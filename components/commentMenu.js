import React from 'react';
import { connect } from 'react-redux';
import fire from "../src/fire";
import bin from"../images/bin.png";
import menuImg from "../images/more.png"

class CommentMenu extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isTagImgDivShowed: false,
            isMenuShowed: false,
            isOwnerShowed: false,
            isEditorShowed: false,
            defaultImg: "",
            defaultText: "",
            defaultTags: [],
            commentTags: { planning:false, process:false, risk:false, achived:false },
            defaultedited: "",
            defaultEditorImg: "",
            defaultOwner: "",
            defaultOwnerImg: "",
            xCoordinate: "",
            yCoordinate: "",

        }
    }

    showImgDiv = () => {
        this.setState( prevState => {
            const isTagImgDivShowed = !prevState.isTagImgDivShowed
            return { isTagImgDivShowed: isTagImgDivShowed }
        });
    }

    showMenu = () => {
        this.setState( prevState => {
            const showMenu = !prevState.isMenuShowed
            return { isMenuShowed: showMenu }
        });
    }

    showOwner = () => {
        this.setState( prevState => {
            const showOwner = !prevState.isOwnerShowed
            return { isOwnerShowed: showOwner }
        });
    }

    showEditor = () => {
        this.setState( prevState => {
            const showEditor = !prevState.isEditorShowed
            return { isEditorShowed: showEditor }
        });
    }

    setDefault = () => {
        const tags = this.state.commentTags  //reset tag value
        const tagsState = [ "planning", "process", "risk", "achived" ]
        tagsState.forEach((element) => {
            if ( tags[element] ) { 
                tags[element] = !tags[element]
            }
        });
        
        const listId = this.props.listId;
        const comId = this.props.comId;
        const text = this.props.text;
        const defaultText = text[listId][comId].text
        const defaultTags = text[listId][comId].tags
        const defaultImg = text[listId][comId].img
        const defaultedited = text[listId][comId].edited;
        const defaultEditorImg = text[listId][comId].editorImg;
        const defaultOwner = text[listId][comId].owner;
        const defaultOwnerImg = text[listId][comId].ownerImg;

        defaultTags.map((target) => {
            this.setState( prevState => {
                const commentTagsCopy = prevState.commentTags
                commentTagsCopy[target] = !prevState.commentTags[target]
                return Object.assign({}, prevState, { commentTags: commentTagsCopy });
            });
        });
        this.setState({
            defaultText: defaultText,
            defaultTags: defaultTags,
            defaultImg: defaultImg,
            defaultedited: defaultedited,
            defaultEditorImg: defaultEditorImg,
            defaultOwner: defaultOwner,
            defaultOwnerImg: defaultOwnerImg,
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
        let firebaseUid = "";
        if ( this.props.currentBoard !== "" ) {
            firebaseUid = this.props.currentBoard
        } else {
            firebaseUid = this.props.firebaseUid
        } 

        db.collection("Boards/" + firebaseUid + "/Lists").where("index", "==", ((listId+1)*2)).get()
        .then(async(querySnapshot) => {

            this.props.dispatch({ type: "deleteComment", listId, comId })
            this.showMenu();    

            const docId =  querySnapshot.docs[0].id;
            db.collection("Boards/" + firebaseUid + "/Lists/" + docId + "/Items").where("index", "==", ((comId+1)*2)).get()
            .then( async(querySnapshot) => {
                const docId2 = querySnapshot.docs[0].id
                //避免誤刪 code 維持 get 改成 delete 就可以刪除了
                db.collection("Boards/" + firebaseUid + "/Lists/" + docId + "/Items").doc(docId2).delete()
                .then(() => {   
                    console.log("Document successfully deleted!");
                    db.collection("Boards/" + firebaseUid + "/Lists/" + docId + "/Items").orderBy("index").get()
                    .then((querySnapshot2) => {
                        const doc2 = querySnapshot2.docs;
                        for ( let j = 0; j < doc2.length; j++ ) {
                            let ref = db.collection("Boards/" + firebaseUid + "/Lists/" + docId + "/Items").doc(doc2[j].id)
                            ref.update({
                                index: (((j+1)*2))
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
        const edited = this.props.userDisplayName;
        const editorImg = this.props.userPhotoURL
        const tags = this.state.commentTags;
        const tagsStatus = [ "planning", "process", "risk", "achived" ]
        const newTextTag = [];
        tagsStatus.forEach((element) => {
            if ( tags[element] ) {
                newTextTag.push(element)
            }
        });

        this.props.dispatch({ type: "getEditedValue", newTextValue, newTextTag, listId, comId, edited, editorImg })
        this.showMenu();

        const db = fire.firestore();
        let firebaseUid = "";
        if ( this.props.currentBoard !== "" ) {
            firebaseUid = this.props.currentBoard
        } else {
            firebaseUid = this.props.firebaseUid
        } 

        db.collection("Boards/" + firebaseUid + "/Lists").where("index", "==", ((listId+1)*2)).get()
        .then((querySnapshot) => {
            const docId =  querySnapshot.docs[0].id;
            db.collection("Boards/" + firebaseUid + "/Lists/" + docId + "/Items").where("index", "==", ((comId+1)*2)).get()
            .then((querySnapshot) => {
                const docId2 = querySnapshot.docs[0].id                
                db.collection("Boards/" + firebaseUid + "/Lists/" + docId + "/Items").doc(docId2)
                .update({
                    img: this.state.defaultImg,
                    text: newTextValue,
                    tags: newTextTag,
                    edited: this.props.userDisplayName,
                    editorImg: this.props.userPhotoURL,
                }).then(() => {
                    console.log("Document successfully written!");
                }).catch((error) => {
                    console.error("Error removing document: ", error);
                })
            })
        })
    }

    // sendEdited = () => {
    //     this.updateContent();
    // }

    getCoordinate = () => {
        console.log(this.props.coordinate.current.getBoundingClientRect(), window.innerWidth);
        let data = this.props.coordinate.current.getBoundingClientRect()
        console.log(data.x);
        if ( data.y + 240 >  window.innerHeight && data.x + 420 > window.innerWidth) {
            this.setState( prevState => {  
                let xCoordinate = prevState.xCoordinate
                xCoordinate = (window.innerWidth - 430)
                let yCoordinate = prevState.yCoordinate
                yCoordinate = (window.innerHeight - 250)
                return { 
                    xCoordinate: xCoordinate,
                    yCoordinate: yCoordinate
                }
            });
        } else if ( data.y + 240 >  window.innerHeight ) {
            this.setState( prevState => {  
                let xCoordinate = prevState.xCoordinate
                xCoordinate = data.x
                let yCoordinate = prevState.yCoordinate
                yCoordinate = (window.innerHeight - 250)
                return { 
                    xCoordinate: xCoordinate,
                    yCoordinate: yCoordinate
                }
            });
        } else if ( data.x + 420 > window.innerWidth ) {
            this.setState( prevState => {  
                let xCoordinate = prevState.xCoordinate
                xCoordinate = (window.innerWidth - 430)
                let yCoordinate = prevState.yCoordinate
                yCoordinate = data.y
                return { 
                    xCoordinate: xCoordinate,
                    yCoordinate: yCoordinate
                }
            });
        } else {
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
    }

    render() {
        const style = {
            menuStyle: {
                display: this.state.isMenuShowed ? "flex" : "none",
                position: "fixed",
                top: this.state.yCoordinate,
                left: this.state.xCoordinate
            },
            tagImgDiv: { 
                display: this.state.isTagImgDivShowed ? "flex" : "none",
            }
        };

        return (
            <React.Fragment>
                <div className="tagDiv" onMouseEnter={ this.showImgDiv } onMouseLeave={ this.showImgDiv }>
                <div className="tagImgDiv" style={ style.tagImgDiv } onClick={ () => this.setDefault() }><img src={ menuImg } /></div>
                    <div className="showMenuBackground" style={{display: this.state.isMenuShowed ? 'block' : 'none' }} onClick={ () => this.showMenu() }></div>
                    <div className="commentMenu"  style={style.menuStyle} >
                        <div className="tags" >
                            <div className="tag planning" style={{backgroundColor: this.state.commentTags.planning ? "#ff9f1a" : "grey" }} onClick={ () => this.selectTags("planning") }>Planning</div>
                            <div className="tag process" style={{backgroundColor: this.state.commentTags.process ? "#00c2e0" : "grey" }} onClick={ () => this.selectTags("process") }>In Process</div>
                            <div className="tag risk" style={{backgroundColor: this.state.commentTags.risk ? "#eb5a46" : "grey" }} onClick={ () => this.selectTags("risk") }>At Risk</div>
                            <div className="tag achived" style={{backgroundColor: this.state.commentTags.achived ? "#4bbf6b" : "grey" }} onClick={ () => this.selectTags("achived") }>Achieved</div>
                        </div>
                        <div className="menuBody">
                            <div className="menuLeft">
                                <textarea  type="text" defaultValue={ this.state.defaultText } ref="theTextInput"/>
                                <div onClick={ () => this.updateContent() }>Save</div>
                            </div>
                            <div className="menuRight">
                                <div className="menuList" onMouseEnter={ this.showOwner } onMouseLeave={ this.showOwner }>
                                    <div className="editTag">
                                        <img src={ this.props.text[this.props.listId][this.props.comId].ownerImg } />
                                    </div>
                                    <div style={{display: this.state.isOwnerShowed ? "none" : "block" }}>Owner</div>
                                    <div style={{display: this.state.isOwnerShowed ? "block" : "none" }}>{ this.props.text[this.props.listId][this.props.comId].owner }</div>
                                </div>
                                <div className="menuList" onMouseEnter={ this.showEditor } onMouseLeave={ this.showEditor }>
                                    <div className="editText">
                                        <img src={ this.props.text[this.props.listId][this.props.comId].editorImg } />
                                    </div>
                                    <div style={{display: this.state.isEditorShowed ? "none" : "block" }}>Editor</div>
                                    <div style={{display: this.state.isEditorShowed ? "block" : "none" }}>{ this.props.text[this.props.listId][this.props.comId].edited }</div>
                                </div>
                                {/* <div className="menuList" >
                                    <div className="setTime">
                                        <img src={ clock } />
                                    </div>
                                    <div>Due Date</div>
                                </div> */}
                                <div className="menuList deleteDiv">
                                    <div className="deleteText">
                                        <img src={ bin } />
                                    </div>
                                    <div onClick={ () => this.deleteComment() }>delete</div>
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
        currentBoard: state.currentBoard,
    }
}
export default connect(mapStateToProps)(CommentMenu)