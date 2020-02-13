import React from 'react';
import ReactDOM from 'react-dom';
import Plus from "../images/plus.png";
import TestIcon from "../images/testIcon.jpg";
import { connect } from 'react-redux';
import fire from "../src/fire";
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {  grey, COMPLEMENTARY} from '@material-ui/core/colors';
import { sizing } from '@material-ui/system';
import { aCreatTitle, aAddNewListOpen, aGetTitleValue, aSetIndexForTitle } from"./actionCreators"
import { object } from 'prop-types';

const InviteFriend = withStyles({
    root: {
      '& label.Mui-focused': {
        color: "#ffffff",
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: grey[600],
      },
      '& .MuiInput-formControl': {
        marginTop: 13,
      }
    },
  })(TextField);

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
        }
    }

    addNewListOpen = () => {
        console.log("run creatTheme")
        this.props.getTvalue("")  //reset input value
        this.props.mAddNewListOpen()
    }

    getTitleValue = (event) => {  //use onChange to get value
        const value = event.target.value
        this.props.getTvalue(value);      
    }

    creatTitle = (event) => {
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
                this.props.mAddNewListOpen();
                newListTitle.push(titleValue);
                newText.push([]);
                this.props.mCreatTitle(newListTitle, newText)
                
                const db = fire.firestore();
                const titleCollection = db.collection("Boards/" + firebaseUid + "/Lists").doc();
                titleCollection.set({
                    title: titleValue,
                    index: indexForTitle
                }).then(() => {
                    this.props.mSetIndexForTitle(indexForTitle+2)  // update index for title
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
        this.props.mAddNewListOpen();
        newListTitle.push(titleValue);
        newText.push([]);
        this.props.mCreatTitle(newListTitle, newText)
        
        const db = fire.firestore();
        const titleCollection = db.collection("Boards/" + firebaseUid + "/Lists").doc();
        titleCollection.set({
            title: titleValue,
            index: indexForTitle
        }).then(() => {
            this.props.mSetIndexForTitle( indexForTitle + 2 )  // update index for next new title
            console.log("Document successfully written!");
        }).catch(() => {
            console.error("Error writing document: ", error);
        })
    }

    showInvitation = () => {
        this.setState( prevState => {
            const showInvitation = !prevState.isShowInvitation
            return { isShowInvitation: showInvitation }
        });
    }
        
    getMailValue = (event ) => {  
        let mailValue = event.target.value
        this.setState( prevState => {
            return Object.assign({}, prevState, {
                userMail: mailValue
            })
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
                            // 寫入被邀請人 db
                            let route = db.collection("Users/" + this.state.userFirebaseuid + "/beInvited").doc()
                            route.set({
                                userMail: this.props.userEmail,
                                userName: this.props.userDisplayName,
                                userPhoto: this.props.userPhotoURL,
                                userFirebaseuid: this.props.firebaseUid,
                                confirm: false
                            }).then(() => {
                                console.log("Document successfully written!")
                            }).catch((error)=> {
                                console.log("Error writing document: ", error);
                            })
                        })
                        .then(() => {
                            // 寫入邀請人 db
                            let route = db.collection("Users/" + this.props.firebaseUid + "/invitation").doc()
                            route.set({
                                userMail: this.state.userMail,
                                userName: this.state.userName,
                                userPhoto: this.state.userPhoto,
                                userFirebaseuid: this.state.userFirebaseuid,
                                confirm: false
                            }).then(() => {
                                console.log("Document successfully written!")
                            }).catch((error)=> {
                                console.log("Error writing document: ", error);
                            })
                            this.showInvitation()
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
        return(
            <React.Fragment>

                <div className="secondBar">
                    <div className="secondLeft">
                        <div className="inviteDiv" onClick={ this.showInvitation } ref={ this.myRef }>邀請</div>
                        <div className="invite" style={{display: this.state.isShowInvitation ? 'block' : 'none' }}>
                            <InviteFriend
                            id="standard-textarea"
                            label="User Email"
                            placeholder="email"
                            multiline
                            onChange={ this.getMailValue }
                            onKeyPress={ this.invite }
                            />
                        </div>
                        <div className="friendList" style={{display: this.state.isShowInvitation ? 'none' : 'flex' }}>
                            <div className="friend"> <img src={ TestIcon } /> </div>
                            <div className="friend"> <img src={ TestIcon } /> </div>
                            <div className="friend"> <img src={ TestIcon } /> </div>
                        </div>
                    </div>
                    <div className="secondRight">
                        <div className="addBoard">
                            <img src={ Plus }  onClick= { this.addNewListOpen } />
                        </div>
                    </div>
                </div>
                <div className="addThemeDiv" style={{display: this.props.addNewListOpen ? 'block' : 'none' }}>
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
        addNewListOpen: state.addNewListOpen,
        deleteConfirmThemeOpen: state.deleteConfirmThemeOpen,
        userEmail: state.userEmail,
        userDisplayName: state.userDisplayName,
        userPhotoURL: state.userPhotoURL,
        firebaseUid: state.firebaseUid,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        mAddNewListOpen: () => { dispatch(aAddNewListOpen()) },
        getTvalue: (value) => { dispatch(aGetTitleValue(value)) },
        mCreatTitle: (newListTitle, newText) => { dispatch(aCreatTitle(newListTitle, newText)) },
        mSetIndexForTitle: (storeTitleIndex) => { dispatch(aSetIndexForTitle(storeTitleIndex))},
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SecondBar);
