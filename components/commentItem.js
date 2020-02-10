import React from 'react';
import { connect } from 'react-redux';
import CommentMenu from "../components/commentMenu";



class CommentItem extends React.Component {
        constructor(props){
            super(props);
            this.myRef = React.createRef();

        }
    
    top = () => {
        console.log("座標來", this.myRef.current.getBoundingClientRect())
    }


    render(){
        console.log("comment", this.props.item.text);
        return(

            <div className="item" ref={ this.myRef }>
            <button onClick={ this.top }>座標來</button>
            <div className="itemHead">
                <div className="tags">

                { this.props.item.tags.map((tag) => {
                    switch (tag) {
                        case "planning":
                            return <div className="tag planning">Planning</div>

                        case "process":
                            return <div className="tag process" >In Process</div>
                    
                        case "risk":
                            return <div className="tag risk">At Risk</div>
                    
                        case "achived":
                            return <div className="tag achived" >Achieved</div>

                            default:
                        break;
                        }
                    }) }
                                            
                </div>

                <CommentMenu  listId={ this.props.listIndex } comId={ this.props.j } coordinate={ this.myRef }  />

            </div>                              
            
            <div className="itemBody">
                <div className="message">                       
                    <div className="msgText"> {this.props.item.text} </div>         
                    <div className="msgImg"> <img src={ this.props.item.img } /> </div>
                </div>
                {/* 可以獨立成一個 component 
                <div className="featureDiv">
                    <div className="feature" style={{display: 'none' }}>
                        <div className="edit">
                            <img src={ Pencil } />
                        </div>
                        <div className="trashcan">
                            <img src={ GarbageCan } />
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
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