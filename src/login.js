import React from 'react';
// import "./login.css";
import Slogan from "../images/slogan.png";
import GLogin from "../components/googleBar.js"

class LoginPage extends React.Component {
    constructor(props){
        super(props);
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
                            <input type="text" placeholder="username" name="user" /><br />
                            <input type="password" placeholder="password" name="password" /><br />
                            <input type="button" value="Login" />
                            <GLogin />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
export default LoginPage;