import React from 'react';
import ReactDOM from 'react-dom';
import Plus from "../images/plus.png";
import TestIcon from "../images/testIcon.jpg";
import { connect } from 'react-redux';
import fire from "../src/fire";
import { aCreatTitle,aAddNewListOpen,aGetTitleValue } from"./actionCreators"


class SecondBar extends React.Component {
    constructor(props){
        super(props);
    }

    addNewListOpen = () => {
        console.log("run creatTheme")
        this.props.getTvalue("")  //reset input value
        this.props.mAddNewListOpen()
    }

    getTitleValue = (event) => {  //use onChange to get value
        const value = event.target.value
        this.props.getTvalue(value);      
    }

    creatTitle = (event) => {
        const newText = this.props.text;
        const newListTitle =  this.props.listTitle;
        const titleValue =  this.props.titleValue;
        const firebaseUid  = this.props.firebaseUid;

        if (event.key === "Enter" ) {
            console.log("enter creat title", titleValue)
            this.props.mAddNewListOpen();
            newListTitle.push(titleValue);
            newText.push([]);
            this.props.mCreatTitle(newListTitle, newText)
            
            const db = fire.firestore();
            const titleCollection = db.collection("Boards/" + firebaseUid + "/Lists").doc();
            titleCollection.set({
                title: titleValue,
            }).then(() => {
                // this.props.getTvalue(""); 
                console.log("Document successfully written!");
            }).catch(() => {
                console.error("Error writing document: ", error);
            })
        }
    } 
    

    render(){
        return(
            <React.Fragment>

                <div className="secondBar">
                    <div className="secondLeft">
                        <div className="invite">邀請</div>
                        <div className="friendList">
                            <div className="friend"> <img src={ TestIcon } /> </div>
                            <div className="friend"> <img src={ TestIcon } /> </div>
                            <div className="friend"> <img src={ TestIcon } /> </div>
                        </div>
                    </div>
                    <div className="secondRight">
                        <div className="addBoard">
                            <img src={ Plus }  onClick= { this.addNewListOpen } />
                        </div>
                    </div>
                </div>
                <div className="addThemeDiv" style={{display: this.props.addNewListOpen ? 'block' : 'none' }}>
                    <div className="addTheme">
                        <p>請輸入列表標題：</p>
                        <input type="text" value={this.props.titleValue} onChange={this.getTitleValue} onKeyPress={this.creatTitle}/>
                        <div className="buttons">
                            <div className="no" onClick= { this.addNewListOpen }>取消</div>
                            <div className="yes">確定</div>
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
        titleValue: state.titleValue,
        addNewListOpen: state.addNewListOpen,
        deleteConfirmThemeOpen: state.deleteConfirmThemeOpen,
        firebaseUid: state.firebaseUid,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    console.log(ownProps,"ownPropsmapDispatchToProps")
    return {
        mAddNewListOpen: () => { dispatch(aAddNewListOpen()) },
        getTvalue: (value) => { dispatch(aGetTitleValue(value)) },
        mCreatTitle: (newListTitle, newText) => { dispatch(aCreatTitle(newListTitle, newText)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SecondBar);
