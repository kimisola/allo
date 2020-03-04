import React from 'react';
import { connect } from 'react-redux';
import { creatTitle, addNewListOpen, getTitleValue, setIndexForTitle } from"./ActionCreators"
import { lib_AccessWhereMethod } from "../library/searchDbData";
import fire from "../src/fire";
import Cancel from "../images/letter-x.png";
import Mail from "../images/email.png";
import Plus from "../images/plus1.png";

class SecondBar extends React.Component {
    constructor(props){
        super(props);
        this.myRef = React.createRef();
        this.titleInput = React.createRef();
        this.mailInput = React.createRef();
        this.state = {
            isShowInvitation: false,
            isAddNewListOpened: false,
            userMail:"",
            userName:"",
            userPhoto:"",
            userFirebaseuid:"",
            alertMsg:[],
            emailValue: "",
            xCoordinate: "",
            yCoordinate: "",
        }
        this.lib_AccessWhereMethod = lib_AccessWhereMethod.bind(this)
    }

    componentDidUpdate() {
        if ( this.state.isAddNewListOpened ) {
            this.titleInput.current.focus();
        }

        if ( this.state.isShowInvitation ) {
            this.mailInput.current.focus();
        }
    }

    addNewListOpen = () => {
        this.props.getTitleValue("")
        //this.props.addNewListOpen()
        this.setState( prevState => {
            return Object.assign({}, prevState, { 
                isAddNewListOpened: !prevState.isAddNewListOpened
            })
        });
    }

    getTitleValue = (event) => {
        const value = event.target.value
        this.props.getTitleValue(value);      
    }

    creatTitle = (event) => {
        let newText = this.props.text;
        let newListTitle =  this.props.listTitle;
        let titleValue =  this.props.titleValue;
        let indexForTitle = this.props.indexForTitle;
        let firebaseUid = "";
        if ( this.props.currentBoard !== "" ) {
            firebaseUid = this.props.currentBoard
        } else {
            firebaseUid = this.props.firebaseUid
        }

        if (event.key === "Enter" ) {
            if ( titleValue.length > 41 ) {
                alert("The text is too long!")
            } else {
                this.addNewListOpen();
                newListTitle.push(titleValue);
                newText.push([]);
                this.props.creatTitle(newListTitle, newText)
                
                const db = fire.firestore();
                const titleCollection = db.collection("Boards/" + firebaseUid + "/Lists").doc();
                titleCollection.set({
                    title: titleValue,
                    index: indexForTitle
                }).then(() => {
                    this.props.setIndexForTitle(indexForTitle + 2)  //更新預備用的 title index
                }).catch(() => {
                    console.error("Error writing document: ", error.message);
                })
            }
        }
    }

    creatTitleByButton = () => {
        let newText = this.props.text;
        let newListTitle =  this.props.listTitle;
        let titleValue =  this.props.titleValue;
        let indexForTitle = this.props.indexForTitle;
        let firebaseUid = "";
        if ( this.props.currentBoard !== "" ) {
            firebaseUid = this.props.currentBoard
        } else {
            firebaseUid = this.props.firebaseUid
        }

        this.addNewListOpen();
        newListTitle.push(titleValue);
        newText.push([]);
        this.props.creatTitle(newListTitle, newText)
        
        const db = fire.firestore();
        const titleCollection = db.collection("Boards/" + firebaseUid + "/Lists").doc();
        titleCollection.set({
            title: titleValue,
            index: indexForTitle
        }).then(() => {
            this.props.setIndexForTitle(indexForTitle + 2)
        }).catch(() => {
            console.error("Error writing document: ", error.message);
        })
    }

    getCoordinate = () => {
        const data = this.myRef.current.getBoundingClientRect()
        this.setState( prevState => {  
            const xCoordinate = data.x
            const yCoordinate = data.y
            return Object.assign({}, prevState, {
                xCoordinate: xCoordinate,
                yCoordinate: yCoordinate
            })     
        });
    }

    showInvitation = () => {
        this.setState( prevState => {
            const showInvitationa = !prevState.isShowInvitation
            return Object.assign({}, prevState, { 
                isShowInvitation: showInvitationa,
                userMail: "",
            })
        });
        this.getCoordinate();
    }
        
    getMailValue = (event) => {  
        let mailValue = event.target.value
        this.setState( prevState => {
            return  Object.assign({}, prevState, { userMail: mailValue })
        });
    }

