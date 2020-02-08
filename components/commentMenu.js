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
        this.setState( prevState => {
            let showMenu = !prevState.menuShowed
            return { menuShowed: showMenu }
        });
        const listId = this.props.listId;
        const comId = this.props.comId;
        const text = this.props.text;
        const defaultText = text[listId][comId].text
        const defaultTags = text[listId][comId].tags
        const defaultImg = text[listId][comId].img
     
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

    updateText = () => {
        const newTextValue = this.refs.theTextInput.value
        const listId = this.props.listId;
        const comId = this.props.comId;
        this.props.dispatch({ type: "getEditedTextValue", newTextValue, listId, comId})
        //const imgValue = this.props.text[listId][comId].img

        const db = fire.firestore();
        const firebaseUid = this.props.firebaseUid;
        const coll = db.collection("Boards/" + firebaseUid + "/Lists");
        coll.get().then((querySnapshot) => {
            const docId = querySnapshot.docs[listId].id
            const coll2 = db.collection("Boards/" + firebaseUid + "/Lists/" + docId + "/Items")
            coll2.get().then((querySnapshot) => {
                const docId2 = querySnapshot.docs[comId].id                
                coll2.doc(docId2).set({
                    img: this.state.defaultImg, 
                    text: newTextValue,
                    tags: this.state.defaultTags
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
        this.updateText();
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
                            <div className="tag planning" onClick={ () => this.selectTags("planning") }>Planning</div>
                            <div className="tag process" onClick={ () => this.selectTags("process") }>In Process</div>
                            <div className="tag risk" onClick={ () => this.selectTags("risk") }>At Risk</div>
                            <div className="tag achived" onClick={ () => this.selectTags("achived") }>Achieved</div>
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