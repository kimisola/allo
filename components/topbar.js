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
            alertMsg:[],
            alertNum: null,
            isShowedAlert: false,
            xCoordinate: "",
            yCoordinate: "",
        }
    }

    //監聽自己的資料夾
    componentDidUpdate(prevProps){
        if(!this.props.firebaseUid){
            return;
        }
        if(this.state.alertNum!==null){
            return;
        }
        const db = fire.firestore();

        // listen for invitation ( new message )
        db.collection("Users/" + this.props.firebaseUid + "/invitation").where("confirm", "==", true)
        .onSnapshot(async(doc) => {
            var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
            let docs = doc.docs;
            let inviArr = [];
            for ( let i = 0; i < docs.length; i++ ) {
                db.collection("Users/" + this.props.firebaseUid + "/invitation").doc(docs[i].id).get()
                .then((querySnapshot) => {
                    let doc = querySnapshot.data();
                    let newMsg = ` ${doc.userName} 同意了您的共同編輯邀請`;
                    inviArr.push(newMsg)
                    
                    if ( i ==  docs.length-1 ){
                        this.setState( prevState => {
                            return Object.assign({}, prevState, {
                                alertNum: inviArr
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
        db.collection("Users/" + this.props.firebaseUid + "/invitation").where("confirm", "==", null)
        .onSnapshot(async(doc) => {
            var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
            let docs = doc.docs;
            let inviArr = [];
            for ( let i = 0; i < docs.length; i++ ) {
                db.collection("Users/" + this.props.firebaseUid + "/invitation").doc(docs[i].id).get()
                .then((querySnapshot) => {
                    let doc = querySnapshot.data();
                    let newMsg = ` ${doc.userName} 同意了您的共同編輯邀請`;
                    inviArr.push(newMsg)
                    
                    if ( i ==  docs.length-1 ){
                        this.setState( prevState => {
                            return Object.assign({}, prevState, {
                                alertMsg: inviArr
                            });
                        })
                    }
                })
                .catch((error) => {
                    console.log(error.message)
                })
            }
        })

        // listen for beInvited
        db.collection("Users/" + this.props.firebaseUid + "/beInvited").where("confirm", "==", false)
        .onSnapshot(async(doc) => {
            var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
            let docs = doc.docs;
            let beInvitArr = [];         
            for ( let i = 0; i < docs.length; i++ ) {
                db.collection("Users/" + this.props.firebaseUid + "/beInvited").doc(docs[i].id).get()
                .then((querySnapshot) => {
                    let doc = querySnapshot.data();
                    let newMsg = ` ${doc.userName} 邀請您的共同編輯他的看板`;
                    beInvitArr.push(newMsg)
                    
                    if ( i ==  docs.length-1 ){
                        this.setState( prevState => {
                            return Object.assign({}, prevState, {
                                alertMsg: beInvitArr
                            });
                        })
                    }
                })
                .catch((error) => {
                    console.log(error.message)
                })
            }
        })
    }


    showAlert = () => {
        console.log("座標來", this.myRef.current.getBoundingClientRect())
        let data = this.myRef.current.getBoundingClientRect()
        this.setState( prevState => {
            
            let xCoordinate = prevState.xCoordinate
            xCoordinate = data.x
            let yCoordinate = prevState.yCoordinate
            yCoordinate = data.y
            console.log(yCoordinate)
            const showedAlert = !prevState.isShowedAlert
            let resetAlertNum = prevState.alertNum
            // resetAlertNum.length = 0
            console.log(this.state)
            return {
                xCoordinate: xCoordinate,
                yCoordinate: yCoordinate,
                isShowedAlert: showedAlert,
                // alertNum: resetAlertNum
            }           
        });
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

        let oldMsg = this.state.alertMsg==null?[]:this.state.alertMsg;
        let newMsg = this.state.alertNum==null?[]:this.state.alertNum;
        let renderMsg = newMsg.concat(oldMsg);

        const menuStyle = {
            menuStyle: {
                display: this.state.isShowedAlert ? 'block' : 'none',
                position: "fixed",
                top: (this.state.yCoordinate + 37),
                left: this.state.xCoordinate
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
                            <div className="boardList" onClick={ this.showAlert} ref={ this.myRef }>
                                <img src={ Bell } />
                                <div className="alertMsg"> { newMsg.length } </div>
                            </div>

                            <div className="alertMenu" style={menuStyle.menuStyle}>
                            {/* <div className="showMenuBackground" onClick={ this.showAlert}></div> */}
                            { renderMsg.map((item, i) => {
                                return (
                                    <React.Fragment key={i}>
                                    
                                    {/* <Link to="/HomePage"> <li> {item} </li> </Link> */}
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