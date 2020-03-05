// import { func } from "prop-types"

// export function addNewListOpen() {
//     return{
//         type: "addNewListOpen"
//     }
// }

export function setCurrentUser(userDisplayName, userPhotoURL, userEmail, firebaseUid, useruid) {
    return {
        type: "SET_CURRENT_USER",
        userDisplayName, 
        userPhotoURL, 
        userEmail, 
        firebaseUid,
        useruid
    }
}

export function getTitleValue(value) {
    return{
        type: "GET_NEW_TITLE_VALUE", 
        value
    }
}

export function creatTitle(newListTitle, newText) {
    return{
        type: "ADD_THEME", 
        newListTitle,
        newText
    }
}

export function deleteTheme(t) {
    return {
        type: "DELETE_THEME",
        t
    }
}

export function getEditedTitleValue(newValue, indexOfValue) {
    return {
        type: "GET_EDITED_TITLE_VALUE",
        newValue,
        indexOfValue
    }
}
// export function setUpComWin(myComWin) {
//     return {
//         type: "setUpComWin",
//         myComWin
//     }
// }

export function setCommentData(Data1, Data2) {
    return {
        type: "SET_COMMENT_DATA",
        Data1,
        Data2
    }
}

export function sendComment(index, newText, newImg, newTags) {
    return {
        type: "SEND_COMMENT",
        index,
        newText,
        newImg,
        newTags
    }
}

export function getEditedValue(newTextValue, newTextTag, listId, comId, edited, editorImg) {
    return {
        type: "GET_EDITED_VALUE",
        newTextValue, 
        newTextTag,
        listId,
        comId,
        edited,
        editorImg
    }
}

export function deleteComment(listId, comId) {
    return {
        type: "DELETE_COMMENT",
        listId,
        comId
    }
}

export function setIndexForTitle(storeTitleIndex) {
    return {
        type: "SET_INDEX_FOR_TITLE",
        storeTitleIndex
    }
}

export function switchBoard(targetLink) {
    return {
        type: "SWITCHBOARD",
        targetLink
    }
}

// export function loadingGifOff() {
//     return {
//         type: "TURN_OFF_LOADING_GIF",
//     }
// }

export function turnOnLoadingGif() {
    return {
        type: "TURN_ON_LOADING_GIF",
    }
}

export function changeTagsDisplay() {
    return {
        type: "CHANGE_TAGS_DISPLAY",
    }
}

export function addBeInvitedData(data) {
    return{
        type: "ADD_BEINVITED_DATA", 
        data
    }
}

export function updateBeInvitedData(index,confirm) {
    return{
        type: "UPDATE_BEINVITED_DATA", 
        index,
        confirm
    }
}

export function addInvitationData(data) {
    return{
        type: "ADD_INVITATION_DATA", 
        data
    }
}

export function unfriend(userFirebaseuid, index) {
    return{
        type: "UNFRIEND", 
        userFirebaseuid,
        index
    }
}