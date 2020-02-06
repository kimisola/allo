import React from 'react';
import "../src/main.css";
import { Route } from 'react-router-dom';


class HomePage extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <React.Fragment>
                <Route>
                
                <div className="myBoards">
                    <div className="boardLists">
                        可以編輯的 boards
                    </div>
                </div>
                
                </Route>
            </React.Fragment>
        )
    }
}
export default HomePage;