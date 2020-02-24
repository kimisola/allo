import React from 'react';
import "../css/loginPage.css";
import GLogin from "../components/googleBar.js";
import LoginImg from "../images/loginpage_main1.png";
import ContentImg1 from "../images/loginpage_content1.png";
import ContentImg2 from "../images/loginpage_content2.png";
import ContentImg3 from "../images/loginpage_content3.png";
import Right from "../images/right.png";
import Sticky from "../images/myLogo.png";
import firebase from 'firebase';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const InviteFriend = withStyles({
    root: {
      '& label.Mui-focused': {
        color: "#ffffff",
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: "#ffffff",
      },
      '& .MuiInput-formControl': {
        marginTop: "2vh",
      },
    '& .MuiInput-root': {
        height: "4.5vh",
      },
    },
})(TextField);


class LoginPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email: "",
            password: "",
            message: "",
            isRegisted: false,
            isLoginin: false,
            isSigninArea: false,
        }
    }

    getEmail = (event) => {
        let emailValue = event.target.value
        const pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if ( pattern.test(emailValue) ||  emailValue.length === 0) {
            console.log(emailValue)
            this.setState(prevState => { 
                return Object.assign({}, prevState, { 
                    email: emailValue ,
                    message: "",
                }) 
            })
        } else {
            this.setState(prevState => { 
                return Object.assign({}, prevState, { message: "email 格式不符合規定哦" }) 
            })
        }
    }

    getPassword = (event) => {
        let passwordValue = event.target.value
        console.log(passwordValue)
        this.setState(prevState => { 
            return Object.assign({}, prevState, { password: passwordValue }) 
        })
    }

    loginEmail = (event) => {
        let emailValue = event.target.value
        this.setState(prevState => { 
            return Object.assign({}, prevState, { 
                email: emailValue ,
                message: "",
            }) 
        })
    }

    Loginpassword = (event) => {
        let passwordValue = event.target.value
        console.log(passwordValue)
        this.setState(prevState => { 
            return Object.assign({}, prevState, { password: passwordValue }) 
        })
    }

    
    registerWithFire = () => {

        if ( this.state.email === "" ) {
            this.setState(prevState => { 
                return Object.assign({}, prevState, { message: "error" }) 
            })
        }
        // 透過 auth().createUserWithEmailAndPassword 建立使用者
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((user) => {
            var user = firebase.auth().currentUser;
            console.log(user);
            // writeInUser(user)
            
        }).catch((error) => {
            this.setState(prevState => { 
                return Object.assign({}, prevState, { message: error.message }) 
            })
        });
    }

    loginWithFire = () => {
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((user) => {
            var user = firebase.auth().currentUser;
            console.log(user);
        if (user) {
            // User is signed in.
            console.log("Login successfully")
        } else {
            // No user is signed in.
        }
        })
        .catch((error) => {
            this.setState(prevState => { 
                return Object.assign({}, prevState, { message: error.message }) 
            })
        });
    }

    switchToRegister = () => {
        this.setState( prevState => {
            let isRegisted = prevState.isRegisted
            isRegisted = true
            let isLoginin = prevState.isLoginin
            isLoginin = false
            let isSigninArea = prevState.isSigninArea
            isSigninArea = true
            return { 
                isRegisted: isRegisted,
                isLoginin: isLoginin,
                isSigninArea: isSigninArea
            }
        }); 
    }

    switchToLogin = () => {
        this.setState( prevState => {
            let isRegisted = prevState.isRegisted
            isRegisted = false
            let isLoginin = prevState.isLoginin
            isLoginin = true
            let isSigninArea = prevState.isSigninArea
            isSigninArea = true
            return { 
                isRegisted: isRegisted,
                isLoginin: isLoginin,
                isSigninArea: isSigninArea
            }
        }); 
    }


    render(){

        const style = {
            signinArea: {
                opacity: this.state.isSigninArea ? '1' : '0' ,
            },
            signup: {
                opacity: this.state.isRegisted ? '1' : '0' ,
                width: this.state.isRegisted ? '50vh' : '0px' ,
                height: this.state.isRegisted ? '33vh' : '0px', 
            },
            login: {
                opacity: this.state.isLoginin ? '1' : '0' ,
                width: this.state.isLoginin ? '50vh' : '0px' ,
                height: this.state.isLoginin ? '33vh' : '0px',
            }
        }

        return(

            <React.Fragment>
                <div className="login-page">

                    <div className="login-topBar">
                        <div className="topBar-Left">
                            <div className="logoDiv">
                                <img src={ Sticky } />
                            </div>
                            <div className="logoName">

                            </div>
                            
                        </div>
                        <div className="topBar-Right">
                            {/* <div className="regist"> Regist </div>
                            <div className="login"> Login </div> */}
                            {/* <div className="guide"> Guide </div> */}
                        </div>
                    </div>
                    <div className="login-background">

                        <div className="login-main">
                            <div className="login-content">
                                                
                                <div className="buttons">
                                    <div className="registerButton" onClick={ this.switchToRegister }>
                                        <label className="b-button switch-register"  value="Register" >Register</label>
                                    </div>
                                    <div className="loginButton" onClick={ this.switchToLogin }>
                                        <label className="b-button switch-login" type="button" value="Login" >Login</label>
                                    </div>
                                </div>

                                <div className="signinArea" style={ style.signinArea }>

                                    {/* 註冊滑出的 div */}
                                    <div className="signup" style={ style.signup }>
                                        <InviteFriend   id="standard-textarea-a"
                                        label="Enter email"
                                        multiline
                                        onChange={ this.getEmail }
                                        /><br />
                                        <InviteFriend
                                        id="standard-textarea-b"
                                        label="Enter password"
                                        multiline
                                        onChange={ this.getPassword }
                                        />
                                        <p className="errmsg"> {this.state.message} </p>
                                        <div className="rigister-div">
                                            <div className="rigister-img">
                                                <img src={ Right } onClick={ this.registerWithFire }/>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 登入滑出的 div */}
                                    <div className="login" style={style.login}>
                                        <InviteFriend   id="standard-textarea-c"
                                        label="Email"
                                        multiline
                                        onChange={ this.loginEmail }
                                        /><br />
                                        <InviteFriend
                                        id="standard-textarea-d"
                                        label="Password"
                                        multiline
                                        onChange={ this.Loginpassword  }
                                        />
                                        
                                        <p className="errmsg"> {this.state.message} </p>
                                        <div className="login-div">
                                        <GLogin />
                                            <div className="login-img">
                                                <img src={ Right } onClick={ this.loginWithFire }/>
                                            </div>
                                        </div>                              
                                    </div>

                                </div>

                                <div className="textContent">
                                    <div className="details">
                                        <p>a-llo 的管理，讓你輕鬆享受生活與工作。</p>
                                    </div>
                                    <div className="slogan">
                                        <p>Enhance your teamwork </p>
                                        <p>with <div className="webName">a-llo</div> !</p>
                                    </div>
                                </div>
                            </div>

                            <div className="login-img">
                                <img src={ LoginImg }/>
                            </div>
                            
                        </div>

                    </div>

                    <div className="login-content">
                        <div className="section">
                            <div className="picture">
                                <img src={ ContentImg1 }/>
                            </div>
                            <div className="text">
                                <h2>文字以外的豐富度</h2>
                                <p>除了文字的紀錄外，也可以分享圖片，甚至是貼上進度標籤提醒工作進度。</p>
                            </div>
                        </div>
                        <div className="section">
                            <div className="text">
                                <h2>與任何團隊合作無間</h2>
                                <p>不論是個人的工作內容，還是團隊間的專案，甚至是家人朋友間的旅遊，a-llo 都可以井然有序地幫你紀錄相關事務。</p>
                            </div>
                            <div className="picture">
                                <img src={ ContentImg2 }/>
                            </div>
                        </div>
                        <div className="section">
                            <div className="picture">
                                <img src={ ContentImg3 }/>
                            </div>
                            <div className="text">
                                <h2>動態的行程管理</h2>
                                <p>支援列表和留言間的拖曳，讓你有更多的彈性來管理專案內容。</p>
                            </div>
                        </div>
                        <div className="section">
                            <div className="text">
                                <h2>簡單快速上手的操作</h2>
                                <p>這裡預計放網站的使用教學 →</p>
                            </div>
                            <div className="picture">
                                <img src={ ContentImg2 }/>
                            </div>
                        </div>
                    </div>

                    <div className="login-footer">
                        <div>&copy; 2020 a-llo Copyright </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
export default LoginPage;