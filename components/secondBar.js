import React from 'react';
import Plus from "../images/plus.png";
import TestIcon from "../images/testIcon.jpg";
import { connect } from 'react-redux';
import fire from "../src/fire";
import { creatTitle, addNewListOpen, getTitleValue, setIndexForTitle } from"./actionCreators"

class SecondBar extends React.Component {
    constructor(props){
        super(props);
        this.myRef = React.createRef();
        this.state = {
            isShowInvitation: false,
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

    addNewListOpen = () => {
        console.log("run creatTheme")
        this.props.getTvalue("")  //reset input value
        this.props.addNewListOpen()
    }

    getTitleValue = (event) => {  //use onChange to get value
        const value = event.target.value
        this.props.getTvalue(value);      
    }

    creatTitle = (event) => {
        console.log("12345689")
        const newText = this.props.text;
        const newListTitle =  this.props.listTitle;
        const titleValue =  this.props.titleValue;
        const firebaseUid  = this.props.firebaseUid;
        let indexForTitle = this.props.indexForTitle;

        if (event.key === "Enter" ) {
            if ( titleValue.length > 14 ) {
                console.log(titleValue.length)
                alert("標題太長囉、再短一點!")
            } else {
                console.log("enter creat title", titleValue)
                this.props.addNewListOpen();
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
        const newText = this.props.text;
        const newListTitle =  this.props.listTitle;
        const titleValue =  this.props.titleValue;
        const firebaseUid  = this.props.firebaseUid;
        let indexForTitle = this.props.indexForTitle;

        console.log("enter creat title", titleValue)
        this.props.addNewListOpen();
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
             //let emailValue = prevState.emailValue  // reset input text value
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

    invite = (event) => {
        if ( event.key === "Enter" ) {
            if ( this.state.userMail !== "" ) {
                const db = fire.firestore();
                db.collection("Users/").where("email", "==", this.state.userMail).get()
                .then((querySnapshot) => {
                    if (querySnapshot.docs[0] != undefined) {
                        let id = querySnapshot.docs[0].id
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
                                })
                                this.showInvitation();
                            })
                        })
                    } else {
                        alert("請輸入正確的 email")
                    }
                })
            } else if ( this.state.userMail == "" ) {
                alert("請輸入 email")
            }
        }
    }

    render(){

        const style = {
            invitedStyle: {
                display: this.state.isShowInvitation ? "block" : "none",
                position: "fixed",
                top: this.state.yCoordinate + 30,
                left: this.state.xCoordinate
            }
        }
        return(
            <React.Fragment>

                <div className="secondBar">
                    <div className="secondLeft">
                        <div className="inviteDiv" onClick={ this.showInvitation } ref={ this.myRef }>邀請編輯</div>
                        <div className="invite" style={style.invitedStyle}>
                            <p>請對方輸入電子郵件：</p>
                            <input type="text" value={ this.state.userMail } onChange={ this.getMailValue } onKeyPress={ this.invite }/>
                            <div className="buttons">
                                <div className="no" onClick={ this.showInvitation }>取消</div>
                                <div className="yes" onClick={ this.inviteByButton }>送出</div>
                            </div>
                        </div>
                    </div>
                    <div className="secondRight">
                        <div className="addBoard">
                            <img src={ Plus }  onClick= { this.addNewListOpen } />
                        </div>
                    </div>
                </div>
                <div className="addThemeDiv" style={{display: this.props.addNewListOpened ? 'block' : 'none' }}>
                    <div className="addTheme">
                        <p>請輸入列表標題：</p>
                        <input type="text" value={this.props.titleValue} onChange={this.getTitleValue} onKeyPress={this.creatTitle}/>
                        <div className="buttons">
                            <div className="no" onClick={this.addNewListOpen}>取消</div>
                            <div className="yes" onClick={this.creatTitleByButton}>確定</div>
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
