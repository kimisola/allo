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