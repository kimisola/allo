import React from 'react';
import ReactDOM from 'react-dom';
import "../src/main.css";
import Plus from "../images/plus.png";
import { connect } from 'react-redux';


class ItemFooter extends React.Component {
    constructor(props){
        super(props);
    }


    creatComment = () => {
        console.log("run creat comment")
        console.log(i)

        this.props.dispatch({ type: "addComment" })

    }


    render(){
        return(
            <React.Fragment>
                
                <div className="itemFooter">
                    <div className="add">
                        <img src={ Plus } onClick={ () => creatComment()}/>
                    </div>
                </div>

            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        text: state.text,
        listTitle: state.listTitle,
        addNewCommentOpen:state.addNewCommentOpen
    }
}

export default connect(mapStateToProps)(ItemFooter);