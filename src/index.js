import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import LoginPage from "./login";
import Board from "./board";

import HomePage from "../components/homePage";
import "./main.css";



let initialState = {
    //render board data
    text: [],
    listTitle: [],
    commentWindow: [], //array of comment pop-up window
    commentTags: { planning:false, process:false, risk:false, achived:false },
    textTag: [],
    textValue: "",
    //add new list window
    addNewListOpen: false,
    //add new comment item window
    addNewCommentOpen: false,
    //delete confirm window
    deleteThemeConfirmOpen: false,

    //user profile
    isLoggedIn: false,
    userEmail: "",
    userDisplayName: "",
    userPhotoURL: "",
    firebaseUid: "",

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
            });
        }

        case "renderComments": {
            return Object.assign({}, state, {  // copy now state and update using items
                text: action.Data2,
                listTitle: action.Data1,
            });
        }

        case "setUpComWin": {
            return Object.assign({}, state, {
                commentWindow: action.myComWin
            });
        }

        case "addList": {
            return Object.assign({}, state, {
                addNewListOpen: !state.addNewListOpen,
            });
        }

        case "newRenderComments": {
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

        case "addNewCommentOpen": {
            console.log(action.t)
            let openValue = !state.addNewCommentOpen
            state.commentWindow.splice(action.t, 1, openValue)
            return Object.assign({}, state, {
                commentWindow: state.commentWindow.slice(0),
                addNewCommentOpen: !state.addNewCommentOpen,
            })
        }

        case "addComment": {
            let openValue = ! state.addNewCommentOpen
            state.commentWindow.splice(action.i, 1, openValue)
            return Object.assign({}, state, {
                commentWindow: state.commentWindow.slice(0),
                addNewCommentOpen: !state.addNewCommentOpen,
                whichTheme: action.i
            })
        }

        case "getNewTextValue": {
            console.log("getNewTextValue", action.textValue)
            return Object.assign({}, state, {
                textValue: action.textValue
            });
        }

        case "getNewTags": {
            console.log("getNewTags", action.textTag)
            return Object.assign({}, state, {
                textTag: action.textTag
            });
        }

        case "getImageURL": {
            console.log("getImageURL", action.url)
            return Object.assign({}, state, {
                commentURL: action.url
            });
        }
 
        case "sendComment": {
            let i = state.whichTheme
            let newText = state.text
            console.log( newText[i])
            newText[i].push({
                img: state.commentURL,
                text: state.textValue,
                tags: state.textTag
            })

            console.log(newText[i])
            return Object.assign({}, state, {
                text: newText.slice(0),
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

    render(){
        return(
            <React.Fragment>
                <Route>       
 
                <Switch>
                    <Route exact path="/">
                        <LoginPage />
                    </Route>
                    <Route path="/HomePage">
                        <HomePage />
                    </Route>
                    <Route path="/Board">
                        <Board />
                    </Route>
                </Switch>

                </Route>
            </React.Fragment>
        )
    }
}
export default App


ReactDOM.render(
    <Router>
    <Provider store={store}>
        <App />
    </Provider>
    </Router>

    , document.querySelector("#root"))