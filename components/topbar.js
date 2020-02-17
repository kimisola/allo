import React from 'react';
import { aSetCurrentUser } from"../components/actionCreators";
import Notice from "../components/notice";
import HomeImg from "../images/home.png";
import Blackboard from "../images/blackboard.png";
import Bell from "../images/bell.png";
import SignOutImg from "../images/logout.png";
import firebase from 'firebase';
import fire from "../src/fire";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { withRouter}  from "react-router";
import { connect } from 'react-redux';


class Topbar extends React.Component {
    constructor(props){
        super(props);
        this.myRef = React.createRef();
        this.state = {
            alertMsg:[],  // 顯示的通知內容(含歷史訊息)
            alertNum: "",  // 幾則新訊息 (不含歷史訊息)
            isShowedAlert: false,
            xCoordinate: "",
            yCoordinate: "",
        }
    }

    //監聽自己的資料夾
    componentDidUpdate(prevProps){

        if ( !this.props.firebaseUid ) {
            return;
        }
        if ( this.state.alertNum !== "" ) {
            return;
        }
        let alertMessage = [];

        const db = fire.firestore();
        // listen for invitation ( new message )
        db.collection("Users/" + this.props.firebaseUid + "/invitation").where("read", "==", false)
        .onSnapshot(async(doc) => {
  
            let docs = doc.docs;
            for ( let i = 0; i < docs.length; i++ ) {
                db.collection("Users/" + this.props.firebaseUid + "/invitation").doc(docs[i].id).get()
                .then((querySnapshot) => {
                    let doc = querySnapshot.data();
                    let newMsg = ` ${doc.userName} 同意了您的共同編輯邀請`;
                    alertMessage.push(newMsg)
                })
                .catch((error) => {
                    console.log(error.message)
                })
            }            
        })
        

        // listen for beInvited
        db.collection("Users/" + this.props.firebaseUid + "/beInvited").where("read", "==", false)
        .onSnapshot(async(doc) => {
            let docs = doc.docs;
            for ( let i = 0; i < docs.length; i++ ) {
                db.collection("Users/" + this.props.firebaseUid + "/beInvited").doc(docs[i].id).get()
                .then((querySnapshot) => {
                    let doc = querySnapshot.data();
                    let newMsg = ` ${doc.userName} 邀請您的共同編輯他的看板`;
                    alertMessage.push(newMsg)                  
                    if ( i ==  docs.length-1 ){
                        this.setState( prevState => {
                            return Object.assign({}, prevState, {
                                alertMsg: alertMessage,
                            });
                        })
                    }
                })
                .catch((error) => {
                    console.log(error.message)
                })
            }
        })

        // history of invitation
        // db.collection("Users/" + this.props.firebaseUid + "/invitation").where("confirm", "==", null)
        // .onSnapshot(async(doc) => {
        //     var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
        //     let docs = doc.docs;
        //     let inviArr = [];
        //     for ( let i = 0; i < docs.length; i++ ) {
        //         db.collection("Users/" + this.props.firebaseUid + "/invitation").doc(docs[i].id).get()
        //         .then((querySnapshot) => {
        //             let doc = querySnapshot.data();
        //             let newMsg = ` ${doc.userName} 同意了您的共同編輯邀請`;
        //             inviArr.push(newMsg)
                    
        //             if ( i ==  docs.length-1 ){
        //                 this.setState( prevState => {
        //                     return Object.assign({}, prevState, {
        //                         alertMsg: inviArr
        //                     });
        //                 })
        //             }
        //         })
        //         .catch((error) => {
        //             console.log(error.message)
        //         })
        //     }
        // })

        
    }


