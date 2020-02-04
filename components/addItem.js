import React from 'react';
import ReactDOM from 'react-dom';
import "../src/main.css";
import Tick from "../images/tick2.png";
import Cross from "../images/letter-x.png";
import { connect } from 'react-redux';
import fire from "../src/fire";



class AddItem extends React.Component {
    constructor(props){
        super(props);
    }

    
    getTextValue = (event) => {
        let textValue = event.target.value
        this.props.dispatch({ type: "getNewTextValue", textValue })
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
            console.log(newText)
            
            route.set({
                img: "",
                tags: ["planning"],
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

    changePlan = () => {
        console.log("run changePlan")
    }


    fileUperload = (event) =>{
        console.log(event)
    }
    

    render(){
        return(
            <React.Fragment>
                
                    <div className="tags">
                        <div className="tag planning" onClick={this.changePlan}>Planning</div>
                        <div className="tag process" onClick={this.changePlan}>In Process</div>
                        <div className="tag risk" onClick={this.changePlan}>At Risk</div>
                        <div className="tag achived" onClick={this.changePlan}>Achieved</div>
                    </div>
                    <div>
                        <textarea type="text" value={this.props.textValue} onChange={this.getTextValue}></textarea>
                    </div>
                    <div className="addItemFooter">
                        <div className="imgUpload">
                            <form action="/somewhere/to/upload" encType="multipart/form-data">
                                <input name="progressbarTW_img" type="file" accept="image/gif, image/jpeg, image/png" onChange={this.fileUperload()}/>    
                            </form>
                        </div>
                        <div className="addItemFeature">
                            <div className="addComment" onClick={this.sendComment}>
                                <img src={ Tick } />
                            </div>
                            <div className="cancel">
                                <img src={ Cross } />
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
        whichTheme: state.whichTheme,
        addNewCommentOpen: state.addNewCommentOpen,
        commentWindow: state.commentWindow,
    }
}

export default connect(mapStateToProps)(AddItem);