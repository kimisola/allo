import React from "react";
import { connect } from "react-redux";
import AddComment from "../AddComment";
import ThemeTitle from "../ThemeTitle";

class SectionWrapper extends React.Component {
    constructor(props){
        super(props);
    }


    render(){
        const i = this.props.i
        const items = this.props.items
        const item = this.props.item
        const key =this.props.key
        return(
            <div className="sectionWrapper" key={key} index={i}>
                <div className="section">
                    <div className="dragArea" onPointerDown={ this.props.dragList }></div>
                    <ThemeTitle themeIndex={ i } title={ item }/>
                    <div className="comment" onWheel={(e) => this.props.stopEvent(e)}> { items[i] } </div>
                    <AddComment index={ i }/>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state,ownprops) => {
    return {
        i: ownprops.i,
        stopEvent: ownprops.stopEvent,
        items:ownprops.items,
        dragList:ownprops.dragList,
        item:ownprops.item,
        key:ownprops.key
    }
}
export default connect(mapStateToProps)(SectionWrapper);