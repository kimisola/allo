import React from 'react';
import "../src/main.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { connect } from 'react-redux';
import { switchBoard } from"./actionCreators"
import fire from "../src/fire";
import Background from "../images/mainBackground.jpg";

class BoardLink extends React.Component {
    constructor(props){
        super(props);
    }


    switchBoard = () => {
        let targetLink = this.props.targetLink
        console.log("targetLinktargetLinktargetLink", this.props.targetLink)
        this.props.switchBoard(targetLink)
    }

    render(){

        const boardStyle = {
            boardStyle: {
                backgroundImage: `url(${this.props.boardURL}) `,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                textDecoration: "none",
            },
            link: {
                color: "white", 
                textDecoration: "none",
            }
        };


        let targetURL = `/Board/${this.props.targetLink}`

        return(
            <React.Fragment>
                
                 <div className="board" 
                        style={ boardStyle.boardStyle }
                        onClick={ this.switchBoard }
                         
                    > <Link to={ targetURL }style={ boardStyle.link }>  { this.props.boardName }   </Link> </div>　 

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
        boardURL: ownprops.boardURL,
        targetLink: ownprops.targetLink,
        boardName: ownprops.boardName,
    }
}

const mapDispatchToProps = (dispatch, ownprops) => {
    return {
        switchBoard: (targetLink) => { dispatch(switchBoard(targetLink)) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BoardLink);