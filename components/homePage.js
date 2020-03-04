import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { addBeInvitedData, addInvitationData } from "./actionCreators";
import { lib_fileUpload } from "../library/lib";
import Topbar from "../components/topbar";
import BoardLists from "../components/homePageBoardLists";
import Notifications from "../components/homePageNotifications";
import Editors from "../components/homePageEditors";
import fire from "../src/fire";
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
        this.lib_fileUpload = lib_fileUpload.bind(this)
    } 

    componentDidMount() {
        const firebaseUid = this.props.firebaseUid
        if (firebaseUid == "") {  //確認中

        } else if (firebaseUid == null) {  //未登入
            window.location = "/";
        } else  {
        }
    }

    componentDidUpdate(){
        if ( this.state.currentUserBackground == "" && this.props.firebaseUid !== "") {
            const db = fire.firestore();
            const firebaseUid = this.props.firebaseUid  
            
            db.collection("Boards").doc(firebaseUid).get()
            .then((querySnapshot) => {
                this.setState(prevState => {
                    let currentUserBackground = querySnapshot.data().background
                    return Object.assign({}, prevState, {
                        currentUserBackground: currentUserBackground
                    })
                }) 
            })

            db.collection("Users").doc(firebaseUid).get()
            .then((querySnapshot) => {
                this.setState(prevState => {
                    // console.log("背景圖片網址", querySnapshot.data().homepageCover)
                    let homepageCover = querySnapshot.data().homepageCover
                    return Object.assign({}, prevState, {
                        homepageCover: homepageCover
                    })
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
                                console.log("i == querySnapshot.docs.length-1")
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
                    const theLastNum = querySnapshot.docs.length-1
                    for (let i = 0 ; i < querySnapshot.docs.length ; i ++ ) {
                        let send = querySnapshot.docs[i].data()
                        if ( send.confirm ) {  //找到 confirm true 的人更新自己 db 邀請函裡的資訊再渲染
                            const ref = db.collection("Users").doc(send.userFirebaseuid)
                            ref.get()
                            .then((querySnapshot) =>{
                                send.userName = querySnapshot.data().name;
                                send.userPhoto =  querySnapshot.data().photo;

                                let ref2 = db.collection("Boards").doc(send.userFirebaseuid)
                                ref2.get()
                                .then(async(querySnapshot) =>{
                                    send.backgroundURL = querySnapshot.data().background
                                    data.push(send);
                                    if ( i === theLastNum ) {
                                        this.props.addInvitationData(data)
                                    }
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

    backgroundEditedOn = () => {
        this.setState( prevState => {
            let isBackgroundEdited = prevState.isBackgroundEdited
            isBackgroundEdited = true
            return { 
                isBackgroundEdited: isBackgroundEdited,
            }
        }); 
    }

    backgroundEditedOff = () => {
        this.setState( prevState => {
            let isBackgroundEdited = prevState.isBackgroundEdited
            isBackgroundEdited = false
            return { 
                isBackgroundEdited: isBackgroundEdited,
            }
        }); 
    }

    fileUpload = (event) => {
        const file = event.target.files[0]
        console.log(event.target.files[0])
        // var reader = new FileReader();
        this.lib_fileUpload("homepageCover", file)
        // const storageRef = fire.storage().ref("boardBackground");
        // const imgRef = storageRef.child(file.name)
        // const fileTypes = ["image/jpeg", "image/png","image/gif"]; 
        // let flag = false;
        
        //     imgRef.put(file)
        //     .then((snapshot) => {
        //         for (let i = 0; i < fileTypes.length; i++) {
        //             if ( file.type == fileTypes[i] ) { 
        //                 flag = true
        //                 if (file.size > 190000 ) {
        //                 // console.log("Uploaded a blob or file!");
        //                 imgRef.getDownloadURL().then( async (url) => {
        //                     // console.log(url)
        //                     this.setState( prevState => {
        //                         let homepageCover = url
        //                         return Object.assign({}, prevState, {
        //                             homepageCover: homepageCover,
        //                         })
        //                     });
        //                     const db = fire.firestore();
        //                     let firebaseUid = this.props.firebaseUid
        //                     db.collection("Users").doc(firebaseUid)
        //                     .update({
        //                         homepageCover: this.state.homepageCover
        //                     }).catch((error)=> {
        //                         console.log("Error writing document: ", error.message);
        //                     })
        //                 })
        //                 } else { 
        //                     alert("Oops! Low resolution image.")
        //                     break;
        //                 }
        //             }  
        //         }
        //         if (!flag) {
        //             alert("Only support jpeg/png/gif type files.");
        //         }
        //     }).catch((error) => {
        //         console.error("Error removing document: ", error.message);
        // })      
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
                <div className="homebackground"  style={ style.cover } onMouseEnter={ this.backgroundEditedOn }  onMouseLeave={ this.backgroundEditedOff }>
                    <div className="imgUpload" style={{ display: this.state.isBackgroundEdited ? "block" : "none" }}>                      
                        <label action="/somewhere/to/upload" encType="multipart/form-data">
                            <img src={ Gear }/>             
                            <input name="progressbarTW_img" type="file" accept="image/gif, image/jpeg, image/png" onChange={ this.fileUpload } style={{display:'none' }} />    
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
        firebaseUid: state.firebaseUid,
        userEmail: state.userEmail,
        userDisplayName: state.userDisplayName,
        userPhotoURL: state.userPhotoURL,
        beInvitedData: state.beInvitedData,
        invitationData: state.invitationData,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addBeInvitedData: (data) => { dispatch(addBeInvitedData(data)) },
        addInvitationData: (data) => { dispatch(addInvitationData(data)) },
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(HomePage);
