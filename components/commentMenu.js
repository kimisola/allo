import React from 'react';
import { connect } from 'react-redux';
import fire from "../src/fire";
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
            xCoordinate: "",
            yCoordinate: "",
            ownerShowed: false,
            editorShowed: false
        }
    }

    showMenu = () => {
        this.setState( prevState => {
            const showMenu = !prevState.menuShowed
            return { menuShowed: showMenu }
        });
    }

    showOwner = () => {
        this.setState( prevState => {
            const showOwner = !prevState.ownerShowed
            return { ownerShowed: showOwner }
        });
    }

    showEditor = () => {
        this.setState( prevState => {
            const showEditor = !prevState.editorShowed
            return { editorShowed: showEditor }
        });
    }

    setDefault = () => {
        const tags = this.state.commentTags  //reset tag value
        const tagsState = [ "planning", "process", "risk", "achived" ]
        tagsState.forEach((element) => {
            if ( tags[element] ) { 
                tags[element] = ! tags[element]
            }
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
        this.getCoordinate();
        this.showMenu();
        
    }

    deleteComment = () => {
        let listId = this.props.listId;
        let comId = this.props.comId;
        console.log(listId,"listId")
        console.log(comId,"comId")

        const db = fire.firestore();
        const firebaseUid = this.props.firebaseUid;
        db.collection("Boards/" + firebaseUid + "/Lists").where("index", "==", ((listId+1)*2)).get()
        .then( async (querySnapshot) => {

            this.props.dispatch({ type: "deleteComment", listId, comId }) //delete state comment
            this.showMenu();    

            let docId =  querySnapshot.docs[0].id;
            // let coll = db.collection("Boards/" + firebaseUid + "/Lists/" + docId + "/Items")
            db.collection("Boards/" + firebaseUid + "/Lists/" + docId + "/Items").where("index", "==", ((comId+1)*2)).get()
            .then( async(querySnapshot) => {
                let docId2 = querySnapshot.docs[0].id
                //避免誤刪 code 維持 get 改成 delete 就可以刪除了
                db.collection("Boards/" + firebaseUid + "/Lists/" + docId + "/Items").doc(docId2).delete()
                .then(() => {   
                    console.log("Document successfully deleted!");
                    db.collection("Boards/" + firebaseUid + "/Lists/" + docId + "/Items").orderBy("index").get()
                    .then((querySnapshot2) => {
                    let doc2 = querySnapshot2.docs;
                        for ( let j = 0; j < doc2.length; j++ ) {
                            let ref = db.collection("Boards/" + firebaseUid + "/Lists/" + docId + "/Items").doc(doc2[j].id)
                            ref.update({
                                index: (((j+1)*2))  // 前後留空格讓之後移動可以有空間塞
                            })   
                        }
                    })
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
        this.showMenu();

        const db = fire.firestore();
        const firebaseUid = this.props.firebaseUid;

        db.collection("Boards/" + firebaseUid + "/Lists").where("index", "==", ((listId+1)*2)).get()
        .then((querySnapshot) => {
            let docId =  querySnapshot.docs[0].id;
            db.collection("Boards/" + firebaseUid + "/Lists/" + docId + "/Items").where("index", "==", ((comId+1)*2)).get()
            .then((querySnapshot) => {
                let docId2 = querySnapshot.docs[0].id                
                db.collection("Boards/" + firebaseUid + "/Lists/" + docId + "/Items").doc(docId2)
                .update({
                    img: this.state.defaultImg, 
                    text: newTextValue,
                    tags: newTextTag,
                    edited: this.props.userDisplayName,
                }).then(() => {
                    console.log("updateContent", newTextValue)
                    console.log("updateContent", newTextTag)
                    console.log("updateContent", listId)
                    console.log("updateContent", comId)
                    console.log("Document successfully written!");
                }).catch((error) => {
                    console.error("Error removing document: ", error);
                })
            })
        })
    }

    sendEdited = () => {
        this.updateContent();
    }

    getCoordinate = () => {
        console.log(this.props.coordinate.current.getBoundingClientRect());
        let data = this.props.coordinate.current.getBoundingClientRect()
        console.log(data.x)
        console.log(data.y)
        this.setState( prevState => {  
            let xCoordinate = prevState.xCoordinate
            xCoordinate = data.x
            let yCoordinate = prevState.yCoordinate
            yCoordinate = data.y
            return { 
                xCoordinate: xCoordinate,
                yCoordinate: yCoordinate
             }
        });
    }

    render() {
        const menuStyle = {
            menuStyle: {
                display: this.state.menuShowed ? 'flex' : 'none',
                position: "fixed",
                top: this.state.yCoordinate,
                left: this.state.xCoordinate
            },
        };

        return (
            <React.Fragment>
                <div className="tagDiv">
                    <div className="tagImgDiv"  onClick={ () => this.setDefault() } ></div>
                    <div className="showMenuBackground" style={{display: this.state.menuShowed ? 'block' : 'none' }} onClick={ () => this.showMenu() }></div>
                    <div className="commentMenu"  style={menuStyle.menuStyle} >
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
                                <div className="menuList" onMouseEnter={ this.showOwner } onMouseLeave={ this.showOwner }>
                                    <div className="editTag">
                                        <img src={ this.props.userPhotoURL } />
                                    </div>
                                    <div style={{display: this.state.ownerShowed ? 'none' : 'block' }}>擁有者</div>
                                    <div style={{display: this.state.ownerShowed ? 'block' : 'none' }}>{ this.props.text[this.props.listId][this.props.comId].owner }</div>
                                </div>
                                <div className="menuList" onMouseEnter={ this.showEditor } onMouseLeave={ this.showEditor }>
                                    <div className="editText">
                                        <img src={ this.props.userPhotoURL } />
                                    </div>
                                    <div style={{display: this.state.editorShowed ? 'none' : 'block' }}>更新者</div>
                                    <div style={{display: this.state.editorShowed ? 'block' : 'none' }}>{ this.props.text[this.props.listId][this.props.comId].edited }</div>
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
        userDisplayName: state.userDisplayName,
        userPhotoURL: state.userPhotoURL,
        coordinate : ownprops.coordinate,
    }
}

export default connect(mapStateToProps)(CommentMenu)