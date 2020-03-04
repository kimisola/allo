import React from 'react';
import { connect } from 'react-redux';
import { unfriend } from "./ActionCreators";
import { lib_AccessWhereMethod } from "../library/getDbData";
import Cancel from "../images/cancel.png";

class Editors extends React.Component {
    constructor(props){
        super(props);
        this.lib_AccessWhereMethod = lib_AccessWhereMethod.bind(this)
    }

    unfriend = (userFirebaseuid, index) => {

        this.props.unfriend(userFirebaseuid, index)

        this.lib_AccessWhereMethod(`Users/${this.props.firebaseUid}/invitation`, "userFirebaseuid", userFirebaseuid, { confirm: null })
        // const db = fire.firestore();
        // db.collection("Users/" + this.props.firebaseUid + "/invitation").where("userFirebaseuid", "==", userFirebaseuid)
        // .get().then((querySnapshot) => {
        //     const docId = querySnapshot.docs[0].id
        //     const ref = db.collection("Users/" + this.props.firebaseUid + "/invitation").doc(docId)
        //     ref.update({ 
        //         confirm: null,
        //     })
        // })

        this.lib_AccessWhereMethod(`Users/${userFirebaseuid}/beInvited`, "userFirebaseuid", this.props.firebaseUid, { confirm: null })

        // db.collection("Users/" + userFirebaseuid + "/beInvited").where("userFirebaseuid", "==", this.props.firebaseUid)
        // .get().then((querySnapshot) => {
        //     const docId = querySnapshot.docs[0].id
        //     const ref = db.collection("Users/" + userFirebaseuid + "/beInvited").doc(docId)
        //     ref.update({ 
        //         confirm: null,
        //     })
        // })
    }

    render(){
        return(
            <React.Fragment>
                <div className="editors">
                    <div className="section">
                        <div className="category">Access List</div>
                        <div className="contents">
                            { this.props.invitationData.map((item, index) =>
                                <div className="content" key={index}>
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

const mapStateToProps = (state, ownprops) => {
    return {
        firebaseUid: state.firebaseUid,
        userEmail: state.userEmail,
        userDisplayName: state.userDisplayName,
        userPhotoURL: state.userPhotoURL,
        invitationData: state.invitationData,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        unfriend: (userFirebaseuid, index) => { dispatch(unfriend(userFirebaseuid, index)) },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Editors);