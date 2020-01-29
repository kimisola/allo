import React from 'react';
import ReactDOM from 'react-dom';
import "../src/main.css";
import Plus from "../images/plus.png";


class ItemFooter extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <React.Fragment>
                
                <div className="itemFooter">
                    <div className="add">
                        <img src={ Plus } />
                    </div>
                </div>

            </React.Fragment>
        )
    }
}
export default ItemFooter;