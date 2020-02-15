import React from 'react';
import "../src/main.css";
import { Route } from 'react-router-dom';
import Topbar from "../components/topbar";
import BoardLink from "../components/boardLink"
import TestIcon from "../images/testIcon.jpg";
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import fire from "../src/fire";
import Cancel from "../images/cancel.png";
import Background from "../images/mainBackground.jpg";

class HomePage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isBoardListShowed: false,
            isNotificationShowed: false,
            isShowInvitation: false,
            beInvitedData:[],
            invitationData:[]
        }
    } 

    componentDidMount  (){
        let firebaseUid = this.props.firebaseUid
        console.log("00000000000firebaseUid", firebaseUid);
        if (firebaseUid == "") {  // 確認中

        }else if (firebaseUid == null) {  //未登入
            window.location = "/";
        } 
    }

    componentDidUpdate (){
            console.log("componentDidUpdate")
        if ( this.state.beInvitedData[0] == [] || this.state.beInvitedData[0] == undefined ) {
            const db = fire.firestore();
            let firebaseUid = this.props.firebaseUid
            console.log(firebaseUid,"querySnapshotHomePage")
            //找到資料庫裡邀請是　false　的　doc
            db.collection("Users/" + firebaseUid + "/beInvited").orderBy("index").get()
                .then((querySnapshot) => {
                    console.log(querySnapshot,"querySnapshotHomePage")
                    let data = [];
                    for(let i = 0 ; i < querySnapshot.docs.length ; i ++ ){
                        console.log(querySnapshot.docs[i].data())
                        let send = querySnapshot.docs[i].data()
                        data.push(send);
                    }
                    this.setState( prevState => {
                        return Object.assign({}, prevState, {
                            beInvitedData: data,
                        })
                    }); 

                    db.collection("Users/" + firebaseUid + "/invitation").orderBy("index").get()
                    .then((querySnapshot) => {
                        console.log(querySnapshot,"querySnapshotHomePage")
                        let data = [];
                        for(let i = 0 ; i < querySnapshot.docs.length ; i ++ ){
                            console.log(querySnapshot.docs[i].data())
                            let send = querySnapshot.docs[i].data()
                            if(send.confirm){
                                data.push(send);
                            }
                        }

                        this.setState( prevState => {
                            return Object.assign({}, prevState, {
                                invitationData: data.slice(0)
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

    accept = (index) =>{
        console.log(index)
        const db = fire.firestore();
        let firebaseUid = this.props.firebaseUid
        
        //用自己的 userFirebaseuid 反推去找對方 invitation 裡面的文件、將 confirm → true
        db.collection("Users/" + firebaseUid + "/beInvited").orderBy("index").get()
        .then((querySnapshot) => {
            console.log(querySnapshot.docs[index].data().userFirebaseuid)    // 用 index 找到邀請我的人的 uid
            let docId = querySnapshot.docs[index].id    // 用 uid 找到文件編號
            let ref = db.collection("Users/" + firebaseUid + "/beInvited").doc(docId)
            ref.update({ 
                confirm: true,
            })

            let oppFiredaseUid = querySnapshot.docs[index].data().userFirebaseuid   //去對方的集合找自己的 firebaseUid
            db.collection("Users/" + oppFiredaseUid + "/invitation").where("userFirebaseuid", "==", firebaseUid)
            .get().then((querySnapshot) => {      // querySnapshot.docs[0].id 為固定寫法、where 抓 firebaseUid 常理只會有一筆
                let docId = querySnapshot.docs[0].id
                let  ref = db.collection("Users/" + oppFiredaseUid + "/invitation").doc(docId)
                ref.update({ 
                    confirm: true
                })
            })
        })
    }


    deny = (index) => {
        console.log(index)
        const db = fire.firestore();
        let firebaseUid = this.props.firebaseUid
        db.collection("Users/" + firebaseUid + "/beInvited").orderBy("index").get()
        .then((querySnapshot) => {
            console.log(querySnapshot.docs[index].data().userFirebaseuid)
            let docId = querySnapshot.docs[index].id
            let ref = db.collection("Users/" + firebaseUid + "/beInvited").doc(docId)
            ref.update({
                confirm: null,
            })
        })
    }

    showBoardLists = () => {
        this.setState( prevState => {
            let isBoardListShowed = prevState.isBoardListShowed
            isBoardListShowed = true
            let isNotificationShowed = prevState.isNotificationShowed
            isNotificationShowed = false
            return { 
                isBoardListShowed: isBoardListShowed,
                isNotificationShowed: isNotificationShowed,
            }
        }); 
    }

    showNotifications = () => {
        this.setState( prevState => {
            let isBoardListShowed = prevState.isBoardListShowed
            isBoardListShowed = false
            let isNotificationShowed = prevState.isNotificationShowed
            isNotificationShowed = true
            return { 
                isBoardListShowed: isBoardListShowed,
                isNotificationShowed: isNotificationShowed,
            }
        }); 
    }



    render(){

        // let beInvited = this.state.beInvitedData
        // let invitation = this.state.invitationData
        // let data = beInvited.concat(invitation)
        // let invitationData = []
        // if ( this.state.invitationData !== [] ) {
        //     invitationData = this.state.invitationData
        // }


        return(
            <React.Fragment>

                <Topbar />
                <div className="homebackground"></div>
                <div className="homepage"> 

                    <div className="profile">
                        <div className="myImg">
                            <img src= {this.props.userPhotoURL} />
                        </div>

                        <div className="details">
                            <div className="list">
                                <div className="content">{this.props.userEmail}</div>
                            </div>
                            <div className="list">
                                <div className="content name" >{this.props.userDisplayName}</div>
                            </div>
                        </div>
                    </div>

                    <div className="mainContent">
                        <div className="menu">
                            <div className="readBoard item" onClick={ this.showBoardLists }>看板列表</div>
                            <div className="readNotice item" onClick={ this.showNotifications }>通知一覽</div>
                            <div className="list">
                                
                                <div className="listTitle">
                                    <div className="name">好友名單</div>
                                    <div>
                                        <img />
                                    </div>
                                </div>
                                <div className="listContent">
                                        <div className="content">
                                            <div className="name">June</div>
                                            <div className="delete">
                                                <img src={Cancel}/>
                                            </div>
                                        </div>
                                        <div className="content">
                                            <div className="name">Shaun</div>
                                            <div className="delete">
                                                <img src={Cancel}/>
                                            </div>
                                        </div>
                                        <div className="content">
                                            <div className="name">YC</div>
                                            <div className="delete">
                                                <img src={Cancel}/>
                                            </div>
                                        </div>
                                        <div className="content">
                                            <div className="name">CW P</div>
                                            <div className="delete">
                                                <img src={Cancel}/>
                                            </div>
                                        </div>
                                </div>
                            </div>
                        </div>

                        <div className="boardLists" style={{display: this.state.isBoardListShowed ? 'block' : 'none' }}>
                            <div className="section">
                                <div className="category">歷史瀏覽</div>
                                <div className="items">
                                    <BoardLink 
                                        boardURL={ "https://images.unsplash.com/photo-1581309553233-a6d8e331c921?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1051&q=80" }
                                        // targetLink={ uid }
                                        boardName={ this.state.userDisplayName }
                                    />
                                    <div className="board" >看板3</div>
                                    <div className="board">看板2</div>
                                </div>
                            </div>
                            <div className="section">
                                <div className="category">我的看板</div>
                                <div className="items">
                                { this.state.invitationData.map((item, index) => 
                                        <BoardLink 
                                        boardURL={ item.backgroundURL }
                                        targetLink={ item.userFirebaseuid }
                                        boardName={ item.userName }
                                    />
                                )}
                                </div>
                                
                            </div>
                            <div className="section">
                                <div className="category">好友看板</div>
                                <div className="items">
                                    <div className="board">看板1</div>
                                    <div className="board">看板2</div>
                                    <div className="board">看板3</div>
                                    <div className="board">看板4</div>
                                    <div className="board">看板5</div>
                                    <div className="board">看板6</div>
                                    <div className="board">看板7</div>
                                    <div className="board">看板8</div>
                                </div>
                            </div>
                        </div>   

                        <div className="notifications" style={{display: this.state.isNotificationShowed ? 'block' : 'none' }}>
                            <div className="section">
                                <div className="category">通知一覽</div>
                                <div className="bars">

                                {this.state.beInvitedData.map((item, index)=>
                                   <React.Fragment> 
                                    <div className="sanckbar">
                                        <div className="msg">
                                            <div className="imgDiv">
                                                <img src={item.userPhoto} />
                                            </div>
                                            <p>{item.userName}　邀請您的共同編輯他的看板</p>
                                        </div>
                                        <div className="buts">
                                            <div className="accept" onClick={ () => this.accept(index)}>確認</div>
                                            <div className="deny" onClick={ () => this.deny(index)}>拒絕</div>
                                        </div>
                                    </div>
                                    </React.Fragment>
                                )}

                                {this.state.invitationData.map((item, index)=>
                                   <React.Fragment> 
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
