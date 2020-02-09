import React from 'react';
import { connect } from 'react-redux';
import fire from "../src/fire";
import priceTag from "../images/tag.png";
import pencil from "../images/pencil.png";
import clock from "../images/clock.png";
import bin from"../images/bin.png";


class CommentMenu extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            menuShowed: false,
            defaultImg: "",
            defaultText: "",
            defaultTags: [],
            commentTags: { planning:false, process:false, risk:false, achived:false },
        }
    }

    showMenu = () => {
        const tags = this.state.commentTags  //reset tag value
        const tagsState = [ "planning", "process", "risk", "achived" ]
        tagsState.forEach((element) => {
            if ( tags[element] ) { 
                tags[element] = ! tags[element]
            }
        });

        this.setState( prevState => {
            const showMenu = !prevState.menuShowed
            return { menuShowed: showMenu }
        });
        const listId = this.props.listId;
        const comId = this.props.comId;
        const text = this.props.text;
        const defaultText = text[listId][comId].text
        const defaultTags = text[listId][comId].tags
        const defaultImg = text[listId][comId].img

        defaultTags.map((target) => {
            this.setState( prevState => {
                const commentTagsCopy = prevState.commentTags
                commentTagsCopy[target] = !prevState.commentTags[target]
                return Object.assign({}, prevState, { commentTags: commentTagsCopy });
            });
        });
        console.log(this.state.commentTags)
        this.setState({
            defaultText: defaultText,
            defaultTags: defaultTags,
            defaultImg: defaultImg
        })
    }

    deleteComment = () => {
        const listId = this.props.listId;
        const comId = this.props.comId;
        console.log(listId,"listId")
        console.log(comId,"comId")
        this.props.dispatch({ type: "deleteComment", listId, comId }) //delete comment

        const db = fire.firestore();
        const firebaseUid = this.props.firebaseUid;
        const coll = db.collection("Boards/" + firebaseUid + "/Lists");
        coll.get().then((querySnapshot) => {
            const docId = querySnapshot.docs[listId].id
            const coll2 = db.collection("Boards/" + firebaseUid + "/Lists/" + docId + "/Items")
            coll2.get().then((querySnapshot) => {
                const docId2 = querySnapshot.docs[comId].id
                //避免誤刪 code 維持 get 改成 delete 就可以刪除了
                coll2.doc(docId2).get().then(() => {   
                    console.log("Document successfully deleted!");
                    alert("刪除成功")
                    
                }).catch((error) => {
                    console.error("Error removing document: ", error);
                })
            })
        }) 
    }

    selectTags = (e) =>{
        this.setState( prevState => {
           let commentTagsCopy =  prevState.commentTags
           commentTagsCopy[e] = !prevState.commentTags[e]
           console.log( prevState.commentTags)
           return Object.assign({}, prevState, { commentTags: commentTagsCopy });
        })
    }

    updateContent = () => {
        const newTextValue = this.refs.theTextInput.value
        const listId = this.props.listId;
        const comId = this.props.comId;
        const tags = this.state.commentTags
        const tagsStatus = [ "planning", "process", "risk", "achived" ]
        const newTextTag = [];
        tagsStatus.forEach((element) => {
            if ( tags[element])  {  // if the key element === true
                newTextTag.push(element)
            }
        });

        this.props.dispatch({ type: "getEditedValue", newTextValue, newTextTag, listId, comId})
        //const imgValue = this.props.text[listId][comId].img

        const db = fire.firestore();
        const firebaseUid = this.props.firebaseUid;
        const coll = db.collection("Boards/" + firebaseUid + "/Lists");
        coll.get().then((querySnapshot) => {
            const docId = querySnapshot.docs[listId].id
            const coll2 = db.collection("Boards/" + firebaseUid + "/Lists/" + docId + "/Items")
            coll2.get().then((querySnapshot) => {
                const docId2 = querySnapshot.docs[comId].id                
                coll2.doc(docId2).update({
                    img: this.state.defaultImg, 
                    text: newTextValue,
                    tags: newTextTag
                }).then(() => {   
                    console.log("Document successfully written!");
                    alert("編輯成功")
                }).catch((error) => {
                    console.error("Error removing document: ", error);
                })
            })
        })
    }

    sendEdited = () => {
        this.updateContent();
        this.showMenu();
    }


    render() {
        return (
            <React.Fragment>
                <div className="tagDiv">
                    <div className="tagImgDiv"  onClick={ this.showMenu } ></div>
                    <div className="showMenuBackground" style={{display: this.state.menuShowed ? 'block' : 'none' }} onClick={ () => this.showMenu() }></div>
                    <div className="commentMenu"  style={{display: this.state.menuShowed ? 'flex' : 'none' }}>
                        <div className="tags">
                            <div className="tag planning" style={{backgroundColor: this.state.commentTags.planning ? "rgba(204 ,94, 28, 0.8)" : 'grey' }} onClick={ () => this.selectTags("planning") }>Planning</div>
                            <div className="tag process" style={{backgroundColor: this.state.commentTags.process ? "rgba(46 ,169, 223, 0.8)" : 'grey' }} onClick={ () => this.selectTags("process") }>In Process</div>
                            <div className="tag risk" style={{backgroundColor: this.state.commentTags.risk ? "rgba(215 ,84, 85, 0.8)" : 'grey' }} onClick={ () => this.selectTags("risk") }>At Risk</div>
                            <div className="tag achived" style={{backgroundColor: this.state.commentTags.achived ? "rgba(123 ,162, 63, 0.8)" : 'grey' }} onClick={ () => this.selectTags("achived") }>Achieved</div>
                        </div>

                        <div className="menuBody">
                            <div className="menuLeft">
                                <textarea  type="text" defaultValue={ this.state.defaultText } ref="theTextInput"/>
                                <div onClick={ () => this.sendEdited() }>儲存</div>
                            </div>
                            <div className="menuRight">
                                <div className="menuList">
                                    <div className="editTag">
                                        <img src={ priceTag } />
                                    </div>
                                    <div>編輯標籤</div>
                                </div>
                                <div className="menuList" >
                                    <div className="editText">
                                        <img src={ pencil } />
                                    </div>
                                    <div>編輯文字</div>
                                </div>
                                <div className="menuList">
                                    <div className="setTime">
                                        <img src={ clock } />
                                    </div>
                                    <div>到期設定</div>
                                </div>                        
                                <div className="menuList">
                                    <div className="deleteText">
                                        <img src={ bin } />
                                    </div>
                                    <div onClick={ () => this.deleteComment() }>刪除留言</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state ,ownprops) => {
    return {
        listTitle: state.listTitle,
        text: state.text,
        listId : ownprops.listId,
        comId :ownprops.comId,
        firebaseUid : state.firebaseUid,
    }
}

export default connect(mapStateToProps)(CommentMenu)