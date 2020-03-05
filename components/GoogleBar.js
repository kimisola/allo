import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import firebase from 'firebase';
import fire from "../src/fire";
import { db } from "../src/fire";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import {setCurrentUser } from"./ActionCreators"

class GLogin extends React.Component {
    uiConfig = {
        signInFlow: 'popup',
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID
        ],
        callbacks: {
          signInSuccessWithAuthResult: (user) => {
            // const db = fire.firestore();
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

              this.props.setCurrentUser(userDisplayName, userPhotoURL, userEmail, firebaseUid, useruid)

              db.collection("Users").doc(`${firebaseUid}`).update({
                  name: userDisplayName,
                  photo: userPhotoURL,
                  email: userEmail,
                  uid: useruid,
                  firebaseuid: firebaseUid,
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

const mapDispatchToProps = (dispatch) => {
  return {
      setCurrentUser: (userDisplayName, userPhotoURL, userEmail, firebaseUid, useruid) => { dispatch(setCurrentUser(userDisplayName, userPhotoURL, userEmail, firebaseUid, useruid)) },
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(GLogin);