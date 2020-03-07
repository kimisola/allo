import React from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { switchBoard } from"../actions/actionCreators"

class BoardLink extends React.Component {
    constructor(props){
        super(props);
    }

    switchBoard = () => {
        let targetLink = this.props.targetLink
        this.props.switchBoard(targetLink)
    }

    render(){
        let boardStyle = {
            board: {
                backgroundImage: `url(${this.props.boardBackground}) `,
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
                <div className="board" style={ boardStyle.board } onClick={ this.switchBoard } > 
                    <Link to={ targetURL } style={ boardStyle.link }>  { this.props.boardName } </Link>
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
        boardBackground: ownprops.boardBackground,
        targetLink: ownprops.targetLink,
        boardName: ownprops.boardName,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        switchBoard: (targetLink) => { dispatch(switchBoard(targetLink)) },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(BoardLink);