let homePageState = {
    // for homepage notifications and editors
    beInvitedData: [],
    invitationData: [],
}

export default function homePageReducer(state = homePageState, action) {
    console.log("reducer run homePageReducer")
    console.log("homePageReducer", action)
    console.log("homePageReducer", homePageState)

    switch(action.type) {
        case "ADD_BEINVITED_DATA": {
            return  Object.assign({}, state, {
                beInvitedData: action.data.slice(0),
            })
        }

        case "UPDATE_BEINVITED_DATA": {
            let beInvitedData = state.beInvitedData.slice(0)
            beInvitedData[action.index].confirm = action.confirm
            return  Object.assign({}, state, {
                beInvitedData: beInvitedData,
            })
        }

        case "ADD_INVITATION_DATA": {
            return  Object.assign({}, state, {
                invitationData: action.data.slice(0),
            })
        }

        case "UNFRIEND": {
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
