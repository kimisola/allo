import React from "react";
import { connect } from "react-redux";
import AddComment from "../AddComment";
import ThemeTitle from "../ThemeTitle";

class SectionWrapperTransform extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        const i = this.props.i
        const items = this.props.items
        const item = this.props.item
        let dragInfo = this.props.dragInfo
        const key = this.props.key

        return(
            <div className="sectionWrapper" key={key} index={i} style={{ left:dragInfo.left, top:dragInfo.top, position:"absolute", transform:"rotate(5deg)", zIndex: "100" }}>
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

const mapStateToProps = (state, ownprops) => {
    return {
        i: ownprops.i,
        stopEvent: ownprops.stopEvent,
        items: ownprops.items,
        dragList: ownprops.dragList,
        dragInfo: ownprops.dragInfo,
        item: ownprops.item,
        key: ownprops.key
    }
}
export default connect(mapStateToProps)(SectionWrapperTransform);