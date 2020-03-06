let boardState = {
    //render board data
    text: [],
    listTitle: [],
    textTag: [],
    textValue: "",
    titleValue: "",
    isBoardLoaded: false,

    //change css of tags
    tagsDisplayChanged: false,

    // index value for next new added title and comment item, default is 2
    // indexForTitle: 2,
    // indexForItem: 2,

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


export default function boardReducer(state = boardState, action) {  
    console.log("reducer run boardReducer")
    console.log("boardReducer", action)
    console.log("boardReducer", boardState)

    switch(action.type) {
        case "SET_CURRENT_USER": {
            return Object.assign({}, state, {
                isLoggedIn: !state.isLoggedIn,
                userEmail: action.userEmail,
                userDisplayName: action.userDisplayName,
                userPhotoURL: action.userPhotoURL,
                firebaseUid: action.firebaseUid,
                useruid: action.useruid
            });
        }

        case "TURN_ON_LOADING_GIF": {
            return Object.assign({}, state, {
                isBoardLoaded: false
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

        // case "setIndexForItem": {
        //     return Object.assign({}, state, {
        //         indexForItem: action.indexForItem
        //     });
        // }

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

        case "GET_EDITED_TITLE_VALUE": {
            state.listTitle.splice(action.indexOfValue, 1, action.newValue)
            return Object.assign({}, state, {
                listTitle: state.listTitle.slice(0),
            });
        }

        case "DELETE_THEME": {
            state.listTitle.splice(action.t, 1)
            state.text.splice(action.t, 1)
            return Object.assign({}, state, {
                text: state.text.slice(0),
                listTitle: state.listTitle.slice(0),
            }); 
        }
 
        case "SEND_COMMENT": {
            const i = action.index;
            const newText = state.text
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

        case "DELETE_COMMENT": {
            state.text[action.listId].splice(action.comId, 1)
            return Object.assign({}, state, {
                text: state.text.slice(0),
            }); 
        }

        case "GET_EDITED_VALUE": {  // 要複製多層
            let text = state.text.slice(0);
            let list = text[action.listId].slice(0);
            let item = {...list[action.comId], text:action.newTextValue, tags:action.newTextTag, edited: action.edited, editorImg: action.editorImg};
            list[action.comId] = item;
            text[action.listId] = list;
            return Object.assign({}, state, {
                text: text
            });
        }

        case "SWITCHBOARD": {
            let currentBoard = action.targetLink
            return Object.assign({}, state, {
                currentBoard: currentBoard
            });
        }

        case "DRAG_DROP_THEME": {
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

        case "DRAG_DROP_TEXT": {
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

        case "CHANGE_TAGS_DISPLAY": {
            return Object.assign({}, state, {
                tagsDisplayChanged: !state.tagsDisplayChanged,
            });
        }

        default:
            return state;
    }
}

