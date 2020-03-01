import React from 'react';
import { setCurrentUser, switchBoard } from"../components/actionCreators";
import Notice from "../components/notice";
import HomeImg from "../images/home2.png";
import Blackboard from "../images/blackboard1.png";
import Bell from "../images/bell2.png";
import SignOutImg from "../images/logout12.png";
import MyLogo from "../images/myLogo.png";
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
            alertMsg:[],  // 顯示的通知內容
            alertNum: 0,  // 幾則新訊息
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
        // if ( this.state.alertNum !== "" ) {
        //     return;
        // }

        const db = fire.firestore();
        // listen for invitation ( new message )
        db.collection("Users/" + this.props.firebaseUid + "/invitation").where("read", "==", false)
        .onSnapshot(async(doc) => {
            let docs = doc.docs;
            let msg  = this.state.alertMsg;
            
            for ( let i = 0; i < docs.length; i++ ) {
                db.collection("Users/" + this.props.firebaseUid + "/invitation").doc(docs[i].id).get()
                .then((querySnapshot) => {

                    let doc = querySnapshot.data();
                    let newMsg = ` ${doc.userName} agreed to your co-editing invitation.`;
                    let push = true;

                    if(msg !== undefined){
                        for (let j = 0; j < msg.length ; j++) {
                            console.log()
                            if(newMsg == msg[j]){
                                push = false;
                            }
                        }
                    }
                    if(push) {
                        this.setState( prevState => {
                            let alertMsg = prevState.alertMsg
                            alertMsg.push(newMsg)
                            return Object.assign({}, prevState, {
                                alertMsg: alertMsg,
                                alertNum: prevState.alertNum+1,
                            });
                        })
                        push = false;
                    }
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
            let msg  = this.state.alertMsg;

            for ( let i = 0; i < docs.length; i++ ) {
                db.collection("Users/" + this.props.firebaseUid + "/beInvited").doc(docs[i].id).get()
                .then((querySnapshot) => {
                    let doc = querySnapshot.data();
                    let newMsg = ` ${doc.userName} invited you to be a co-editor to his board.`;
                    let push = true;
                    if (msg !== undefined) {
                        for (let j = 0; j < msg.length ; j++){
                            if (newMsg == msg[j]) {
                                push = false;
                            }
                        }
                    }
                    if(push) {
                        this.setState( prevState => {
                            let alertMsg = prevState.alertMsg
                            alertMsg.push(newMsg)
                            return Object.assign({}, prevState, {
                                alertMsg: alertMsg,
                                alertNum: prevState.alertNum+1,
                            });
                        })
                        push = false;
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
            let showedAlert = !prevState.isShowedAlert
            return {
                xCoordinate: xCoordinate,
                yCoordinate: yCoordinate,
                isShowedAlert: showedAlert,
                alertNum: 0,
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
    }

    closeAlertMsg = () => {
        this.setState( prevState => {
            let showedAlert = !prevState.isShowedAlert
            return {
                isShowedAlert: showedAlert,
            }           
        });
    }

    switchBoard = (targetLink) => {
        this.props.switchBoard(targetLink)
    }

    userSignOut = () => {
        firebase.auth().signOut().then(() => {
            location.href = "/";

            let firebaseUid = "";
            let userDisplayName = "";
            let userPhotoURL = "";
            let userEmail = "";  
            let useruid = "";       
            props.setCurrentUser(userDisplayName, userPhotoURL, userEmail, firebaseUid, useruid)

        }).catch((error) => {
            console.log(error)
        });
    }
    
    render(){

        let alertMsg = this.state.alertMsg==null?[]:this.state.alertMsg;

        const menuStyle = {
            menuStyle: {
                display: this.state.isShowedAlert ? 'block' : 'none',
                position: "fixed",
                top: (this.state.yCoordinate + 40),
                left: (this.state.xCoordinate - 60)
            },
        }

        let targetURL = `/Board/${ this.props.firebaseUid }`;

        let withAlertMsg = [
            <React.Fragment>
                <div className="boardList alertDiv" onClick={ ()=>this.showAlert()} ref={ this.myRef }>
                    <div className="alert">
                        <img src={ Bell } />
                        <div className="alertMsg"> { this.state.alertNum } </div>   
                    </div>
                </div>

                <Link to="/HomePage/notifications"><div className="alertMenu" style={menuStyle.menuStyle} onClick={ this.closeAlertMsg }>
                { alertMsg.map((item, i) => {
                    return (
                        <React.Fragment key={i}>
                            <Notice message={item} index={i} />
                        </React.Fragment>
                    )
                }) } 
                </div></Link>
            </React.Fragment>
        ]

        let withoutAlertMsg = [
            <React.Fragment>
                <Link to="/HomePage/notifications"><div className="boardList alertDiv" onClick={ ()=>this.showAlert()} ref={ this.myRef }>
                    <div className="alert">
                        <img src={ Bell } />
                    </div>
                </div></Link>
            </React.Fragment>            
        ]



        return(
            <React.Fragment>
                       
                    <div className="topBar">
                        <div className="topLeft">
                            <div className="home">
                                <Link to="/HomePage/boardLists"><img src={ HomeImg } /></Link>
                            </div>
                        </div>
                        <div className="logoDiv">
                            <img src={ MyLogo } />
                        </div>
                        <div className="topRight">
                            <div className="boardList">
                                <div className="boardIcon" onClick={ () => this.switchBoard(this.props.firebaseUid) }>
                                    <Link to={ targetURL }> <img src={ Blackboard } /> </Link>
                                </div>
                            </div>
                        
                            { this.state.alertNum == 0 ? withoutAlertMsg : withAlertMsg }  

                            <div className="memberIcon">
                                <Link to="/HomePage/boardLists"><img src={ this.props.userPhotoURL } /></Link>
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
        setCurrentUser: (userDisplayName, userPhotoURL, userEmail, firebaseUid) => { dispatch(setCurrentUser(userDisplayName, userPhotoURL, userEmail, firebaseUid)) },
        switchBoard: (targetLink) => { dispatch(switchBoard(targetLink)) },
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Topbar));