import React from 'react';
import { connect } from 'react-redux';
import Cross from "../images/cross.png";
import Tick2 from "../images/tick2.png";
import Letter from "../images/letter-x.png";
import fire from "../src/fire";

class ListTitle extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isInEditMode: false,
        }
    }

    openConfirmWin = (i) => {
        console.log("run openConfirmWin")
        console.log(i)
        this.props.dispatch({ type: "deleteThemeConfirmOpen", i })
    }

    deleteTheme = () => {
        let t = this.props.whichWindowOpen
        console.log("run delete theme")
        console.log(t)

        const db = fire.firestore();
        const coll = db.collection("Boards/BEUG8sKBRg2amOD19CCD/Lists");

        coll.get().then((querySnapshot) => {
            console.log(querySnapshot.docs[t].id)
            let docId = querySnapshot.docs[t].id

            //避免誤刪 code 維持 get 改成 delete 就可以刪除了
            coll.doc(docId).get().then(() => {
                console.log("Document successfully deleted!", t);
                this.props.dispatch({ type: "deleteTheme", t })
                this.props.dispatch({ type: "deleteThemeConfirmOpen" })
                alert("刪除成功")
            }).catch((error) => {
                console.error("Error removing document: ", error);
            })
        })
    }

    changeEditMode = () => {
        console.log("run changeEditMode")
        this.setState({
            isInEditMode: ! this.state.isInEditMode
        })
        console.log("should go to changeEditMode")
    }

    updateValue = () => {
        let newValue = this.refs.theTextInput.value
        let indexOfValue = this.props.indexWin
        console.log("111111111111", indexOfValue)
        this.props.dispatch({ type: "getEditTitleValue", newValue, indexOfValue})
        this.setState({
            isInEditMode: false
        });

        const db = fire.firestore();
        const coll = db.collection("Boards/BEUG8sKBRg2amOD19CCD/Lists");
        coll.get().then((querySnapshot) => {
            let docId = querySnapshot.docs[indexOfValue].id

            let titleCollection = db.collection("Boards/BEUG8sKBRg2amOD19CCD/Lists").doc(docId);
            titleCollection.set({
                title: newValue,
            }).then(() => {
                console.log("Document successfully written!");
            }).catch((error) => {
                console.error("Error removing document: ", error);
            })
        })    
    }

    renderEditView = () => {
        return (
            <React.Fragment>
            <div className="head" onDoubleClick={ () => this.changeEditMode() }>
                <input className="titleLeftInput" type="text" defaultValue={ this.props.title } ref="theTextInput" />
                <div className="titleRight" onClick={ () => this.changeEditMode() }>
                    <img src={ Letter } />
                </div>
                <div className="titleRight" onClick={ () => this.updateValue() }>
                    <img src={ Tick2 } />
                </div>
            </div>
            </React.Fragment>
            
        )
    }

    renderDefaultView = () => {
        return (
            <React.Fragment>
            <div className="head" onDoubleClick={ () => this.changeEditMode() }>
                <div className="titleLeft"> { this.props.title } </div>
                <div className="titleRight" onClick={ () => this.openConfirmWin(this.props.indexWin) }>
                    <img src={ Cross } />
                </div>
            </div>

            <div className="addThemeDiv" style={{ display: this.props.deleteThemeConfirmOpen ? 'block' : 'none' }}>
                <div className="addTheme">
                    <p>確定要刪除該列表嗎？</p>
                    <div className="buttons">
                        <div className="no" onClick={ this.openConfirmWin }>取消</div>
                        <div className="yes" onClick={ this.deleteTheme }>確定</div>
                    </div>
                </div>
            </div>
            </React.Fragment>
        )

    }

    render(){
        return this.state.isInEditMode ? this.renderEditView() : this.renderDefaultView() 
    }
}

const mapStateToProps = (state ,ownprops) => {
    return {
        text: state.text,
        listTitle: state.listTitle,
        title: ownprops.title,
        firebaseUid: state.firebaseUid,
        indexWin: ownprops.indexWin,
        deleteThemeConfirmOpen: state.deleteThemeConfirmOpen,
        whichWindowOpen: state.whichWindowOpen,
    }
}

export default connect(mapStateToProps)(ListTitle)