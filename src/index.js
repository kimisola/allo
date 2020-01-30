import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { connect, Provider } from "react-redux";
import Topbar from "../components/topbar";
import SecondBar from "../components/secondBar";
import CommentItem from "../components/commentItem";
import AddItem from "../components/addItem";
import "./main.css";
import ItemFooter from "../components/itemFooter";

import fire from "./fire";


let initialState = {
    text: [],
    listTitle: [],
    loadPage: true,  //是不是要設一個東西讓原始 state 裡有資料才會動
}

//read db
const db = fire.firestore();
    db.collection("Boards").get().then((querySnapshot) => {
        
        querySnapshot.forEach(doc => {
            // initialState.text.push( doc.data());
            let boardId = "";
            boardId = doc.id
            console.log(boardId)

            db.collection("Boards/BEUG8sKBRg2amOD19CCD/Lists").get().then((querySnapshot) => {
                querySnapshot.forEach(doc =>{
                    console.log(doc.id)
                    console.log(doc.data().title)
                    initialState.listTitle.push(doc.data().title)
                    let listsId = "";
                    listsId = doc.id

                    db.collection("Boards/BEUG8sKBRg2amOD19CCD/Lists/" + listsId + "/Items").get().then((querySnapshot) => {
                        querySnapshot.forEach(doc =>{
                            console.log(doc.id)
                            console.log(doc.data())
                            initialState.text.push(doc.data())
                        })
                        store.dispatch({ type: "renderComments" });
                        console.log(initialState.text);
                    })
                })
            })
        });
    });

function reducer(state = initialState, action) {  
    switch(action.type) {
        case "renderComments":
            return {  
                text: state.text,
                listTitle: state.listTitle
            };
      default:
        return state;
    }
}

const store = createStore(reducer);


class App extends React.Component {
    constructor(props){
        super(props);
        // this.state = store.getState();
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

            </React.Fragment>
        )
    }
}
export default App


ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
    , document.querySelector("#root"))