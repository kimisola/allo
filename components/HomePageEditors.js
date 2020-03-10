import React from "react";
import { connect } from "react-redux";
import { unfriend } from "../actions/actionCreators";
import { accessWhereMethod } from "../library/accessDb";
import Cancel from "../images/cancel.png";

class Editors extends React.Component {
    constructor(props){
        super(props);
        this.accessWhereMethod = accessWhereMethod.bind(this)
    }

    unfriend = (userFirebaseuid, index) => {
        this.props.unfriend(userFirebaseuid, index)
        this.accessWhereMethod(`Users/${this.props.firebaseUid}/invitation`, "userFirebaseuid", userFirebaseuid, { confirm: null })
        this.accessWhereMethod(`Users/${userFirebaseuid}/beInvited`, "userFirebaseuid", this.props.firebaseUid, { confirm: null })
    }

    render(){
        return(
            <React.Fragment>
                <div className="editors">
                    <div className="section">
                        <div className="category">Access List</div>
                        <div className="contents">
                            { this.props.invitationData.map((item, index) =>
                                <div className="content" key={ index }>
                                    <div className="userDetails">
                                        <div className="userPhoto">
                                            <img src={ item.userPhoto } />
                                        </div>
                                        <div className="name">{ item.userName }</div>
                                    </div>
                                    <div className="delete">
                                        <img src={ Cancel } onClick={ () => this.unfriend(item.userFirebaseuid, index) }/>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        firebaseUid: state.board.firebaseUid,
        userEmail: state.board.userEmail,
        userDisplayName: state.board.userDisplayName,
        userPhotoURL: state.board.userPhotoURL,
        invitationData: state.homePage.invitationData,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        unfriend: (userFirebaseuid, index) => { dispatch(unfriend(userFirebaseuid, index)) },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Editors);