import React from "react";
import { connect } from "react-redux";
import fire from "../src/fire";

export function lib_AccessWhereMethod(dbPath, column, target, targetData) {
    console.log("lib_AccessWhereMethod")
    const db = fire.firestore();
    db.collection(dbPath).where(column, "==", target).get()
    .then((querySnapshot) => {
        const docId = querySnapshot.docs[0].id
        const ref = db.collection(dbPath).doc(docId)
        ref.update(targetData)
        .catch((error) => {
            console.log("Error removing document: ", error.message);
        })
    })
}

//重新 set list / item 的 index
export function lib_AccessOrderByMethod(dbPath) {
    console.log("lib_AccessOrderByMethod")
    const db = fire.firestore();
    db.collection(dbPath).orderBy("index").get()
    .then((querySnapshot) => {
        const doc = querySnapshot.docs;
        for ( let i = 0; i < doc.length; i++ ) {       
            let ref = db.collection(dbPath).doc(doc[i].id)
            ref.update({
                index: (((i+1)*2)) //前後留空格讓之後移動可以有空間塞
            })
            .catch((error) => {
                console.log("Error removing document: ", error.message);
            })
        }
    })
}

export function lib_AccessDeleteMethod(dbPath, docId) {
    console.log("lib_AccessDeleteMethod", dbPath, docId)
    const db = fire.firestore();
    db.collection(dbPath).doc(docId).delete()
    .then(() => {
        lib_AccessOrderByMethod(dbPath)
    }).catch((error) => {
        console.error("Error removing document: ", error.message);
    })    
}