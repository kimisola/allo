import React from "react";
import { connect } from "react-redux";
import BoardLink from "./BoardLink";

class BoardLists extends React.Component {
    constructor(props){
        super(props);
    }
    
    render(){
        return(
            <React.Fragment>
                <div className="boardLists">
                    <div className="section">
                        <div className="category">My Board</div>
                        <div className="items">
                            <BoardLink 
                            boardBackground={ this.props.currentUserBackground }
                            targetLink={ this.props.firebaseUid }
                            boardName={ this.props.userDisplayName }
                            />
                        </div>
                    </div>
                    <div className="section">
                        <div className="category">Team Boards</div>
                        <div className="items">
                        { this.props.beInvitedData.map((item, index) => item.confirm ?
                            <BoardLink
                            boardBackground={ item.backgroundURL }
                            targetLink={ item.userFirebaseuid }
                            boardName={ item.userName }
                            key={ index }
                            /> : ""
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
        currentUserBackground: ownprops.currentUserBackground
    }
}
export default connect(mapStateToProps)(BoardLists);