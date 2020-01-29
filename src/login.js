import React from 'react';
import ReactDOM from 'react-dom';
import GoogleLogin from 'react-google-login';
import "./login.css";
import slogan from "../images/slogan.png";
import GLogin from "../components/googleBar.js"

class LoginPage extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <React.Fragment>
                <main></main>
                <div className="gard"></div>

                <header>
                    <div className="title">
                        <img src={ slogan } /> 
                    </div>
                </header>

                <div className="login">
                    <div className="nameDiv">
                        <p className="name">arello</p>
                    </div>
                    <div>
                        <input type="text" placeholder="username" name="user" /><br />
                        <input type="password" placeholder="password" name="password" /><br />
                        <input type="button" value="Login" />
                        <GLogin />
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
export default LoginPage;

ReactDOM.render(<LoginPage />, document.querySelector("#loginroot"))