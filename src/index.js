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
import "./main.css";

import fire from "./fire";


let initialState = {
    //render board data
    myData:[],
    text: [],
    listTitle: [],

    //add new list
    addNewListClicked: false,
    addNewListOpen: false,
}

function reducer(state = initialState, action) {  
    console.log("run reducer")
    console.log(action.Data)
    switch(action.type) {
        case "renderComments":
            state.myData.listTitle = action.Data1;
            state.myData.listTitle.text = action.Data2;
            return {
                myData: state.myData,
                text: state.text = action.Data2,
                listTitle: state.listTitle = action.Data1,
            };

        case "addList": {
            return {
                addNewListOpen:!state.addNewListOpen,
            }
        }
      default:
        return state;
    }
}

const store = createStore(reducer);


class App extends React.Component {
    constructor(props){
        super(props);
    }

    componentDidMount() {
        console.log("run componentDidMount")

        //read db
        const db = fire.firestore();
        let myDataTitle = [];
        let myDataText = [];
        let listsId = [];
        let Data = [];
        let Data1 = [];  // store title
        let Data2 = [];  // store comment text

        getTitles();
        async function getTitles(){
            db.collection("Boards/BEUG8sKBRg2amOD19CCD/Lists").get().then(async (querySnapshot) => {
                let doc = querySnapshot.docs;
                for ( let i = 0; i < doc.length; i++ ) {       
                    listsId.push(doc[i].id)
                    myDataTitle.push(doc[i].data().title)
                    Data1.push(myDataTitle[i]);
                }
                getCommentText();
            });

            async function getCommentText(){
                for(let i = 0; i < listsId.length; i++ ) {
                    await db.collection("Boards/BEUG8sKBRg2amOD19CCD/Lists/" + listsId[i] + "/Items").get().then((querySnapshot2) => {
                    console.log(listsId[i])
                    let doc2 = querySnapshot2.docs;
                    for ( let j = 0; j < doc2.length; j++ ) {
                        myDataText.push(doc2[j].data())
                    }
                    Data2.push(myDataText);
                    console.log(Data2)
                    myDataText = [];
                    })
                } combineData();
            }
        }

        function combineData() {
            console.log("Hello")
            for(let z = 0; z < Data1.length; z++) {
                Data.push(Data1[z]);
                Data.push(Data2[z]);
                console.log(Data)
            }
            console.log("goodbey")
            store.dispatch({ type: "renderComments", Data1, Data2 })
        };
    }


    //write db
    getdbData1 = () => {
        const db = fire.firestore();
        let aaa = db.collection("Users").doc();
        aaa.set({
            email: "789@gmail.com",            
            img: "741852963",
            name: "suisqi",
        });
        console.log(db.collection("Users").doc())
    }

    render(){
        return(
            <React.Fragment>
                <Route>

                <main>
                    <view>
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
                    </view>
                </main>             

                {/* exact and switch choose one */}
 
                </Route>
            </React.Fragment>
        )
    }
}
export default App


ReactDOM.render(
    <Router>
    <Provider store={store}>
        <App />
    </Provider>
    </Router>

    , document.querySelector("#root"))