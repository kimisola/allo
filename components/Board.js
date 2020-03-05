import React from "react";
import { connect } from "react-redux";
import fire from "../src/fire";
import { db } from "../src/fire";
import { setCommentData, setIndexForTitle, turnOnLoadingGif, switchBoard } from "./ActionCreators"
import { lib_fileUpload } from "../library/lib";
import Topbar from "./TopBar";
import SecondBar from "./SecondBar";
import Section from "./Section";
import loadingGif from "../images/loadingImg.gif";
import Gear from "../images/gear.png";


class Board extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            boardURL: "https://firebasestorage.googleapis.com/v0/b/allo-dc54c.appspot.com/o/homepageCover%2Fmaldives-1993704_1920.jpg?alt=media&token=b17d4f00-7e8f-4e2c-978f-c8ea14bb3a7f",
            exampleImg: "https://firebasestorage.googleapis.com/v0/b/allo-dc54c.appspot.com/o/image%2Fwelcome.png?alt=media&token=7a5e1d96-87c0-4a51-8dfc-e7c98b67579c",
            exampleAuthor: "https://firebasestorage.googleapis.com/v0/b/allo-dc54c.appspot.com/o/image%2F%E6%9C%AA%E5%91%BD%E5%90%8D.png?alt=media&token=264bf4c3-e1ed-42bd-8291-4928859932f7",
        }
        this.lib_fileUpload = lib_fileUpload.bind(this)
    }

    componentDidMount() {
        // const db = fire.firestore();
        const props = this.props;
        props.turnOnLoadingGif();
        
        let myDataTitle = [];
        let myDataText = [];
        let listsId = [];
        let Data = [];  //主題留言 combine 在一起
        let Data1 = [];  //儲存主題
        let Data2 = [];  //儲存留言
        let firebaseUid = "";
        if (firebaseUid == null) {  //未登入
            window.location = "/";
        } 
        else {
            firebaseUid = this.props.match.params.id 
            this.props.switchBoard(this.props.match.params.id)
            getTitles(firebaseUid);
        }

        db.collection("Boards").doc(firebaseUid).get()
        .then((querySnapshot) => {
            if( querySnapshot.data() !== undefined ){
                this.setState(() => {
                    const boardURL = querySnapshot.data().background
                    return { 
                        boardURL: boardURL,
                    }
                }); 
            } else {
                const ref = db.collection("Boards").doc(firebaseUid)
                ref.update({
                    background: "https://firebasestorage.googleapis.com/v0/b/allo-dc54c.appspot.com/o/homepageCover%2Fmaldives-1993704_1920.jpg?alt=media&token=b17d4f00-7e8f-4e2c-978f-c8ea14bb3a7f"
                }).catch((error) => {
                    console.error("Error removing document: ", error);
                })
            }
        })

        const userEmail = this.props.userEmail
        async function getTitles(firebaseUid) {  //每次讀取資料庫就依照定義的 index 逐個抓出來再重新定義一次
            db.collection("Boards/").doc(firebaseUid).get().then((querySnapshot)=>{
                if (querySnapshot.data() === undefined ) {
                    const ref = db.collection("Boards").doc(firebaseUid)
                    ref.update({
                        owner : userEmail
                    }).catch((error) => {
                        console.error("Error removing document: ", error.message);
                    })
                }
            })

            db.collection("Boards/" + firebaseUid + "/Lists").orderBy("index").get()
            .then(async (querySnapshot) => {
                const doc = querySnapshot.docs;
                for ( let i = 0; i < doc.length; i++ ) {       
                    listsId.push(doc[i].id)
                    let ref = db.collection("Boards/" + firebaseUid + "/Lists").doc(doc[i].id)
                    ref.update({
                        index: (((i+1)*2))  //前後留空格讓之後移動可以有空間塞
                    })
                    myDataTitle.push(doc[i].data().title)
                    Data1.push(myDataTitle[i]);

                    if ( i === doc.length - 1 ) {
                        let storeTitleIndex = ((doc.length+1)*2)
                        props.setIndexForTitle(storeTitleIndex)
                    }
                }
                getCommentText();
            });

            async function getCommentText(){
                for(let i = 0; i < listsId.length; i++ ) {
                    await db.collection("Boards/" + firebaseUid + "/Lists/" + listsId[i] + "/Items").orderBy("index").get()
                    .then((querySnapshot2) => {
                        let doc2 = querySnapshot2.docs;
                        for ( let j = 0; j < doc2.length; j++ ) {
                            let ref = db.collection("Boards/" + firebaseUid + "/Lists/" + listsId[i] + "/Items").doc(doc2[j].id)
                            ref.update({
                                index: (((j+1)*2)),
                            })           
                            myDataText.push(doc2[j].data())
                        }
                        Data2.push(myDataText);
                        myDataText = [];  //重置陣列為空陣列
                    })
                } combineData();
            }
        }

        function combineData() { 
            for (let k = 0; k < Data1.length; k++) {
                Data.push(Data1[k]);
                Data.push(Data2[k]);
            }
            props.setCommentData(Data1, Data2);
        };
    }

    componentDidUpdate(prevProps){
        let props = this.props;
        let currentBoard = this.props.currentBoard
        if ( currentBoard !==  prevProps.currentBoard) {
            props.turnOnLoadingGif();
            // const db = fire.firestore();
            let firebaseUid = currentBoard;

            db.collection("Boards").doc(firebaseUid).get()
            .then((querySnapshot) => {
                if( querySnapshot.data() !== undefined ){
                    this.setState(() => {
                        const boardURL = querySnapshot.data().background
                        return { 
                            boardURL: boardURL,
                        }
                    }); 
                } else {
                    const ref = db.collection("Boards").doc(firebaseUid)
                    ref.set({
                        background: "https://firebasestorage.googleapis.com/v0/b/allo-dc54c.appspot.com/o/homepageCover%2Fmaldives-1993704_1920.jpg?alt=media&token=b17d4f00-7e8f-4e2c-978f-c8ea14bb3a7f"
                    }).then(() => {
                        //新增初始範例
                        props.setCommentData(["Welcome to a-llo guide !","List"], [
                            [{
                            edited:"a-llo",
                            editorImg: this.state.exampleAuthor,
                            img:"" ,
                            index:0,
                            owner:"a-llo",
                            ownerImg:this.state.exampleAuthor,
                            tags:[],
                            text:`To add your new list, press the
                            plus(+) button in the upper right corner of the page.
                            
                            At the bottom of the list, use the plus button to create cards which can include texts, images, and
                            tags.
                            
                            Need to edit or delete 
                            your cards? 
                            Click the upper right of the card.
                            
                            Small tips here, 
                            try dragging-dropping your lists or cards to manage schedule 
                            even more quickly.
                            
                            Now enjoy it !`
                            }],
                            [{
                            edited:"a-llo",
                            editorImg:this.state.exampleAuthor,
                            img: this.state.exampleImg,
                            index:2,
                            owner:"a-llo",
                            ownerImg:this.state.exampleAuthor,
                            tags:["planning"],
                            text:"",
                            },
                            {
                            edited:"a-llo",
                            editorImg:this.state.exampleAuthor,
                            img:"" ,
                            index:4,
                            owner:"a-llo",
                            ownerImg:this.state.exampleAuthor,
                            tags:["process","risk"],
                            text:`card` 
                            },
                            {
                            edited:"a-llo",
                            editorImg:this.state.exampleAuthor,
                            img:"" ,
                            index:6,
                            owner:"a-llo",
                            ownerImg:this.state.exampleAuthor,
                            tags:["process","risk","achived"],
                            text:`card`
                            }]
                        ]);
                        const ref = db.collection("Boards/"+ firebaseUid + "/Lists").doc("alloExample")
                        ref.set({
                            title: "Welcome to a-llo guide !",
                            index: 2
                        }).then(() => {
                            const ref = db.collection("Boards/"+ firebaseUid + "/Lists/alloExample/Items").doc()
                            ref.set({
                                edited:"a-llo",
                                editorImg:this.state.exampleAuthor,
                                img:"" ,
                                index:2,
                                owner:"a-llo",
                                ownerImg:this.state.exampleAuthor,
                                tags:[],
                                text:`To add your new list, press the
                                plus(+) button in the upper right corner of the page.
                                
                                At the bottom of the list, use the plus button to create cards which can include texts, images, and
                                tags.
                                
                                Need to edit or delete 
                                your cards? 
                                Click the upper right of the card.
                                
                                Small tips here, 
                                try dragging-dropping your lists or cards to manage schedule 
                                even more quickly.
                                
                                Now enjoy it !`
                            }).then(()=>{
                                console.log("Document successfully written!");
                            }).catch((error) => {
                                console.error("Error removing document: ", error.message);
                            })
                        }).catch((error) => {
                            console.error("Error removing document: ", error.message);
                        })                      
                    }).then(()=>{
                        const ref = db.collection("Boards/"+ firebaseUid + "/Lists").doc("alloExample2")
                        ref.set({
                            title: "List",
                            index: 4
                        }).then(() => {
                            const ref = db.collection("Boards/"+ firebaseUid + "/Lists/alloExample2/Items").doc()
                            ref.set({
                                edited:"a-llo",
                                editorImg:this.state.exampleAuthor,
                                img:this.state.exampleImg,
                                index:2,
                                owner:"a-llo",
                                ownerImg:this.state.exampleAuthor,
                                tags:["planning"],
                                text:"",
                            })
                            const ref2 = db.collection("Boards/"+ firebaseUid + "/Lists/alloExample2/Items").doc()
                            ref2.set({
                                edited:"a-llo",
                                editorImg:this.state.exampleAuthor,
                                img:"" ,
                                index:4,
                                owner:"a-llo",
                                ownerImg:this.state.exampleAuthor,
                                tags:["process","risk"],
                                text:`card`
                            })
                            const ref3= db.collection("Boards/"+ firebaseUid + "/Lists/alloExample2/Items").doc()
                            ref3.set({
                                edited:"a-llo",
                                editorImg:this.state.exampleAuthor,
                                img:"" ,
                                index:6,
                                owner:"a-llo",
                                ownerImg:this.state.exampleAuthor,
                                tags:["process","risk","achived"],
                                text:`card`
                            })
                        })
                    })
                    .catch((error) => {
                        console.error("Error removing document: ", error.message);
                    })
                }
            })
           
            let myDataTitle = [];
            let myDataText = [];
            let listsId = [];
            let Data = [];
            let Data1 = [];
            let Data2 = [];
 
            getTitles(firebaseUid);
            async function getTitles(firebaseUid) {

                db.collection("Boards/" + firebaseUid + "/Lists").orderBy("index").get()
                .then(async (querySnapshot) => {
                    const doc = querySnapshot.docs;
                    for ( let i = 0; i < doc.length; i++ ) {       
                        listsId.push(doc[i].id)
                        let ref = db.collection("Boards/" + firebaseUid + "/Lists").doc(doc[i].id)
                        ref.update({
                            index: (((i+1)*2)),
                        })
                        myDataTitle.push(doc[i].data().title)
                        Data1.push(myDataTitle[i]);
                        if ( i === doc.length - 1 ) {
                            let storeTitleIndex = ((doc.length+1)*2)
                            props.setIndexForTitle(storeTitleIndex)
                        }
                    }
                    getCommentText();
                });
    
                async function getCommentText(){
                    for(let i = 0; i < listsId.length; i++ ) {
                        await db.collection("Boards/" + firebaseUid + "/Lists/" + listsId[i] + "/Items").orderBy("index").get()
                        .then((querySnapshot2) => {
                            const doc2 = querySnapshot2.docs;
                            for ( let j = 0; j < doc2.length; j++ ) {
                                const ref = db.collection("Boards/" + firebaseUid + "/Lists/" + listsId[i] + "/Items").doc(doc2[j].id)
                                ref.update({
                                    index: (((j+1)*2)),
                                })           
                                myDataText.push(doc2[j].data())
                            }
                            Data2.push(myDataText);
                            myDataText = [];
                        })
                    } combineData();
                }
            }
    
            function combineData() { 
                for (let k = 0; k < Data1.length; k++) {
                    Data.push(Data1[k]);
                    Data.push(Data2[k]);
                }
                props.setCommentData(Data1, Data2);
            };
        }
    }

    fileUpload = (event) => {
        const file = event.target.files[0]
        this.lib_fileUpload("boardBackground", file)
    }

    render(){

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
                <main  style={ style.backgroundStyle} >
                    <div className="loading"  style={{display: this.props.isBoardLoaded ? 'none' : 'block' }} > 
                        <img src={ loadingGif } />
                    </div>
                    <div className="view" style={{display: this.props.isBoardLoaded ? 'block' : 'block' }} >
                        <Topbar />
                        <SecondBar />
                        <Section />
                    </div>
                    <label action="/somewhere/to/upload" encType="multipart/form-data" className="uploadBackground">
                        <img src={ Gear } />
                        <input name="progressbarTW_img" type="file" accept="image/gif, image/jpeg, image/png" onChange={ this.fileUpload } style={{display:'none' }} />
                    </label>
                </main>             
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
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
        setCommentData: (Data1, Data2) => { dispatch(setCommentData(Data1, Data2)) },
        setIndexForTitle: (storeTitleIndex) => { dispatch(setIndexForTitle(storeTitleIndex))},
        turnOnLoadingGif: () => { dispatch(turnOnLoadingGif()) },
        switchBoard: (targetLink) => { dispatch(switchBoard(targetLink)) },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Board)