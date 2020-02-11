import React from 'react';
import { aSetCurrentUser } from"../components/actionCreators"
import HomeImg from "../images/home.png";
import Blackboard from "../images/blackboard.png";
import SignOutImg from "../images/logout.png";
import firebase from 'firebase';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { withRouter}  from "react-router";
import { connect } from 'react-redux';


class Topbar extends React.Component {
    constructor(props){
        super(props);
    }

    userSignOut = () => {

        firebase.auth().signOut().then(() => {
            location.href = "/";

            let firebaseUid = "";
            let userDisplayName = "";
            let userPhotoURL = "";
            let userEmail = "";  
            let useruid = "";       
            props.mSetCurrentUser(userDisplayName, userPhotoURL, userEmail, firebaseUid, useruid)

        }).catch((error) => {
            console.log(error)
        });
    }


    render(){
        return(
            <React.Fragment>
                       
                    <div className="topBar">
                        <div className="topLeft">
                            <div className="home">
                                <Link to="/HomePage"> <img src={ HomeImg } /> </Link>
                            </div>
                            <div className="searchBar">
                                <input />
                            </div>
                        </div>
                        <div className="topRight">
                            <div className="boardList">
                                <div className="boardIcon">
                                    <Link to="/Board"> <img src={ Blackboard } /> </Link>
                                </div>
                            </div>
                            <div className="memberIcon">
                                <img src={ this.props.userPhotoURL } />
                            </div>
                            <div className="signOutImg">
                                <img src={ SignOutImg } onClick={ this.userSignOut }/>
                            </div>
                        </div>
                    </div>  

            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userDisplayName: state.userDisplayName,
        userPhotoURL: state.userPhotoURL,
    }
}


const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        mSetCurrentUser: (userDisplayName, userPhotoURL, userEmail, firebaseUid) => { dispatch(aSetCurrentUser(userDisplayName, userPhotoURL, userEmail, firebaseUid)) }
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Topbar));