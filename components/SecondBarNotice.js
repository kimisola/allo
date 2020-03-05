import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { connect } from "react-redux";

class Notice extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <React.Fragment key={this.props.index}>
                <Link to="/HomePage/notifications"> <li> {this.props.message} </li> </Link>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state, ownprops) => {
    return {
        userDisplayName: state.userDisplayName,
        userPhotoURL: state.userPhotoURL,
        firebaseUid: state.firebaseUid,
        message: ownprops.message,
        index: ownprops.index,
    }
}
export default connect(mapStateToProps)(Notice);