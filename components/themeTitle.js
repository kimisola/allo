// import React from 'react';
// import { connect } from 'react-redux';
// import Comments from "../components/comments";
// import AddComment from "../components/addComment";
// import Cross from "../images/cross.png";
// import Tick2 from "../images/tick2.png";
// import Letter from "../images/letter-x.png";
// import fire from "../src/fire";

// class ThemeTitle extends React.Component {
//     constructor(props){
//         super(props);
//         this.state = {
//             isInEditMode: false,
//             dragInfo: {
//                 left:"auto",
//                 top:"auto",
//                 index:-1,
//                 markIndex:-1
//             }
//         }
//         this.drag = this.drag.bind(this);
//     }

//     openConfirmWin = (i) => {
//         console.log("run openConfirmWin")
//         console.log(i)
//         this.props.dispatch({ type: "deleteThemeConfirmOpen", i })
//     }

//     deleteTheme = () => {
//         let t = this.props.whichWindowOpen
//         console.log("run delete theme")
//         console.log(this.props.whichWindowOpen)

//         const db = fire.firestore();
//         let firebaseUid = "";
//         if ( this.props.currentBoard !== "" ) {
//             firebaseUid = this.props.currentBoard
//         } else {
//             firebaseUid = this.props.firebaseUid
//         } 

//         db.collection("Boards/" + firebaseUid + "/Lists").where("index", "==", ((t+1)*2)).get()
//         .then((querySnapshot) => {
//             console.log(querySnapshot.docs[0].id)
//             let docId = querySnapshot.docs[0].id

//             //避免誤刪 code 維持 get 改成 delete 就可以刪除了
//             db.collection("Boards/" + firebaseUid + "/Lists").doc(docId).delete()
//             .then(() => {
//                 console.log("Document successfully deleted!", t);
//                 this.props.dispatch({ type: "deleteTheme", t })
//                 this.props.dispatch({ type: "deleteThemeConfirmOpen" })
//                 db.collection("Boards/" + firebaseUid + "/Lists").orderBy("index").get()
//                 .then(async (querySnapshot) => {
//                     let doc = querySnapshot.docs;
//                     for ( let i = 0; i < doc.length; i++ ) {       
//                         let ref = db.collection("Boards/" + firebaseUid + "/Lists").doc(doc[i].id)
//                         ref.update({
//                             index: (((i+1)*2))  // 重新塞一次 index 給它
//                         })
//                     }
//                 })
//             }).catch((error) => {
//                 console.error("Error removing document: ", error);
//             })
//         })
//     }

//     changeEditMode = () => {
//         console.log("run changeEditMode")
        
//         this.setState( prevState => {
//             let isInEditMode = true
//             return { isInEditMode: isInEditMode }
//         });
//         console.log("should go to changeEditMode", this.state.isInEditMode)
//     }

//     updateValue = () => {
//         let newValue = this.refs.theTextInput.value
//         let indexOfValue = this.props.indexWin

//         if ( newValue.length > 14 ) {
//             alert("標題太長囉、再短一點!")
//         } else {
//             this.props.dispatch({ type: "getEditedTitleValue", newValue, indexOfValue})
//             this.setState({
//                 isInEditMode: false
//             });

//             const db = fire.firestore();
//             const firebaseUid  = this.props.firebaseUid;
//             db.collection("Boards/" + firebaseUid + "/Lists").where("index", "==", ((indexOfValue+1)*2)).get()
//             .then((querySnapshot) => {
//                 let docId = querySnapshot.docs[0].id
    
//                 db.collection("Boards/" + firebaseUid + "/Lists").doc(docId)
//                 .update({
//                     title: newValue,
//                     index: ((indexOfValue+1)*2)
//                 }).then(() => {
//                     console.log("Document successfully written!");
//                 }).catch((error) => {
//                     console.error("Error removing document: ", error);
//                 })
//             }) 
//         }
//     }

//     renderEditView = () => {
//         return (
//             <React.Fragment>
//             <div className="head" onDoubleClick={ () => this.changeEditMode() }>
//                 <input className="titleLeftInput" type="text" defaultValue={ this.props.title } ref="theTextInput" />
//                 <div className="titleRight" onClick={ () => this.changeEditMode() }>
//                     <img src={ Letter } />
//                 </div>
//                 <div className="titleRight" onClick={ () => this.updateValue() }>
//                     <img src={ Tick2 } />
//                 </div>
//             </div>
//             </React.Fragment>
//         )
//     }

