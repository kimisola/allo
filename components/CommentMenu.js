import React from "react";
import { connect } from "react-redux";
import { accessWhereMethod, accessDeleteMethod } from "../library/accessDb";
import { getEditedValue, deleteComment } from "../actions/actionCreators";
import bin from"../images/bin.png";
import menuImg from "../images/more.png";
import { db } from "../src/fire";

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
        this.accessWhereMethod = accessWhereMethod.bind(this)
        this.accessDeleteMethod = accessDeleteMethod.bind(this)
    }
   
    showImgDiv = () => {
        this.setState( prevState => {
            return { isTagImgDivShowed: !prevState.isTagImgDivShowed }
        });
    }

    showMenu = () => {
        this.setState( prevState => {
            return { isMenuShowed: !prevState.isMenuShowed }
        });
    }

    showOwner = () => {
        this.setState( prevState => {
            return { isOwnerShowed: !prevState.isOwnerShowed }
        });
    }

    showEditor = () => {
        this.setState( prevState => {
            return { isEditorShowed: !prevState.isEditorShowed }
        });
    }

    setDefault = () => {
        const tags = this.state.commentTags
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
                return ({ commentTags: commentTagsCopy });
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

        let firebaseUid = "";
        if ( this.props.currentBoard !== "" ) {
            firebaseUid = this.props.currentBoard
        } else {
            firebaseUid = this.props.firebaseUid
        } 

        db.collection("Boards/" + firebaseUid + "/Lists").where("index", "==", ((listId+1)*2)).get()
        .then(async(querySnapshot) => {

            this.props.deleteComment(listId, comId);
            this.showMenu();

            const docId =  querySnapshot.docs[0].id;
            db.collection("Boards/" + firebaseUid + "/Lists/" + docId + "/Items").where("index", "==", ((comId+1)*2)).get()
            .then(async(querySnapshot) => {
                const docId2 = querySnapshot.docs[0].id
                this.accessDeleteMethod(`Boards/${firebaseUid}/Lists/${docId}/Items`, docId2)
            })
        }) 
    }

    selectTags = (e) =>{
        this.setState( prevState => {
           let commentTagsCopy =  prevState.commentTags
           commentTagsCopy[e] = !prevState.commentTags[e]
           return ({ commentTags: commentTagsCopy });
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

        this.props.getEditedValue(newTextValue, newTextTag, listId, comId, edited, editorImg)
        this.showMenu();

        let firebaseUid = "";
        if ( this.props.currentBoard !== "" ) {
            firebaseUid = this.props.currentBoard
        } else {
            firebaseUid = this.props.firebaseUid
        } 

        db.collection("Boards/" + firebaseUid + "/Lists").where("index", "==", ((listId+1)*2)).get()
        .then((querySnapshot) => {
            const docId = querySnapshot.docs[0].id;

            const targetData = {
                img: this.state.defaultImg,
                text: newTextValue,
                tags: newTextTag,
                edited: this.props.userDisplayName,
                editorImg: this.props.userPhotoURL,
            }
            this.accessWhereMethod(`Boards/${firebaseUid}/Lists/${docId}/Items`, "index", ((comId+1)*2), targetData)
        })
    }

    getCoordinate = () => {
        let data = this.props.coordinate.current.getBoundingClientRect()
        if ( data.y + 240 >  window.innerHeight && data.x + 420 > window.innerWidth) {
            this.setState(() => {  
                const xCoordinate = (window.innerWidth - 430)
                const yCoordinate = (window.innerHeight - 250)
                return { 
                    xCoordinate: xCoordinate,
                    yCoordinate: yCoordinate
                }
            });
        } else if ( data.y + 240 >  window.innerHeight ) {
            this.setState(() => {  
                const xCoordinate = data.x
                const yCoordinate = (window.innerHeight - 250)
                return { 
                    xCoordinate: xCoordinate,
                    yCoordinate: yCoordinate
                }
            });
        } else if ( data.x + 420 > window.innerWidth ) {
            this.setState(() => {  
                const xCoordinate = (window.innerWidth - 430)
                const yCoordinate = data.y
                return { 
                    xCoordinate: xCoordinate,
                    yCoordinate: yCoordinate
                }
            });
        } else {
            this.setState(() => {  
                const xCoordinate = data.x
                const yCoordinate = data.y
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
                    <div className="showMenuBackground" style={{display: this.state.isMenuShowed ? "block" : "none" }} onClick={ () => this.showMenu() }></div>
                    <div className="commentMenu"  style={style.menuStyle} >
                        <div className="tags" >
                            <div className="tag planning" style={{backgroundColor: this.state.commentTags.planning ? "#ff9f1a" : "grey" }} onClick={ () => this.selectTags("planning") }>Planning</div>
                            <div className="tag process" style={{backgroundColor: this.state.commentTags.process ? "#00c2e0" : "grey" }} onClick={ () => this.selectTags("process") }>Process</div>
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
                                <div className="menuList deleteDiv">
                                    <div className="deleteText">
                                        <img src={ bin } />
                                    </div>
                                    <div onClick={ () => this.deleteComment() }>Delete</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state, ownprops) => {
    return {
        listTitle: state.board.listTitle,
        text: state.board.text,
        firebaseUid : state.board.firebaseUid,
        userDisplayName: state.board.userDisplayName,
        userPhotoURL: state.board.userPhotoURL,
        currentBoard: state.board.currentBoard,
        coordinate : ownprops.coordinate,
        listId : ownprops.listId,
        comId :ownprops.comId,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getEditedValue: (newTextValue, newTextTag, listId, comId, edited, editorImg) => { dispatch(getEditedValue(newTextValue, newTextTag, listId, comId, edited, editorImg)) },
        deleteComment: (listId, comId) => { dispatch(deleteComment(listId, comId)) }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CommentMenu)