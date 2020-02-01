import React from 'react';
import ReactDOM from 'react-dom';
import Plus from "../images/plus.png";
import TestIcon from "../images/testIcon.jpg";
import { connect } from 'react-redux';
import store from "../src/index";



class SecondBar extends React.Component {
    constructor(props){
        super(props);
    }

    creatTheme = () => {
        console.log("run creatTheme")
        this.props.dispatch({ type: "addList" })
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
                <div className="addThemeDiv" style={{display: this.props.addNewListOpen ? 'block' : 'none' }}>
                    <div className="addTheme">
                        <p>請輸入列表標題：</p>
                        <input type="text"/>
                        <div className="buttons">
                            <div className="no">取消</div>
                            <div className="yes">確定</div>
                        </div>
                    </div>
                </div>

            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        addNewListClicked: state.addNewListClicked,
        addNewListOpen: state.addNewListOpen,
    }
}

export default connect(mapStateToProps)(SecondBar);
