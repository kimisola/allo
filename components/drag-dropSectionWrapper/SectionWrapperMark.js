import React from "react";
import { connect } from "react-redux";

class SectionWrapperMark extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        const style = this.props.style
        const key = this.props.key
        const i = this.props.i
        return(
            <div className="sectionWrapper" index={i} key={key}>
                <div key="mark" className="mark" style={ style.mark } />
            </div>
        )
    }
}

const mapStateToProps = (state, ownprops) => {
    return {
        style: ownprops.style,
        i: ownprops.i,
        key: ownprops.key
    }
}
export default connect(mapStateToProps)(SectionWrapperMark);