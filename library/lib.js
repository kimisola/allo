import { db } from "../src/fire";
import fire from "../src/fire";

export function uploadBackgroundImg(ref, file) {
    const storageRef = fire.storage().ref(ref);
    const imgRef = storageRef.child(file.name)
    const fileTypes = ["image/jpeg", "image/png","image/gif"]; 
    let flag = false;
        imgRef.put(file)
        .then((snapshot) => {
            for (let i = 0; i < fileTypes.length; i++) {
                if ( file.type == fileTypes[i] ) { 
                    flag = true
                    if (file.size > 190000 ) {
                    imgRef.getDownloadURL().then( async (url) => {
                        if ( ref === "homepageCover" ) {
                            this.setState({ homepageCover: url })
                            const db = fire.firestore();
                            let firebaseUid = this.props.firebaseUid
                            db.collection("Users").doc(firebaseUid)
                            .update({
                                homepageCover: this.state.homepageCover
                            }).catch((error)=> {
                                console.log("Error writing document: ", error.message);
                            })
                        } else {
                            this.setState({ boardURL: url })
                            const db = fire.firestore();
                            let firebaseUid = this.props.firebaseUid
                            db.collection("Boards").doc(firebaseUid)
                            .update({
                                background: this.state.boardURL
                            }).catch((error)=> {
                                console.log("Error writing document: ", error);
                            })
                        }
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
            console.log("Error removing document: ", error);
    })
}


export function getBeInvitedData(firebaseUid) {
    db.collection("Users/" + firebaseUid + "/beInvited").orderBy("index").get()
    .then((querySnapshot) => {
        let data = [];
        const theLastNum = querySnapshot.docs.length-1
        for (let i = 0 ; i < querySnapshot.docs.length ; i ++ ) {
            let send = querySnapshot.docs[i].data()
            const ref = db.collection("Users").doc(send.userFirebaseuid)
            ref.get()
            .then((querySnapshot) =>{
                send.userName = querySnapshot.data().name;
                send.userPhoto =  querySnapshot.data().photo;

                const ref2 = db.collection("Boards").doc(send.userFirebaseuid)
                ref2.get()
                .then((querySnapshot) =>{
                    send.backgroundURL = querySnapshot.data().background
                    data.push(send);
                    if ( i === theLastNum ) {
                        this.props.addBeInvitedData(data)
                    }
                }).catch((error)=> {
                    console.log("Error writing document: ", error.message);
                })
            }).catch((error)=> {
                console.log("Error writing document: ", error.message);
            })
        }
    }).catch((error) =>{
        console.log(error.message);
    })
}