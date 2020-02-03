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
    text: [],
    listTitle: [],
    commentWindow: [], //pop-up window

    //add new list window
    addNewListOpen: false,
    //add new comment item window
    addNewCommentOpen: false,
    //delete confirm window
    deleteThemeConfirmOpen: false,
}

function reducer(state = initialState, action) {  
    console.log("run reducer")
    console.log(action)
    console.log(initialState)
    console.log(state)
    switch(action.type) {
        case "renderComments": {
            return Object.assign({}, state, {  // copy now state and update using items
                text: action.Data2,
                listTitle: action.Data1,
            });
        }

        case "setUpComWin": {
            return Object.assign({}, state, {
                commentWindow: action.myComWin
            });
        }

        case "addList": {
            return Object.assign({}, state, {
                addNewListOpen: !state.addNewListOpen,
            });
        }

        case "newRenderComments": {
            return Object.assign({}, state, {
                text: action.newText.slice(0),
                listTitle: action.newListTitle.slice(0),
            });
        }

        case "getNewTitleValue": {
            return Object.assign({}, state, {
                titleValue: action.value
            });
        }

        case "deleteTheme": {
            console.log(action.t)
            state.listTitle.splice(action.t, 1)
            state.text.splice(action.t, 1)
            return Object.assign({}, state, {
                text: state.text.slice(0),
                listTitle: state.listTitle.slice(0),
            }); 
        }
       
        case "deleteThemeConfirmOpen": {
            return Object.assign({}, state, {
                deleteThemeConfirmOpen: !state.deleteThemeConfirmOpen,
                whichWindowOpen: action.i
            }); 
        }

        case "addNewCommentOpen": {
            console.log(action.t)
            let openValue = !state.addNewCommentOpen
            state.commentWindow.splice(action.t, 1, openValue)
            return Object.assign({}, state, {
                commentWindow: state.commentWindow.slice(0),
                addNewCommentOpen: !state.addNewCommentOpen,
            })
        }

        case "addComment": {
            let openValue = ! state.addNewCommentOpen
            state.commentWindow.splice(action.i, 1, openValue)
            return Object.assign({}, state, {
                commentWindow: state.commentWindow.slice(0),
                addNewCommentOpen: !state.addNewCommentOpen,
                whichTheme: action.i
            })
        }

        case "getNewTextValue": {
            console.log(action.textValue)
            return Object.assign({}, state, {
                textValue: action.textValue
            });
        }
 
        case "sendComment": {
            console.log(state.text)
            console.log(state.textValue)
            console.log(state.whichTheme)
            let i = state.whichTheme
            let newText = state.text
            console.log( newText[i])
            newText[i].push({
                text: state.textValue,
                tags: []
            })

            console.log(newText[i])
            return Object.assign({}, state, {
                text: newText.slice(0),
            });
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
        let myComWin = [];
        let listsId = [];
        let Data = [];  // combine titles and texts
        let Data1 = [];  // store title
        let Data2 = [];  // store comment text

        getTitles();
        async function getTitles(){  // 逐行執行
            db.collection("Boards/BEUG8sKBRg2amOD19CCD/Lists").get()
            .then(async (querySnapshot) => {
                let doc = querySnapshot.docs;
                for ( let i = 0; i < doc.length; i++ ) {       
                    listsId.push(doc[i].id)
                    myDataTitle.push(doc[i].data().title)
                    myComWin.push(doc[i].data().addComWin)
                    Data1.push(myDataTitle[i]);
                }
                store.dispatch({ type: "setUpComWin", myComWin })
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
            store.dispatch({ type: "renderComments", Data1, Data2 })
        };
    }

    render(){
        return(
            <React.Fragment>
                <Route>

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
 
                <Switch>
                    <Route exact path="/">
                        {/* 預設用 board board 放在另個元件再引入 */}
                    
                    </Route>
                    <Route path="/HomePage">
                        <HomePage />
                    </Route>
                </Switch>

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