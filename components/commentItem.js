import React from 'react';
import { connect } from 'react-redux';
import CommentMenu from "../components/commentMenu";



class CommentItem extends React.Component {
        constructor(props){
            super(props);
            this.myRef = React.createRef();

        }
    
    // top = () => {
    //     console.log("座標來", this.myRef.current.getBoundingClientRect())
    // }


    render(){
        return(
            <React.Fragment>
                
                <div className="tags" ref={ this.myRef }>
                { this.props.item.tags.map((tag, i) => {
                    switch (tag) {
                        case "planning":
                            return <div className="tag planning" key={i}>Planning</div>

                        case "process":
                            return <div className="tag process"  key={i}>In Process</div>
                    
                        case "risk":
                            return <div className="tag risk" key={i}>At Risk</div>
                    
                        case "achived":
                            return <div className="tag achived" key={i}>Achieved</div>

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
    }
}

export default connect(mapStateToProps)(CommentItem);