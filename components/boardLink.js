import React from 'react';
import "../src/main.css";
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import fire from "../src/fire";
import Background from "../images/mainBackground.jpg";

class BoardLink extends React.Component {
    constructor(props){
        super(props);
    }


    render(){

        const boardStyle = {
            boardStyle: {
                backgroundImage: `url(${this.props.boardURL}) `,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',

            },
        };
console.log("this.propsthis.propsthis.props", this.props)
        return(
            <React.Fragment>
                
                    <div className="board" style={ boardStyle.boardStyle }>{ this.props.boardName }</div>

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

export default connect(mapStateToProps)(BoardLink);