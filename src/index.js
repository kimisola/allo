import React from "react";
import ReactDOM from "react-dom";
import { connect, Provider } from "react-redux";
import { createStore } from "redux";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import firebase from 'firebase';
import fire from "../src/fire";
import LoginPage from "./login";
import Board from "./board";
import HomePage from "../components/homePage";
import {aSetCurrentUser } from"../components/actionCreators"
import "./main.css";



let initialState = {
    //render board data
    text: [],
    listTitle: [],
    commentWindow: [], //array of comment pop-up window
    textTag: [],
    textValue: "",
    titleValue: "",
    isBoardLoaded: false,
    
    //add new list window
    addNewListOpen: false,
    //delete confirm window
    deleteThemeConfirmOpen: false,

    // index value for next new added title and comment item, default is 2
    indexForTitle: 2,
    indexForItem: 2,

    //user profile
    isLoggedIn: false,
    userEmail: "",
    userDisplayName: "",
    userPhotoURL: "",
    firebaseUid: "",
    useruid: "",

    // key for switch board
    currentBoard: "",
}

function reducer(state = initialState, action) {  
    console.log("run reducer")
    console.log(action)
    console.log(initialState)
    console.log(state)
    switch(action.type) {
        case "setCurrentUser": {
            return Object.assign({}, state, {
                isLoggedIn: ! state.isLoggedIn,
                userEmail: action.userEmail,
                userDisplayName: action.userDisplayName,
                userPhotoURL: action.userPhotoURL,
                firebaseUid: action.firebaseUid,
                useruid: action.useruid
            });
        }

        case "loadingGifOff": {
            let isBoardLoaded = true
            return Object.assign({}, state, {
                isBoardLoaded: isBoardLoaded
            });
        }

        case "loadingGifOn": {
            let isBoardLoaded = false
            return Object.assign({}, state, {
                isBoardLoaded: isBoardLoaded
            });
        }


        case "renderComments": {
            return Object.assign({}, state, {  // copy now state and update using items
                text: action.Data2,
                listTitle: action.Data1,
                isBoardLoaded: true
            });
        }

        case "setIndexForTitle": {
            console.log("setIndexForTitle",  action.storeTitleIndex)
            return Object.assign({}, state, {
                indexForTitle: action.storeTitleIndex
            });
        }

        case "setIndexForItem": {
            console.log("setIndexForItem",  action.indexForItem)
            return Object.assign({}, state, {
                indexForItem: action.indexForItem
            });
        }

        case "addNewListOpen": {
            return Object.assign({}, state, {
                addNewListOpen: !state.addNewListOpen,
            });
        }

        case "addTheme": {
            return Object.assign({}, state, {
                text: action.newText.slice(0),
                listTitle: action.newListTitle.slice(0),
            });
        }

        case "getNewTitleValue": {
            return Object.assign({}, state, {
                titleValue: action.value
            });
        }

        case "getEditedTitleValue": {
            console.log(action.newValue)
            console.log(action.indexOfValue)
            state.listTitle.splice(action.indexOfValue, 1, action.newValue)
            return Object.assign({}, state, {
                listTitle: state.listTitle.slice(0),
            });
        }

        case "deleteTheme": {
            console.log(action.t)
            state.listTitle.splice(action.t, 1)
            state.text.splice(action.t, 1)
            return Object.assign({}, state, {
                text: state.text.slice(0),
                listTitle: state.listTitle.slice(0),
            }); 
        }
       
        case "deleteThemeConfirmOpen": {
            return Object.assign({}, state, {
                deleteThemeConfirmOpen: !state.deleteThemeConfirmOpen,
                whichWindowOpen: action.i
            }); 
        }
 
        case "sendComment": {
            console.log(state.userDisplayName)
            let i = action.index;
            let newText = state.text
            console.log( newText[i])
            newText[i].push({
                img: action.newImg,
                text: action.newText,
                tags: action.newTags,
                owner: state.userDisplayName,
                edited: state.userDisplayName,
                ownerImg: state.userPhotoURL,
                editorImg: state.userPhotoURL,
            })
            return Object.assign({}, state, {
                text: newText.slice(0),
            });
        }

        case "deleteComment": {
            console.log(action.listId)
            console.log(action.comId)
            state.text[action.listId].splice(action.comId, 1)
            return Object.assign({}, state, {
                text: state.text.slice(0),
            }); 
        }

        case "getEditedValue": {  // 要複製多層
            let text = state.text.slice(0);
            let list = text[action.listId].slice(0);
            let item = {...list[action.comId], text:action.newTextValue, tags:action.newTextTag, edited: action.edited, editorImg: action.editorImg};
            list[action.comId] = item;
            text[action.listId] = list;
            /*
            state.text[action.listId][action.comId].text = action.newTextValue
            state.text[action.listId][action.comId].tags = action.newTextTag
            */
            return Object.assign({}, state, {
                text: text
            });
        }

        case "switchBoard": {
            console.log("9999999999", action.targetLink)
            let currentBoard = action.targetLink
            return Object.assign({}, state, {
                currentBoard: currentBoard
            });
        }

        default:
            return state;
    }
}

const store = createStore(reducer);


class App extends React.Component {
    constructor(props){
        super(props);
    }

    componentDidMount() {
        this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
            (user) => {
                console.log("App userrrrrrrrrr",user)
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
                        userPhotoURL = "https://firebasestorage.googleapis.com/v0/b/allo-dc54c.appspot.com/o/image%2Fuser.png?alt=media&token=2005cf1c-816d-4777-95ae-d535f7a4ebb1"
                    }

                    this.props.mSetCurrentUser(userDisplayName, userPhotoURL, userEmail, firebaseUid, useruid)

                    db.collection("Users").doc(firebaseUid).set({
                        name: userDisplayName,
                        photo: userPhotoURL,
                        email: userEmail,
                        uid: useruid,
                        firebaseuid: firebaseUid
                    }).then(() => {
                        console.log("Document successfully written!")
                    }).catch((error) => {
                        console.error("Error writing document: ", error);
                    })
    
                } else {
                    this.props.mSetCurrentUser(null, null, null, null, null)
                    // No user is signed in.
                   // window.location = "/"
                }

            }
        );
      }

    render(){
        return(
            <React.Fragment>
                <Router>       
                    <Switch>
                        <Route exact path = "/" component = { LoginPage } /> 
                        <Route path = "/HomePage" component = { HomePage } />
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
        mSetCurrentUser: (userDisplayName, userPhotoURL, userEmail, firebaseUid, useruid) => { dispatch(aSetCurrentUser(userDisplayName, userPhotoURL, userEmail, firebaseUid, useruid)) },
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