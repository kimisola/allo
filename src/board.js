import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { connect, Provider } from "react-redux";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Topbar from "../components/topbar";
import SecondBar from "../components/secondBar";
import CommentItem from "../components/commentItem";
import AddItem from "../components/addItem";
import ItemFooter from "../components/itemFooter";
import HomePage from "../components/homePage";
import { aSetUpComWin, aRenderComments, aSetCurrentUser } from"../components/actionCreators"
import "./main.css";
import firebase from 'firebase';
import fire from "./fire";

class Board extends React.Component {
    constructor(props){
        super(props);
    }

    componentDidMount() {
        console.log("run componentDidMount")

        // google login
        firebase.auth().onAuthStateChanged(function(user) {
            
            if (user) {
                console.log("get user data", user)
                let firebaseUid = user.a.c;
                let userDisplayName;
                let userPhotoURL;
                let userEmail;

                user.providerData.forEach((profile) => {
                        userDisplayName = profile.displayName;
                        userEmail = profile.email;
                        userPhotoURL = profile.photoURL;
                });           

            props.mSetCurrentUser(userDisplayName, userPhotoURL, userEmail, firebaseUid)

            } else {
                // No user is signed in.
            }              
        });
  



        let props = this.props;
        
        //read db
        const db = fire.firestore();
        let myDataTitle = [];
        let myDataText = [];
        let myComWin = [];
        let listsId = [];
        let Data = [];  // combine titles and texts
        let Data1 = [];  // store title
        let Data2 = [];  // store comment text

        getTitles();
        async function getTitles(){  // 逐行執行
            db.collection("Boards/BEUG8sKBRg2amOD19CCD/Lists").get()
            .then(async (querySnapshot) => {
                console.log(props)
                let doc = querySnapshot.docs;
                for ( let i = 0; i < doc.length; i++ ) {       
                    listsId.push(doc[i].id)
                    myDataTitle.push(doc[i].data().title)
                    myComWin.push(doc[i].data().addComWin)
                    Data1.push(myDataTitle[i]);
                }
                props.mSetUpComWin(myComWin)
                getCommentText();
            });

            async function getCommentText(){
                for(let i = 0; i < listsId.length; i++ ) {
                    await db.collection("Boards/BEUG8sKBRg2amOD19CCD/Lists/" + listsId[i] + "/Items").get()
                    .then((querySnapshot2) => {
                        let doc2 = querySnapshot2.docs;
                        for ( let j = 0; j < doc2.length; j++ ) {
                            myDataText.push(doc2[j].data())
                        }
                        Data2.push(myDataText);
                        myDataText = []; //reset comments under certain title
                    })
                } combineData();
            }
        }

        function combineData() { 
            for(let k = 0; k < Data1.length; k++) {
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
                    <div className="view">
                        <Topbar />
                        <SecondBar />
                        <div className="board">
                            {/* <div className="sectionWrapper">
                                <div className="section"> */}
                                                         
                                    <CommentItem />
     
                                    {/* <AddItem />
                                    <ItemFooter /> */}
                                {/* </div>
                            </div> */}
                        </div>
                    </div>
                </main>             
 
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
        isLoggedIn: state.isLoggedIn,
        userEmail: state.userEmail,
        userDisplayName: state.userDisplayName,
        userPhotoURL: state.userPhotoURL,
        firebaseUid: state.firebaseUid
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        mSetUpComWin: (myComWin) => { dispatch(aSetUpComWin(myComWin)) },
        mRenderComments: (Data1, Data2) => { dispatch(aRenderComments(Data1, Data2)) },
        mSetCurrentUser: (userDisplayName, userPhotoURL, userEmail, firebaseUid) => { dispatch(aSetCurrentUser(userDisplayName, userPhotoURL, userEmail, firebaseUid)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Board)