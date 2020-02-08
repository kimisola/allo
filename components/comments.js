import React from 'react';
import { connect } from 'react-redux';
import CommentMenu from "../components/commentMenu";


class Comments extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <React.Fragment>
                           
                <div className="comment">
                    { this.props.text[this.props.listIndex].map((item, j) =>
                    
                        <div className="item" >
                            <div className="itemHead">
                                <div className="tags">

                                { item.tags.map((tag) => {
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
                                    }) }                        
                                </div>

                                <CommentMenu  listId={this.props.listIndex} comId={`${j}`}   />

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
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state, ownprops) => {
    return {
        text: state.text,
        listTitle: state.listTitle,
        listIndex: ownprops.listIndex
    }
}
export default connect(mapStateToProps)(Comments)