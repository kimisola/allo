import React from 'react';
import ReactDOM from 'react-dom';
import "../src/main.css";
import Tick from "../images/tick.png";
import Cross from "../images/cross.png";


class AddItem extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <React.Fragment>
                
                    <div className="tags">
                        <div className="tag planning">Planning</div>
                        <div className="tag process">In Process</div>
                        <div className="tag risk">At Risk</div>
                        <div className="tag achived">Achieved</div>
                    </div>
                    <div>
                        <textarea type="text"></textarea>
                    </div>
                    <div className="addItemFooter">
                        <div className="imgUpload">
                            <form action="/somewhere/to/upload" encType="multipart/form-data">
                                <input name="progressbarTW_img" type="file" accept="image/gif, image/jpeg, image/png" />    
                            </form>
                        </div>
                        <div className="addItemFeature">
                            <div className="addComment">
                                <img src={ Tick } />
                            </div>
                            <div className="cancel">
                                <img src={ Cross } />
                            </div>
                        </div>
                    </div>
                

            </React.Fragment>
        )
    }
}
export default AddItem;