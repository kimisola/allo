import React from 'react';
import { connect } from 'react-redux';
import fire from "../src/fire";
import clock from "../images/clock.png";
import bin from"../images/bin.png";
import menuImg from "../images/more.png"


class CommentMenu extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            tagImgDivShowed: false,
            menuShowed: false,
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
            ownerShowed: false,
            editorShowed: false
        }
    }

    showImgDiv = () => {
        this.setState( prevState => {
            const tagImgDivShowed = !prevState.tagImgDivShowed
            return { tagImgDivShowed: tagImgDivShowed }
        });
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
        const edited = this.props.userDisplayName;
        const editorImg = this.props.userPhotoURL
        const tags = this.state.commentTags;
        const tagsStatus = [ "planning", "process", "risk", "achived" ]
        const newTextTag = [];
        tagsStatus.forEach((element) => {
            if ( tags[element])  {  // if the key element === true
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
                    editorImg: this.props.userPhotoURL,
                }).then(() => {
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
                display: this.state.menuShowed ? 'flex' : 'none',
                position: "fixed",
                top: this.state.yCoordinate,
                left: this.state.xCoordinate
            },
            tagImgDiv: { 
                display: this.state.tagImgDivShowed ? 'block' : 'none',

            }
        };

        return (
            <React.Fragment>
                <div className="tagDiv" onMouseEnter={ this.showImgDiv } onMouseLeave={ this.showImgDiv }>
                <div className="tagImgDiv" style={ style.tagImgDiv } onClick={ () => this.setDefault() } ><img src={ menuImg } /></div>
                    <div className="showMenuBackground" style={{display: this.state.menuShowed ? 'block' : 'none' }} onClick={ () => this.showMenu() }></div>
                    <div className="commentMenu"  style={style.menuStyle} >
                        <div className="tags" >
                            <div className="tag planning" style={{backgroundColor: this.state.commentTags.planning ? "rgba(204 ,94, 28, 0.8)" : 'grey' }} onClick={ () => this.selectTags("planning") }>Planning</div>
                            <div className="tag process" style={{backgroundColor: this.state.commentTags.process ? "rgba(46 ,169, 223, 0.8)" : 'grey' }} onClick={ () => this.selectTags("process") }>In Process</div>
                            <div className="tag risk" style={{backgroundColor: this.state.commentTags.risk ? "rgba(215 ,84, 85, 0.8)" : 'grey' }} onClick={ () => this.selectTags("risk") }>At Risk</div>
                            <div className="tag achived" style={{backgroundColor: this.state.commentTags.achived ? "rgba(123 ,162, 63, 0.8)" : 'grey' }} onClick={ () => this.selectTags("achived") }>Achieved</div>
                        </div>

                        <div className="menuBody">
                            <div className="menuLeft">
                                <textarea  type="text" defaultValue={ this.state.defaultText } ref="theTextInput"/>
                                <div onClick={ () => this.sendEdited() }>Save</div>
                            </div>
                            <div className="menuRight">
                                <div className="menuList" onMouseEnter={ this.showOwner } onMouseLeave={ this.showOwner }>
                                    <div className="editTag">
                                        <img src={ this.props.text[this.props.listId][this.props.comId].ownerImg } />
                                    </div>
                                    <div style={{display: this.state.ownerShowed ? 'none' : 'block' }}>Owner</div>
                                    <div style={{display: this.state.ownerShowed ? 'block' : 'none' }}>{ this.props.text[this.props.listId][this.props.comId].owner }</div>
                                </div>
                                <div className="menuList" onMouseEnter={ this.showEditor } onMouseLeave={ this.showEditor }>
                                    <div className="editText">
                                        <img src={ this.props.text[this.props.listId][this.props.comId].editorImg } />
                                    </div>
                                    <div style={{display: this.state.editorShowed ? 'none' : 'block' }}>Editor</div>
                                    <div style={{display: this.state.editorShowed ? 'block' : 'none' }}>{ this.props.text[this.props.listId][this.props.comId].edited }</div>
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