import React from 'react';
import Slogan from "../images/slogan.png";
import GLogin from "../components/googleBar.js";
import firebase from 'firebase';
import fire from "../src/fire";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

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

    render(){
        return(
            <React.Fragment>
                <div className="Lmain"></div>
                <div className="Lgard"></div>

                <div className="Lbody">

                    <div className="Lheader">
                        <div className="Ltitle">
                            <img src={ Slogan } /> 
                        </div>
                    </div>
                    <div className="Llogin">
                        <div className="LnameDiv">
                            <p className="Lname">a-llo</p>
                        </div>
                        <div>
                            <input type="text" placeholder="email" name="email" onChange={ this.getEmail }/><br />
                            <input type="password" placeholder="password" name="password" onChange={ this.getPassword } /><br />
                            <input type="password" placeholder="confirm password" name="password" onChange={ this.getPassword } /><br />
                            <input type="button" value="Register" onClick={ this.registerWithFire }/>
                            <p className="errmsg"> {this.state.message} </p>
                            
                        </div>
                        <div>
                            <input type="text" placeholder="email" name="email" onChange={ this.loginEmail }/><br />
                            <input type="password" placeholder="password" name="password" onChange={ this.Loginpassword } /><br />
                            <input type="button" value="Login" onClick={ this.loginWithFire }/>
                            <p className="errmsg"> {this.state.message} </p>
                            <GLogin />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
export default LoginPage;