import React from 'react';
import Plus from "../images/plus1.png";
import { connect } from 'react-redux';
import fire from "../src/fire";
import Cancel from "../images/letter-x.png";
import Mail from "../images/email.png";
import { creatTitle, addNewListOpen, getTitleValue, setIndexForTitle } from"./actionCreators"

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
        console.log("run creatTheme")
        this.props.getTvalue("")  //reset input value
        //this.props.addNewListOpen()
        this.setState( prevState => {
            return Object.assign({}, prevState, { 
                isAddNewListOpened: !prevState.isAddNewListOpened
            })
        });
        
    }

    getTitleValue = (event) => {  //use onChange to get value
        const value = event.target.value
        this.props.getTvalue(value);      
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
            if ( titleValue.length > 14 ) {
                console.log(titleValue.length)
                alert("標題太長囉、再短一點!")
            } else {
                console.log("enter creat title", titleValue)
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
                    this.props.setIndexForTitle(indexForTitle+2)  // update index for title
                    console.log("Document successfully written!");
                }).catch(() => {
                    console.error("Error writing document: ", error);
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

        console.log("enter creat title", titleValue)
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
            this.props.setIndexForTitle( indexForTitle + 2 )  // update index for next new title
            console.log("Document successfully written!");
        }).catch(() => {
            console.error("Error writing document: ", error);
        })
    }

    getCoordinate = () => {
        console.log(this.myRef.current.getBoundingClientRect());
        let data = this.myRef.current.getBoundingClientRect()
        this.setState( prevState => {  
            let xCoordinate = prevState.xCoordinate
            xCoordinate = data.x
            let yCoordinate = prevState.yCoordinate
            yCoordinate = data.y
            return { 
                xCoordinate: xCoordinate,
                yCoordinate: yCoordinate
             }
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

    writeInvitationToDb = (id,states) => {
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
                if(states === "new"){
                    route.doc().set({
                        userMail: this.props.userEmail,
                        userName: this.props.userDisplayName,
                        userPhoto: this.props.userPhotoURL,
                        userFirebaseuid: this.props.firebaseUid,
                        confirm: false,
                        index: querySnapshot.docs.length,
                        read: false,  // 被邀請通知來要亮燈提醒
                    }).then(() => {
                        console.log("Document successfully written!")
                    }).catch((error)=> {
                        console.log("Error writing document: ", error);
                    })
                    // 否則找到對方的doc更新資料
                }else {
                    route.where("userFirebaseuid", "==", this.props.firebaseUid).get()
                    .then((querySnapshot) => {
                        let docid = querySnapshot.docs[0].id;
                        route.doc(docid).update({
                            userMail: this.props.userEmail,
                            userName: this.props.userDisplayName,
                            userPhoto: this.props.userPhotoURL,
                            userFirebaseuid: this.props.firebaseUid,
                            confirm: false,
                            index: querySnapshot.docs.length,
                            read: false,  // 被邀請通知來要亮燈提醒
                        }).then(() => {
                            console.log("Document successfully written!")
                        }).catch((error)=> {
                            console.log("Error writing document: ", error);
                        })
                    })
                }
            })
        })
        .then(() => {
            // 寫入對方資訊至自己 db

            // get 對方 board 的背景圖 url
            db.collection("Boards").doc(this.state.userFirebaseuid).get()
            .then((querySnapshot) =>{
                let backgroundURL = querySnapshot.data().background

                let route = db.collection("Users/" + this.props.firebaseUid + "/invitation")
                route.get().then((querySnapshot)=>{
                    if(states === "new"){
                        route.doc().set({
                            userMail: this.state.userMail,
                            userName: this.state.userName,
                            userPhoto: this.state.userPhoto,
                            userFirebaseuid: this.state.userFirebaseuid,
                            confirm: false,
                            index: querySnapshot.docs.length,
                            backgroundURL: backgroundURL,
                            read: null,  // 當對方確認後改成 false 亮燈提醒
                        }).then(() => {
                            console.log("Document successfully written!")
                        }).catch((error)=> {
                            console.log("Error writing document: ", error);
                        })
                    }else {
                        route.where("userFirebaseuid", "==", this.state.userFirebaseuid).get()
                        .then((querySnapshot) => {
                            let docid = querySnapshot.docs[0].id;
                            route.doc(docid).update({
                            userMail: this.state.userMail,
                            userName: this.state.userName,
                            userPhoto: this.state.userPhoto,
                            userFirebaseuid: this.state.userFirebaseuid,
                            confirm: false,
                            index: querySnapshot.docs.length,
                            backgroundURL: backgroundURL,
                            read: null,  // 當對方確認後改成 false 亮燈提醒
                        }).then(() => {
                            console.log("Document successfully written!")
                        }).catch((error)=> {
                            console.log("Error writing document: ", error);
                        })
                    })
                    }
                })
                alert(`已送出邀請 ${this.state.userMail} 來編輯你的看板`)
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
                            if(querySnapshot.docs.length == 0  ) {
                                this.writeInvitationToDb(id,"new")                               
                            } else {
                                let docId = querySnapshot.docs[0].id
                                db.collection("Users/" + this.props.firebaseUid + "/invitation/").doc(docId).get()
                                .then((querySnapshot) => {
                                    if (querySnapshot.data().confirm) {
                                        alert(`${this.state.userMail} 已經可以編輯您的看板囉` )
                                        this.showInvitation();
                                    } else if ( querySnapshot.data().confirm == false ) {
                                        alert(`正在等待 ${this.state.userMail} 回覆你的邀請 ` )
                                        this.showInvitation();
                                    } else if ( querySnapshot.data().confirm == null ) {
                                        this.writeInvitationToDb(id,"update");
                                    }
                                })
                            }
                        })
                    } else {
                        alert("請輸入正確的 email")
                    }
                })
            } else if ( this.state.userMail == "" ) {
                alert("Please enter email.")
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
                        <div className="addBoard">
                            <img src={ Plus }  onClick= { this.addNewListOpen } />
                        </div>
                    </div>
                </div>
                <div className="addThemeDiv" style={{display: this.state.isAddNewListOpened ? 'block' : 'none' }}>
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

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        addNewListOpen: () => { dispatch(addNewListOpen()) },
        getTvalue: (value) => { dispatch(getTitleValue(value)) },
        creatTitle: (newListTitle, newText) => { dispatch(creatTitle(newListTitle, newText)) },
        setIndexForTitle: (storeTitleIndex) => { dispatch(setIndexForTitle(storeTitleIndex))},
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SecondBar);
