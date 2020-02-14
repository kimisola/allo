import React from 'react';
import Slogan from "../images/slogan.png";
import GLogin from "../components/googleBar.js";
import LoginImg from "../images/login-img.png";
import Right from "../images/right.png";
import firebase from 'firebase';
import fire from "../src/fire";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {  grey, COMPLEMENTARY} from '@material-ui/core/colors';
import { sizing } from '@material-ui/system';

const InviteFriend = withStyles({
    root: {
      '& label.Mui-focused': {
        color: "#ffffff",
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: grey[600],
      },
    //   '& .MuiInput-formControl': {
    //     marginTop: 13,
    //   }
    },
  })(TextField);



class LoginPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email: "",
            password: "",
            message: "",
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
            // 註冊失敗時顯示錯誤訊息
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
        .catch((err) => {
            console.log(err.message);
        });
    }

    render(){
        return(
            <React.Fragment>
                <div className="login-background"></div>

                <div className="login-topBar">
                    a-llo
                </div>
                <div className="login-main">
                    <div className="login-content">
                                           
                        <div className="buttons">
                            <input className="b-button" type="button" value="Register" />
                            <input className="b-button" type="button" value="Login" />
                        </div>

                        <div className="signinArea">
                            <div className="signup">
                                <InviteFriend   id="standard-textarea-a"
                                label="Enter email"
                                multiline
                                onChange={ this.getMailValue }
                                onKeyPress={ this.invite }
                                /><br />
                                <InviteFriend
                                id="standard-textarea-b"
                                label="Enter password"
                                multiline
                                onChange={ this.getMailValue }
                                onKeyPress={ this.invite }
                                />
                                <p className="errmsg"> {this.state.message} </p>
                                <div className="rigister-div">
                                    <div className="rigister-img">
                                        <img src={ Right } onClick={ this.registerWithFire }/>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="login">
                                <input type="text" placeholder="email" name="email" onChange={ this.loginEmail }/><br />
                                <input type="password" placeholder="password" name="password" onChange={ this.Loginpassword } /><br />
                                <input type="button" value="Login" onClick={ this.loginWithFire }/>
                                <p className="errmsg"> {this.state.message} </p>
                                <GLogin />
                            </div> */}
                        </div>




                        <GLogin />



                        {/* <div className="signinArea">
                            <div className="signup">
                                <input type="text" placeholder="email" name="email" onChange={ this.getEmail }/><br />
                                <input type="password" placeholder="password" name="password" onChange={ this.getPassword } /><br />
                                <input type="button" value="Register" onClick={ this.registerWithFire }/>
                                <p className="errmsg"> {this.state.message} </p>
                            </div>
                            <div className="login">
                                <input type="text" placeholder="email" name="email" onChange={ this.loginEmail }/><br />
                                <input type="password" placeholder="password" name="password" onChange={ this.Loginpassword } /><br />
                                <input type="button" value="Login" onClick={ this.loginWithFire }/>
                                <p className="errmsg"> {this.state.message} </p>
                                <GLogin />
                            </div>
                        </div> */}

                        <div className="textContent">
                            <div className="slogan">
                                <p>Enhance your teamwork </p>
                                <p>with <div className="webName">a-llo</div> !</p>
                            </div>
                            <div className="details">
                                <p>Trello’s boards, lists, and cards enable you to organize and prioritize your projects in a fun, flexible, and rewarding way.</p>
                            </div>
                        </div>

                    </div>
                    <div className="login-img">
                        <img src={ LoginImg }/>
                    </div>
                </div>


            </React.Fragment>
        )
    }
}
export default LoginPage;