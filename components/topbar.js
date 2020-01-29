import React from 'react';
import ReactDOM from 'react-dom';
import HomeImg from "../images/home.png";
import Blackboard from "../images/blackboard.png";
import TestIcon from "../images/testIcon.jpg";


class Topbar extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <React.Fragment>
              <div className="topBar">
                <div className="topLeft">
                    <div className="home">
                        <img src={ HomeImg } /> 
                    </div>
                    <div className="searchBar">
                        <input />
                    </div>
                </div>
                <div className="topRight">
                    <div className="boardList">
                        <div className="boardIcon">
                            <img src={ Blackboard } />
                        </div>
                    </div>
                    <div className="memberIcon">
                        <img src={ TestIcon } />
                    </div>
                </div>
            </div>  
            </React.Fragment>
        )
    }
}
export default Topbar;