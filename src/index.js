import React from "react";
import ReactDOM from "react-dom";
import { connect, Provider } from "react-redux";
import { createStore } from "redux";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import firebase from 'firebase';
// import fire from "../src/fire";
import { db } from "../src/fire";
import Reducer from "../reducer/index";
import LoginPage from "../components/Login";
import Board from "../components/Board";
import HomePage from "../components/HomePage";
import { setCurrentUser } from"../components/ActionCreators"
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
                    // const db = fire.firestore();
                    let firebaseUid = user.uid;
                    let userDisplayName;
                    let userPhotoURL;
                    let userEmail;
                    let useruid;
                    
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

                    const ref = db.collection("Users").doc(firebaseUid)
                    ref.get().then((querySnapshot) => {
                        if ( querySnapshot.data() !== undefined ) {
                            const ref = db.collection("Users").doc(firebaseUid)
                            console.log("querySnapshotquerySnapshot")
                            ref.update({
                                name: userDisplayName,
                                photo: userPhotoURL,
                                email: userEmail,
                                uid: useruid,
                                firebaseuid: firebaseUid,
                            }).catch((error) => {
                                console.error("Error writing document: ", error.message);
                            })
                        } else {
                            const ref = db.collection("Users").doc(firebaseUid)
                            ref.set({
                                name: userDisplayName,
                                photo: userPhotoURL,
                                email: userEmail,
                                uid: useruid,
                                firebaseuid: firebaseUid,
                                homepageCover: "https://firebasestorage.googleapis.com/v0/b/allo-dc54c.appspot.com/o/homepageCover%2Fhomepagecover1.jpg?alt=media&token=6793a59f-eaac-4d76-83fb-db421ea2a0b4",
                            }).catch((error) => {
                                console.error("Error writing document: ", error.message);
                            })
                        }
                    })
                } else {
                    this.props.setCurrentUser(null, null, null, null, null)
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
        // deleteThemeConfirmOpen: state.deleteThemeConfirmOpen,
        // whichWindowOpen: state.whichWindowOpen,
        // commentWindow: state.commentWindow,
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

App = connect(mapStateToProps, mapDispatchToProps)(App);
export default App

ReactDOM.render(
    <Router>
        <Provider store = { store } >
            <App />
        </Provider>
    </Router>

    , document.querySelector("#root"))