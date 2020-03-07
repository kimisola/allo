import React from "react";
import { connect } from "react-redux";
import CommentMenu from "./CommentMenu";
import { changeTagsDisplay } from "../actions/actionCreators";

class CommentTags extends React.Component {
        constructor(props){
            super(props);
            this.myRef = React.createRef();
        }

        change = () => {
            this.props.changeTagsDisplay();
        }

    render(){

        const style = {
            tag: {
                width: this.props.tagsDisplayChanged ? "30px" : "",
                height: this.props.tagsDisplayChanged ? "6.5px" :  "",
                textIndent: this.props.tagsDisplayChanged ? "-999px" : "",
                transition: this.props.tagsDisplayChanged ? "width 0.3s  cubic-bezier(1,.31,.39,0), height 0.1s":"width 0.1s, height 0.3s cubic-bezier(1,.31,.39,0)" ,
            }
        }

        return(
            <React.Fragment>
                <div className="tags" ref={ this.myRef }>
                { this.props.item.tags.map((tag, i) => {
                    switch (tag) {
                        case "planning":
                            return <div className="tag planning tagBrightness" key={i} onClick={ this.change } style={ style.tag }>Planning</div>

                        case "process":
                            return <div className="tag process tagBrightness"  key={i} onClick={ this.change } style={ style.tag }>Process</div>
                    
                        case "risk":
                            return <div className="tag risk tagBrightness" key={i} onClick={ this.change } style={ style.tag }>At Risk</div>
                    
                        case "achived":
                            return <div className="tag achived tagBrightness" key={i} onClick={ this.change } style={ style.tag }>Achieved</div>

                            default:
                        break;
                        }
                    })
                }
                </div>
                <CommentMenu  listId={ this.props.listIndex } comId={ this.props.j } coordinate={ this.myRef }  />
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state ,ownprops) => {
    return {
        item : ownprops.item,
        j :ownprops.j,
        listIndex:ownprops.listIndex,
        tagsDisplayChanged: state.board.tagsDisplayChanged,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeTagsDisplay: () => { dispatch(changeTagsDisplay()) },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CommentTags);