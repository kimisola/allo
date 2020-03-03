import React from 'react';
import { connect } from 'react-redux';
import Letter from "../images/letter-x.png";
import fire from "../src/fire";

class ThemeTitle extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isInEditMode: false,
            isDeleteConfirmWinOpen: false,
            targetIndex: "",
        }
    }

    openConfirmWin = (i) => {
        console.log("run openConfirmWin")
        console.log(i)
        //this.props.dispatch({ type: "deleteThemeConfirmOpen", i })
        this.setState( prevState => {
            let targetIndex = i
            return Object.assign({}, prevState, { 
                isDeleteConfirmWinOpen: !prevState.isDeleteConfirmWinOpen,
                targetIndex: targetIndex
            })
        });
        console.log(this.state)
    }

    deleteTheme = () => {
        let t = this.state.targetIndex
        console.log("run delete theme", t)

        const db = fire.firestore();
        let firebaseUid = "";
        if ( this.props.currentBoard !== "" ) {
            firebaseUid = this.props.currentBoard
        } else {
            firebaseUid = this.props.firebaseUid
        } 

        db.collection("Boards/" + firebaseUid + "/Lists").where("index", "==", ((t+1)*2)).get()
        .then((querySnapshot) => {
            console.log(querySnapshot.docs[0].id)
            let docId = querySnapshot.docs[0].id

            //避免誤刪 code 維持 get 改成 delete 就可以刪除了
            db.collection("Boards/" + firebaseUid + "/Lists").doc(docId).delete()
            .then(() => {
                console.log("Document successfully deleted!", t);
                this.props.dispatch({ type: "deleteTheme", t })
                this.setState( prevState => {
                    let targetIndex = ""
                    return Object.assign({}, prevState, { 
                        isDeleteConfirmWinOpen: !prevState.isDeleteConfirmWinOpen,
                        targetIndex: targetIndex
                    })
                });
                db.collection("Boards/" + firebaseUid + "/Lists").orderBy("index").get()
                .then(async (querySnapshot) => {
                    let doc = querySnapshot.docs;
                    for ( let i = 0; i < doc.length; i++ ) {       
                        let ref = db.collection("Boards/" + firebaseUid + "/Lists").doc(doc[i].id)
                        ref.update({
                            index: (((i+1)*2))  // 重新塞一次 index 給它
                        })
                    }
                })
            }).catch((error) => {
                console.error("Error removing document: ", error);
            })
        })
    }

    changeEditMode = () => {
        this.setState( prevState => {
            return { isInEditMode: !prevState.isInEditMode }
        });
    }

    updateValue = (event) => {
        let newValue = this.refs.theTextInput.value
        let indexOfValue = this.props.themeIndex
        console.log("updateValue",newValue, indexOfValue )
        if ( event.key === "Enter" ) {
            if ( newValue.length > 41 ) {
                alert("Beyond the word limit!")
            } else {
                this.props.dispatch({ type: "getEditedTitleValue", newValue, indexOfValue})
                this.setState({
                    isInEditMode: false
                });

                const db = fire.firestore();
                let firebaseUid = "";
                if ( this.props.currentBoard !== "" ) {
                    firebaseUid = this.props.currentBoard
                } else {
                    firebaseUid = this.props.firebaseUid
                }
                
                db.collection("Boards/" + firebaseUid + "/Lists").where("index", "==", ((indexOfValue+1)*2)).get()
                .then((querySnapshot) => {
                    let docId = querySnapshot.docs[0].id
        
                    db.collection("Boards/" + firebaseUid + "/Lists").doc(docId)
                    .update({
                        title: newValue,
                        index: ((indexOfValue+1)*2)
                    }).then(() => {
                        console.log("Document successfully written!");
                    }).catch((error) => {
                        console.error("Error removing document: ", error);
                    })
                }) 
            }
        }
    }

    renderEditView = () => {
        return (
            <React.Fragment>
            <div className="head" onDoubleClick={ () => this.changeEditMode() }>
                <input className="titleLeftInput" type="text" defaultValue={ this.props.title } onKeyPress={ this.updateValue } ref="theTextInput" />
                <div className="titleRight" onClick={ () => this.changeEditMode() }>
                    <img src={ Letter } />
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
                <div className="titleRight" onClick={ () => this.openConfirmWin(this.props.themeIndex) }>
                    <img src={ Letter } />
                </div>
            </div>

            <div className="addThemeDiv" style={{ display: this.state.isDeleteConfirmWinOpen ? 'block' : 'none' }}>
                <div className="addTheme">
                    <p>Are you sure to delete the list?</p>
                    <div className="buttons">
                        <div className="no" onClick={ this.openConfirmWin }>cancel</div>
                        <div className="yes" onClick={ this.deleteTheme }>confirm</div>
                    </div>
                </div>
            </div>
            </React.Fragment>
        )
    }

    render() {
        return (
            this.state.isInEditMode ? this.renderEditView() : this.renderDefaultView() 
        )
    }
}

const mapStateToProps = (state ,ownprops) => {
    return {
        text: state.text,
        listTitle: state.listTitle,
        title: ownprops.title,
        firebaseUid: state.firebaseUid,
        // indexWin: ownprops.indexWin,
        // deleteThemeConfirmOpen: state.deleteThemeConfirmOpen,
        // whichWindowOpen: state.whichWindowOpen,
        firebaseUid: state.firebaseUid,
        currentBoard: state.currentBoard,
        themeIndex: ownprops.themeIndex,
    }
}

export default connect(mapStateToProps)(ThemeTitle)