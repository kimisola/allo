import React from 'react';
import "../css/homePage.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { connect } from 'react-redux';
import Topbar from "../components/topbar";
import BoardLink from "../components/boardLink";
import BoardLists from "../components/homePageBoardLists";
import Notifications from "../components/homePageNotifications";
import Editors from "../components/homePageEditors";
import ReplyButtons from "../components/replyButtons";
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
            beInvitedData:[],
            invitationData:[],
            currentUserBackground: "",
        }
    } 

    componentDidMount() {
        let firebaseUid = this.props.firebaseUid
        if (firebaseUid == "") {  // 確認中

        } else if (firebaseUid == null) {  //未登入
            window.location = "/";
        } else  {
        }
    }

    componentDidUpdate (){
        if ( this.state.beInvitedData == [] || this.state.beInvitedData[0] == undefined ) {
            const db = fire.firestore();
            let firebaseUid = this.props.firebaseUid  
            console.log("homepage firebaseUid", firebaseUid)
            
            //  get current user's board background image
            db.collection("Boards").doc(firebaseUid).get()
            .then((querySnapshot) => {
                this.setState(prevState => {
                    let currentUserBackground = querySnapshot.data().background
                    return Object.assign({}, prevState, {
                        currentUserBackground: currentUserBackground
                    })
                }) 
            })

            // get current user's homepage cover
            db.collection("Users").doc(firebaseUid).get()
            .then((querySnapshot) => {
                console.log("querySnapshot", firebaseUid, querySnapshot.doc)
                this.setState(prevState => {
                    let homepageCover = querySnapshot.data().homepageCover
                    return Object.assign({}, prevState, {
                        homepageCover: homepageCover
                    })
                }) 
            })
            
            //  找到資料庫裡邀請是　false　的　doc
            db.collection("Users/" + firebaseUid + "/beInvited").orderBy("index").get()
            .then((querySnapshot) => {
                let data = [];
                for (let i = 0 ; i < querySnapshot.docs.length ; i ++ ) {
                    let send = querySnapshot.docs[i].data()
                    let ref = db.collection("Users").doc(send.userFirebaseuid)
                    ref.get()
                    .then((querySnapshot) =>{
                        console.log("signupsignupsignup", querySnapshot.data())
                        send.userName = querySnapshot.data().name;
                        send.userPhoto =  querySnapshot.data().photo;

                        let ref2 = db.collection("Boards").doc(send.userFirebaseuid)
                        ref2.get()
                        .then((querySnapshot) =>{
                            send.backgroundURL = querySnapshot.data().background
                            data.push(send);
                            this.setState( prevState => {
                                return Object.assign({}, prevState, {
                                    beInvitedData: data,
                                })
                            }); 
                        }).catch((error)=> {
                            console.log("Error writing document: ", error);
                        })
                    }).catch((error)=> {
                        console.log("Error writing document: ", error);
                    })
                }

                db.collection("Users/" + firebaseUid + "/invitation").orderBy("index").get()
                .then((querySnapshot) => {
                    let data = [];
                    for (let i = 0 ; i < querySnapshot.docs.length ; i ++ ) {
                        let send = querySnapshot.docs[i].data()
                        if(send.confirm){  // 找到 confirm true 的人更新自己 db 邀請函裡的資訊再渲染
                            let ref = db.collection("Users").doc(send.userFirebaseuid)
                            ref.get()
                            .then((querySnapshot) =>{
                                console.log("signupsignupsignup", querySnapshot.data())
                                send.userName = querySnapshot.data().name;
                                send.userPhoto =  querySnapshot.data().photo;

                                let ref2 = db.collection("Boards").doc(send.userFirebaseuid)
                                ref2.get()
                                .then(async(querySnapshot) =>{
                                    send.backgroundURL = querySnapshot.data().background
                                    data.push(send);
                                    this.setState( prevState => {
                                        return Object.assign({}, prevState, {
                                            invitationData: data
                                        })
                                    }); 
                                }).catch((error)=> {
                                    console.log("Error writing document: ", error);
                                })
                            }).catch((error)=> {
                                console.log("Error writing document: ", error);
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

    // accept = (index) =>{
    //     console.log(index)

    //     // this.setState(prevState => {
    //     //     return Object.assign({}, prevState, {
    //     //         accepted: true
    //     //     })
    //     // })

    //     const db = fire.firestore();
    //     let firebaseUid = this.props.firebaseUid
        
    //     //用自己的 userFirebaseuid 反推去找對方 invitation 裡面的文件、將 confirm → true
    //     db.collection("Users/" + firebaseUid + "/beInvited").orderBy("index").get()
    //     .then((querySnapshot) => {
    //         console.log(querySnapshot.docs[index].data().userFirebaseuid)    // 用 index 找到邀請我的人的 uid
    //         let docId = querySnapshot.docs[index].id    // 用 uid 找到文件編號
    //         let ref = db.collection("Users/" + firebaseUid + "/beInvited").doc(docId)
    //         ref.update({ 
    //             confirm: true,
    //             read: false,
    //         })

    //         let oppFiredaseUid = querySnapshot.docs[index].data().userFirebaseuid   //去對方的集合找自己的 firebaseUid
    //         db.collection("Users/" + oppFiredaseUid + "/invitation").where("userFirebaseuid", "==", firebaseUid)
    //         .get().then((querySnapshot) => {      // querySnapshot.docs[0].id 為固定寫法、where 抓 firebaseUid 常理只會有一筆
    //             let docId = querySnapshot.docs[0].id
    //             let  ref = db.collection("Users/" + oppFiredaseUid + "/invitation").doc(docId)
    //             ref.update({ 
    //                 confirm: true,
    //                 read: false,
    //             })
    //         })
    //     })
    // }


    // deny = (index) => {
        
    //     // this.setState(prevState => {
    //     //     return Object.assign({}, prevState, {
    //     //         denied: true
    //     //     })
    //     // })

    //     const db = fire.firestore();
    //     let firebaseUid = this.props.firebaseUid
    //     db.collection("Users/" + firebaseUid + "/beInvited").orderBy("index").get()
    //     .then((querySnapshot) => {
    //         console.log(querySnapshot.docs[index].data().userFirebaseuid)
    //         let docId = querySnapshot.docs[index].id
    //         let ref = db.collection("Users/" + firebaseUid + "/beInvited").doc(docId)
    //         ref.update({
    //             confirm: null,
    //         })
    //     })
    // }

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
        var reader = new FileReader(); 
        const storageRef = fire.storage().ref("homepageCover");
        const imgRef = storageRef.child(file.name)
        const fileTypes = ["image/jpeg", "image/png","image/gif"]; 
        console.log("typetypetypetypetype",file.size)
        let flag = false;
        
            imgRef.put(file)
            .then((snapshot) => {
                for (let i = 0; i < fileTypes.length; i++) {
                    if ( file.type == fileTypes[i] ) { 
                        flag = true
                        if (file.size > 200000 ) {
                        console.log("Uploaded a blob or file!");
                        imgRef.getDownloadURL().then( async (url) => {
                            console.log(url)
                            this.setState( prevState => {
                                let homepageCover = url
                                return Object.assign({}, prevState, {
                                    homepageCover: homepageCover,
                                })
                            });
                            const db = fire.firestore();
                            let firebaseUid = this.props.firebaseUid
                            db.collection("Users").doc(firebaseUid)
                            .update({
                                homepageCover: this.state.homepageCover
                            }).then(() => {
                                console.log("Document successfully written!")
                            }).catch((error)=> {
                                console.log("Error writing document: ", error);
                            })
                        })
                        } else { 
                            alert("檔案解析度太低了喔~")
                            break;
                        }
                    }  
                }
                if (!flag) {
                    alert("不接受此類型檔案，請上傳jpeg/png/gif類型檔案喔~");
                }
            }).catch((error) => {
                console.error("Error removing document: ", error);
        })      
    }

    render(){
        console.log("this.propsthis.propsthis.props", this.state.invitationData)

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
                    <div className="imgUpload" style={{ display: this.state.isBackgroundEdited ? 'block' : 'none' }}>                      
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
                            <Link to="/HomePage/boardLists"><div className="readBoard item">看板列表</div></Link>
                            <Link to="/HomePage/notifications"><div className="readNotice item">通知一覽</div></Link>
                            <Link to="/HomePage/editors"><div className="readEditor item">允許編輯</div></Link>
                        </div>

                        <Switch>
                            <Route path="/HomePage/boardLists">
                                <BoardLists beInvitedData={ this.state.beInvitedData } currentUserBackground={ this.state.currentUserBackground }/>
                            </Route>
                            <Route path="/HomePage/notifications">
                                <Notifications beInvitedData={ this.state.beInvitedData } invitationData={ this.state.invitationData }/>
                            </Route>
                            <Route path="/HomePage/editors">
                                <Editors invitationData={ this.state.invitationData }/>
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
    }
}

export default connect(mapStateToProps)(HomePage);
