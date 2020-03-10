import { db } from "../src/fire";

export function accessWhereMethod(dbPath, column, target, targetData) {
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
export function accessOrderByMethod(dbPath) {
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

export function accessDeleteMethod(dbPath, docId) {
    //避免誤刪 code 維持 get 改成 delete 就可以刪除了
    db.collection(dbPath).doc(docId).delete()
    .then(() => {
        accessOrderByMethod(dbPath)
    }).catch((error) => {
        console.error("Error removing document: ", error.message);
    })    
}