import React from "react";
import { connect, Provider } from "react-redux";
import fire from "../src/fire";
import { setUpComWin, renderComments, setIndexForTitle, loadingGifOn, switchBoard } from"../components/actionCreators"
import Topbar from "../components/topbar";
import SecondBar from "../components/secondBar";
import Section from "../components/section";
import loadingGif from "../images/loadingImg.gif";
import Gear from "../images/gear.png";


class Board extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            boardURL: "https://firebasestorage.googleapis.com/v0/b/allo-dc54c.appspot.com/o/homepageCover%2Fmaldives-1993704_1920.jpg?alt=media&token=b17d4f00-7e8f-4e2c-978f-c8ea14bb3a7f",
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
            this.props.switchBoard(this.props.match.params.id)
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
                    background: "https://firebasestorage.googleapis.com/v0/b/allo-dc54c.appspot.com/o/homepageCover%2Fmaldives-1993704_1920.jpg?alt=media&token=b17d4f00-7e8f-4e2c-978f-c8ea14bb3a7f"
                }).then(() => {
                        // 新增初始範例↓
                        let ref = db.collection("Boards/"+ firebaseUid + "/Lists").doc("alloExample")
                        ref.set({
                            title: "Example",
                            index: 2
                        }).then(() => {
                            console.log("Document successfully written!");
                            let ref = db.collection("Boards/"+ firebaseUid + "/Lists/alloExample/Items").doc()
                            ref.set({
                                edited: "Example",
                                editorImg: 2,
                                img:"" ,
                                index:2,
                                owner: "",
                                ownerImg: "",
                                tags:["process"],
                                text: "hello"
                            }).then(() => {
                                props.renderComments(["Example"], [{
                                    edited: "Example",
                                    editorImg: 2,
                                    img:"" ,
                                    index:2,
                                    owner: "",
                                    ownerImg: "",
                                    tags:["process"],
                                    text: "hello"
                                }]);
                                console.log("getTitles(firebaseUid);");
                            }).catch((error) => {
                                console.error("Error removing document: ", error);
                            })
                        }).catch((error) => {
                            console.error("Error removing document: ", error);
                        })
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
        };
    }


    componentDidUpdate(prevProps){

        let props = this.props;

        let currentBoard = this.props.currentBoard
        if ( currentBoard !==  prevProps.currentBoard) {
            props.loadingGifOn();
            //read db
            const db = fire.firestore();
            let firebaseUid = currentBoard;

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
                    ref.set({
                        background: "https://firebasestorage.googleapis.com/v0/b/allo-dc54c.appspot.com/o/homepageCover%2Fmaldives-1993704_1920.jpg?alt=media&token=b17d4f00-7e8f-4e2c-978f-c8ea14bb3a7f"
                    }).then(() => {
                        // 新增初始範例 ↓
                        let ref = db.collection("Boards/"+ firebaseUid + "/Lists").doc("alloExample")
                        ref.set({
                            title: "Welcome to a-llo guide !",
                            index: 2
                        }).then(() => {
                            console.log("Document successfully written!");
                            let ref = db.collection("Boards/"+ firebaseUid + "/Lists/alloExample/Items").doc()
                            ref.set({
                                edited:"offical",
                                editorImg:"https://firebasestorage.googleapis.com/v0/b/allo-dc54c.appspot.com/o/image%2F%E6%9C%AA%E5%91%BD%E5%90%8D.png?alt=media&token=beddf24c-489d-4f33-af81-ccabdfb417d2",
                                img:"" ,
                                index:2,
                                owner:"official",
                                ownerImg:"https://firebasestorage.googleapis.com/v0/b/allo-dc54c.appspot.com/o/image%2F%E6%9C%AA%E5%91%BD%E5%90%8D.png?alt=media&token=beddf24c-489d-4f33-af81-ccabdfb417d2",
                                tags:[],
                                text:`You can add new list by the PLUS in the upper right corner.

                                And add cards at the bottom of 
                                the list which can be included 
                                tags, text and image just like the 
                                card below.
                                
                                To improve your management of schedule, try dragging-dropping
                                between list and card.
                                
                                If you want to edit or delete your cards, try moving your mouse to the the upper right of the card.`
                            })
                            let ref2 = db.collection("Boards/"+ firebaseUid + "/Lists/alloExample/Items").doc()
                            ref2.set({
                                edited:"offical",
                                editorImg:"https://firebasestorage.googleapis.com/v0/b/allo-dc54c.appspot.com/o/image%2F%E6%9C%AA%E5%91%BD%E5%90%8D.png?alt=media&token=beddf24c-489d-4f33-af81-ccabdfb417d2",
                                img:"https://firebasestorage.googleapis.com/v0/b/allo-dc54c.appspot.com/o/image%2F%E6%9C%AA%E5%91%BD%E5%90%8D.png?alt=media&token=beddf24c-489d-4f33-af81-ccabdfb417d2" ,
                                index:4,
                                owner:"official",
                                ownerImg:"https://firebasestorage.googleapis.com/v0/b/allo-dc54c.appspot.com/o/image%2F%E6%9C%AA%E5%91%BD%E5%90%8D.png?alt=media&token=beddf24c-489d-4f33-af81-ccabdfb417d2",
                                tags:["planning", "process"],
                                text:`Now enjoy your experience with 
                                a-llo!`
                            }).then(() => {
                                props.renderComments(["Welcome to a-llo guide !"], [[
                                    {
                                    edited:"offical",
                                    editorImg:"https://firebasestorage.googleapis.com/v0/b/allo-dc54c.appspot.com/o/image%2F%E6%9C%AA%E5%91%BD%E5%90%8D.png?alt=media&token=beddf24c-489d-4f33-af81-ccabdfb417d2",
                                    img:"" ,
                                    index:0,
                                    owner:"offical",
                                    ownerImg:"https://firebasestorage.googleapis.com/v0/b/allo-dc54c.appspot.com/o/image%2F%E6%9C%AA%E5%91%BD%E5%90%8D.png?alt=media&token=beddf24c-489d-4f33-af81-ccabdfb417d2",
                                    tags:[],
                                    text:`You can add new list by the PLUS in the upper right corner.

                                    And add cards at the bottom of 
                                    the list which can be included 
                                    tags, text and image just like the 
                                    card below.
                                    
                                    To improve your management of schedule, try dragging-dropping
                                    between list and card.
                                    
                                    If you want to edit or delete your cards, try moving your mouse to the the upper right of the card.`
                                    },
                                    {
                                    edited:"offical",
                                    editorImg:"https://firebasestorage.googleapis.com/v0/b/allo-dc54c.appspot.com/o/image%2F%E6%9C%AA%E5%91%BD%E5%90%8D.png?alt=media&token=beddf24c-489d-4f33-af81-ccabdfb417d2",
                                    img:"https://firebasestorage.googleapis.com/v0/b/allo-dc54c.appspot.com/o/image%2F%E6%9C%AA%E5%91%BD%E5%90%8D.png?alt=media&token=beddf24c-489d-4f33-af81-ccabdfb417d2" ,
                                    index:1,
                                    owner:"offical",
                                    ownerImg:"https://firebasestorage.googleapis.com/v0/b/allo-dc54c.appspot.com/o/image%2F%E6%9C%AA%E5%91%BD%E5%90%8D.png?alt=media&token=beddf24c-489d-4f33-af81-ccabdfb417d2",
                                    tags:["planning", "process"],
                                    text:`Now enjoy your experience with 
                                    a-llo!`  
                                    }
                                ]]);

                            }).catch((error) => {
                                console.error("Error removing document: ", error);
                            })
                        }).catch((error) => {
                            console.error("Error removing document: ", error);
                        })                      
                        console.log("Document successfully written!");
                    }).catch((error) => {
                        console.error("Error removing document: ", error);
                    })
                }
            })
           
            let myDataTitle = [];
            let myDataText = [];
            let listsId = [];
            let Data = [];  // combine titles and texts
            let Data1 = [];  // store title
            let Data2 = [];  // store comment text
 
            getTitles(firebaseUid);
            async function getTitles(firebaseUid) {  // 每次讀取資料庫就依照定義的 index 逐個抓出來再重新定義一次

                db.collection("Boards/" + firebaseUid + "/Lists").orderBy("index").get()
                .then(async (querySnapshot) => {
                    let doc = querySnapshot.docs;
    
                    for ( let i = 0; i < doc.length; i++ ) {       
                        listsId.push(doc[i].id)
                        let ref = db.collection("Boards/" + firebaseUid + "/Lists").doc(doc[i].id)
                        console.log("getTitles(firebaseUid);",firebaseUid);

                        ref.update({
                            index: (((i+1)*2)),  // 前後留空格讓之後移動可以有空間塞
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
                    for(let i = 0; i < listsId.length; i++ ) {
                        await db.collection("Boards/" + firebaseUid + "/Lists/" + listsId[i] + "/Items").orderBy("index").get()
                        .then((querySnapshot2) => {
                            let doc2 = querySnapshot2.docs;
                            for ( let j = 0; j < doc2.length; j++ ) {
                                let ref = db.collection("Boards/" + firebaseUid + "/Lists/" + listsId[i] + "/Items").doc(doc2[j].id)
                                ref.update({
                                    index: (((j+1)*2)),  // 前後留空格讓之後移動可以有空間塞
                                })           
                                myDataText.push(doc2[j].data())
                            }
                            Data2.push(myDataText);
                            console.log(Data2,"doc2[j].data()doc2[j].data()doc2[j].data()")
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
            };
        }
    }

    fileUpload = (event) => {
        const file = event.target.files[0]
        console.log(event.target.files[0])
        var reader = new FileReader(); 
        const storageRef = fire.storage().ref("homepageCover");
        const imgRef = storageRef.child(file.name)
        const fileTypes = ["image/jpeg", "image/png","image/gif"]; 
        console.log("typetypetypetypetype",file.size)
        let flag = false;
        
            imgRef.put(file)
            .then((snapshot) => {
                for (let i = 0; i < fileTypes.length; i++) {
                    if ( file.type == fileTypes[i] ) { 
                        flag = true
                        if (file.size > 190000 ) {
                        console.log("Uploaded a blob or file!");
                        imgRef.getDownloadURL().then( async (url) => {
                            console.log(url)
                            this.setState( prevState => {
                                let boardURL = url
                                return Object.assign({}, prevState, {
                                    boardURL: boardURL,
                                })
                            });
                            const db = fire.firestore();
                            let firebaseUid = this.props.firebaseUid
                            db.collection("Boards").doc(firebaseUid)
                            .update({
                                background: this.state.boardURL
                            }).then(() => {
                                console.log("Document successfully written!")
                            }).catch((error)=> {
                                console.log("Error writing document: ", error);
                            })
                        })
                        } else { 
                            alert("Oops! Low resolution image.")
                            break;
                        }
                    }  
                }
                if (!flag) {
                    alert("Only support jpeg/png/gif type files.");
                }
            }).catch((error) => {
                console.error("Error removing document: ", error);
        })      
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
        setIndexForTitle: (storeTitleIndex) => { dispatch(setIndexForTitle(storeTitleIndex))},
        loadingGifOn: () => { dispatch(loadingGifOn()) },
        switchBoard: (targetLink) => { dispatch(switchBoard(targetLink)) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Board)