    writeInvitationToDb = (id, states) => {
        const db = fire.firestore();
        db.collection("Users/").doc(id).get()
        .then((querySnapshot) => {
            let data = querySnapshot.data()
            this.setState( prevState => {
                let usermail =  data.email
                let username =  data.name
                let userphoto =  data.photo
                let userfirebaseuid =  data.firebaseuid 
                return Object.assign({}, prevState, { 
                    userMail: usermail,
                    userName: username,
                    userPhoto: userphoto,
                    userFirebaseuid: userfirebaseuid
                });
            })
            console.log(this.state)
        })
        .then(() => {
            // 將自己資訊寫入被邀請人 db
            let route = db.collection("Users/" + this.state.userFirebaseuid + "/beInvited")
            route.get().then((querySnapshot) => {     
                //如果是全新的執行set
                if ( states === "new" ) {
                    route.doc().set({
                        userMail: this.props.userEmail,
                        userName: this.props.userDisplayName,
                        userPhoto: this.props.userPhotoURL,
                        userFirebaseuid: this.props.firebaseUid,
                        confirm: false,
                        index: querySnapshot.docs.length,
                        read: false,  //被邀請通知來要亮燈提醒
                    }).catch((error)=> {
                        console.log("Error writing document: ", error.message);
                    })
                    //否則找到對方的doc更新資料
                } else {
                    const targetData = {
                        userMail: this.props.userEmail,
                        userName: this.props.userDisplayName,
                        userPhoto: this.props.userPhotoURL,
                        userFirebaseuid: this.props.firebaseUid,
                        confirm: false,
                        index: querySnapshot.docs.length,
                        read: false
                    }
                    this.lib_AccessWhereMethod(`Users/${this.state.userFirebaseuid}/beInvited`, "userFirebaseuid", this.props.firebaseUid, targetData)

                    // route.where("userFirebaseuid", "==", this.props.firebaseUid).get()
                    // .then((querySnapshot) => {
                    //     let docid = querySnapshot.docs[0].id;
                    //     route.doc(docid).update({
                    //         userMail: this.props.userEmail,
                    //         userName: this.props.userDisplayName,
                    //         userPhoto: this.props.userPhotoURL,
                    //         userFirebaseuid: this.props.firebaseUid,
                    //         confirm: false,
                    //         index: querySnapshot.docs.length,
                    //         read: false,  //被邀請通知來要亮燈提醒
                    //     }).catch((error)=> {
                    //         console.log("Error writing document: ", error.message);
                    //     })
                    // })
                }
            })
        }).then(() => {
            // 寫入對方資訊至自己 db 且 get 對方 board 的背景圖 url
            db.collection("Boards").doc(this.state.userFirebaseuid).get()
            .then((querySnapshot) =>{
                const backgroundURL = querySnapshot.data().background

                const route = db.collection("Users/" + this.props.firebaseUid + "/invitation")
                route.get().then((querySnapshot) => {
                    if ( states === "new" ) {
                        route.doc().set({
                            userMail: this.state.userMail,
                            userName: this.state.userName,
                            userPhoto: this.state.userPhoto,
                            userFirebaseuid: this.state.userFirebaseuid,
                            confirm: false,
                            index: querySnapshot.docs.length,
                            backgroundURL: backgroundURL,
                            read: null,
                        }).catch((error)=> {
                            console.log("Error writing document: ", error.message);
                        })
                    } else {
                        const targetData = {
                            userMail: this.state.userMail,
                            userName: this.state.userName,
                            userPhoto: this.state.userPhoto,
                            userFirebaseuid: this.state.userFirebaseuid,
                            confirm: false,
                            index: querySnapshot.docs.length,
                            backgroundURL: backgroundURL,
                            read: null,
                        }
                        this.lib_AccessWhereMethod(`Users/${this.props.firebaseUid}/beInvited`, "userFirebaseuid", this.state.userFirebaseuid, targetData)

                        // route.where("userFirebaseuid", "==", this.state.userFirebaseuid).get()
                        // .then((querySnapshot) => {
                        //     let docid = querySnapshot.docs[0].id;
                        //     route.doc(docid).update({
                        //     userMail: this.state.userMail,
                        //     userName: this.state.userName,
                        //     userPhoto: this.state.userPhoto,
                        //     userFirebaseuid: this.state.userFirebaseuid,
                        //     confirm: false,
                        //     index: querySnapshot.docs.length,
                        //     backgroundURL: backgroundURL,
                        //     read: null,
                        // }).catch((error)=> {
                        //     console.log("Error writing document: ", error.message);
                        // })
                    // })
                    }
                })
                alert(`You have sent ${this.state.userMail} an invitation.`)
                this.showInvitation();
            })
        })
    }