    showAlert = () => {
        console.log("座標來", this.myRef.current.getBoundingClientRect())
        let data = this.myRef.current.getBoundingClientRect()
        this.setState( prevState => {
            
            let xCoordinate = prevState.xCoordinate
            xCoordinate = data.x
            let yCoordinate = prevState.yCoordinate
            yCoordinate = data.y
            const showedAlert = !prevState.isShowedAlert
            return {
                xCoordinate: xCoordinate,
                yCoordinate: yCoordinate,
                isShowedAlert: showedAlert,
            }           
        });

        // reset alert number
        const db = fire.firestore();
        db.collection("Users/" + this.props.firebaseUid + "/invitation").where("read", "==", false)
        .onSnapshot(async(doc) => {
            let docs = doc.docs;
            for ( let i = 0; i < docs.length; i++ ) {
               let ref = db.collection("Users/" + this.props.firebaseUid + "/invitation").doc(docs[i].id)
                ref.update({
                    read: true
                })
            }
        })
        db.collection("Users/" + this.props.firebaseUid + "/beInvited").where("read", "==", false)
        .onSnapshot(async(doc) => {
            let docs = doc.docs;
            for ( let i = 0; i < docs.length; i++ ) {
               let ref = db.collection("Users/" + this.props.firebaseUid + "/beInvited").doc(docs[i].id)
                ref.update({
                    read: true
                })
            }
        })
        
        this.setState( prevState => {
            return Object.assign({}, prevState, {
                alertNum: 0
            });
        })
        
    }


    userSignOut = () => {
        firebase.auth().signOut().then(() => {
            location.href = "/";

            let firebaseUid = "";
            let userDisplayName = "";
            let userPhotoURL = "";
            let userEmail = "";  
            let useruid = "";       
            props.mSetCurrentUser(userDisplayName, userPhotoURL, userEmail, firebaseUid, useruid)

        }).catch((error) => {
            console.log(error)
        });
    }
    
    render(){

        let alertMsg = this.state.alertMsg==null?[]:this.state.alertMsg;
        // let newMsg = this.state.alertNum==null?[]:this.state.alertNum;
        let num = alertMsg.length;

        const menuStyle = {
            menuStyle: {
                display: this.state.isShowedAlert ? 'block' : 'none',
                position: "fixed",
                top: (this.state.yCoordinate + 37),
                // left: this.state.xCoordinate
            },
        }

        return(
            <React.Fragment>
                       
                    <div className="topBar">
                        <div className="topLeft">
                            <div className="home">
                                <Link to="/HomePage"> <img src={ HomeImg } /> </Link>
                            </div>
                            <div className="searchBar">
                                <input />
                            </div>
                        </div>
                        <div className="topRight">
                            <div className="boardList">
                                <div className="boardIcon">
                                    <Link to="/Board"> <img src={ Blackboard } /> </Link>
                                </div>
                            </div>
                            <div className="boardList" onClick={ ()=>this.showAlert()} ref={ this.myRef }>
                                <img src={ Bell } />
                                <div className="alertMsg"> { num } </div>
                            </div>

                            <div className="alertMenu" style={menuStyle.menuStyle}>
                            {/* <div className="showMenuBackground" onClick={ this.showAlert}></div> */}
                            { this.state.alertMsg.map((item, i) => {
                                return (
                                    <React.Fragment key={i}>
                                        <Notice message={item} index={i} />
                                    </React.Fragment>
                                )
                            }) } 
                                    
                            </div>

                            <div className="memberIcon">
                                <img src={ this.props.userPhotoURL } />
                            </div>
                            <div className="signOutImg">
                                <img src={ SignOutImg } onClick={ this.userSignOut }/>
                            </div>
                        </div>
                    </div>  

            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userDisplayName: state.userDisplayName,
        userPhotoURL: state.userPhotoURL,
        firebaseUid: state.firebaseUid,
    }
}


const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        mSetCurrentUser: (userDisplayName, userPhotoURL, userEmail, firebaseUid) => { dispatch(aSetCurrentUser(userDisplayName, userPhotoURL, userEmail, firebaseUid)) }
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Topbar));