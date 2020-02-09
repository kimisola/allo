import React from 'react';
import { connect } from 'react-redux';
import CommentItem from "../components/CommentItem";


class Comments extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <React.Fragment>
                           
                <div className="comment">
                    { this.props.text[this.props.listIndex].map((item, j) =>
                        <CommentItem listIndex={ this.props.listIndex } item={ item } j={ j }/>
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