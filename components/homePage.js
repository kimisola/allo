import React from 'react';
import "../css/homePage.css";
import { Route } from 'react-router-dom';
import Topbar from "../components/topbar";
import BoardLink from "../components/boardLink";
import ReplyButtons from "../components/replyButtons";
import { connect } from 'react-redux';
import fire from "../src/fire";
import Cancel from "../images/cancel.png";
import DropdownIcon from "../images/dropdownIcon.png";
import Gear from "../images/gear.png";
import "../css/homePage.css";

class HomePage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isBackgroundEdited: false,
            backgroundURL: "",
            isBoardListShowed: false,
            isNotificationShowed: false,
            isFriendListShowed: false,
            isShowInvitation: false,
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
                            
                        }).catch((error)=> {
                            console.log("Error writing document: ", error);
                        })
                    }).catch((error)=> {
                        console.log("Error writing document: ", error);
                    })
                    data.push(send);
                }

                this.setState( prevState => {
                    return Object.assign({}, prevState, {
                        beInvitedData: data,
                    })
                }); 

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
                                .then((querySnapshot) =>{
                                    send.backgroundURL = querySnapshot.data().background
                                    data.push(send);
                                }).catch((error)=> {
                                    console.log("Error writing document: ", error);
                                })
                            }).catch((error)=> {
                                console.log("Error writing document: ", error);
                            })
                        }
                    }
                    this.setState( prevState => {
                        return Object.assign({}, prevState, {
                            invitationData: data
                        })
                    }); 
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

    friendListShow = () => {
        this.setState( prevState => {
            let isBoardListShowed = prevState.isBoardListShowed
            isBoardListShowed = false
            let isNotificationShowed = prevState.isNotificationShowed
            isNotificationShowed = false
            let isFriendListShowed =  prevState.isFriendListShowed
            isFriendListShowed = true
            return Object.assign({}, prevState, {
                isBoardListShowed: isBoardListShowed,
                isNotificationShowed: isNotificationShowed,
                isFriendListShowed: isFriendListShowed,
            });
         })
    }

    showBoardLists = () => {
        this.setState( prevState => {
            let isBoardListShowed = prevState.isBoardListShowed
            isBoardListShowed = true
            let isNotificationShowed = prevState.isNotificationShowed
            isNotificationShowed = false
            let isFriendListShowed =  prevState.isFriendListShowed
            isFriendListShowed = false
            return Object.assign({}, prevState, {
                isBoardListShowed: isBoardListShowed,
                isNotificationShowed: isNotificationShowed,
                isFriendListShowed: isFriendListShowed,
            })
        }); 
    }

    showNotifications = () => {
        this.setState( prevState => {
            let isBoardListShowed = prevState.isBoardListShowed
            isBoardListShowed = false
            let isNotificationShowed = prevState.isNotificationShowed
            isNotificationShowed = true
            let isFriendListShowed =  prevState.isFriendListShowed
            isFriendListShowed = false
            return Object.assign({}, prevState, { 
                isBoardListShowed: isBoardListShowed,
                isNotificationShowed: isNotificationShowed,
                isFriendListShowed: isFriendListShowed,
            })
        }); 
    }


    unfriend = (userFirebaseuid) => {
        const db = fire.firestore();
        db.collection("Users/" + this.props.firebaseUid + "/invitation").where("userFirebaseuid", "==", userFirebaseuid)
        .get().then((querySnapshot) => {
            let docId = querySnapshot.docs[0].id
            let  ref = db.collection("Users/" + this.props.firebaseUid + "/invitation").doc(docId)
            ref.update({ 
                confirm: null,
            })
        })

        db.collection("Users/" + userFirebaseuid + "/beInvited").where("userFirebaseuid", "==", this.props.firebaseUid)
        .get().then((querySnapshot) => {
            let docId = querySnapshot.docs[0].id
            let  ref = db.collection("Users/" + this.props.firebaseUid + "/beInvited").doc(docId)
            ref.update({ 
                confirm: null,
            })
        })
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
                        
                        }else { 
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
            },
            dropdownIcon: {
                transform: this.state.isIconTurn ? "" : "rotate(-90deg)",
                transition: "transform .25s ease-in-out",
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
                            <div className="readBoard item" onClick={ () => this.showBoardLists() }>看板列表</div>
                            <div className="readNotice item" onClick={ () => this.showNotifications() }>通知一覽</div>
                            <div className="list">
                                
                                <div className="listTitle" onClick={ () => this.friendListShow() }>
                                    <div className="name">允許編輯</div>
                                    {/* <div className="dropdownIcon">
                                        <img src={ DropdownIcon }style={ style.dropdownIcon }/>
                                    </div> */}
                                </div>
                                {/* <div className="listContent" style={{ display: this.state.isFriendListShowed ? 'block' : 'none' }}>
                                    { this.state.invitationData.map((item, index) =>
                                    <div className="content" key={index}>
                                        <div className="name">{ item.userName }</div>
                                        <div className="delete">
                                            <img src={Cancel} onClick={ () => this.unfriend(item.userFirebaseuid) }/>
                                        </div>
                                    </div>
                                    )}
                               
                                </div> */}
                            </div>
                        </div>

                        <div className="boardLists" style={{display: this.state.isBoardListShowed ? 'block' : 'none' }}>
                            <div className="section">
                                <div className="category">我的看板</div>
                                <div className="items">
                                    <BoardLink 
                                    boardBackground={ this.state.currentUserBackground }
                                    targetLink={ this.props.firebaseUid }
                                    boardName={ this.props.userDisplayName }
                                    />
                                </div>
                            </div>
                            <div className="section">
                                <div className="category">可編輯看板</div>
                                <div className="items">
                                { this.state.beInvitedData.map((item, index) => item.confirm ?
                                        <BoardLink 
                                        boardBackground={ item.backgroundURL }
                                        targetLink={ item.userFirebaseuid }
                                        boardName={ item.userName }
                                        key={index}
                                        /> :""
                                    )}
                                </div>
                            </div>
                            <div className="section">
                                <div className="category">歷史瀏覽</div>
                                <div className="items">
                                    <BoardLink 
                                        boardBackground={ "https://images.unsplash.com/photo-1581309553233-a6d8e331c921?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1051&q=80" }
                                        // targetLink={ uid }
                                        boardName="歷史看板"
                                    />
                                    <BoardLink 
                                        boardBackground={ "https://images.unsplash.com/photo-1581309553233-a6d8e331c921?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1051&q=80" }
                                        // targetLink={ uid }
                                        boardName="歷史看板"
                                    />
                                    <BoardLink 
                                        boardBackground={ "https://images.unsplash.com/photo-1581309553233-a6d8e331c921?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1051&q=80" }
                                        // targetLink={ uid }
                                        boardName="歷史看板"
                                    />
                                </div>
                            </div>
                        </div>   

                        <div className="notifications" style={{display: this.state.isNotificationShowed ? 'block' : 'none' }}>
                            <div className="section">
                                <div className="category">通知一覽</div>
                                <div className="bars">

                                {this.state.beInvitedData.map((item, index)=>
                                   <React.Fragment key={index}> 
                                    <div className="sanckbar">
                                        <div className="msg">
                                            <div className="imgDiv">
                                                <img src={item.userPhoto} />
                                            </div>
                                            <p>{item.userName}　邀請您的共同編輯他的看板</p>
                                        </div>
                                        <div className="buts">
                                        <ReplyButtons confirm={ item.confirm } index={ index } userFirebaseuid={ item.userFirebaseuid }/> 
                                        </div>
                                    </div>
                                    </React.Fragment>
                                )}

                                {this.state.invitationData.map((item, index)=>
                                   <React.Fragment key={index}> 
                                    <div className="sanckbar">
                                        <div className="msg">
                                            <div className="imgDiv">
                                                <img src={item.userPhoto} />
                                            </div>
                                            <p>{item.userName}　同意了您的共同編輯邀請</p>
                                        </div>
                                    </div>
                                    </React.Fragment>
                                )}

                                </div>
                            </div>
                        </div>

                        <div className="editors" style={{display: this.state.isFriendListShowed ? 'block' : 'none' }}>
                            <div className="section">
                                <div className="category">允許編輯</div>
                                <div className="contents">
                                    { this.state.invitationData.map((item, index) =>
                                        <div className="content" key={index}>
                                            <div className="usePhoto">
                                                <img src={ item.userPhoto } />
                                            </div>
                                            <div className="name">{ item.userName }</div>
                                            <div className="delete">
                                                <img src={ Cancel } onClick={ () => this.unfriend(item.userFirebaseuid) }/>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

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
