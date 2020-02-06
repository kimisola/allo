import React from 'react';
import { connect } from 'react-redux';
import fire from "../src/fire";
import Cross from "../images/cross.png"



class CommentMenu extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            menuShowed: false
        }
        console.log(this.props.targetid)
    }

    showMenu = () => {
        console.log("3333333333333")
        this.setState( prevState => {
            let showMenu = !prevState.menuShowed
            return { menuShowed: showMenu }
        });
    }

    render() {
        return (
            <React.Fragment>
                <div className="tagDiv"  onMouseEnter={ () => this.showMenu() } onMouseLeave={ () => this.showMenu() }>
                    <div className="tagImgDiv"></div>
                    <div className="commentMenu"  style={{display: this.state.menuShowed ? 'block' : 'none' }}>
                        <li> <div className="menuImg"> <img src={ Cross } /></div> 標籤編輯</li>
                        <li> <div className="menuImg"> <img src={ Cross } /></div> 文字編輯</li>
                        <li> <div className="menuImg"> <img src={ Cross } /></div> 刪除留言</li>
                        <li> <div className="menuImg"> <img src={ Cross } /></div> 標籤編輯</li>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default CommentMenu