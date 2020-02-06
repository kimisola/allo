export function aCreatTheme() {
    return{
        type: "addList"
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
        type: "newRenderComments", 
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

export function aSetCurrentUser(userDisplayName, userPhotoURL, userEmail, firebaseUid) {
    return {
        type: "setCurrentUser",
        userDisplayName, 
        userPhotoURL, 
        userEmail, 
        firebaseUid
    }
    
}