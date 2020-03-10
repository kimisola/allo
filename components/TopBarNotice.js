import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { connect } from "react-redux";

class Notice extends React.Component {
    constructor(props){
        super(props);
    }

    render() {

        const style = {
            linkStyle: {
                textDecoration: "none",
            },
        }

        return (
            <React.Fragment key={ this.props.index }>
                <Link to="/HomePage/notifications" style={ style.linkStyle }> <li> { this.props.message } </li> </Link>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state, ownprops) => {
    return {
        userDisplayName: state.board.userDisplayName,
        userPhotoURL: state.board.userPhotoURL,
        firebaseUid: state.board.firebaseUid,
        message: ownprops.message,
        index: ownprops.index,
    }
}
export default connect(mapStateToProps)(Notice);