import React from "react";
import "../css/loginPage.css";
import GLogin from "./googleBar.js";
import LoginImg from "../images/loginpage_main2.png";
import ContentImg1 from "../images/loginpage_content1.png";
import ContentImg2 from "../images/loginpage_content2.png";
import ContentImg3 from "../images/loginpage_content3.png";
import Mylogo from "../images/myLogo.png";
import Postit from "../images/post-it-w.png"
import firebase from "firebase";

class LoginPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email: "",
            password: "",
            message: "",
            isRegisted: false,
            isLoggedin: false,
            isSigninArea: false,
        }
    }

    getEmail = (event) => {
        let emailValue = event.target.value
        const pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if ( pattern.test(emailValue) ||  emailValue.length === 0) {
            this.setState({ 
                    email: emailValue ,
                    message: "",
                })
        } else {
            this.setState({ message: "The email address is badly formatted." }) 
        }
    }

    getPassword = (event) => {
        let passwordValue = event.target.value
        this.setState({ password: passwordValue }) 
    }
    
    registerWithFire = () => {
        if ( this.state.email === "" ) {
            this.setState({ message: "error" }) 
        }
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        .catch((error) => {
            this.setState({ message: error.message }) 
        });
    }

    registerWithFireByEnter = (event) => {
        if ( event.key === "Enter" ) {
            this.registerWithFire();
        }
    }

    loginWithFire = () => {
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .catch((error) => {
            this.setState({ message: error.message }) 
        });
    }

    loginWithFireByEnter = (event) => {
        if ( event.key === "Enter" ) {
            this.loginWithFire();
        }
    }

    switchSigninArea = (isRegisted, isLoggedin, isSigninArea) => {
        this.setState({ 
            isRegisted: isRegisted,
            isLoggedin: isLoggedin,
            isSigninArea: isSigninArea 
        })
    }

    render(){

        const style = {
            signinArea: {
                opacity: this.state.isSigninArea ? "1" : "0" ,
            },
            signup: {
                opacity: this.state.isRegisted ? "1" : "0" ,
                height: this.state.isRegisted ? "250px" : "0px", 
                zIndex: this.state.isRegisted ? "10" : "",
            },
            login: {
                opacity: this.state.isLoggedin ? "1" : "0" ,
                height: this.state.isLoggedin ? "250px" : "0px",
                zIndex: this.state.isLoggedin ? "10" : "",
            }
        }
        const textContent = [ 
            <div className="textContent">
                <div className="details"style={{ textAlign: "left" }}>
                    <p>a-llo’s boards enable you to organize and prioritize your projects in a fun, flexible, and rewarding way.</p>
                </div>
                <div className="slogan">
                    <p>Enhance your teamwork </p>
                    <p>with <span className="webName">a-llo</span> !</p>
                </div>
            </div>
            ];

        const sign = [ 
            <div className="textContent">
                <div className="SignDetails" style={{textAlign: "center", fontSize:"19px" }}>
                    <p>Sign up for your account</p>
                </div>
                <div className="slogan">
                </div>
            </div>
            ];

            
        const login = [ 
            <div className="textContent">
                <div className="details" style={{ textAlign: "center", fontSize:"19px" }}>
                    <p>Log in to a-llo</p>
                </div>
                <div className="slogan">
                </div>
            </div>
            ];

        return(

            <React.Fragment>
                <div className="login-page">
                    <div className="login-topBar">
                        <div className="topBar-Left">
                            <div className="logoDiv">
                                <img src={ Postit } />
                            </div>
                            <div className="logoName">
                                <img src={ Mylogo } />
                            </div>                           
                        </div>
                        <div className="topBar-Right">
                        </div>
                    </div>
                    <div className="login-background">
                        <div className="login-main">
                            <div className="login-content">
                                <div className="buttons">
                                    <div className="registerButton" onClick={ () => this.switchSigninArea(true, false, true) }>
                                        <label className="b-button switch-register" value="Register">Register</label>
                                    </div>
                                    <div className="loginButton" onClick={ () => this.switchSigninArea(false, true, true) }>
                                        <label className="b-button switch-login" type="button" value="Login">Login</label>
                                    </div>
                                </div>
                                <div className="signinArea" style={ style.signinArea }>

                                    {/* 註冊滑出的 div */}
                                    <div className="signup" style={ style.signup }>
                                        <div className="rigister-div">
                                            <input type="email" placeholder="Email *" onChange={ this.getEmail }/>
                                            <input label="Password" placeholder="Password *" type="password" onChange={ this.getPassword } onKeyPress={ this.registerWithFireByEnter }/>
                                            <button onClick={ this.registerWithFire } style={{ display:  this.state.isSigninArea ? this.state.isLoggedin ?  "none" : "block"  :  "none" }}>Register</button>
                                        </div>
                                        <p className="errmsg"> {this.state.message} </p>
                                    </div>

                                    {/* 登入滑出的 div */}
                                    <div className="login" style={style.login}>
                                        <div className="login-div">
                                            <input type="email" placeholder="Email *" onChange={ this.getEmail }/>
                                            <input label="Password" placeholder="Password *" type="password" onChange={ this.getPassword } onKeyPress={ this.loginWithFireByEnter }/>
                                            <button onClick={ this.loginWithFire } style={{ display: this.state.isLoggedin ? "block" : "none" }}>Log in</button>
                                        </div>
                                        <p className="errmsg"> {this.state.message} </p>
                                        <div className="googleBar" style={{ display: this.state.isLoggedin ? "block" : "none" }}>
                                            <div className="or"><div></div>OR<div></div></div>
                                            <GLogin />
                                        </div>
                                    </div>

                                </div>              
                                { this.state.isSigninArea ? this.state.isLoggedin ? login : sign  :  textContent }                 
                                </div>

                            <div className="login-img">
                                <img src={ LoginImg }/>
                            </div>
                        </div>
                    </div>

                    <div className="login-content">
                        <div className="section section1">
                            <div className="picture">
                                <img src={ ContentImg1 }/>
                            </div>
                            <div className="text">
                                <h2>-Visualize your task list</h2>
                                <p>Besides sharing picture, adding category tags for your schedule.</p>
                            </div>
                        </div>
                        <div className="section">
                            <div className="text">
                                <h2>-Cooperate with anyone.</h2>
                                <p>Whether it is your personal jobs, team project or travel plan among friends and family. a-llo organizes and gets everything leap to the eye.</p>
                            </div>
                            <div className="picture">
                                <img src={ ContentImg2 }/>
                            </div>
                        </div>
                        <div className="section section3">
                            <div className="picture">
                                <img src={ ContentImg3 }/>
                            </div>
                            <div className="text">
                                <h2>-Sectional schedule management</h2>
                                <p>Drag and drop between list and comment offers you more flexibility.</p>
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