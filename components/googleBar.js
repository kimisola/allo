import React, { Component } from 'react';
import { connect, Provider } from "react-redux";
import { Redirect } from "react-router-dom";
import firebase from 'firebase';
import fire from "../src/fire";
//install react-firebaseui
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import "../src/main.css";
import {aSetCurrentUser } from"../components/actionCreators"


class GLogin extends React.Component {
    uiConfig = {
        signInFlow: 'popup',
        // signInSuccessUrl: '/Board',
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID
          // fire.auth.FacebookAuthProvider.PROVIDER_ID
        ],
        // Terms of service url.
        // tosUrl: '/Board',
        callbacks: {
          // write in db
          signInSuccessWithAuthResult: (user) => {
            //read db
            const db = fire.firestore();
            // google login                
            if (user) {
              console.log("get user data", user)
              
              let firebaseUid = user.user.uid;
              let userDisplayName;
              let userPhotoURL;
              let userEmail;
              let useruid;
              let profile = user.additionalUserInfo.profile
            
              userDisplayName = profile.name;
              userEmail = profile.email;
              userPhotoURL = profile.picture;
              useruid = profile.id;

              this.props.mSetCurrentUser(userDisplayName, userPhotoURL, userEmail, firebaseUid, useruid)


              db.collection("Users").doc(`${firebaseUid}`).set({
                  name: userDisplayName,
                  photo: userPhotoURL,
                  email: userEmail,
                  uid: useruid,
                  firebaseuid: firebaseUid
              }).then(() => {
                  //window.location = "/Board"
                  console.log("Document successfully written!")
              }).catch((error) => {
                  console.error("Error writing document: ", error);
              })

            } else {
                // No user is signed in.
            }              
          }
        },
      };
    
    render() {
        console.log("render", this.props.firebaseUid);
        if (this.props.firebaseUid) {
          let targetURL = `/Board/${ this.props.firebaseUid }`
          return <Redirect to={ targetURL } />;
        }

        return (
            <React.Fragment>
            
              <div className="firebaseui-auth-container">
                <StyledFirebaseAuth uiConfig={ this.uiConfig } firebaseAuth={ firebase.auth() }/>
              </div>
            
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
  return {
      isBoardLoaded: state.isBoardLoaded,
      text: state.text,
      listTitle: state.listTitle,
      deleteThemeConfirmOpen: state.deleteThemeConfirmOpen,
      whichWindowOpen: state.whichWindowOpen,
      commentWindow: state.commentWindow,
      isLoggedIn: state.isLoggedIn,
      userEmail: state.userEmail,
      userDisplayName: state.userDisplayName,
      userPhotoURL: state.userPhotoURL,
      firebaseUid: state.firebaseUid,
      useruid: status.useruid
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
      mSetCurrentUser: (userDisplayName, userPhotoURL, userEmail, firebaseUid, useruid) => { dispatch(aSetCurrentUser(userDisplayName, userPhotoURL, userEmail, firebaseUid, useruid)) },
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(GLogin);