import React from 'react';
import "../src/main.css";
import { Route } from 'react-router-dom';

class HomePage extends React.Component {
    constructor(props){
        super(props);
    }

    onSave = val => {
        console.log('Edited Value -> ', val)
    }

    render(){
        return(
            <React.Fragment>
                <Route>
                
                <div className="myBoards">
                    <div className="boardLists"> 這裡是 board list </div>           
                </div>
                
                </Route>
            </React.Fragment>
        )
    }
}
export default HomePage;