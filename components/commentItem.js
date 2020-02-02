import React from 'react';
import ReactDOM from 'react-dom';
import Tag from "../images/tag.png";
import TestImage from "../images/IMG_0069.jpg";
import Pencil from "../images/pencil.png";
import GarbageCan from "../images/garbagecan.png";
import Cross from "../images/cross.png"
import Plus from "../images/plus.png";
import AddItem from "../components/addItem";
import ItemFooter from "../components/itemFooter";
import { connect } from 'react-redux';
import { element } from 'prop-types';
import { Switch } from 'react-router-dom';
import fire from "../src/fire";



class CommentItem extends React.Component {
    constructor(props){
        super(props);
    }

    deleteTheme = (i) => {
        console.log("run delete theme")
        console.log(i)

        const db = fire.firestore();
        const coll = db.collection("Boards/BEUG8sKBRg2amOD19CCD/Lists");

        coll.get().then((querySnapshot) => {
            console.log(querySnapshot.docs[i].id)
            let docId = querySnapshot.docs[i].id

            //為了避免誤刪 code 維持 get 改成 delete 就可以刪除了
            coll.doc(docId).get().then((querySnapshot) => {
                console.log(querySnapshot)
                console.log("Document successfully deleted!");
            }).catch((error) => {
                console.error("Error removing document: ", error);
            })
        })


    }

    creatComment = (i) => {
        console.log("run creat comment")
        console.log(i)
        this.props.dispatch({ type: "addComment" })
    }

    

    render(){
        
        return(
            <React.Fragment>
            {this.props.listTitle.map((item , i) =>
                <React.Fragment>
                <div className="sectionWrapper">
                    <div className="section">
                        <div className="head">
                            <div className="titleLeft"> {item} </div>
                            <div className="titleRight" onClick={ () => this.deleteTheme(i) }>
                                <img src={ Cross } />
                            </div>
                        </div>
                        <div className="comment">
                            {this.props.text[i].map((item) =>
                            
                                <div className="item">
                                    <div className="itemHead">
                                        <div className="tags">

                                        {item.tags.map((tag) => {
                                            switch (tag) {
                                                case "planning":
                                                    return <div className="tag planning">Planning</div>

                                                case "process":
                                                    return <div className="tag process">In Process</div>
                                            
                                                case "risk":
                                                    return <div className="tag risk">At Risk</div>
                                            
                                                case "achived":
                                                    return <div className="tag achived">Achieved</div>

                                                    default:
                                                break;
                                                }
                                            })}
                                    
                                        </div>

                                        <div className="tagImg">
                                            <img src={ Tag } />
                                        </div>
                                    </div>
                                    <div className="itemBody">
                                        <div className="message">                       
                                            <div className="msgText"> {item.text} </div>         
                                            <div className="msgImg"> <img src={ item.img } /> </div>
                                        </div>
                                        <div className="featureDiv">
                                            <div className="feature">
                                                <div className="edit">
                                                    <img src={ Pencil } />
                                                </div>
                                                <div className="trashcan">
                                                    <img src={ GarbageCan } />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="addItem" style={{display: this.props.addNewCommentOpen ? 'block' : 'none' }}>
                        <AddItem />
                        </div>
                        <div className="itemFooter">
                            <div className="add">
                                <img src={ Plus } onClick={ () => this.creatComment(i)}/>
                            </div>
                        </div>
                    </div>
                </div>
                </React.Fragment>
            )}
            </React.Fragment>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        text: state.text,
        listTitle: state.listTitle,
        addNewCommentOpen:state.addNewCommentOpen
    }
}

export default connect(mapStateToProps)(CommentItem);

 