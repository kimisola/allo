import React from 'react';
import ReactDOM from 'react-dom';
import Plus from "../images/plus.png";
import TestIcon from "../images/testIcon.jpg";
import { connect } from 'react-redux';
import fire from "../src/fire";
import { aCreatTitle,aCreatTheme,aGetTitleValue } from"./actionCreators"


class SecondBar extends React.Component {
    constructor(props){
        super(props);
    }

    creatTheme = () => {
        console.log("run creatTheme")
        this.props.cCreatTheme()
    }

    getTitleValue = (event) => { //use onChange to get value
        let value = event.target.value
        this.props.getTvalue(value);      
    }

    creatTitle = (event) => {
        let newText = this.props.text;
        let newListTitle =  this.props.listTitle;
        let titleValue =  this.props.titleValue;

        if(event.key === "Enter") {
            console.log("enter creat title", titleValue)
            let db = fire.firestore();
            let titleCollection = db.collection("Boards/BEUG8sKBRg2amOD19CCD/Lists").doc();
            titleCollection.set({
                title: titleValue,
            }).then(() => {
                newListTitle.push(titleValue);
                newText.push([]);
                this.props.cCreatTheme();
                this.props.getTvalue("");
                console.log("Document successfully written!");
                this.props.cCreatTitle(newListTitle, newText)
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
                            <img src={ Plus }  onClick= { this.creatTheme } />
                        </div>
                    </div>
                </div>
                <div className="addThemeDiv" style={{display: this.props.addNewListOpen ? 'block' : 'none' }}>
                    <div className="addTheme">
                        <p>請輸入列表標題：</p>
                        <input type="text" value={this.props.titleValue} onChange={this.getTitleValue} onKeyPress={this.creatTitle}/>
                        <div className="buttons">
                            <div className="no">取消</div>
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
        addNewListClicked: state.addNewListClicked,
        addNewListOpen: state.addNewListOpen,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    console.log(ownProps,"ownPropsmapDispatchToProps")
    return {
        cCreatTheme: () => { dispatch(aCreatTheme()) },
        getTvalue: (value) => { dispatch(aGetTitleValue(value)) },
        cCreatTitle: (newListTitle, newText) => { dispatch(aCreatTitle(newListTitle, newText)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SecondBar);