//     // drag and drop
//     drag(e) {　　// 滑鼠按下去的想做的事情
//         e.preventDefault();
//         e.stopPropagation();
//         let theme = e.currentTarget.parentElement.parentElement;
//         let index = parseInt(this.props.themeIndex);
//         let rect = theme.getBoundingClientRect();
//         let offset = {  // 滑鼠所在位置到該 div 最左上的座標的距離  → rect.x y 所指 div 最左上角的座標
//                 x:e.clientX - rect.x,
//                 y:e.clientY - rect.y
//             };
//         let x = e.clientX - offset.x;  // 這裡的 x y 是取得 div 最左上角為起點的座標數字 
//         let y = e.clientY - offset.y;
//         console.log("xxxxxxxxx", index)
//         console.log("yyyyyyyyy", offset)
//         console.log("3333333333", rect)
//         this.setState({
//                 dragInfo:{
//                 left:x, top:y, index:index, markIndex:index
//             }
//         });

//         const move = (e) => {  // 滑鼠移動想做的事情
//             e.preventDefault();
//             e.stopPropagation();
//             let x = e.clientX - offset.x;
//             let y = e.clientY - offset.y;
//             let themeWidth = 295;
//             let markIndex = Math.floor(( x + rect.width/2 ) / themeWidth);
//             if ( markIndex < 0 ) {
//                 markIndex = 0;
//             }else if ( markIndex > this.props.listTitle.length-1 ) {
//                 markIndex = this.props.listTitle.length-1;
//             }
//             this.setState({
//                 dragInfo: {
//                     left:x, top:y, index:index, markIndex:markIndex
//                 }});
//         };

//         let up = (e) => {  // 滑鼠放開的時候想做的事情，最後把監聽事件移除
            
//             e.preventDefault();
//             e.stopPropagation();

//             let sourceIndex = index
//             let destinationIndex = this.state.dragInfo.markIndex
//             this.props.dispatch({ type: "drag-dropTheme", sourceIndex, destinationIndex  })
//             this.setState((preState)=>{
//                 return {
//                     dragInfo:{left:"auto", top:"auto", index:-1, markIndex:-1}
//                 };
//             });
//             document.removeEventListener("pointermove", move);
//             document.removeEventListener("pointerup", up);

//             // write in db
//             const db = fire.firestore();
//             let firebaseUid = this.props.firebaseUid;
//             db.collection("Boards/" + firebaseUid + "/Lists").where("index", "==", ((sourceIndex+1)*2)).get()
//             .then((querySnapshot) => {
//                 let docId = querySnapshot.docs[0].id
//                 let ref =  db.collection("Boards/" + firebaseUid + "/Lists").doc(docId)
//                 console.log(destinationIndex)
//                 console.log(((destinationIndex+1)*2)-1)
//                 ref.update({
//                     index: ((destinationIndex+1)*2)-1
//                 })
//             })
//             .then(() => {
//                 db.collection("Boards/" + firebaseUid + "/Lists").orderBy("index").get()
//                 .then(async (querySnapshot) => {
//                 let doc = querySnapshot.docs;
//                 for ( let i = 0; i < doc.length; i++ ) {       
//                     let ref = db.collection("Boards/" + firebaseUid + "/Lists").doc(doc[i].id)
//                     ref.update({
//                         index: (((i+1)*2))
//                         })
//                     }
//                 });
//             })
//         };
//         document.addEventListener("pointermove", move);
//         document.addEventListener("pointerup", up);
//     }


//     stopEvent = (e) => {
//         console.log("run stopEvent")
//         e.preventDefault();
//         e.stopPropagation();
//     }

//     // renderDefaultView = () => {
    
//     //     return (
//     //         <React.Fragment>
//     //         <div className="head" onDoubleClick={ () => this.changeEditMode() }>
//     //             <div className="titleLeft"> { this.props.title } </div>
//     //             <div className="titleRight" onClick={ () => this.openConfirmWin(this.props.indexWin) }>
//     //                 <img src={ Cross } />
//     //             </div>
//     //         </div>

//     //         <div className="addThemeDiv" style={{ display: this.props.deleteThemeConfirmOpen ? 'block' : 'none' }}>
//     //             <div className="addTheme">
//     //                 <p>確定要刪除該列表嗎？</p>
//     //                 <div className="buttons">
//     //                     <div className="no" onClick={ this.openConfirmWin }>取消</div>
//     //                     <div className="yes" onClick={ this.deleteTheme }>確定</div>
//     //                 </div>
//     //             </div>
//     //         </div>
//     //         </React.Fragment>
//     //     )
//     // }

//     render() {

//         const style = {
//             mark: {
//                 backgroundColor: "rgba(254, 246, 251, 0.36)",
//                 borderRadius: "10px",
//                 width: "275px", 
//                 height: "574px", 
//             }
//         }

