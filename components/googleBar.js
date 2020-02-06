import React, { Component } from 'react';
import firebase from 'firebase';
//install react-firebaseui
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import "../src/main.css";


class GLogin extends Component {

    uiConfig = {
        callbacks: {
          // Avoid redirects after sign-in.
          // signInSuccess: () => false

          // write in db
        },
        // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
        signInFlow: 'popup',
        signInSuccessUrl: '/Board',
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID
          // fire.auth.FacebookAuthProvider.PROVIDER_ID
        ],
        // Terms of service url.
        tosUrl: '/Board',

      };
    
    render() {
        return (
            <React.Fragment>
            
            <div className="firebaseui-auth-container">
              <StyledFirebaseAuth uiConfig={ this.uiConfig } firebaseAuth={ firebase.auth() }/>
            </div>
            
            </React.Fragment>
        );
    }
}

export default GLogin;