import React from "react";
import { connect } from "react-redux";
import { creatTitle, getTitleValue, setIndexForTitle } from"../actions/actionCreators"
import { accessWhereMethod } from "../library/accessDb";
import { db } from "../src/fire";
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
        this.accessWhereMethod = accessWhereMethod.bind(this)
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
        this.setState( prevState => {
            return ({ 
                isAddNewListOpened: !prevState.isAddNewListOpened
            })
        });
    }

    getTitleValue = (event) => {
        const value = event.target.value
        this.props.getTitleValue(value);      
    }

    creatTitle = (firebaseUid) => {
        let titleValue =  this.props.titleValue;
        let newText = this.props.text;
        let indexForTitle = this.props.indexForTitle;
        let newListTitle =  this.props.listTitle;

        this.addNewListOpen();
        newListTitle.push(titleValue);
        newText.push([]);
        this.props.creatTitle(newListTitle, newText)
        const titleCollection = db.collection("Boards/" + firebaseUid + "/Lists").doc();
        titleCollection.set({
            title: titleValue,
            index: (newListTitle.length)*2
        }).then(() => {
            this.props.setIndexForTitle(indexForTitle + 2)  //更新預備用的 title index
        }).catch(() => {
            console.error("Error writing document: ", error.message);
        })
    }

    creatTitleByEnter = (event) => {
        let titleValue =  this.props.titleValue;
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
                this.creatTitle(firebaseUid);
            }
        }
    }

    creatTitleByButton = () => {
        let firebaseUid = "";
        if ( this.props.currentBoard !== "" ) {
            firebaseUid = this.props.currentBoard
        } else {
            firebaseUid = this.props.firebaseUid
        }
        this.creatTitle(firebaseUid);
    }

    getCoordinate = () => {
        const data = this.myRef.current.getBoundingClientRect()
        this.setState({
            xCoordinate: data.x,
            yCoordinate: data.y
        }) 
    }

    showInvitation = () => {
        this.setState(prevState => {
            return ({ 
                isShowInvitation: !prevState.isShowInvitation,
                userMail: "",
            })
        });
        this.getCoordinate();
    }
        
    getMailValue = (event) => {  
        let mailValue = event.target.value
        this.setState({ userMail: mailValue })
    }

    writeInvitationToDb = (id, states) => {
        db.collection("Users/").doc(id).get()
        .then((querySnapshot) => {
            let data = querySnapshot.data()
            this.setState({ 
                userMail: data.email,
                userName: data.name,
                userPhoto: data.photo,
                userFirebaseuid: data.firebaseuid
            });
        })
        .then(() => {  // 將自己資訊寫入被邀請人 db
            const route = db.collection("Users/" + this.state.userFirebaseuid + "/beInvited")
            route.get().then((querySnapshot) => {   //如果是全新的執行 set、否則找到對方的 doc 更新資料
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
                    this.accessWhereMethod(`Users/${this.state.userFirebaseuid}/beInvited`, "userFirebaseuid", this.props.firebaseUid, targetData)
                }
            })
        }).then(() => {  // 寫入對方資訊至自己 db 且 get 對方 board 的背景圖 url
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
                        this.accessWhereMethod(`Users/${this.props.firebaseUid}/beInvited`, "userFirebaseuid", this.state.userFirebaseuid, targetData)
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
                db.collection("Users/").where("email", "==", this.state.userMail).get()
                .then((querySnapshot) => {
                    if (querySnapshot.docs[0] != undefined && querySnapshot.docs[0].id != this.props.firebaseUid) {
                        const id = querySnapshot.docs[0].id
                        
                        db.collection("Users/" + this.props.firebaseUid + "/invitation").where("userFirebaseuid", "==", id).get()
                        .then((querySnapshot) => {
                            if ( querySnapshot.docs.length === 0  ) {
                                this.writeInvitationToDb(id,"new")                               
                            } else {
                                const docId = querySnapshot.docs[0].id
                                db.collection("Users/" + this.props.firebaseUid + "/invitation/").doc(docId).get()
                                .then((querySnapshot) => {
                                    if (querySnapshot.data().confirm) {
                                        alert(`${this.state.userMail} is already on your access list.` )
                                        this.showInvitation();
                                    } else if ( querySnapshot.data().confirm === false ) {
                                        alert(`Now is waiting for ${this.state.userMail} 's reply. ` )
                                        this.showInvitation();
                                    } else if ( querySnapshot.data().confirm === null ) {
                                        this.writeInvitationToDb(id,"update");
                                    }
                                })
                            }
                        })
                    } else {
                        alert("Please enter the current email address.")
                    }
                })
            } else if ( this.state.userMail === "" ) {
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
                        <input type="text" value={ this.props.titleValue } onChange={ this.getTitleValue } onKeyPress={ this.creatTitleByEnter } ref={ this.titleInput }/>
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
        text: state.board.text,
        listTitle: state.board.listTitle,
        titleValue: state.board.titleValue,
        userEmail: state.board.userEmail,
        userDisplayName: state.board.userDisplayName,
        userPhotoURL: state.board.userPhotoURL,
        firebaseUid: state.board.firebaseUid,
        currentBoard: state.board.currentBoard,
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
