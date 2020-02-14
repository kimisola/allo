import React from 'react';
import "../src/main.css";
import { Route } from 'react-router-dom';
import Topbar from "../components/topbar";
import TestIcon from "../images/testIcon.jpg";
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import fire from "../src/fire";
import Cancel from "../images/cancel.png";

class HomePage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isShowInvitation: false,
            renders:[],
            // userEmail:"",
            // userName:"",
            // userPhoto:"",
            // userFirebaseuid:"",
            // alertMsg:[],
        }
    } 

    componentDidMount  (){
        let firebaseUid = this.props.firebaseUid
        console.log("00000000000firebaseUid", firebaseUid);
        if (firebaseUid == "") {  // 確認中

        }else if (firebaseUid == null) {  //未登入
            window.location = "/";
        } 
        else {
            getMessageData(firebaseUid);
        }

        async function getMessageData(firebaseUid) {  
            const db = fire.firestore();
                //找到資料庫裡邀請是　false　的　doc
                db.collection("Users/" + firebaseUid + "/beInvited").orderBy("index").get()
                .then((querySnapshot) => {
                    let rend = [];
                    for(let i = 0 ; i < querySnapshot.docs.length ; i ++ ){
                        console.log(querySnapshot.docs[i].data())
                        let send = querySnapshot.docs[i].data()
                        send.userName = ( send.userName + "　邀請您的共同編輯他的看板" );
                        rend.push(send);
                    }
                    this.setState( prevState => {
                        return Object.assign({}, prevState, {
                            renders: rend,
                        })
                    });             
                }).catch((error) =>{
                    console.log(error.massage);
                })
            }
        }

    render(){
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
                                {/* <div className="name">電子郵件</div> */}
                                <div className="content">{this.props.userEmail}</div>
                            </div>
                            <div className="list">
                                {/* <div className="name">使用者名稱</div> */}
                                <div className="content name" >{this.props.userDisplayName}</div>
                            </div>
                        </div>
                    </div>

                    {/* <div className="boardLists">
                        <div className="section">
                            <div className="category">歷史瀏覽</div>
                            <div className="items">
                                <div className="board">我的看板</div>
                                <div className="board">看板3</div>
                                <div className="board">看板2</div>
                            </div>
                        </div>
                        <div className="section">
                            <div className="category">我的看板</div>
                            <div className="items">
                                <div className="board">我的看板</div>
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
                    </div>   */}

                    <div className="mainContent">
                        <div className="menu">
                            <div className="readBoard item">看板列表</div>
                            <div className="readNotice item">通知一覽</div>
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
                                        <div className="content">
                                            <div className="name">CW P</div>
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
                                        <div className="content">
                                            <div className="name">CW P</div>
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
                                        <div className="content">
                                            <div className="name">CW P</div>
                                            <div className="delete">
                                                <img src={Cancel}/>
                                            </div>
                                        </div>

                                </div>
                            </div>
                        </div>


                        <div className="boardLists">
                            <div className="section">
                                <div className="category">通知一覽</div>
                                <div className="bars">

                                {this.state.renders.map((item)=>
                                   <React.Fragment> 
                                    <div className="sanckbar">
                                        <div className="msg">
                                            <div className="imgDiv">
                                                <img src={item.userPhoto} />
                                            </div>
                                            <p>{item.userName} </p>
                                        </div>
                                        <div className="buts">
                                            <div className="accept">確認</div>
                                            <div className="deny">拒絕</div>
                                        </div>
                                    </div>
                                    <div className="sanckbar">
                                        <div className="msg">
                                            <div className="imgDiv">
                                                <img src={item.userPhoto} />
                                            </div>
                                            <p>{item.userName} </p>
                                        </div>
                                        <div className="buts">
                                            <div className="accept">確認</div>
                                            <div className="deny">拒絕</div>
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
