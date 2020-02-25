import React from 'react';
import CommentItem from "../components/commentItem";
import AddComment from "../components/addComment";
import { connect } from 'react-redux';
import Cross from "../images/letter-x.png";
import Tick2 from "../images/tick2.png";
import Letter from "../images/letter-x.png";
import fire from "../src/fire";


class Section extends React.Component {
    constructor(props){
        super(props);
        this.board = React.createRef();
        this.state = {
            isInEditMode: false,
            themeHeight: "",
            itemHeight: "",
            dragInfo: {
                left: "auto",
                top: "auto",
                index: -1,
                markIndex: -1
            },
            dragInfoItem: {
                left: "auto",
                top: "auto",
                theme: -1,
                row: -1,
                markTheme: -1,
                markRow: -1,
            }
        }
        this.drag = this.drag.bind(this);
        this.dragItem = this.dragItem.bind(this);
    }

    openConfirmWin = (i) => {
        console.log("run openConfirmWin", i)
        this.props.dispatch({ type: "deleteThemeConfirmOpen", i })
    }

    deleteTheme = () => {
        let t = this.props.whichWindowOpen
        console.log("run delete theme", t)

        const db = fire.firestore();
        let firebaseUid = "";
        if ( this.props.currentBoard.length > 0) {
            firebaseUid = this.props.currentBoard
            console.log("2222222", firebaseUid)
        } else {
            firebaseUid = this.props.firebaseUid
            console.log("000000", firebaseUid)
        } 

        db.collection("Boards/" + firebaseUid + "/Lists").where("index", "==", ((t+1)*2)).get()
        .then((querySnapshot) => {
            let docId = querySnapshot.docs[0].id

            //避免誤刪 code 維持 get 改成 delete 就可以刪除了
            db.collection("Boards/" + firebaseUid + "/Lists").doc(docId).delete()
            .then(() => {
                console.log("Document successfully deleted!", t);
                this.props.dispatch({ type: "deleteTheme", t })
                this.props.dispatch({ type: "deleteThemeConfirmOpen" })
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
        console.log("run changeEditMode")
        
        this.setState( prevState => {
            let isInEditMode = true
            return { isInEditMode: isInEditMode }
        });
        console.log("should go to changeEditMode", this.state.isInEditMode)
    }

    updateValue = () => {
        let newValue = this.refs.theTextInput.value
        let indexOfValue = this.props.indexWin

        if ( newValue.length > 14 ) {
            alert("標題太長囉、再短一點!")
        } else {
            this.props.dispatch({ type: "getEditedTitleValue", newValue, indexOfValue})
            this.setState({
                isInEditMode: false
            });

            const db = fire.firestore();
            let firebaseUid = "";
            if ( this.props.currentBoard.length > 0) {
                firebaseUid = this.props.currentBoard
                console.log("2222222", firebaseUid)
            } else {
                firebaseUid = this.props.firebaseUid
                console.log("000000", firebaseUid)
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

    addComment = (i) => {
        this.props.dispatch({ type: "addComment", i })
    }

    stopEvent = (e) => {
        console.log("run stopEvent")
        e.preventDefault();
        e.stopPropagation();
    }

    drag(e) {　　// 滑鼠按下去的想做的事情
        e.preventDefault();
        e.stopPropagation();
        let theme = e.currentTarget.parentElement.parentElement;
        let index=parseInt(theme.getAttribute("index"));
        let rect = theme.getBoundingClientRect();
        let themeRect = e.currentTarget.parentElement.getBoundingClientRect();
        let themeHeight = themeRect.height
        let offset = {  // 滑鼠所在位置到該 div 最左上的座標的距離  → rect.x y 所指 div 最左上角的座標
                x:e.clientX - rect.x,
                y:e.clientY - rect.y
            };
        let x = e.clientX - offset.x;  // 這裡的 x y 是取得 div 最左上角為起點的座標數字 
        let y = e.clientY - offset.y;
        console.log("index", index)
        console.log("offset", offset)
        console.log("rect", rect)
        this.setState({
                dragInfo:{
                left:x, top:y, index:index, markIndex:index
                },
                themeHeight: themeHeight
        });

        const move = (e) => {  // 滑鼠移動想做的事情
            e.preventDefault();
            e.stopPropagation();
            let x = e.clientX - offset.x;
            let y = e.clientY - offset.y;
            let themeWidth = 278;
            let markIndex = Math.floor((( x + rect.width/2 )+this.board.current.scrollLeft )/ themeWidth);
            console.log(markIndex)
            if ( markIndex <= 0 ) {
                markIndex = 0;
            }else if ( markIndex > this.props.listTitle.length-1 ) {
                markIndex = this.props.listTitle.length-1;
            }
            this.setState({
                dragInfo: {
                    left:x, top:y, index:index, markIndex:markIndex
                }
            });
        };

        let up = (e) => {  // 滑鼠放開的時候想做的事情，最後把監聽事件移除
            e.preventDefault();
            e.stopPropagation();

            let sourceIndex = index;
            let destinationIndex = this.state.dragInfo.markIndex;
            console.log(sourceIndex , destinationIndex,"123")
            this.props.dispatch({ type: "drag-dropTheme", sourceIndex, destinationIndex  })
            this.setState((preState)=>{
                return {
                    dragInfo:{left:"auto", top:"auto", index:-1, markIndex:-1}
                };
            });
            document.removeEventListener("pointermove", move);
            document.removeEventListener("pointerup", up);

            // write in db
            const db = fire.firestore();
            let firebaseUid = "";
            if ( this.props.currentBoard.length > 0) {
                firebaseUid = this.props.currentBoard
                console.log("2222222", firebaseUid)
            } else {
                firebaseUid = this.props.firebaseUid
                console.log("000000", firebaseUid)
            } 
            console.log(sourceIndex, destinationIndex )
            db.collection("Boards/" + firebaseUid + "/Lists").where("index", "==", ((sourceIndex+1)*2)).get()
            .then((querySnapshot) => {
                console.log(querySnapshot)
                let docId = querySnapshot.docs[0].id
                let ref = db.collection("Boards/" + firebaseUid + "/Lists").doc(docId)
                let beforeIndex = (sourceIndex+1)*2;
                let afterIndex = (destinationIndex+1)*2;
                let finalIndex

                if ( beforeIndex > afterIndex) {
                    finalIndex = ((destinationIndex+1)*2)-1
                } else { 
                    finalIndex = ((destinationIndex+1)*2)+1 
                }
                console.log(beforeIndex)
                console.log(afterIndex)
                console.log(finalIndex)
                ref.update({
                    index: finalIndex
                })
            })
            .then(() => {
                db.collection("Boards/" + firebaseUid + "/Lists").orderBy("index").get()
                .then(async (querySnapshot) => {
                let doc = querySnapshot.docs;
                console.log(doc)
                for ( let i = 0; i < doc.length; i++ ) {       
                    let ref = db.collection("Boards/" + firebaseUid + "/Lists").doc(doc[i].id)
                    ref.update({
                        index: (((i+1)*2))  // 前後留空格讓之後移動可以有空間塞
                        })
                    }
                })
            }).catch((error)=> {
                console.log("Error writing document: ", error);
            })
        };
        document.addEventListener("pointermove", move);
        document.addEventListener("pointerup", up);
    }


    dragItem(e) {
        e.preventDefault();
        e.stopPropagation();
        let item = e.currentTarget.parentElement;
        console.log(item)
        let rect = item.getBoundingClientRect();
        let itemHeight = rect.height
        let index = item.getAttribute("index");
        console.log(index)
        let theme = parseInt(index.split("-")[0])
        let row = parseInt(index.split("-")[1])
        console.log(index,theme, row)
        let offset = {  // 滑鼠所在位置到該 div 最左上的座標的距離  → rect.x y 所指 div 最左上角的座標
            x:e.clientX - rect.x,
            y:e.clientY - rect.y
        };
        let x = e.clientX - offset.x;  // 這裡的 x y 是取得 div 最左上角為起點的座標數字 
        let y = e.clientY - offset.y;
        console.log("offset", offset)
        console.log("rect", rect)
        this.setState({
                dragInfoItem: {
                    left:x, top:y, theme:theme, row:row, markTheme:theme, markRow: row
                },
                itemHeight: itemHeight
        });
        console.log("rect", this.state.height)
        const move = (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("scroll left", this.board.current.scrollLeft);
            let x = e.clientX - offset.x;
            let y = e.clientY - offset.y;
            let themeWidth = 278;
            let rowHeight = 200;  // 如果遇到高度特別高的留言就會不精準
            let markTheme = Math.floor((( x + rect.width/2 )+this.board.current.scrollLeft )/ themeWidth);  // 代表同主題寬度 x 軸
            let markRow = Math.floor(( y + rect.height/3 ) / rowHeight);  // 代表主題內留言高度 y 軸
            console.log("markTheme, markRow", markTheme, markRow)
            if ( markTheme <= 0 ) {
                markTheme = 0;
            } else if ( markTheme > this.props.text.length-1 ) {
                markTheme = this.props.text.length-1;
            }

            if ( markRow <= 0 ) {
                markRow = 0;
            } else if ( markRow > this.props.text[markTheme].length-1 ) {
                markRow = this.props.text[markTheme].length-1;
            }
            this.setState({
                dragInfoItem: {
                    left:x, top:y, theme:theme, row:row, markTheme:markTheme, markRow: markRow
                },
            });
        };

        let up = (e) => {
            e.preventDefault();
            e.stopPropagation();
            let sourceTheme = theme;
            let sourceRow = row;
            let destinationTheme = this.state.dragInfoItem.markTheme;
            let destinationRow = this.state.dragInfoItem.markRow;
            this.props.dispatch({ type: "drag-dropText", sourceTheme, sourceRow, destinationTheme, destinationRow })
            this.setState({
                dragInfoItem: { 
                    left:"auto", top:"auto", theme:-1, row:-1, markTheme:-1, markRow:-1 
                }
            })
            document.removeEventListener("pointermove", move);
            document.removeEventListener("pointerup", up);

            // write in db
            const db = fire.firestore();
            let dbData = [];
            let firebaseUid = "";
            if ( this.props.currentBoard.length > 0) {
                firebaseUid = this.props.currentBoard
            } else {
                firebaseUid = this.props.firebaseUid
            }

            db.collection("Boards/" + firebaseUid + "/Lists").where("index", "==", ((sourceTheme+1)*2)).get()
            .then((querySnapshot) => {
                let sourceThemeRef = querySnapshot.docs[0].id
                db.collection("Boards/" + firebaseUid + "/Lists/" + sourceThemeRef +"/Items" ).where("index", "==", ((sourceRow+1)*2)).get()
                .then((querySnapshot) => {
                    let sourceItemRef = querySnapshot.docs[0].id;
                    let sourceItem = db.collection("Boards/" + firebaseUid + "/Lists/"+ sourceThemeRef +"/Items").doc(sourceItemRef)
                    sourceItem.get().then((querySnapshot) => {
                        dbData.push(querySnapshot.data());
                        sourceItem.delete().then(() => {   
                            console.log("Document successfully deleted!");
                        }).catch((error) => {
                            console.error("Error removing document: ", error);
                        });

                        db.collection("Boards/" + firebaseUid + "/Lists").where("index", "==", ((destinationTheme+1)*2)).get()
                        .then((querySnapshot) => {
                            let destinationTheme = querySnapshot.docs[0].id
                            dbData[0].index = ((destinationRow + 1)*2 )-1
                            console.log("destinationRow", destinationRow, dbData[0])

                            let ref = db.collection("Boards/" + firebaseUid + "/Lists/"+ destinationTheme +"/Items").doc()
                            ref.set(dbData[0])
                            .then(() => {
                                db.collection("Boards/" + firebaseUid + "/Lists").orderBy("index").get()
                                .then( (querySnapshot) => {
                                    let doc = querySnapshot.docs;
                                    let listsId = [];
                                    for ( let i = 0; i < doc.length; i++ ) { 
                                        listsId.push(doc[i].id)
                                    }
                                    for (let i = 0; i < listsId.length; i++ ) {  //讀取每一個 list 底下的 items
                                        db.collection("Boards/" + firebaseUid + "/Lists/" + listsId[i] + "/Items").orderBy("index").get()
                                        .then((querySnapshot2) => {
                                            let doc2 = querySnapshot2.docs;
                                            for ( let j = 0; j < doc2.length; j++ ) {
                                            let ref = db.collection("Boards/" + firebaseUid + "/Lists/" + listsId[i] + "/Items").doc(doc2[j].id)
                                            ref.update({
                                                index: (((j+1)*2)), // 前後留空格讓之後移動可以有空間塞
                                                })      
                                            }
                                        })
                                    }
                                })
                            })
                        })
                    });
                })
            })
        }
        document.addEventListener("pointermove", move);
        document.addEventListener("pointerup", up);
    }


    render(){

        
        let style = {
            mark: {
                backgroundColor: "rgba(235,236,240,0.4)",
                borderRadius: "4px",
                width: "270px", 
                height: this.state.themeHeight, 
            },
            markItem: {
                backgroundColor: "rgba(55,55,55,0.2)",
                borderRadius: "4px",
                height: this.state.itemHeight,
                width: "270px",
            }
        }

// drag-drop of comments
        let texts = this.props.text
        let items =[]
        let dragInfoItem=this.state.dragInfoItem;

        for ( let i = 0; i < texts.length; i++ ) {
            items.push([]);
            for ( let j = 0; j < texts[i].length; j++ ) {
                if ( i === dragInfoItem.markTheme && j === dragInfoItem.markRow && i <= dragInfoItem.theme && j <= dragInfoItem.row ) {
                    console.log("top",dragInfoItem.markTheme, dragInfoItem.markRow, dragInfoItem.theme, dragInfoItem.row )
                    items[i].push (
                        <div className="item" key={i+100} >
                            <div key="mark" className="mark" style={style.markItem} />
                        </div>
                    )
                }

                if ( i === dragInfoItem.theme && j === dragInfoItem.row ) {
                    items[i].push (
                        <div className="item" index={ `${i}-${j}` } style={{ left:dragInfoItem.left, top:dragInfoItem.top, position:"absolute", transform:"rotate(5deg)" }} key={j}>
                            <div className="itemPointer" onPointerDown={ this.dragItem }></div>
                            <div className="itemHead">
                                <CommentItem item={ texts[i][j] } listIndex={ i } j={ j }/>
                            </div>                              
                            
                            <div className="itemBody">
                                <div className="message">                       
                                    <div className="msgText"> {texts[i][j].text} </div>         
                                    <div className="msgImg"> <img src={ texts[i][j].img } /> </div>
                                </div>
                            </div>
                        </div>
                    )
                } else {
                    items[i].push (
                        <div className="item" index={ `${i}-${j}` } key={j}>
                            <div className="itemPointer" onPointerDown={ this.dragItem }></div>
                            <div className="itemHead">
                                <CommentItem item={ texts[i][j] } listIndex={ i } j={ j }/>
                            </div>                              
                            
                            <div className="itemBody">
                                <div className="message">                       
                                    <div className="msgText"> {texts[i][j].text} </div>         
                                    <div className="msgImg"> <img src={ texts[i][j].img } /> </div>
                                </div>
                            </div>
                        </div>
                    )
                }

                if ( i === dragInfoItem.markTheme && j === dragInfoItem.markRow && i > dragInfoItem.theme && j > dragInfoItem.row ) {
                    console.log("33333333333333",dragInfoItem.markTheme, dragInfoItem.markRow, dragInfoItem.theme, dragInfoItem.row )
                    items[i].push (
                        <div className="item" key={i+300} >
                            <div key="mark" className="mark" style={style.markItem} />
                        </div>
                    )
                }
            }
        }


// drag-drop of themes
        let dragInfo=this.state.dragInfo;
        let elements=[];

            for (let i = 0; i < this.props.listTitle.length; i++) {
                let item = this.props.listTitle[i];
            
                if (i === dragInfo.markIndex && i <= dragInfo.index) {
                    elements.push(
                        <div className="sectionWrapper" index={i} key={i+200}>
                            <div key="mark" className="mark" style={ style.mark } />
                        </div>
                    )
                }

                if (i === dragInfo.index) {
                    elements.push(
                        <div className="sectionWrapper" key={i} index={i} style={{ left:dragInfo.left, top:dragInfo.top, position:"absolute", transform:"rotate(5deg)" }}>
                            <div className="section">
                                <div className="head" onPointerDown={ this.drag }   >
                                    <div className="titleLeft" onPointerDown={this.stopEvent} onClick={ () => this.changeEditMode() }> { item } </div>
                                    <div className="titleRight" onPointerDown={this.stopEvent} onClick={ () => this.openConfirmWin(i) }>
                                        <img src={ Cross } />
                                    </div>
                                </div>

                                <div className="head" style={{ display: this.state.isInEditMode ? 'block' : 'none' }}>
                                    <input className="titleLeftInput" type="text" defaultValue={ this.props.title } ref="theTextInput" />
                                    <div className="titleRight" onClick={ () => this.changeEditMode() }>
                                        <img src={ Letter } />
                                    </div>
                                    <div className="titleRight" onClick={ () => this.updateValue() }>
                                        <img src={ Tick2 } />
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
                                <div className="comment"> { items[i] } </div>
                                <AddComment index={ i }/>
                            </div>
                        </div>
                    )
                } else {
                    elements.push(
                        <div className="sectionWrapper" key={i} index={i}>
                            <div className="section">
                                <div className="head" onPointerDown={ this.drag }  style={{ display: this.state.isInEditMode ? 'none' : 'flex' }} >
                                    <div className="titleLeft" onPointerDown={ this.stopEvent } onClick={ () => this.changeEditMode() }> { item } </div>
                                    <div className="titleRight" onPointerDown={ this.stopEvent } onClick={ () => this.openConfirmWin(i) }>
                                        <img src={ Cross } />
                                    </div>
                                </div>

                                <div className="head" style={{ display: this.state.isInEditMode ? 'block' : 'none' }}>
                                    <input className="titleLeftInput" type="text" defaultValue={ this.props.title } ref="theTextInput" />
                                    <div className="titleRight" onClick={ () => this.changeEditMode() }>
                                        <img src={ Letter } />
                                    </div>
                                    <div className="titleRight" onClick={ () => this.updateValue() }>
                                        <img src={ Tick2 } />
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
                                <div className="comment"> { items[i] } </div>
                                <AddComment index={ i }/>
                            </div>
                        </div>
                    )
                }         
                if (i === dragInfo.markIndex && i > dragInfo.index) {
                    elements.push(
                        <div className="sectionWrapper" index={i} key={i+300}>
                            <div key="mark" className="mark" style={style.mark}  />
                        </div>
                    )
                }
            }        
        return(
            <React.Fragment>
                <div className="board" ref={this.board}>
           		    { elements }
                </div>
            </React.Fragment>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        text: state.text,
        listTitle: state.listTitle,
        addNewCommentOpen: state.addNewCommentOpen,
        deleteThemeConfirmOpen: state.deleteThemeConfirmOpen,
        whichWindowOpen: state.whichWindowOpen,
        commentWindow: state.commentWindow,
        firebaseUid: state.firebaseUid,
        currentBoard: state.currentBoard,
    }
}

export default connect(mapStateToProps)(Section);