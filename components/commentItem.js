import React from 'react';
import { connect } from 'react-redux';
import CommentMenu from "../components/commentMenu";
import { changeTagsDisplay } from "./actionCreators";



class CommentItem extends React.Component {
        constructor(props){
            super(props);
            this.myRef = React.createRef();

        }
    
    // top = () => {
    //     console.log("座標來", this.myRef.current.getBoundingClientRect())
    // }

        change = () => {
            this.props.changeTagsDisplay();
        }

    render(){

        const style = {
            tag: {
                width: this.props.tagsDisplayChanged ? "30px" : "",
                height: this.props.tagsDisplayChanged ? "6.5px" :  "",
                textIndent: this.props.tagsDisplayChanged ? "-999px" : "",
                // transition: this.props.tagsDisplayChanged ? "3s" : "",
                // transition: this.props.tagsDisplayChanged ? "height 3s" : "",
            }
        }

        return(
            <React.Fragment>
                
                <div className="tags" ref={ this.myRef }>
                { this.props.item.tags.map((tag, i) => {
                    switch (tag) {
                        case "planning":
                            return <div className="tag planning" key={i} onClick={ this.change } style={ style.tag }>Planning</div>

                        case "process":
                            return <div className="tag process"  key={i} onClick={ this.change } style={ style.tag }>In Process</div>
                    
                        case "risk":
                            return <div className="tag risk" key={i} onClick={ this.change } style={ style.tag }>At Risk</div>
                    
                        case "achived":
                            return <div className="tag achived" key={i} onClick={ this.change } style={ style.tag }>Achieved</div>

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
        tagsDisplayChanged: state.tagsDisplayChanged,

    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        changeTagsDisplay: (userDisplayName, userPhotoURL, userEmail, firebaseUid) => { dispatch(changeTagsDisplay(userDisplayName, userPhotoURL, userEmail, firebaseUid)) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentItem);