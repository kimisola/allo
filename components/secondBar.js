import React from 'react';
import ReactDOM from 'react-dom';
import Plus from "../images/plus.png";
import TestIcon from "../images/testIcon.jpg";



class SecondBar extends React.Component {
    constructor(props){
        super(props);
    }

    creatTheme = () => {
        console.log("creatTheme~~")
    }

    render(){
        return(
            <React.Fragment>

                <div className="secondBar">
                    <div className="secondLeft">
                        <div className="invite">邀請</div>
                        <div className="friendList">
                            <div className="friend"> <img src={ TestIcon } /> </div>
                            <div className="friend"> <img src={ TestIcon } /> </div>
                            <div className="friend"> <img src={ TestIcon } /> </div>
                        </div>
                    </div>
                    <div className="secondRight">
                        <div className="addBoard">
                            <img src={ Plus }  onClick= { this.creatTheme } />
                        </div>
                    </div>
                </div>

            </React.Fragment>
        )
    }
}
export default SecondBar;