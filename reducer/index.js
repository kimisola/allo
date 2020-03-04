import { createStore } from "redux";

let initialState = {
    //render board data
    text: [],
    listTitle: [],
    //commentWindow: [], //array of comment pop-up window
    textTag: [],
    textValue: "",
    titleValue: "",
    isBoardLoaded: false,

    // for homepage notifications and editors
    beInvitedData: [],
    invitationData: [],

    //delete confirm window
    //deleteThemeConfirmOpen: false,

    //change css of tags
    tagsDisplayChanged: false,

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


function Reducer(state = initialState, action) {  
    console.log("reducer run reducer")
    console.log(action)
    console.log(initialState)
    console.log(state)
    switch(action.type) {
        case "SET_CURRENT_USER": {
            return Object.assign({}, state, {
                isLoggedIn: ! state.isLoggedIn,
                userEmail: action.userEmail,
                userDisplayName: action.userDisplayName,
                userPhotoURL: action.userPhotoURL,
                firebaseUid: action.firebaseUid,
                useruid: action.useruid
            });
        }

        // case "TURN_OFF_LOADING_GIF": {
        //     let isBoardLoaded = true
        //     return Object.assign({}, state, {
        //         isBoardLoaded: isBoardLoaded
        //     });
        // }

        case "TURN_ON_LOADING_GIF": {
            let isBoardLoaded = false
            return Object.assign({}, state, {
                isBoardLoaded: isBoardLoaded
            });
        }

        case "SET_COMMENT_DATA": {
            return Object.assign({}, state, {
                text: action.Data2,
                listTitle: action.Data1,
                isBoardLoaded: true
            });
        }

        case "SET_INDEX_FOR_TITLE": {
            return Object.assign({}, state, {
                indexForTitle: action.storeTitleIndex
            });
        }

        case "setIndexForItem": {
            return Object.assign({}, state, {
                indexForItem: action.indexForItem
            });
        }

        case "ADD_THEME": {
            return Object.assign({}, state, {
                text: action.newText.slice(0),
                listTitle: action.newListTitle.slice(0),
            });
        }

        case "GET_NEW_TITLE_VALUE": {
            return Object.assign({}, state, {
                titleValue: action.value
            });
        }

        case "getEditedTitleValue": {
            state.listTitle.splice(action.indexOfValue, 1, action.newValue)
            return Object.assign({}, state, {
                listTitle: state.listTitle.slice(0),
            });
        }

        case "deleteTheme": {
            state.listTitle.splice(action.t, 1)
            state.text.splice(action.t, 1)
            return Object.assign({}, state, {
                text: state.text.slice(0),
                listTitle: state.listTitle.slice(0),
            }); 
        }
       
        // case "deleteThemeConfirmOpen": {
        //     return Object.assign({}, state, {
        //         deleteThemeConfirmOpen: !state.deleteThemeConfirmOpen,
        //         whichWindowOpen: action.i
        //     }); 
        // }
 
        case "sendComment": {
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
            console.log("action.listId", "action.comId", action.listId, action.comId)
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
            console.log("targetLink_board", action.targetLink)
            let currentBoard = action.targetLink
            return Object.assign({}, state, {
                currentBoard: currentBoard
            });
        }

        case "drag-dropTheme": {
            console.log("drag-dropTheme", action.sourceIndex, action.destinationIndex)
            let listTitle = state.listTitle.slice(0);
            let removeTitle = listTitle.splice(action.sourceIndex, 1)
            listTitle.splice(action.destinationIndex, 0, `${removeTitle}`)

            let text = state.text.slice(0);
            let removeText = text.splice(action.sourceIndex, 1)
            text.splice(action.destinationIndex, 0, removeText[0])
            console.log("drag-dropTheme", text, listTitle)
            return Object.assign({}, state, {
                text: text.slice(0),
                listTitle: listTitle.slice(0),
            });
        }

        case "drag-dropText": {
            console.log("drag-dropText", action.sourceTheme, action.sourceRow, action.destinationTheme, action.destinationRow)
            let text = state.text.slice(0);
            let removeText = text[action.sourceTheme].splice(action.sourceRow, 1)
            console.log("drag-dropText", text[action.destinationTheme])
            text[action.destinationTheme].splice(action.destinationRow, 0, removeText[0])
            console.log("drag-dropText", removeText[0])
            return Object.assign({}, state, {
                text: text.slice(0),
            });
        }

        case "change-tags-display": {
            return Object.assign({}, state, {
                tagsDisplayChanged: !state.tagsDisplayChanged,
            });
        }

        case "addBeInvitedData": {
            return  Object.assign({}, state, {
                beInvitedData: action.data.slice(0),
            })
        }

        case "updateInvitedData": {
            let beInvitedData = state.beInvitedData.slice(0)
            console.log("11111111111111", beInvitedData[action.index].confirm)
            beInvitedData[action.index].confirm = action.confirm
            return  Object.assign({}, state, {
                beInvitedData: beInvitedData,
            })
        }

        case "addInvitationData": {
            return  Object.assign({}, state, {
                invitationData: action.data.slice(0),
            })
        }

        case "unfriend": {
            let invitationData = state.invitationData.slice(0)
            invitationData.splice(action.index, 1)
            return  Object.assign({}, state, {
                invitationData: invitationData,
            })
        }

        default:
            return state;
    }
}

export default Reducer