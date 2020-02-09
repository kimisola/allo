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
    textTag: [],
    textValue: "",
    isBoardLoaded: false,
    
    //add new list window
    addNewListOpen: false,
    //add new comment item window
    // addNewCommentOpen: false,
    //delete confirm window
    deleteThemeConfirmOpen: false,

    // index value for next new added title and comment item
    indexForTitle: "",

    //user profile
    isLoggedIn: false,
    userEmail: "",
    userDisplayName: "",
    userPhotoURL: "",
    firebaseUid: "",
    useruid: "",

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

        case "renderComments": {
            return Object.assign({}, state, {  // copy now state and update using items
                text: action.Data2,
                listTitle: action.Data1,
                isBoardLoaded: !state.isBoardLoaded
            });
        }

        case "setIndexForTitle": {
            console.log("setIndexForTitle",  action.storeTitleIndex)
            return Object.assign({}, state, {
                indexForTitle: action.storeTitleIndex
            });
        }

        // case "setUpComWin": {
        //     return Object.assign({}, state, {
        //         commentWindow: action.myComWin
        //     });
        // }

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

        // case "addNewCommentOpen": {
        //     console.log(action.index)
        //     let openValue = !state.addNewCommentOpen
        //     state.commentWindow.splice(action.index, 1, openValue)
        //     return Object.assign({}, state, {
        //         commentWindow: state.commentWindow.slice(0),
        //         addNewCommentOpen: !state.addNewCommentOpen,
        //     })
        // }

        // case "addComment": {
        //     let openValue = ! state.addNewCommentOpen
        //     state.commentWindow.splice(action.i, 1, openValue)
        //     return Object.assign({}, state, {
        //         commentWindow: state.commentWindow.slice(0),
        //         addNewCommentOpen: !state.addNewCommentOpen,
        //         whichTheme: action.i
        //     })
        // }

        // case "getNewTextValue": {
        //     return Object.assign({}, state, {
        //         textValue: action.textValue
        //     });
        // }

        // case "getNewTags": {
        //     console.log("getNewTags", action.textTag)
        //     return Object.assign({}, state, {
        //         textTag: action.textTag
        //     });
        // }

        // case "getImageURL": {
        //     console.log("getImageURL", action.url)
        //     return Object.assign({}, state, {
        //         commentURL: action.url
        //     });
        // }
 
        case "sendComment": {
            let i = action.index;
            let newText = state.text
            console.log( newText[i])
            newText[i].push({
                img: action.newImg,
                text: action.newText,
                tags: action.newTags
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

        case "getEditedValue": {
            state.text[action.listId][action.comId].text = action.newTextValue
            state.text[action.listId][action.comId].tags = action.newTextTag
            return Object.assign({}, state, {
                text: state.text.slice(0),
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
                        <Route exact path = "/" component = { LoginPage } /> 
                        <Route path = "/HomePage" component = { HomePage } />
                        <Route path = "/Board" component = { Board } />
                    </Switch>
                </Route>
            </React.Fragment>
        )
    }
}
export default App


ReactDOM.render(
    <Router>
    <Provider store = { store } >
        <App />
    </Provider>
    </Router>

    , document.querySelector("#root"))