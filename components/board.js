import React from "react";
import { connect, Provider } from "react-redux";
import fire from "../src/fire";
import { setUpComWin, renderComments, setIndexForTitle, loadingGifOff, loadingGifOn } from"../components/actionCreators"
import Topbar from "../components/topbar";
import SecondBar from "../components/secondBar";
import Section from "../components/section";
import loagingGif from "../images/loadingImg.gif";


class Board extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            boardURL: "https://images.unsplash.com/photo-1578241561880-0a1d5db3cb8a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
        }
    }

    componentDidMount() {
        
        console.log("run componentDidMount")
        let props = this.props;
        props.loadingGifOn();
        //read db
        const db = fire.firestore();
        
        let myDataTitle = [];
        let myDataText = [];
        let listsId = [];
        let Data = [];  // combine titles and texts
        let Data1 = [];  // store title
        let Data2 = [];  // store comment text

        let firebaseUid = "";
      
        if (firebaseUid == null) {  // 未登入
            window.location = "/";
        } 
        else {
            firebaseUid = this.props.match.params.id 
            console.log("0000000000000000", this.props.match.params.id)
            // if ( this.props.match.params.id !== "" ) {
            //     firebaseUid = this.props.match.params.id
            // } else {
            //     firebaseUid = this.props.firebaseUid
            // } 
            // console.log("uiddddddddddddddddd", firebaseUid)
            getTitles(firebaseUid);
        }


// set up or get background image
db.collection("Boards").doc(firebaseUid).get()
.then((querySnapshot) => {
    if( querySnapshot.data() !== undefined ){
        this.setState( prevState => {
            let boardURL = prevState.boardURL
            boardURL = querySnapshot.data().background
            return { 
                boardURL: boardURL,
            }
        }); 
    } else {
        let ref = db.collection("Boards").doc(firebaseUid)
        ref.update({
            background: "https://images.unsplash.com/photo-1578241561880-0a1d5db3cb8a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
        }).then(() => {
            console.log("Document successfully written!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        })
    }
})


        let userEmail = this.props.userEmail
        async function getTitles(firebaseUid) {  // 每次讀取資料庫就依照定義的 index 逐個抓出來再重新定義一次
            db.collection("Boards/").doc(firebaseUid).get().then((querySnapshot)=>{
                if (querySnapshot.data() === undefined ) {
                    let ref = db.collection("Boards").doc(firebaseUid)
                    ref.update({
                        owner : userEmail
                    }).then(() => {
                        console.log("Document successfully written!");
                    }).catch((error) => {
                        console.error("Error removing document: ", error.message);
                    })
                }
            })
            db.collection("Boards/" + firebaseUid + "/Lists").orderBy("index").get()
            .then(async (querySnapshot) => {
                let doc = querySnapshot.docs;

                for ( let i = 0; i < doc.length; i++ ) {       
                    listsId.push(doc[i].id)
                    let ref = db.collection("Boards/" + firebaseUid + "/Lists").doc(doc[i].id)
                    ref.update({
                        index: (((i+1)*2))  // 前後留空格讓之後移動可以有空間塞
                    })
                    myDataTitle.push(doc[i].data().title)
                    Data1.push(myDataTitle[i]);

                    // set an index value for next new added title
                    if ( i === doc.length - 1 ) {
                        let storeTitleIndex = ((doc.length+1)*2)
                        props.setIndexForTitle(storeTitleIndex)
                    }
                }
                getCommentText();
            });

            async function getCommentText(){
                for(let i = 0; i < listsId.length; i++ ) {  //讀取每一個 list 底下的 items
                    await db.collection("Boards/" + firebaseUid + "/Lists/" + listsId[i] + "/Items").orderBy("index").get()
                    .then((querySnapshot2) => {
                        let doc2 = querySnapshot2.docs;
                        for ( let j = 0; j < doc2.length; j++ ) {
                            let ref = db.collection("Boards/" + firebaseUid + "/Lists/" + listsId[i] + "/Items").doc(doc2[j].id)
                            ref.update({
                                index: (((j+1)*2)), // 前後留空格讓之後移動可以有空間塞
                                // edited: "",
                                // owner: ""
                            })           
                            myDataText.push(doc2[j].data())
                        }
                        Data2.push(myDataText);
                        myDataText = []; //reset comments under certain title
                    })
                } combineData();
            }
        }

        function combineData() { 
            for (let k = 0; k < Data1.length; k++) {
                Data.push(Data1[k]);
                Data.push(Data2[k]);
            }
            props.renderComments(Data1, Data2);
           // props.loadingGifOff();         
        };
    }


    // componentDidUpdate(prevProps){

    //     let props = this.props;
    //     // let firebaseUid = this.props.firebaseUid
    //     // if (firebaseUid !== prevProps.firebaseUid) {
    //     let targetURL = this.props.match.params.id
    //     if (targetURL !== prevProps.targetURL) {
    //         //read db
    //         const db = fire.firestore();
    //         let firebaseUid = targetURL;
    //         // if ( this.props.currentBoard !== "" ) {
    //         //     firebaseUid = targetURL
    //         // } else {
    //         //     firebaseUid = targetURL
    //         // }

    //         // set up or get background image
    //         db.collection("Boards").doc(firebaseUid).get()
    //         .then((querySnapshot) => {
    //             if( querySnapshot.data() !== undefined ){
    //                 this.setState( prevState => {
    //                     let boardURL = prevState.boardURL
    //                     boardURL = querySnapshot.data().background
    //                     return { 
    //                         boardURL: boardURL,
    //                     }
    //                 }); 
    //             } else {
    //                 let ref = db.collection("Boards").doc(firebaseUid)
    //                 ref.set({
    //                     background: "https://images.unsplash.com/photo-1578241561880-0a1d5db3cb8a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
    //                 }).then(() => {
    //                     console.log("Document successfully written!");
    //                 }).catch((error) => {
    //                     console.error("Error removing document: ", error);
    //                 })
    //             }
    //         })

           
    //         let myDataTitle = [];
    //         let myDataText = [];
    //         let listsId = [];
    //         let Data = [];  // combine titles and texts
    //         let Data1 = [];  // store title
    //         let Data2 = [];  // store comment text
 
    //         getTitles(firebaseUid);
    //         async function getTitles(firebaseUid) {  // 每次讀取資料庫就依照定義的 index 逐個抓出來再重新定義一次

    //             db.collection("Boards/" + firebaseUid + "/Lists").orderBy("index").get()
    //             .then(async (querySnapshot) => {
    //                 let doc = querySnapshot.docs;
    
    //                 for ( let i = 0; i < doc.length; i++ ) {       
    //                     listsId.push(doc[i].id)
    //                     let ref = db.collection("Boards/" + firebaseUid + "/Lists").doc(doc[i].id)
    //                     ref.update({
    //                         index: (((i+1)*2)),  // 前後留空格讓之後移動可以有空間塞
    //                     })
    //                     myDataTitle.push(doc[i].data().title)
    //                     Data1.push(myDataTitle[i]);
    
    //                     // set an index value for next new added title
    //                     if ( i === doc.length - 1 ) {
    //                         let storeTitleIndex = ((doc.length+1)*2)
    //                         props.setIndexForTitle(storeTitleIndex)
    //                     }
    //                 }
    //                 getCommentText();
    //             });
    
    //             async function getCommentText(){
    //                 for(let i = 0; i < listsId.length; i++ ) {
    //                     await db.collection("Boards/" + firebaseUid + "/Lists/" + listsId[i] + "/Items").orderBy("index").get()
    //                     .then((querySnapshot2) => {
    //                         let doc2 = querySnapshot2.docs;
    //                         for ( let j = 0; j < doc2.length; j++ ) {
    //                             let ref = db.collection("Boards/" + firebaseUid + "/Lists/" + listsId[i] + "/Items").doc(doc2[j].id)
    //                             ref.update({
    //                                 index: (((j+1)*2)),  // 前後留空格讓之後移動可以有空間塞
    //                             })           
    //                             myDataText.push(doc2[j].data())
    //                         }
    //                         Data2.push(myDataText);
    //                         myDataText = []; //reset comments under certain title
    //                     })
    //                 } combineData();
    //             }
    //         }
    
    //         function combineData() { 
    //             for (let k = 0; k < Data1.length; k++) {
    //                 Data.push(Data1[k]);
    //                 Data.push(Data2[k]);
    //             }
    //             props.renderComments(Data1, Data2);
    //            // props.loadingGifOff();   
    //         };
    //     }
    // }

    horizontalScroll = (event) => {
        const delta = Math.max(-1, Math.min(1, (event.nativeEvent.wheelDelta || event.nativeEvent.detail)))
        event.currentTarget.scrollRight += (delta * 10)
        event.preventDefault
    }

    render(){
        console.log("match.params.id,match.params.id",this.props.match.params.id)
        const style = {
            backgroundStyle: {
                backgroundImage: `url("${this.state.boardURL}")`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat'
            }
        };
        

        return(
            <React.Fragment>

                <main style={ style.backgroundStyle} onWheel={(e) => this.horizontalScroll(e)}>
                    <div className="loading"  style={{display: this.props.isBoardLoaded ? 'none' : 'block' }} > 
                        <img src={ loagingGif } />
                    </div>
                    <div className="view" style={{display: this.props.isBoardLoaded ? 'block' : 'block' }} >
                        <Topbar />
                        <SecondBar />
                        <div className="board">                                                         
                            <Section />
                        </div>
                    </div>
                </main>             
 
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    console.log("map state", state.firebaseUid);
    return {
        isBoardLoaded: state.isBoardLoaded,
        text: state.text,
        listTitle: state.listTitle,
        deleteThemeConfirmOpen: state.deleteThemeConfirmOpen,
        whichWindowOpen: state.whichWindowOpen,
        commentWindow: state.commentWindow,
        isLoggedIn: state.isLoggedIn,
        userEmail: state.userEmail,
        userDisplayName: state.userDisplayName,
        userPhotoURL: state.userPhotoURL,
        firebaseUid: state.firebaseUid,
        useruid: state.useruid,
        currentBoard: state.currentBoard
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setUpComWin: (myComWin) => { dispatch(setUpComWin(myComWin)) },
        renderComments: (Data1, Data2) => { dispatch(renderComments(Data1, Data2)) },
        //setCurrentUser: (userDisplayName, userPhotoURL, userEmail, firebaseUid, useruid) => { dispatch(setCurrentUser(userDisplayName, userPhotoURL, userEmail, firebaseUid, useruid)) },
        setIndexForTitle: (storeTitleIndex) => { dispatch(setIndexForTitle(storeTitleIndex))},
        loadingGifOff: () => { dispatch(loadingGifOff()) },
        loadingGifOn: () => { dispatch(loadingGifOn()) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Board)