import { db } from "../src/fire";

export function setGuideData() {
    let props = this.props;
    let firebaseUid = this.props.currentBoard;
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
}