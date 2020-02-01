import React from 'react';
import ReactDOM from 'react-dom';
import HomeImg from "../images/home.png";
import Blackboard from "../images/blackboard.png";
import TestIcon from "../images/testIcon.jpg";
import HomePage from "./homePage";
import App from "../src/index"
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";


class Topbar extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <React.Fragment>
            <Router>
              <div className="topBar">
                <div className="topLeft">
                    <div className="home">
                        <Link to={"/HomePage"}> <img src={ HomeImg } /> </Link>
                         
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

            <Switch>
                <Route exact path="/">
                
                </Route>
                <Route path="/HomePage">
                    <HomePage />
                </Route>
            </Switch>
            
            </Router>
            </React.Fragment>
        )
    }
}
export default Topbar;