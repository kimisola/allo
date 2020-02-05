import React from 'react';
import ReactDOM from 'react-dom';
import GoogleLogin from 'react-google-login';
// import "./login.css";
import Slogan from "../images/slogan.png";
import GLogin from "../components/googleBar.js"
import { Route, Link } from 'react-router-dom';

class LoginPage extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <React.Fragment>
                <Route>

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
                            <p className="Lname">arello</p>
                        </div>
                        <div>
                            <input type="text" placeholder="username" name="user" /><br />
                            <input type="password" placeholder="password" name="password" /><br />
                            <Link to={"/Board"} ><input type="button" value="Login" /> </Link>
                            <GLogin />
                        </div>
                    </div>
                </div>

                </Route>
            </React.Fragment>
        )
    }
}
export default LoginPage;