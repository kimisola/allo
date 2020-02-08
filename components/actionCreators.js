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