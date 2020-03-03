import React from 'react';
import { connect } from 'react-redux';
import fire from "../src/fire";
import Tick3 from "../images/tick3.png";
import Cancel from "../images/cancel.png";
import Plus from "../images/plusG.png";
import Upload from "../images/upload.png";

class AddComment extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            commentTags: { planning:false, process:false, risk:false, achived:false },
            isCommentWinShowed: false,
            newText: "",
            newImg: "",
            newTags: [],
            fileName: "",
        }
    }

    openCommentWindow = () => {
        this.resetToDefault();
        this.setState( prevState => {
            let showCommentWin = !prevState.isCommentWinShowed
            return { isCommentWinShowed: showCommentWin }
        });
    }

    resetToDefault = () => {
        this.setState( prevState => {
            let newtext = prevState.newText
            newtext = "";
            let newimg = prevState.newImg
            newimg = "";
            let tagsState = [ "planning", "process", "risk", "achived" ]
            let newtags = prevState.newTags;
            newtags = [];
            tagsState.forEach((item)=>{
                this.setState( prevState => {
                    let commentTagsCopy =  prevState.commentTags
                    if ( commentTagsCopy[item] ){
                        commentTagsCopy[item] = false
                    }   
                    return Object.assign({}, prevState, { 
                        commentTags: commentTagsCopy,
                        newText: newtext,
                        newImg: newimg,
                        newTags: newtags,
                    });
                });
            })
        });
    }
    
    getTextValue = (event) => {
        const textValue = event.target.value
        console.log(textValue)
        this.setState( prevState => {
            let newtext = prevState.newText
            newtext = textValue
            return  { newText: newtext }
        });
    }

    selectTags = (selected) => {
        console.log(selected)
        let tags = this.state.commentTags
        tags[selected] = !tags[selected]

        let tagsState = [ "planning", "process", "risk", "achived" ]
        let textTag = []
        tagsState.forEach((element) => {
            if ( tags[element] ) {
                textTag.push(element)
            }
        });
        this.setState( prevState => {
            let tags =  prevState.newTags
            tags = textTag
            return  { newTags: tags }
        })
    }

    fileUpload = (event) => {
        const file = event.target.files[0]
        const storageRef = fire.storage().ref("image");
        const imgRef = storageRef.child(file.name)
        const fileTypes = ["image/jpeg", "image/png","image/gif"];
        let flag = false;

        this.setState( prevState => {
            let newfileName = prevState.fileName
            newfileName =  file.name
            if (newfileName.length > 12) {
                let shortName = newfileName.slice(0, 8) + "..." + newfileName.slice(-4)
                return Object.assign({}, prevState, {
                    fileName: shortName
                }) 
            } else {
                return Object.assign({}, prevState, {
                    fileName: newfileName
                }) 
            }
        });

        imgRef.put(file)
        .then(async (snapshot) => {
            for (let i = 0; i < fileTypes.length; i++) {
                if ( file.type == fileTypes[i] ) {
                    flag = true
                    console.log(snapshot)
                    console.log('Uploaded a blob or file!');
                    imgRef.getDownloadURL().then(async(url) => {
                        console.log(url)
                        this.setState( prevState => {
                            let newImgUrl = prevState.newImg
                            newImgUrl = url
                            return { 
                                newImg: newImgUrl,
                            }
                        });
                    })
                }
            }
            if (!flag) {
                alert("Only support jpeg/png/gif type files.");
            }
        }).catch((error) => {
            console.error("Error removing document: ", error);
        })      
    }

    sendComment = () => {
        let index = this.props.index;
        let newText = this.state.newText;
        let newImg = this.state.newImg;
        let newTags = this.state.newTags;
        let fileName = this.state.fileName;
        let indexForItem = this.props.indexForItem;
        let docId = "";

        if ( newText === "" &&  fileName === "" && newTags.length === 0) {
            alert("You didn't enter anything!")
        } else {
            this.props.dispatch({ type: "sendComment", index, newText, newImg, newTags})
            this.openCommentWindow();

            this.setState( prevState => { //清除上傳圖片名稱
                return Object.assign({}, prevState, {
                    fileName: ""
                }) 
            });
         
            const db = fire.firestore();
            let firebaseUid = "";
            if ( this.props.currentBoard !== "" ) {
                firebaseUid = this.props.currentBoard
            } else {
                firebaseUid = this.props.firebaseUid
            } 

            db.collection("Boards/" + firebaseUid + "/Lists").where("index", "==", ((index+1)*2)).get()
            .then( async (querySnapshot) => {
                docId =  querySnapshot.docs[0].id;

                let route = db.collection("Boards/" + firebaseUid + "/Lists/" + docId + "/Items").doc();
                db.collection("Boards/" + firebaseUid + "/Lists/" + docId + "/Items").orderBy("index").get()
                .then( async (querySnapshot2) => {
                    let doc2 = querySnapshot2.docs;
                    indexForItem = ((doc2.length+1)*2)
                    this.props.dispatch({ type: "setIndexForItem", indexForItem})

                    if ( newImg === undefined ) {
                        newImg = "";
                    }
               
                    route.set({
                        img: newImg,
                        tags: newTags,
                        text: newText,
                        index: indexForItem,
                        owner: this.props.userDisplayName,
                        edited: this.props.userDisplayName,
                        ownerImg: this.props.userPhotoURL,
                        editorImg: this.props.userPhotoURL,
                    }).then(() => {
                        console.log("Document successfully written!")
                    }).catch((error)=> {
                        console.log("Error writing document: ", error);
                    })
                }).catch((error) => {
                    console.log("Error writing document: ", error);
                })
            })
        }         
    }

    render(){
        return(
            <React.Fragment>
                <div className="addItem" style={{display: this.state.isCommentWinShowed ? 'block' : 'none' }}>               
                    <div className="tags">
                        <div className="tag planning" style={{backgroundColor: this.state.commentTags.planning ? "#ff9f1a" : "grey" }} onClick={ () => this.selectTags("planning") }>Planning</div>
                        <div className="tag process" style={{backgroundColor: this.state.commentTags.process ? "#00c2e0" : "grey" }} onClick={ () => this.selectTags("process") }>In Process</div>
                        <div className="tag risk" style={{backgroundColor: this.state.commentTags.risk ? "#eb5a46" : "grey" }} onClick={ () => this.selectTags("risk") }>At Risk</div>
                        <div className="tag achived" style={{backgroundColor: this.state.commentTags.achived ? "#4bbf6b" : "grey" }} onClick={ () => this.selectTags("achived") }>Achieved</div>
                    </div>
                    <div>
                        <textarea type="text" value={ this.state.newText } onChange={ this.getTextValue }></textarea>
                    </div>
                    <div className="addItemFooter">
                        <div className="addItemFooter2">
                            <div className="imgUploadDiv">
                                <label action="/somewhere/to/upload" encType="multipart/form-data">
                                    <div className="imgUpload">
                                        <img src={ Upload } />
                                    </div>
                                    <input name="progressbarTW_img" type="file" accept="image/gif, image/jpeg, image/png" onChange={ this.fileUpload } style={{display:'none' }} />    
                                </label>
                                <div className="fileNameDiv"> {this.state.fileName} </div>
                            </div>
                            <div className="addItemFeature">
                                <div className="addComment" onClick={ this.sendComment }> 
                                    <img src={ Tick3 } />
                                </div>
                                <div className="cancel">
                                    <img src={ Cancel } onClick={ this.openCommentWindow }/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="itemFooter">
                    <div className="add">
                        <img src={ Plus } onClick={ this.openCommentWindow }/>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state , ownprops) => {
    return {
        index: ownprops.index,
        indexForItem: state.indexForItem,
        text: state.text,
        listTitle: state.listTitle,
        commentURL: state.commentURL,
        commentTags: state.commentTags,
        whichTheme: state.whichTheme,
        addNewCommentOpen: state.addNewCommentOpen,
        //commentWindow: state.commentWindow,
        userDisplayName: state.userDisplayName,
        userPhotoURL: state.userPhotoURL,
        firebaseUid: state.firebaseUid,
        currentBoard: state.currentBoard,
    }
}
export default connect(mapStateToProps)(AddComment);