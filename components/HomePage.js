import React from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { addBeInvitedData, addInvitationData } from "../actions/actionCreators";
import { uploadBackgroundImg } from "../library/lib";
import Topbar from "./TopBar";
import BoardLists from "./HomePageBoardLists";
import Notifications from "./HomePageNotifications";
import Editors from "./HomePageEditors";
// import fire from "../src/fire";
import { db } from "../src/fire";
import Gear from "../images/gear.png";
import "../css/homePage.css";

class HomePage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isBackgroundEdited: false,
            backgroundURL: "",
            isIconTurn: false, 
            currentUserBackground: "",
        }
        this.uploadBackgroundImg = uploadBackgroundImg.bind(this)
    } 

    componentDidMount() {
        const firebaseUid = this.props.firebaseUid
        if (firebaseUid === "") {  //確認中
            return
        } else if (firebaseUid === null) {  //未登入
            window.location = "/";
        } else  {
            return
        }
    }

    componentDidUpdate(){
        if ( this.state.currentUserBackground === "" && this.props.firebaseUid !== "") {
            const firebaseUid = this.props.firebaseUid  
            
            db.collection("Boards").doc(firebaseUid).get()
            .then((querySnapshot) => {
                this.setState(() => {
                    return ({ currentUserBackground: querySnapshot.data().background })
                })
            })

            db.collection("Users").doc(firebaseUid).get()
            .then((querySnapshot) => {
                this.setState(() => {
                    return ({ homepageCover: querySnapshot.data().homepageCover })
                })
            })
            
            db.collection("Users/" + firebaseUid + "/beInvited").orderBy("index").get()
            .then((querySnapshot) => {
                let data = [];
                const theLastNum = querySnapshot.docs.length-1
                for (let i = 0 ; i < querySnapshot.docs.length ; i ++ ) {
                    let send = querySnapshot.docs[i].data()
                    const ref = db.collection("Users").doc(send.userFirebaseuid)
                    ref.get()
                    .then((querySnapshot) =>{
                        send.userName = querySnapshot.data().name;
                        send.userPhoto =  querySnapshot.data().photo;

                        const ref2 = db.collection("Boards").doc(send.userFirebaseuid)
                        ref2.get()
                        .then((querySnapshot) =>{
                            send.backgroundURL = querySnapshot.data().background
                            data.push(send);
                            if ( i === theLastNum ) {
                                this.props.addBeInvitedData(data)
                            }
                        }).catch((error)=> {
                            console.log("Error writing document: ", error.message);
                        })
                    }).catch((error)=> {
                        console.log("Error writing document: ", error.message);
                    })
                }

                db.collection("Users/" + firebaseUid + "/invitation").orderBy("index").get()
                .then((querySnapshot) => {
                    let data = [];
                    
                    for (let i = 0; i < querySnapshot.docs.length; i ++ ) {
                        let send = querySnapshot.docs[i].data()
                        if ( send.confirm ) {
                            const ref = db.collection("Users").doc(send.userFirebaseuid)
                            ref.get()
                            .then((querySnapshot) =>{
                                send.userName = querySnapshot.data().name;
                                send.userPhoto =  querySnapshot.data().photo;
                                const ref2 = db.collection("Boards").doc(send.userFirebaseuid)
                                ref2.get()
                                .then(async(querySnapshot) =>{
                                    send.backgroundURL = querySnapshot.data().background
                                    data.push(send);
                                    this.props.addInvitationData(data)
                                }).catch((error)=> {
                                    console.log("Error writing document: ", error.message);
                                })
                            }).catch((error)=> {
                                console.log("Error writing document: ", error.message);
                            })
                        }
                    }
                }).catch((error) =>{
                    console.log(error.message);
                })
            }).catch((error) =>{
                console.log(error.message);
            })
        }
    }

    TurnOnEditedMode = () => {
        this.setState({ isBackgroundEdited: true }); 
    }

    TurnOffEditedMode = () => {
        this.setState({ isBackgroundEdited: false }); 
    }

    uploadFile = (event) => {
        const file = event.target.files[0]
        this.uploadBackgroundImg("homepageCover", file)
    }

    render(){

        const style = {
            cover: {
                backgroundImage: `url(${this.state.homepageCover}) `,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
            }
        }

        return(
            <React.Fragment>
                <Topbar />
                <div className="homebackground"  style={ style.cover } onMouseEnter={ this.TurnOnEditedMode }  onMouseLeave={ this.TurnOffEditedMode }>
                    <div className="imgUpload" style={{ display: this.state.isBackgroundEdited ? "block" : "none" }}>                      
                        <label action="/somewhere/to/upload" encType="multipart/form-data">
                            <img src={ Gear }/>             
                            <input name="progressbarTW_img" type="file" accept="image/gif, image/jpeg, image/png" onChange={ this.uploadFile } style={{display:'none' }} />    
                        </label>
                    </div>
                </div>
                <div className="homepage"> 
                    <div className="profile">
                        <div className="myImg">
                            <img src={ this.props.userPhotoURL } />
                        </div>

                        <div className="details">
                            <div className="list">
                                <div className="content">{ this.props.userEmail} </div>
                            </div>
                            <div className="list">
                                <div className="content name" >{ this.props.userDisplayName }</div>
                            </div>
                        </div>
                    </div>
                    <div className="mainContent">
                        <div className="menu">
                            <Link to="/HomePage/boardLists"><div className="readBoard item">Boards</div></Link>
                            <Link to="/HomePage/notifications"><div className="readNotice item">Notifications</div></Link>
                            <Link to="/HomePage/editors"><div className="readEditor item">Access List</div></Link>
                        </div>

                        <Switch>
                            <Route path="/HomePage/boardLists">
                                <BoardLists currentUserBackground={ this.state.currentUserBackground }/>
                            </Route>
                            <Route path="/HomePage/notifications">
                                <Notifications invitationData={ this.props.invitationData }/>
                            </Route>
                            <Route path="/HomePage/editors">
                                <Editors invitationData={ this.props.invitationData }/>
                            </Route>
                        </Switch>

                    </div>  
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state, ownprops) => {
    return {
        firebaseUid: state.board.firebaseUid,
        userEmail: state.board.userEmail,
        userDisplayName: state.board.userDisplayName,
        userPhotoURL: state.board.userPhotoURL,
        beInvitedData: state.homePage.beInvitedData,
        invitationData: state.homePage.invitationData,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addBeInvitedData: (data) => { dispatch(addBeInvitedData(data)) },
        addInvitationData: (data) => { dispatch(addInvitationData(data)) },
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(HomePage);