    invite = (event) => {
        if ( event.key === "Enter" ) {
            if ( this.state.userMail !== "" ) {
                const db = fire.firestore();
                db.collection("Users/").where("email", "==", this.state.userMail).get()
                .then((querySnapshot) => {
                    if (querySnapshot.docs[0] != undefined && querySnapshot.docs[0].id != this.props.firebaseUid) {
                        let id = querySnapshot.docs[0].id
                        
                        db.collection("Users/" + this.props.firebaseUid + "/invitation").where("userFirebaseuid", "==", id).get()
                        .then((querySnapshot) => {
                            if ( querySnapshot.docs.length == 0  ) {
                                this.writeInvitationToDb(id,"new")                               
                            } else {
                                let docId = querySnapshot.docs[0].id
                                db.collection("Users/" + this.props.firebaseUid + "/invitation/").doc(docId).get()
                                .then((querySnapshot) => {
                                    if (querySnapshot.data().confirm) {
                                        alert(`${this.state.userMail} is already on your access list.` )
                                        this.showInvitation();
                                    } else if ( querySnapshot.data().confirm == false ) {
                                        alert(`Now is waiting for ${this.state.userMail} 's reply. ` )
                                        this.showInvitation();
                                    } else if ( querySnapshot.data().confirm == null ) {
                                        this.writeInvitationToDb(id,"update");
                                    }
                                })
                            }
                        })
                    } else {
                        alert("Please enter the current email address.")
                    }
                })
            } else if ( this.state.userMail == "" ) {
                alert("Please enter email address.")
            }
        }
    }

    render(){
        const style = {
            invitedStyle: {
                display: this.state.isShowInvitation ? "flex" : "none",
                position: "fixed",
                top: this.state.yCoordinate + 35,
                left: this.state.xCoordinate
            }
        }
        return(
            <React.Fragment>
                <div className="secondBar">
                    <div className="secondLeft">
                        <div className="inviteDiv" onClick={ this.showInvitation } ref={ this.myRef }>Invite</div>
                        <div className="invite" style={ style.invitedStyle }>
                            <div className="cancel" onClick={ this.showInvitation }>
                                <div className="cancelImg">
                                    <img src={ Cancel } />
                                </div>
                            </div>
                            <p>Please enter mail address：</p>
                            <div className="inputDiv">
                                <div className="mailDiv">
                                    <img src={ Mail } />
                                </div>
                                <input type="text" value={ this.state.userMail } onChange={ this.getMailValue } onKeyPress={ this.invite } ref={ this.mailInput }/>
                            </div>
                        </div>
                    </div>
                    <div className="secondRight">
                        <div className="addBoard" onClick= { this.addNewListOpen }>
                            <img src={ Plus } />
                        </div>
                    </div>
                </div>
                <div className="addThemeDiv" style={{display: this.state.isAddNewListOpened ? "block" : "none" }}>
                    <div className="addTheme">
                        <p>Add new list：</p>
                        <input type="text" value={ this.props.titleValue } onChange={ this.getTitleValue } onKeyPress={ this.creatTitle } ref={ this.titleInput }/>
                        <div className="buttons">
                            <div className="no" onClick={ this.addNewListOpen }>cancel</div>
                            <div className="yes" onClick={ this.creatTitleByButton }>confirm</div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        indexForTitle: state.indexForTitle,
        text: state.text,
        listTitle: state.listTitle,
        titleValue: state.titleValue,
        addNewListOpened: state.addNewListOpened,
        deleteConfirmThemeOpen: state.deleteConfirmThemeOpen,
        userEmail: state.userEmail,
        userDisplayName: state.userDisplayName,
        userPhotoURL: state.userPhotoURL,
        firebaseUid: state.firebaseUid,
        currentBoard: state.currentBoard,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addNewListOpen: () => { dispatch(addNewListOpen()) },
        getTitleValue: (value) => { dispatch(getTitleValue(value)) },
        creatTitle: (newListTitle, newText) => { dispatch(creatTitle(newListTitle, newText)) },
        setIndexForTitle: (storeTitleIndex) => { dispatch(setIndexForTitle(storeTitleIndex)) },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SecondBar);
