import React from 'react';
import ReactDOM from 'react-dom';
import Tag from "../images/tag.png";
import Pencil from "../images/pencil.png";
import GarbageCan from "../images/garbagecan.png";
import Cross from "../images/cross.png"
import Plus from "../images/plus.png";
import ListTitle from "../components/listTitle";
import AddItem from "../components/addItem";
import CommentMenu from "../components/commentMenu";
import { connect } from 'react-redux';
import fire from "../src/fire";



class CommentItem extends React.Component {
    constructor(props){
        super(props);
    }

    addComment = (i) => {
        this.props.dispatch({ type: "addComment", i })
    }

    render(){
        console.log("render list title", this.props.listTitle)
        console.log("render text", this.props.text)
        return(
            <React.Fragment>

            {this.props.listTitle.map((item , i) =>
                <React.Fragment>
                <div className="sectionWrapper" >
                    <div className="section">
                        
                        <ListTitle title={ item } indexWin={ i }/>
                           
                        <div className="comment">
                            {this.props.text[i].map((item, j) =>
                            
                                <div className="item" >
                                    <div className="itemHead">
                                        <div className="tags">

                                        {item.tags.map((tag) => {
                                            switch (tag) {
                                                case "planning":
                                                    return <div className="tag planning">Planning</div>

                                                case "process":
                                                    return <div className="tag process" >In Process</div>
                                            
                                                case "risk":
                                                    return <div className="tag risk">At Risk</div>
                                            
                                                case "achived":
                                                    return <div className="tag achived" >Achieved</div>

                                                    default:
                                                break;
                                                }
                                            })}
                                    
                                        </div>

                                        <CommentMenu  listId={`${i}`} comId={`${j}`}   />

                                    </div>                              
                                    
                                    <div className="itemBody">
                                        <div className="message">                       
                                            <div className="msgText"> {item.text} </div>         
                                            <div className="msgImg"> <img src={ item.img } /> </div>
                                        </div>
                                        {/* 可以獨立成一個 component 
                                        <div className="featureDiv">
                                            <div className="feature" style={{display: 'none' }}>
                                                <div className="edit">
                                                    <img src={ Pencil } />
                                                </div>
                                                <div className="trashcan">
                                                    <img src={ GarbageCan } />
                                                </div>
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="addItem" style={{display: this.props.commentWindow[i] ? 'block' : 'none' }}>
                        <AddItem />
                        </div>
                        <div className="itemFooter">
                            <div className="add">
                                <img src={ Plus } onClick={ () => this.addComment(i)}/>
                            </div>
                        </div>
                    </div>
                </div>

                </React.Fragment>  
            )}
          
            </React.Fragment>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        text: state.text,
        listTitle: state.listTitle,
        addNewCommentOpen: state.addNewCommentOpen,
        deleteThemeConfirmOpen: state.deleteThemeConfirmOpen,
        whichWindowOpen: state.whichWindowOpen,
        commentWindow: state.commentWindow,
    }
}

export default connect(mapStateToProps)(CommentItem);