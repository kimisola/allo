import React from "react";
import { connect, Provider } from "react-redux";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import firebase from 'firebase';
import fire from "./fire";
import { aSetUpComWin, aRenderComments, aSetCurrentUser, aSetIndexForTitle } from"../components/actionCreators"
import "./main.css";
import Topbar from "../components/topbar";
import SecondBar from "../components/secondBar";
import Section from "../components/section";
import loagingGif from "../images/loading.gif";




class Board extends React.Component {
    constructor(props){
        super(props);
    }

    componentDidMount() {
        console.log("run componentDidMount")
        let props = this.props;
        //read db
        const db = fire.firestore();

        // google login
        firebase.auth().onAuthStateChanged(async(user) => {
            
            if (user) {
                console.log("get user data", user)
                console.log("get user data", user.uid)
                let firebaseUid = user.uid;
                let userDisplayName;
                let userPhotoURL;
                let userEmail;
                let useruid;

                user.providerData.forEach((profile) => {
                        userDisplayName = profile.displayName;
                        userEmail = profile.email;
                        userPhotoURL = profile.photoURL;
                        useruid = profile.uid;
                });           

                props.mSetCurrentUser(userDisplayName, userPhotoURL, userEmail, firebaseUid, useruid)


                db.collection("Users").doc(`${firebaseUid}`).set({
                    name: userDisplayName,
                    photo: userPhotoURL,
                    email: userEmail,
                    uid: useruid,
                    firebaseuid: firebaseUid
                }).then(() => {
                    getTitles(firebaseUid)
                    console.log("Document successfully written!")
                }).catch((error) => {
                    console.error("Error writing document: ", error);
                })

            } else {
                // No user is signed in.
            }              
        });
         
        
        let myDataTitle = [];
        let myDataText = [];
        // let myComWin = [];
        let listsId = [];
        let Data = [];  // combine titles and texts
        let Data1 = [];  // store title
        let Data2 = [];  // store comment text

        async function getTitles(firebaseUid) {  // 每次讀取資料庫就依照定義的 index 逐個抓出來再重新定義一次
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
                    // myComWin.push(doc[i].data().addComWin)
                    Data1.push(myDataTitle[i]);

                    // set an index value for next new added title
                    if ( i === doc.length - 1 ) {
                        let storeTitleIndex = ((doc.length+1)*2)
                        props.mSetIndexForTitle(storeTitleIndex)
                    }
                }
                // props.mSetUpComWin(myComWin)
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
                                index: (((j+1)*2))  // 前後留空格讓之後移動可以有空間塞
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
            props.mRenderComments(Data1, Data2)           
        };
    }

    render(){
        return(
            <React.Fragment>

                <main>
                    <div className="loading"  style={{display: this.props.isBoardLoaded ? 'none' : 'block' }} > 
                        <img src={ loagingGif } />
                    </div>
                    <div className="view" style={{display: this.props.isBoardLoaded ? 'block' : 'none' }} >
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
    return {
        isBoardLoaded: state.isBoardLoaded,
        text: state.text,
        listTitle: state.listTitle,
        // addNewCommentOpen: state.addNewCommentOpen,
        deleteThemeConfirmOpen: state.deleteThemeConfirmOpen,
        whichWindowOpen: state.whichWindowOpen,
        commentWindow: state.commentWindow,
        isLoggedIn: state.isLoggedIn,
        userEmail: state.userEmail,
        userDisplayName: state.userDisplayName,
        userPhotoURL: state.userPhotoURL,
        firebaseUid: state.firebaseUid,
        useruid: status.useruid
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        mSetUpComWin: (myComWin) => { dispatch(aSetUpComWin(myComWin)) },
        mRenderComments: (Data1, Data2) => { dispatch(aRenderComments(Data1, Data2)) },
        mSetCurrentUser: (userDisplayName, userPhotoURL, userEmail, firebaseUid, useruid) => { dispatch(aSetCurrentUser(userDisplayName, userPhotoURL, userEmail, firebaseUid, useruid)) },
        mSetIndexForTitle: (storeTitleIndex) => { dispatch(aSetIndexForTitle(storeTitleIndex))},
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Board)