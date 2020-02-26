import React from 'react';
import { connect } from 'react-redux';
import Cancel from "../images/cancel.png";
import fire from "../src/fire";

class Editors extends React.Component {
    constructor(props){
        super(props);
    }

    unfriend = (userFirebaseuid) => {
        const db = fire.firestore();
        db.collection("Users/" + this.props.firebaseUid + "/invitation").where("userFirebaseuid", "==", userFirebaseuid)
        .get().then((querySnapshot) => {
            let docId = querySnapshot.docs[0].id
            let  ref = db.collection("Users/" + this.props.firebaseUid + "/invitation").doc(docId)
            ref.update({ 
                confirm: null,
            })
        })

        db.collection("Users/" + userFirebaseuid + "/beInvited").where("userFirebaseuid", "==", this.props.firebaseUid)
        .get().then((querySnapshot) => {
            let docId = querySnapshot.docs[0].id
            let  ref = db.collection("Users/" + this.props.firebaseUid + "/beInvited").doc(docId)
            ref.update({ 
                confirm: null,
            })
        })
    }

    render(){
        return(
            <React.Fragment>
                <div className="editors">
                    <div className="section">
                        <div className="category">允許編輯</div>
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
                                        <img src={ Cancel } onClick={ () => this.unfriend(item.userFirebaseuid) }/>
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
        invitationData: ownprops.invitationData,
    }
}

export default connect(mapStateToProps)(Editors);