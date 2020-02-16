export function aAddNewListOpen() {
    return{
        type: "addNewListOpen"
    }
}

export function aGetTitleValue(value) {
    return{
        type: "getNewTitleValue", 
        value
    }
}

export function aCreatTitle(newListTitle, newText) {
    return{
        type: "addTheme", 
        newListTitle,
        newText
    }
}

export function aSetUpComWin(myComWin) {
    return {
        type: "setUpComWin",
        myComWin
    }
}

export function aRenderComments(Data1, Data2) {
    return {
        type: "renderComments",
        Data1,
        Data2
    }
}

export function aSetCurrentUser(userDisplayName, userPhotoURL, userEmail, firebaseUid, useruid) {
    return {
        type: "setCurrentUser",
        userDisplayName, 
        userPhotoURL, 
        userEmail, 
        firebaseUid,
        useruid
    }
}

export function aSetIndexForTitle(storeTitleIndex) {
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