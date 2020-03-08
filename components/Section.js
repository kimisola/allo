import React from "react";
import { connect } from "react-redux";
import { accessOrderByMethod } from "../library/accessDb";
import SectionItem from "./drag-dropSectionComment/SectionItem";
import SectionItemMark from "./drag-dropSectionComment/SectionItemMark";
import SectionItemTransform from "./drag-dropSectionComment/SectionItemTransform";
import SectionWrapper from "./drag-dropSectionWrapper/SectionWrapper";
import SectionWrapperMark from "./drag-dropSectionWrapper/SectionWrapperMark";
import SectionWrapperTransform from "./drag-dropSectionWrapper/SectionWrapperTransform";
import { db } from "../src/fire";

class Section extends React.Component {
    constructor(props){
        super(props);
        this.board = React.createRef();
        this.state = {
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
            } else if ( markIndex > this.props.listTitle.length-1 ) {
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
            let rowHeight = 130;
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
            } else if ( markRow > this.props.text[markTheme].length ) {
                markRow = this.props.text[markTheme].length;
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
                        sourceItem.delete()
                        .catch((error) => {
                            console.error("Error removing document: ", error);
                        });

                        db.collection("Boards/" + firebaseUid + "/Lists").where("index", "==", ((destinationTheme+1)*2)).get()
                        .then((querySnapshot) => {
                            let destinationTheme = querySnapshot.docs[0].id
                            dbData[0].index = ((destinationRow + 1)*2 )-1
                            console.log("destinationRow", destinationRow, dbData[0])

                            const ref = db.collection("Boards/" + firebaseUid + "/Lists/"+ destinationTheme +"/Items").doc()
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
            items.push([]);  // 關鍵在 push 的先後順序
            for ( let j = 0; j < texts[i].length; j++ ) {
                // 因為是往上拖曳， j <= 原本所在的位置所以要先 push mark 使他先渲染出來
                if ( i === dragInfoItem.markTheme && j === dragInfoItem.markRow && j <= dragInfoItem.row ) { 
                    items[i].push (<SectionItemMark key={ `${i}SectionItemMark${j}` } style={ style }/>)
                }

                // 渲染抓取的目標物(傾斜)
                if ( i === dragInfoItem.theme && j === dragInfoItem.row ) { 
                    items[i].push (<SectionItemTransform key={ `${i}SectionItemTransform${j}` } i={ i } j={ j } texts={ texts } dragItem={ this.dragItem } dragInfoItem={ dragInfoItem }/>)
                } else {
                    // 留言拖曳到不同主題時的情境。因為如果 j 往下拖曳到大於自己原本所在的位置時，會先經過 else 的判斷式，先渲染出沒有拖曳事件的 component，
                    // 程式再往下跑到 314 行渲染出大於時的 mark，所以這邊要先判斷是否是拖曳到不同主題，且往下拖曳
                    if ( i === dragInfoItem.markTheme && j === dragInfoItem.markRow && i !== dragInfoItem.theme && j > dragInfoItem.row ) {
                        items[i].push (<SectionItemMark key={ `${i}SectionItemMark${j}` } style={ style }/>)
                    }
                    items[i].push (<SectionItem key={ `${i}SectionItem${j}` } i={ i } j={ j } texts={ texts } dragItem={ this.dragItem }/>)
                }   // ↑ 沒有 drag-drop 事件時的渲染

                // 因為是往下拖曳， j > 原本所在的位置所以是後 push mark
                if ( i === dragInfoItem.markTheme && j === dragInfoItem.markRow && i === dragInfoItem.theme && j > dragInfoItem.row ) { 
                    items[i].push (<SectionItemMark key={ `${i}SectionItemMark${j}` } style={ style }/>)
                }
            }
            // 當把 item 跨主題移動到未有留言的主題或是跨主題的最下方(因為該主題的留言長度會維持原樣，所以如果多塞一個 item 到最下方，j 會進不了 for 迴圈，所以會無法顯示 mark)
            if ( i === dragInfoItem.markTheme && texts[i].length === dragInfoItem.markRow) {  
                items[i].push (<SectionItemMark key={ `${i}SectionItemMark${texts[i].length}` } style={ style }/>)
            }
        }


// drag-drop of themes
        const dragInfo = this.state.dragInfo;
        let elements = [];

        for (let i = 0; i < this.props.listTitle.length; i++) {
            let item = this.props.listTitle[i];

            if (i === dragInfo.markIndex && i <= dragInfo.index) {
                elements.push(<SectionWrapperMark key={ `${i}SectionWrapperMark` } i={ i } style={ style }/>)
            }

            if (i === dragInfo.index) {
                elements.push(<SectionWrapperTransform key={ `${i}SectionWrapperTransform` } i={ i } stopEvent={ this.stopEvent } items={ items } item={ item } dragList = { this.dragList } dragInfo={ dragInfo }/>)
            } else {
                elements.push(<SectionWrapper key={ `${i}SectionWrapper` } i={ i } stopEvent={ this.stopEvent } items={ items } item={ item } dragList = { this.dragList }/>)
            }

            if (i === dragInfo.markIndex && i > dragInfo.index) {
                elements.push(<SectionWrapperMark key={ `${i}SectionWrapperMark` } i={ i } style={ style }/>)
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
        firebaseUid: state.board.firebaseUid,
        currentBoard: state.board.currentBoard,
    }
}
export default connect(mapStateToProps)(Section);