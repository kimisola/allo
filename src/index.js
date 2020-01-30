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

function reducer(state = initialState, action) {  
    switch(action.type) {
        case "renderComments":
            return {  
                text: action.myDataText,
                listTitle: action.myDataTitle
            };
      default:
        return state;
    }
}

const store = createStore(reducer);


class App extends React.Component {
    constructor(props){
        super(props);
    }

    async componentDidMount() {
        console.log("run componentDidMount")

        //read db
        // await db.collection("Boards").get().then((querySnapshot) => {
        // });
    
        // querySnapshot.forEach(doc => {
        //     initialState.text.push( doc.data());
        //     let boardId = "";
        //     boardId = doc.id
        //     console.log(boardId)
        //});

        const db = fire.firestore();
        let myDataTitle = [];
        let myDataText = [];
        let listsId = "";

        const getListId = await db.collection("Boards/BEUG8sKBRg2amOD19CCD/Lists").get().then((querySnapshot) => {
                querySnapshot.forEach(doc => {
                    myDataTitle.push(doc.data().title)                  
                    listsId = doc.id
                    console.log(myDataTitle)
                    
                    db.collection("Boards/BEUG8sKBRg2amOD19CCD/Lists/" + listsId + "/Items").get().then((querySnapshot) => {
                        querySnapshot.forEach(doc => {
                            console.log(doc.data())
                            myDataText.push(doc.data())
                            console.log(myDataText)
                        })
                        store.dispatch({ type: "renderComments", myDataText, myDataTitle });
                    })
                })                
            })


        // const getItemData = await db.collection("Boards/BEUG8sKBRg2amOD19CCD/Lists/" + listsId + "/Items").get().then((querySnapshot) => {
        //         querySnapshot.forEach(doc => {
        //             console.log(doc.id)
        //             console.log(doc.data())
        //             myDataText.push(doc.data())
        //         })
        //         store.dispatch({ type: "renderComments" });
        //         console.log(myDataText);
        //     })
        
        

       
            // try {
            //   const response = await fetch(`https://api.appworks-school.tw/api/1.0/products/all`)
            //   .then((response) => {
            //       console.log(response)
            //       return response.json()
            //   })
            //   .then((data) => {
            //       console.log(data)
            //   })
            //   if (!response.ok) {
            //     throw Error(response.statusText);
            //   }
            // } catch (error) {
            //   console.log(error);
            // }
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