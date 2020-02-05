import React from 'react';
import ReactDOM from 'react-dom';
import "../src/main.css";
import Tick2 from "../images/tick2.png";
import Letter from "../images/letter-x.png";
import { connect } from 'react-redux';
import fire from "../src/fire";
import { element } from 'prop-types';
import { database } from 'firebase';



class AddItem extends React.Component {
    constructor(props){
        super(props);
    }

    getTextValue = (event) => {
        let textValue = event.target.value
        this.props.dispatch({ type: "getNewTextValue", textValue })
    }

    selectTags = (selected) => {
        console.log(selected)
        let tags = this.props.commentTags
        console.log(tags[selected])
        tags[selected] = !tags[selected]

        let tagsState = [ "planning", "process", "risk", "achived" ]
        let textTag = []
        tagsState.forEach((element) => {
            if(tags[element]) {  // if key element === true
                textTag.push(element)
            }
        });
        console.log(textTag);
        this.props.dispatch({ type: "getNewTags", textTag })
    }


    fileUperload = (event) => {
        let file = event.target.files[0]
        const storageRef = fire.storage().ref("image");
        const imgRef = storageRef.child(file.name)
        imgRef.put(file)
        .then(async (snapshot) => {
            console.log(snapshot)
            console.log('Uploaded a blob or file!');
            imgRef.getDownloadURL().then(async(url) => {
                console.log(url)
                this.props.dispatch({ type: "getImageURL", url })
            })
        }).catch((error) => {
            console.error("Error removing document: ", error);
        })      
    }

    sendComment = () => {
        console.log("run send")
        this.props.dispatch({ type: "sendComment" })
        
        let t = this.props.whichTheme
        console.log(t)
        const db = fire.firestore();
        const coll = db.collection("Boards/BEUG8sKBRg2amOD19CCD/Lists");

        coll.get().then((querySnapshot) => {
            let docId =  querySnapshot.docs[t].id;
            let route = db.collection("Boards/BEUG8sKBRg2amOD19CCD/Lists/" + docId + "/Items").doc();
            let newText = this.props.textValue;
            let newTag = this.props.textTag;
            let newImageURL = this.props.commentURL;
           
            route.set({
                img: newImageURL,
                tags: newTag,
                text: newText,
            }).then(() => {
                console.log("Document successfully written!")
            }).catch(()=> {
                console.error("Error writing document: ", error);
            })

            let textValue = "";
            this.props.dispatch({ type: "getNewTextValue", textValue }) //reset textarea value
        })

        this.props.dispatch({ type: "addNewCommentOpen", t })
        
    }
    

    render(){
        return(
            <React.Fragment>
                
                    <div className="tags">
                        <div className="tag planning" onClick={ () => this.selectTags("planning") }>Planning</div>
                        <div className="tag process" onClick={ () => this.selectTags("process") }>In Process</div>
                        <div className="tag risk" onClick={ () => this.selectTags("risk") }>At Risk</div>
                        <div className="tag achived" onClick={ () => this.selectTags("achived") }>Achieved</div>
                    </div>
                    <div>
                        <textarea type="text" value={ this.props.textValue } onChange={ this.getTextValue }></textarea>
                    </div>
                    <div className="addItemFooter">
                        <div className="imgUpload">
                            <form action="/somewhere/to/upload" encType="multipart/form-data">
                                <input name="progressbarTW_img" type="file" accept="image/gif, image/jpeg, image/png" onChange={ this.fileUperload }/>    
                            </form>
                        </div>
                        <div className="addItemFeature">
                            <div className="addComment" onClick={ this.sendComment }> 
                                <img src={ Tick2 } />
                            </div>
                            <div className="cancel">
                                <img src={ Letter } />
                            </div>
                        </div>
                    </div>
                

            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        text: state.text,
        listTitle: state.listTitle,
        textValue: state.textValue,
        textTag: state.textTag,
        commentURL: state.commentURL,
        commentTags: state.commentTags,
        whichTheme: state.whichTheme,
        addNewCommentOpen: state.addNewCommentOpen,
        commentWindow: state.commentWindow,
    }
}

export default connect(mapStateToProps)(AddItem);