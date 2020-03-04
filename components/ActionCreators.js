// export function addNewListOpen() {
//     return{
//         type: "addNewListOpen"
//     }
// }

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

export function setIndexForTitle(storeTitleIndex) {
    return {
        type: "SET_INDEX_FOR_TITLE",
        storeTitleIndex
    }
}

export function switchBoard(targetLink) {
    return {
        type: "switchBoard",
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
        type: "change-tags-display",
    }
}

export function addBeInvitedData(data) {
    return{
        type: "addBeInvitedData", 
        data
    }
}

export function updateInvitedData(index,confirm) {
    return{
        type: "updateInvitedData", 
        index,
        confirm
    }
}

export function addInvitationData(data) {
    return{
        type: "addInvitationData", 
        data
    }
}

export function unfriend(userFirebaseuid, index) {
    return{
        type: "unfriend", 
        userFirebaseuid,
        index
    }
}