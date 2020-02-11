import React from 'react';
import ReactDOM from 'react-dom';
import Plus from "../images/plus.png";
import TestIcon from "../images/testIcon.jpg";
import { connect } from 'react-redux';
import fire from "../src/fire";
import { aCreatTitle, aAddNewListOpen, aGetTitleValue, aSetIndexForTitle } from"./actionCreators"


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
        let indexForTitle = this.props.indexForTitle;

        if (event.key === "Enter" ) {
            if ( titleValue.length > 14 ) {
                console.log(titleValue.length)
                alert("標題太長囉、再短一點!")
            } else {
                console.log("enter creat title", titleValue)
                this.props.mAddNewListOpen();
                newListTitle.push(titleValue);
                newText.push([]);
                this.props.mCreatTitle(newListTitle, newText)
                
                const db = fire.firestore();
                const titleCollection = db.collection("Boards/" + firebaseUid + "/Lists").doc();
                titleCollection.set({
                    title: titleValue,
                    index: indexForTitle
                }).then(() => {
                    this.props.mSetIndexForTitle(indexForTitle+2)  // update index for title
                    console.log("Document successfully written!");
                }).catch(() => {
                    console.error("Error writing document: ", error);
                })

            }

        }
    }

    creatTitleByButton = () => {
        const newText = this.props.text;
        const newListTitle =  this.props.listTitle;
        const titleValue =  this.props.titleValue;
        const firebaseUid  = this.props.firebaseUid;
        let indexForTitle = this.props.indexForTitle;

        console.log("enter creat title", titleValue)
        this.props.mAddNewListOpen();
        newListTitle.push(titleValue);
        newText.push([]);
        this.props.mCreatTitle(newListTitle, newText)
        
        const db = fire.firestore();
        const titleCollection = db.collection("Boards/" + firebaseUid + "/Lists").doc();
        titleCollection.set({
            title: titleValue,
            index: indexForTitle
        }).then(() => {
            this.props.mSetIndexForTitle( indexForTitle + 2 )  // update index for next new title
            console.log("Document successfully written!");
        }).catch(() => {
            console.error("Error writing document: ", error);
        })
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
                            <div className="no" onClick={this.addNewListOpen}>取消</div>
                            <div className="yes" onClick={this.creatTitleByButton}>確定</div>
                        </div>
                    </div>
                </div>

            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        indexForTitle: state.indexForTitle,
        text: state.text,
        listTitle: state.listTitle,
        titleValue: state.titleValue,
        addNewListOpen: state.addNewListOpen,
        deleteConfirmThemeOpen: state.deleteConfirmThemeOpen,
        firebaseUid: state.firebaseUid,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        mAddNewListOpen: () => { dispatch(aAddNewListOpen()) },
        getTvalue: (value) => { dispatch(aGetTitleValue(value)) },
        mCreatTitle: (newListTitle, newText) => { dispatch(aCreatTitle(newListTitle, newText)) },
        mSetIndexForTitle: (storeTitleIndex) => { dispatch(aSetIndexForTitle(storeTitleIndex))},
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SecondBar);
