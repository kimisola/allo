export function addNewListOpen() {
    return{
        type: "addNewListOpen"
    }
}

export function getTitleValue(value) {
    return{
        type: "getNewTitleValue", 
        value
    }
}

export function creatTitle(newListTitle, newText) {
    return{
        type: "addTheme", 
        newListTitle,
        newText
    }
}

export function setUpComWin(myComWin) {
    return {
        type: "setUpComWin",
        myComWin
    }
}

export function renderComments(Data1, Data2) {
    return {
        type: "renderComments",
        Data1,
        Data2
    }
}

export function setCurrentUser(userDisplayName, userPhotoURL, userEmail, firebaseUid, useruid) {
    return {
        type: "setCurrentUser",
        userDisplayName, 
        userPhotoURL, 
        userEmail, 
        firebaseUid,
        useruid
    }
}

export function setIndexForTitle(storeTitleIndex) {
    return {
        type: "setIndexForTitle",
        storeTitleIndex
    }
}

export function switchBoard(targetLink) {
    return {
        type: "switchBoard",
        targetLink
    }
}

export function loadingGifOff() {
    return {
        type: "loadingGifOff",
    }
}

export function loadingGifOn() {
    return {
        type: "loadingGifOn",
    }
}