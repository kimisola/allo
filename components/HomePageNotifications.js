
import React from "react";
import { connect } from "react-redux";
import ReplyButtons from "./HomePageReplyButtons";

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
        firebaseUid: state.board.firebaseUid,
        userEmail: state.board.userEmail,
        userDisplayName: state.board.userDisplayName,
        userPhotoURL: state.board.userPhotoURL,
        beInvitedData: state.homePage.beInvitedData,
        invitationData: ownprops.invitationData,
    }
}
export default connect(mapStateToProps)(Notifications);