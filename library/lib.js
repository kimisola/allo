import React from "react";
import { connect } from "react-redux";
import fire from "../src/fire";

export function lib_fileUpload(ref, file) {
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
                    // console.log("Uploaded a blob or file!");
                    imgRef.getDownloadURL().then( async (url) => {
                        // console.log(url)
                        if ( ref === "homepageCover" ) {
                            this.setState( prevState => {
                                let homepageCover = url
                                return Object.assign({}, prevState, {
                                    homepageCover: homepageCover,
                                })
                            });
                            const db = fire.firestore();
                            let firebaseUid = this.props.firebaseUid
                            db.collection("Users").doc(firebaseUid)
                            .update({
                                homepageCover: this.state.homepageCover
                            }).then(()=>{
                                console.log("successed", this.state.homepageCover)
                            })
                            .catch((error)=> {
                                console.log("Error writing document: ", error.message);
                            })
                        } else {
                            this.setState( prevState => {
                                let boardURL = url
                                return Object.assign({}, prevState, {
                                    boardURL: boardURL,
                                })
                            });
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