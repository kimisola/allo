import React from "react";
import { connect } from "react-redux";

class SectionItemMark extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        const style = this.props.style
        const key = this.props.key
        return(
            <div className="item" key={ key }>
                <div key="mark" className="mark" style={ style.markItem } />
            </div>
        )
    }
}

const mapStateToProps = (state, ownprops) => {
    return {
        style: ownprops.style,
        key: ownprops.key
    }
}
export default connect(mapStateToProps)(SectionItemMark);