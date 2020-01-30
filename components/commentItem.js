import React from 'react';
import ReactDOM from 'react-dom';
import Tag from "../images/tag.png";
import TestImage from "../images/IMG_0069.jpg";
import Pencil from "../images/pencil.png";
import GarbageCan from "../images/garbagecan.png";
import Cross from "../images/cross.png"
import AddItem from "../components/addItem";
import ItemFooter from "../components/itemFooter";
import { connect } from 'react-redux';
import { element } from 'prop-types';
import { Switch } from 'react-router-dom';



class CommentItem extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        
        return(
            <React.Fragment>
           
           
            {this.props.listTitle.map((item) =>
                <React.Fragment>
                <div className="sectionWrapper">
                    <div className="section">
                        <div class="head">
                            <div className="titleLeft" onClick={ this.getdbData }> {item} </div>
                            <div className="titleRight">
                                <img src={ Cross } />
                            </div>
                        </div>
                <div class="comment">
                    {this.props.text.map((item) =>
                    
                    <div className="item">
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
                                        return <div className="tag achived">Achieved</div>

                                        default:
                                    break;
                                    }
                                })}
                        
                            </div>

                            <div className="tagImg">
                                <img src={ Tag } />
                            </div>
                        </div>
                        <div className="itemBody">
                            <div className="message">                       
                                <div className="msgText"> {item.text} </div>         
                                <div className="msgImg"> <img src={ item.img } /> </div>
                            </div>
                            <div className="featureDiv">
                                <div className="feature">
                                    <div className="edit">
                                        <img src={ Pencil } />
                                    </div>
                                    <div className="trashcan">
                                        <img src={ GarbageCan } />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                )}
                </div>
                <AddItem />
                <ItemFooter />
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
        text : state.text,
        listTitle: state.listTitle,
        loadPage: state.loadPage,
    }
}

export default connect(mapStateToProps)(CommentItem);

 