import React from "react";
import ReactDOM from "react-dom";
import { connect, Provider } from "react-redux";
import { createStore } from "redux";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import firebase from 'firebase';
import fire from "../src/fire";
import Reducer from "../reducer/index";
import LoginPage from "../components/login";
import Board from "../components/board";
import HomePage from "../components/homePage";
import { setCurrentUser } from"../components/actionCreators"
import "../css/main.css";

const store = createStore(Reducer);


class App extends React.Component {
    constructor(props){
        super(props);
    }

    componentDidMount() {
        this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
            (user) => {
                console.log("App userrrrrrrrrr", user)
                if (user) {
                    const db = fire.firestore();
                    let firebaseUid = user.uid;
                    let userDisplayName;
                    let userPhotoURL;
                    let userEmail;
                    let useruid;
                    console.log(firebaseUid)
                    
                    user.providerData.forEach((profile) => {
                        userDisplayName = profile.displayName;
                        userEmail = profile.email;
                        userPhotoURL = profile.photoURL;
                        useruid = profile.uid;
                    });           

                    if ( userDisplayName === null && userPhotoURL === null ) {
                        let makeName = userEmail.split("@")
                        userDisplayName = makeName[0]
                        userPhotoURL = "https://firebasestorage.googleapis.com/v0/b/allo-dc54c.appspot.com/o/image%2F%E6%9C%AA%E5%91%BD%E5%90%8D.png?alt=media&token=beddf24c-489d-4f33-af81-ccabdfb417d2"
                    }

                    this.props.setCurrentUser(userDisplayName, userPhotoURL, userEmail, firebaseUid, useruid)

                    if ( db.collection("Users").where("firebaseuid", "==", firebaseUid) ) {
                        let ref = db.collection("Users").doc(firebaseUid)
                        ref.set({
                            name: userDisplayName,
                            photo: userPhotoURL,
                            email: userEmail,
                            uid: useruid,
                            firebaseuid: firebaseUid,
                            homepageCover: "https://firebasestorage.googleapis.com/v0/b/allo-dc54c.appspot.com/o/homepageCover%2Fhomepagecover1.jpg?alt=media&token=6793a59f-eaac-4d76-83fb-db421ea2a0b4",
                        }).then(() => {
                            console.log("Document successfully written!")
                        }).catch((error) => {
                            console.error("Error writing document: ", error);
                        })
                    } else {
                        ref.update({
                            name: userDisplayName,
                            photo: userPhotoURL,
                            email: userEmail,
                            uid: useruid,
                            firebaseuid: firebaseUid,
                        }).then(() => {
                            console.log("Document successfully written!")
                        }).catch((error) => {
                            console.error("Error writing document: ", error);
                        })
                    }
                    
                    // ref.get().then((querySnapshot) => {
                    //     // console.log("querySnapshot.data().homepageCover", querySnapshot.docs[0])
                    //     // console.log(querySnapshot.data().homepageCover == "")
                    //     // console.log(querySnapshot.data().homepageCover === "")
                    //     if ( querySnapshot.data().homepageCover == "" ) {
                    //         ref.set({
                    //             name: userDisplayName,
                    //             photo: userPhotoURL,
                    //             email: userEmail,
                    //             uid: useruid,
                    //             firebaseuid: firebaseUid,
                    //             homepageCover: "https://firebasestorage.googleapis.com/v0/b/allo-dc54c.appspot.com/o/homepageCover%2Fhomepagecover1.jpg?alt=media&token=6793a59f-eaac-4d76-83fb-db421ea2a0b4",
                    //         }).then(() => {
                    //             console.log("Document successfully written!")
                    //         }).catch((error) => {
                    //             console.error("Error writing document: ", error);
                    //         })
                    //     } else {
                    //         ref.update({
                    //             name: userDisplayName,
                    //             photo: userPhotoURL,
                    //             email: userEmail,
                    //             uid: useruid,
                    //             firebaseuid: firebaseUid,
                    //         }).then(() => {
                    //             console.log("Document successfully written!")
                    //         }).catch((error) => {
                    //             console.error("Error writing document: ", error);
                    //         })
                    //     }
                    // })
                } else {
                    this.props.setCurrentUser(null, null, null, null, null)
                    // No user is signed in.
                   // window.location = "/"
                }
            }
        );
    }

    render() {
        return(
            <React.Fragment>
                <Router>       
                    <Switch>
                        <Route exact path = "/" component = { LoginPage } /> 
                        <Route path = "/HomePage/:id" component = { HomePage } />
                        <Route path = "/Board/:id" component = { Board } />
                    </Switch>
                </Router>
            </React.Fragment>
        )
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
        setCurrentUser: (userDisplayName, userPhotoURL, userEmail, firebaseUid, useruid) => { dispatch(setCurrentUser(userDisplayName, userPhotoURL, userEmail, firebaseUid, useruid)) },
    }
}

App = connect(mapStateToProps, mapDispatchToProps)(App);
export default App

ReactDOM.render(
    <Router>
    <Provider store = { store } >
        <App />
    </Provider>
    </Router>

    , document.querySelector("#root"))