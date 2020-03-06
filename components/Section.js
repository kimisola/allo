import React from "react";
import { connect } from "react-redux";
import { accessOrderByMethod } from "../library/accessDb";
import CommentItem from "./CommentItem";
import AddComment from "./AddComment";
import ThemeTitle from "./ThemeTitle";
import fire from "../src/fire";
import { db } from "../src/fire";

class Section extends React.Component {
    constructor(props){
        super(props);
        this.board = React.createRef();
        this.state = {
            //editedMode: [],
            //isInEditMode: false,
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
        this.dragList = this.dragList.bind(this);
        this.dragItem = this.dragItem.bind(this);
        this.accessOrderByMethod = accessOrderByMethod.bind(this);
    }

    addComment = (i) => {
        this.props.dispatch({ type: "addComment", i })
    }

    stopEvent = (e) => {
        e.preventDefault();
        e.stopPropagation();
    }

    dragList(e) {　　//滑鼠按下去的想做的事情
        e.preventDefault();
        e.stopPropagation();
        const theme = e.currentTarget.parentElement.parentElement;
        const index = parseInt(theme.getAttribute("index"));
        const rect = theme.getBoundingClientRect();
        const themeRect = e.currentTarget.parentElement.getBoundingClientRect();
        const themeHeight = themeRect.height
        let offset = {  //滑鼠所在位置到該 div 最左上的座標的距離  → rect.x y 所指 div 最左上角的座標
                x:e.clientX - rect.x,
                y:e.clientY - rect.y
            };
        let x = e.clientX - offset.x;  //這裡的 x y 是取得 div 最左上角為起點的座標數字 
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

        const move = (e) => {  //滑鼠移動想做的事情
            e.preventDefault();
            e.stopPropagation();
            let x = e.clientX - offset.x;
            let y = e.clientY - offset.y;
            const themeWidth = 278;
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

        const up = (e) => {  //滑鼠放開的時候想做的事情，最後把監聽事件移除
            e.preventDefault();
            e.stopPropagation();

            let sourceIndex = index;
            let destinationIndex = this.state.dragInfo.markIndex;
            console.log("sourceIndex , destinationIndex", sourceIndex , destinationIndex)
            this.props.dispatch({ type: "DRAG_DROP_THEME", sourceIndex, destinationIndex  })
            this.setState((preState)=>{
                return {
                    dragInfo:{left:"auto", top:"auto", index:-1, markIndex:-1}
                };
            });
            document.removeEventListener("pointermove", move);
            document.removeEventListener("pointerup", up);

            // const db = fire.firestore();
            let firebaseUid = "";
            if ( this.props.currentBoard.length > 0) {
                firebaseUid = this.props.currentBoard
            } else {
                firebaseUid = this.props.firebaseUid
            } 
            db.collection("Boards/" + firebaseUid + "/Lists").where("index", "==", ((sourceIndex+1)*2)).get()
            .then((querySnapshot) => {
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
            }).then(() => {

                this.accessOrderByMethod(`Boards/${firebaseUid}/Lists`)
                // db.collection("Boards/" + firebaseUid + "/Lists").orderBy("index").get()
                // .then(async (querySnapshot) => {
                // const doc = querySnapshot.docs;
                // for ( let i = 0; i < doc.length; i++ ) {       
                //     let ref = db.collection("Boards/" + firebaseUid + "/Lists").doc(doc[i].id)
                //     ref.update({
                //         index: (((i+1)*2))
                //         })
                //     }
                // })
            }).catch((error)=> {
                console.log("Error writing document: ", error.message);
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
        let offset = {  //滑鼠所在位置到該 div 最左上的座標的距離  → rect.x y 所指 div 最左上角的座標
            x:e.clientX - rect.x,
            y:e.clientY - rect.y
        };
        let x = e.clientX - offset.x;  //這裡的 x y 是取得 div 最左上角為起點的座標數字 
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
            let rowHeight = 200;
            let markTheme = Math.floor((( x + rect.width/2 )+this.board.current.scrollLeft )/ themeWidth);  //代表同主題寬度 x 軸
            let markRow = Math.floor(( y + rect.height/3 ) / rowHeight);  //代表主題內留言高度 y 軸
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
            this.props.dispatch({ type: "DRAG_DROP_TEXT", sourceTheme, sourceRow, destinationTheme, destinationRow })
            this.setState({
                dragInfoItem: { 
                    left:"auto", top:"auto", theme:-1, row:-1, markTheme:-1, markRow:-1 
                }
            })
            document.removeEventListener("pointermove", move);
            document.removeEventListener("pointerup", up);

            // write in db
            // const db = fire.firestore();
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
                                    for ( let i = 0; i < listsId.length; i++ ) {  //讀取每一個 list 底下的 items

                                        this.accessOrderByMethod(`Boards/${firebaseUid}/Lists/${listsId[i]}/Items`)

                                        // db.collection("Boards/" + firebaseUid + "/Lists/" + listsId[i] + "/Items").orderBy("index").get()
                                        // .then((querySnapshot2) => {
                                        //     let doc2 = querySnapshot2.docs;
                                        //     for ( let j = 0; j < doc2.length; j++ ) {
                                        //     let ref = db.collection("Boards/" + firebaseUid + "/Lists/" + listsId[i] + "/Items").doc(doc2[j].id)
                                        //     ref.update({
                                        //         index: (((j+1)*2)), // 前後留空格讓之後移動可以有空間塞
                                        //         })      
                                        //     }
                                        // })
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

    horizontalScroll = (e) => {
        if (e.deltaY !== 0) {
            e.stopPropagation()
            e.preventDefault()
            this.board.current.scrollLeft += e.deltaY
        }
    }

    render() {

        const style = {
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
        const texts = this.props.text;
        let items = [];
        const dragInfoItem = this.state.dragInfoItem;

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
                        <div className="item" index={ `${i}-${j}` } style={{ left:dragInfoItem.left, top:dragInfoItem.top, position:"absolute", transform:"rotate(5deg)", zIndex: "100" }} key={j}>
                            <div className="itemDragArea" onPointerDown={ this.dragItem }></div>
                            <div className="itemHead">
                                <CommentItem item={ texts[i][j] } listIndex={ i } j={ j }/>
                            </div>                              
                            
                            <div className="itemBody">
                                <div className="message">                       
                                    <div className="msgText"> {texts[i][j].text} </div>         
                                    <div className="msgImg">{texts[i][j].img == "" ? "" : <img src={ texts[i][j].img } />}  </div>
                                </div>
                            </div>
                        </div>
                    )
                } else {
                    items[i].push (
                        <div className="item" index={ `${i}-${j}` } key={j}>
                            <div className="itemDragArea" onPointerDown={ this.dragItem }></div>
                            <div className="itemHead">
                                <CommentItem item={ texts[i][j] } listIndex={ i } j={ j }/>
                            </div>                              
                            
                            <div className="itemBody">
                                <div className="message">                       
                                    <div className="msgText"> {texts[i][j].text} </div>         
                                    <div className="msgImg">{texts[i][j].img == "" ? "" : <img src={ texts[i][j].img } />}  </div>
                                </div>
                            </div>
                        </div>
                    )
                }

                if ( i === dragInfoItem.markTheme && j === dragInfoItem.markRow && i > dragInfoItem.theme && j > dragInfoItem.row ) {
                    console.log("bottom",dragInfoItem.markTheme, dragInfoItem.markRow, dragInfoItem.theme, dragInfoItem.row )
                    items[i].push (
                        <div className="item" key={i+300} >
                            <div key="mark" className="mark" style={style.markItem} />
                        </div>
                    )
                }
            }
        }


// drag-drop of themes
        const dragInfo = this.state.dragInfo;
        let elements = [];

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
                    <div className="sectionWrapper" key={i} index={i} style={{ left:dragInfo.left, top:dragInfo.top, position:"absolute", transform:"rotate(5deg)", zIndex: "100" }}>
                        <div className="section">
                            <div className="dragArea" onPointerDown={ this.dragList }></div>
                            <ThemeTitle themeIndex={ i } title={ item }/>
                            <div className="comment" onWheel={(e) => this.stopEvent(e)}> { items[i] } </div>
                            <AddComment index={ i }/>
                        </div>
                    </div>
                )
            } else {
                elements.push(
                    <div className="sectionWrapper" key={i} index={i}>
                        <div className="section">
                            <div className="dragArea" onPointerDown={ this.dragList }></div>
                            <ThemeTitle themeIndex={ i } title={ item }/>
                            <div className="comment" onWheel={(e) => this.stopEvent(e)}> { items[i] } </div>
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
                <div className="board" ref={this.board} onWheel={(e) => this.horizontalScroll(e)}>
           		    { elements }
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        text: state.board.text,
        listTitle: state.board.listTitle,
        // addNewCommentOpen: state.addNewCommentOpen,
        // deleteThemeConfirmOpen: state.deleteThemeConfirmOpen,
        // whichWindowOpen: state.whichWindowOpen,
        // commentWindow: state.commentWindow,
        firebaseUid: state.board.firebaseUid,
        currentBoard: state.board.currentBoard,
    }
}
export default connect(mapStateToProps)(Section);