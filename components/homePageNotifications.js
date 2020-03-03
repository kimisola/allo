import React from 'react';
import { connect } from 'react-redux';
import ReplyButtons from "../components/replyButtons";
import fire from "../src/fire";

class Notifications extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <React.Fragment>
                <div className="notifications">
                    <div className="section">
                        <div className="category">Notifications</div>
                        <div className="bars">

                        {this.props.invitationData.map((item, index)=>
                            <React.Fragment key={index}> 
                            <div className="sanckbar">
                                <div className="msg">
                                    <div className="imgDiv">
                                        <img src={item.userPhoto} />
                                    </div>
                                    <p>{item.userName}　accepted your co-editing invitation.</p>
                                </div>
                            </div>
                            </React.Fragment>
                        )}
                        
                        {this.props.beInvitedData.map((item, index)=>
                            <React.Fragment key={index}> 
                            <div className="sanckbar">
                                <div className="msg">
                                    <div className="imgDiv">
                                        <img src={item.userPhoto} />
                                    </div>
                                    <p>{item.userName}　invited you to edit his board.</p>
                                </div>
                                <div className="buts">
                                <ReplyButtons confirm={ item.confirm } index={ index } userFirebaseuid={ item.userFirebaseuid }/> 
                                </div>
                            </div>
                            </React.Fragment>
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
        beInvitedData: state.beInvitedData,
        invitationData: ownprops.invitationData,
    }
}
export default connect(mapStateToProps)(Notifications);