import React from "react";
import { connect } from "react-redux";
import CommentTags from "../CommentTags";

class SectionItem extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        const i = this.props.i
        const j = this.props.j
        const texts = this.props.texts
        const key = this.props.key
        return(
            <div className="item" index={ `${i}-${j}` } key={ key }>
                <div className="itemDragArea" onPointerDown={ this.props.dragItem }></div>
                <div className="itemHead">
                    <CommentTags item={ texts[i][j] } listIndex={ i } j={ j }/>
                </div>                              
                
                <div className="itemBody">
                    <div className="message">                       
                        <div className="msgText"> {texts[i][j].text} </div>         
                        <div className="msgImg"> {texts[i][j].img === "" ? "" : <img src={ texts[i][j].img } />} </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownprops) => {
    return {
        i: ownprops.i,
        j: ownprops.j,
        texts: ownprops.texts,
        dragItem: ownprops.dragItem,
        key: ownprops.key
    }
}
export default connect(mapStateToProps)(SectionItem);