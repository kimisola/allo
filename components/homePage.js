import React from 'react';
import "../src/main.css";


class HomePage extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <React.Fragment>
                
                <div className="myBoards">
                    <div className="boardLists">
                        可以編輯的 boards
                    </div>
                </div>

            </React.Fragment>
        )
    }
}
export default HomePage;