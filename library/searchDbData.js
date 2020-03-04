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