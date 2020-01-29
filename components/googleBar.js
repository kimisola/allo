import React, { Component } from 'react';
import { GoogleLogin } from 'react-google-login';
import "../src/gLogin.css";


const responseGoogle = (response) => {
    console.log(response);
}

class GLogin extends Component {
    render() {
        return (
            <React.Fragment>
            
            <GoogleLogin
                className='glogin'
                clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
                buttonText="Login with google"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
            />
            
            </React.Fragment>
        );
    }
}

export default GLogin;