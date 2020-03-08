import React from "react";
import { connect } from "react-redux";
import { db } from "../src/fire";
import { setCommentData, setIndexForTitle, turnOnLoadingGif, switchBoard, addBeInvitedData } from "../actions/actionCreators"
import { uploadBackgroundImg, getBeInvitedData } from "../library/lib";
import { setGuideData } from "../library/guide";
import Topbar from "./TopBar";
import SecondBar from "./SecondBar";
import Section from "./Section";
import loadingGif from "../images/loadingImg.gif";
import PageNotFound from "../images/404.png";
import Gear from "../images/gear.png";

class Board extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            boardURL: "https://firebasestorage.googleapis.com/v0/b/allo-dc54c.appspot.com/o/homepageCover%2Fmaldives-1993704_1920.jpg?alt=media&token=b17d4f00-7e8f-4e2c-978f-c8ea14bb3a7f",
            exampleImg: "https://firebasestorage.googleapis.com/v0/b/allo-dc54c.appspot.com/o/image%2Fwelcome.png?alt=media&token=7a5e1d96-87c0-4a51-8dfc-e7c98b67579c",
            exampleAuthor: "https://firebasestorage.googleapis.com/v0/b/allo-dc54c.appspot.com/o/image%2F%E6%9C%AA%E5%91%BD%E5%90%8D.png?alt=media&token=264bf4c3-e1ed-42bd-8291-4928859932f7",
            lock: false,
            permission: null,
        }
        this.uploadBackgroundImg = uploadBackgroundImg.bind(this);
        this.setGuideData = setGuideData.bind(this);
        this.getBeInvitedData = getBeInvitedData.bind(this);
    }

    componentDidMount() {
        this.props.turnOnLoadingGif();
        
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
                    background: "https://firebasestorage.googleapis.com/v0/b/allo-dc54c.appspot.com/o/homepageCover%2Fmaldives-1993704_1920.jpg?alt=media&token=b17d4f00-7e8f-4e2c-978f-c8ea14bb3a7f",
                }).catch((error) => {
                    console.error("Error removing document: ", error);
                })
            }
        })
    }

    componentDidUpdate(prevProps){
        const currentBoard = this.props.currentBoard
        const beInvitedData = this.props.beInvitedData
        let confirm = false;

        if ( currentBoard !==  prevProps.currentBoard) {
            this.props.turnOnLoadingGif();
            this.setGuideData();
            let firebaseUid = currentBoard;
            this.getCurrentBoardData(firebaseUid);
        }
        if ( this.props.firebaseUid !== "" && beInvitedData.length === 0 && !this.state.lock ) {  //確保 didupdate 只跑一次
            this.getBeInvitedData(this.props.firebaseUid)
            this.setState({ lock: true })
        }
        if ( currentBoard !== undefined && this.props.firebaseUid !== undefined && this.props.firebaseUid === currentBoard && this.state.permission === null ) { //自己的板子
            this.setState({ permission:true })
        }
        if ( currentBoard !== undefined && this.props.firebaseUid !== undefined && this.props.firebaseUid !== currentBoard  && this.props.gotBeInvitedData && this.state.permission === null ) {
            for ( let i = 0 ; i < beInvitedData.length ; i ++ ) {
                if ( beInvitedData[i].userFirebaseuid === this.props.match.params.id ) {
                    confirm = true;
                    break;
                }
            }
            if (confirm) {
                this.setState({ permission:true })
            } else {
                this.setState({ permission:false })
            }
        }
    }

    async getCurrentBoardData(firebaseUid) {
        const props = this.props;
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
                backgroundImage: this.state.permission === null ? "" : `url("${this.state.boardURL}")`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat"
            }
        };

        return(
            <React.Fragment>
                <main  style={ style.backgroundStyle } >
                    <div className="loading" style={{display: this.props.isBoardLoaded ? "none" : "block" }} > 
                        <img src={ loadingGif } />
                    </div>
                    <div className="loading pageNotFound" style={{display: this.state.permission == null ? "none" :this.state.permission ? "none" : "block" }} > 
                        <img src={ PageNotFound } />
                    </div>
                    <div className="view" style={{display: this.state.permission ? "block" : "none" }} >
                        <Topbar />
                        <SecondBar />
                        <Section />
                    </div>
                    <label action="/somewhere/to/upload" encType="multipart/form-data" className="uploadBackground">
                        <img src={ Gear } />
                        <input name="progressbarTW_img" type="file" accept="image/gif, image/jpeg, image/png" onChange={ this.uploadFile } style={{display: "none" }} />
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
        currentBoard: state.board.currentBoard,
        beInvitedData: state.homePage.beInvitedData,
        gotBeInvitedData: state.homePage.gotBeInvitedData,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setUpComWin: (myComWin) => { dispatch(setUpComWin(myComWin)) },
        setCommentData: (Data1, Data2) => { dispatch(setCommentData(Data1, Data2)) },
        setIndexForTitle: (storeTitleIndex) => { dispatch(setIndexForTitle(storeTitleIndex))},
        turnOnLoadingGif: () => { dispatch(turnOnLoadingGif()) },
        switchBoard: (targetLink) => { dispatch(switchBoard(targetLink)) },
        addBeInvitedData: (data) => { dispatch(addBeInvitedData(data)) },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Board)