//         let dragInfo=this.state.dragInfo;
//         let elements=[];
//         let item;
//         let i = this.props.themeIndex
//         item  = this.props.listTitle[i];

//         if (i === dragInfo.markIndex && i <= dragInfo.index) {
//             elements.push(
//                 <div className="sectionWrapper"  style={style.mark} key={i+2}>
//                     <div key="mark" className="mark"/>
//                 </div>
//             )
//         }

//         if (i === dragInfo.markIndex && i > dragInfo.index){
//             elements.push(
//                 <div className="sectionWrapper"  style={style.mark} key={i+4}>
//                     <div key="mark" className="mark"/>
//                 </div>
//             );
//         }

//         if (i === dragInfo.index) {

//             elements.push(
//                 <div className="section" key={i} style={{ left:dragInfo.left, top:dragInfo.top, position:"absolute", transform:"rotate(8deg)" }}>
//                     <div className="head" onPointerDown={this.drag} index={i}  >
//                         <div className="titleLeft" onPointerDown={this.stopEvent} onClick={ () => this.changeEditMode() }> { item } </div>
//                         <div className="titleRight" onPointerDown={this.stopEvent} onClick={ () => this.openConfirmWin(this.props.indexWin) }>
//                             <img src={ Cross } />
//                         </div>
//                     </div>

//                     <div className="head" style={{ display: this.props.isInEditMode ? 'block' : 'none' }}>
//                         <input className="titleLeftInput" type="text" defaultValue={ this.props.title } ref="theTextInput" />
//                         <div className="titleRight" onClick={ () => this.changeEditMode() }>
//                             <img src={ Letter } />
//                         </div>
//                         <div className="titleRight" onClick={ () => this.updateValue() }>
//                             <img src={ Tick2 } />
//                         </div>
//                     </div>

//                     <div className="addThemeDiv" style={{ display: this.props.deleteThemeConfirmOpen ? 'block' : 'none' }}>
//                         <div className="addTheme">
//                             <p>確定要刪除該列表嗎？</p>
//                             <div className="buttons">
//                                 <div className="no" onClick={ this.openConfirmWin }>取消</div>
//                                 <div className="yes" onClick={ this.deleteTheme }>確定</div>
//                             </div>
//                         </div>
//                     </div>

//                     <Comments listIndex={ i }/>
//                     <AddComment index={ i }/>
//                 </div>
//             )
//         } else {
//             elements.push(
//                 <div className="section" key={i}>
//                     <div className="head" onPointerDown={this.drag} index={i} style={{ display: this.props.isInEditMode ? 'none' : 'flex' }} >
//                         <div className="titleLeft" onPointerDown={this.stopEvent} onClick={ () => this.changeEditMode() }> { item } </div>
//                         <div className="titleRight" onPointerDown={this.stopEvent} onClick={ () => this.openConfirmWin(this.props.indexWin) }>
//                             <img src={ Cross } />
//                         </div>
//                     </div>

//                     <div className="head" style={{ display: this.props.isInEditMode ? 'block' : 'none' }}>
//                         <input className="titleLeftInput" type="text" defaultValue={ this.props.title } ref="theTextInput" />
//                         <div className="titleRight" onClick={ () => this.changeEditMode() }>
//                             <img src={ Letter } />
//                         </div>
//                         <div className="titleRight" onClick={ () => this.updateValue() }>
//                             <img src={ Tick2 } />
//                         </div>
//                     </div>

//                     <div className="addThemeDiv" style={{ display: this.props.deleteThemeConfirmOpen ? 'block' : 'none' }}>
//                         <div className="addTheme">
//                             <p>確定要刪除該列表嗎？</p>
//                             <div className="buttons">
//                                 <div className="no" onClick={ this.openConfirmWin }>取消</div>
//                                 <div className="yes" onClick={ this.deleteTheme }>確定</div>
//                             </div>
//                         </div>
//                     </div>

//                     <Comments listIndex={ i }/>
//                     <AddComment index={ i }/>
//                 </div>
//             )

//         }

//         return (
//             <React.Fragment>
//            		{elements}
//             </React.Fragment>
//         )
//     }
// }

// const mapStateToProps = (state ,ownprops) => {
//     return {
//         text: state.text,
//         listTitle: state.listTitle,
//         title: ownprops.title,
//         firebaseUid: state.firebaseUid,
//         indexWin: ownprops.indexWin,
//         deleteThemeConfirmOpen: state.deleteThemeConfirmOpen,
//         whichWindowOpen: state.whichWindowOpen,
//         firebaseUid: state.firebaseUid,
//         currentBoard: state.currentBoard,
//         themeIndex: ownprops.themeIndex,
//     }
// }

// export default connect(mapStateToProps)(ThemeTitle)