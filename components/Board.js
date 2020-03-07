import React from "react";
import { connect } from "react-redux";
import { db } from "../src/fire";
import { setCommentData, setIndexForTitle, turnOnLoadingGif, switchBoard } from "../actions/actionCreators"
import { uploadBackgroundImg } from "../library/lib";
import { setGuideData } from "../library/guide";
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
        this.uploadBackgroundImg = uploadBackgroundImg.bind(this);
        this.setGuideData = setGuideData.bind(this);
    }

    componentDidMount() {
        const props = this.props;
        props.turnOnLoadingGif();
        
        let firebaseUid = "";
        if (firebaseUid === null) {  //未登入
            window.location = "/";
        } 
        else {
            firebaseUid = this.props.match.params.id 
            this.props.switchBoard(this.props.match.params.id)
            this.getCurrentBoardData(firebaseUid);
        }

        db.collection("Boards").doc(firebaseUid).get()
        .then((querySnapshot) => {
            console.log(querySnapshot.data(), "querySnapshot.data().background")
            if( querySnapshot.data() !== undefined ){
                this.setState(() => {
                    const boardURL = querySnapshot.data().background
                    return { 
                        boardURL: boardURL,
                    }
                }); 
            } else {
                const ref = db.collection("Boards").doc(firebaseUid)
                const userEmail = this.props.userEmail
                ref.set({
                    background: "https://firebasestorage.googleapis.com/v0/b/allo-dc54c.appspot.com/o/homepageCover%2Fmaldives-1993704_1920.jpg?alt=media&token=b17d4f00-7e8f-4e2c-978f-c8ea14bb3a7f",
                    owner: userEmail
                }).then(()=>{
                    console.log("222222222", querySnapshot.data())
                })
                .catch((error) => {
                    console.error("Error removing document: ", error);
                })
            }
        })

        // const userEmail = this.props.userEmail
        // db.collection("Boards/").doc(firebaseUid).get().then((querySnapshot)=>{
        //     console.log("222222222", querySnapshot.data().owner)
        //     if (querySnapshot.data().owner === undefined ) {
        //         const ref = db.collection("Boards").doc(firebaseUid)
        //         ref.update({
        //             owner : userEmail
        //         }).catch((error) => {
        //             console.error("Error removing document: ", error.message);
        //         })
        //     }
        // })
    }

    componentDidUpdate(prevProps){
        let props = this.props;
        let currentBoard = this.props.currentBoard
        if ( currentBoard !==  prevProps.currentBoard) {
            props.turnOnLoadingGif();
            this.setGuideData();
            let firebaseUid = currentBoard;
            this.getCurrentBoardData(firebaseUid);
        }
    }

    async getCurrentBoardData(firebaseUid) {
        let props = this.props;
        let myDataTitle = [];
        let myDataText = [];
        let listsId = [];
        let Data = [];
        let Data1 = [];
        let Data2 = [];

        db.collection("Boards/" + firebaseUid + "/Lists").orderBy("index").get()
        .then(async (querySnapshot) => {
            const doc = querySnapshot.docs;
            for ( let i = 0; i < doc.length; i++ ) {       
                listsId.push(doc[i].id)
                const ref = db.collection("Boards/" + firebaseUid + "/Lists").doc(doc[i].id)
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
        
        function combineData() { 
            for (let k = 0; k < Data1.length; k++) {
                Data.push(Data1[k]);
                Data.push(Data2[k]);
            }
            props.setCommentData(Data1, Data2);
        }
    }

    uploadFile = (event) => {
        const file = event.target.files[0]
        this.uploadBackgroundImg("boardBackground", file)
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
                        <input name="progressbarTW_img" type="file" accept="image/gif, image/jpeg, image/png" onChange={ this.uploadFile } style={{display:'none' }} />
                    </label>
                </main>             
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isBoardLoaded: state.board.isBoardLoaded,
        text: state.board.text,
        listTitle: state.board.listTitle,
        isLoggedIn: state.board.isLoggedIn,
        userEmail: state.board.userEmail,
        userDisplayName: state.board.userDisplayName,
        userPhotoURL: state.board.userPhotoURL,
        firebaseUid: state.board.firebaseUid,
        useruid: state.board.useruid,
        currentBoard: state.board.currentBoard
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