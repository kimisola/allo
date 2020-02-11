import React from 'react';
import "../src/main.css";
import { Route } from 'react-router-dom';
import Topbar from "../components/topbar";
import TestIcon from "../images/testIcon.jpg";

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

                <Topbar />
                <div className="homepage"> 

                    <div className="profile">
                        <div className="myImg">
                            <img src= { TestIcon } />
                        </div>
                        
                        <div className="details">
                            <div className="list">
                                <div className="name">使用者名稱</div>
                                <div className="content">kimisola</div>
                            </div>
                            <div className="list">
                                <div className="name">電子郵件</div>
                                <div className="content">testtest@testtest.com</div>
                            </div>
                            <div className="list">
                                <div className="name">好友名單</div>
                                <li className="content">June</li>
                                <li className="content">Shaun</li>
                                <li className="content">YC</li>
                                <li className="content">CW P</li>
                            </div>
                        </div>
                    </div>

                    <div className="boardLists">
                        <div className="section">
                            <div className="category">歷史瀏覽</div>
                            <div className="items">
                                <div className="board">我的看板</div>
                                <div className="board">看板3</div>
                                <div className="board">看板2</div>
                            </div>
                        </div>
                        <div className="section">
                            <div className="category">我的看板</div>
                            <div className="items">
                                <div className="board">我的看板</div>
                            </div>
                        </div>
                        <div className="section">
                            <div className="category">好友看板</div>
                            <div className="items">
                                <div className="board">看板1</div>
                                <div className="board">看板2</div>
                                <div className="board">看板3</div>
                                <div className="board">看板4</div>
                                <div className="board">看板5</div>
                                <div className="board">看板6</div>
                                <div className="board">看板7</div>
                                <div className="board">看板8</div>
                            </div>
                        </div>
                    </div>  

                </div>
                
            </React.Fragment>
        )
    }
}
export default HomePage;