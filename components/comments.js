import React from 'react';
import { connect } from 'react-redux';
import CommentItem from "../components/CommentItem";


class Comments extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        //console.log("render text", this.props.text[3][0].text)
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