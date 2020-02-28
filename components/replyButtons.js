import React from 'react';
import { connect } from 'react-redux';
import { render } from 'react-dom';
import fire from "../src/fire";

class ReplyButtons extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            confirm: this.props.confirm,
        }
    }


    accept = (index) =>{
        console.log(index)

        this.setState(prevState => {
            return Object.assign({}, prevState, {
                confirm: true
            })
        })

        const db = fire.firestore();
        let firebaseUid = this.props.firebaseUid
        
        //用自己的 userFirebaseuid 反推去找對方 invitation 裡面的文件、將 confirm → true
        db.collection("Users/" + firebaseUid + "/beInvited").orderBy("index").get()
        .then((querySnapshot) => {
            console.log(querySnapshot.docs[index].data().userFirebaseuid)    // 用 index 找到邀請我的人的 uid
            let docId = querySnapshot.docs[index].id    // 用 uid 找到文件編號
            let ref = db.collection("Users/" + firebaseUid + "/beInvited").doc(docId)
            ref.update({ 
                confirm: true,
                read: false,
            })

            let oppFiredaseUid = querySnapshot.docs[index].data().userFirebaseuid   //去對方的集合找自己的 firebaseUid
            db.collection("Users/" + oppFiredaseUid + "/invitation").where("userFirebaseuid", "==", firebaseUid)
            .get().then((querySnapshot) => {      // querySnapshot.docs[0].id 為固定寫法、where 抓 firebaseUid 常理只會有一筆
                let docId = querySnapshot.docs[0].id
                let  ref = db.collection("Users/" + oppFiredaseUid + "/invitation").doc(docId)
                ref.update({ 
                    confirm: true,
                    read: false,
                })
            })
        })
    }


    deny = (index) => {
        
        this.setState(prevState => {
            return Object.assign({}, prevState, {
                confirm: null
            })
        })

        const db = fire.firestore();
        let firebaseUid = this.props.firebaseUid
        db.collection("Users/" + firebaseUid + "/beInvited").orderBy("index").get()
        .then((querySnapshot) => {
            console.log(querySnapshot.docs[index].data().userFirebaseuid)
            let docId = querySnapshot.docs[index].id
            let ref = db.collection("Users/" + firebaseUid + "/beInvited").doc(docId)
            ref.update({
                confirm: null,
            })
        })
    }

    


    render(){

        const style = {
            accept: {
                pointerEvents: this.state.confirm == false ? "" : "none",
                background: this.state.confirm ? "lightgray" : "",
                display: this.state.confirm == null ? "none" : "",
            },
            deny: {
                pointerEvents: this.state.confirm == false ? "" : "none",
                background: this.state.confirm == null ? "lightgray" : "",
                display: this.state.confirm ? "none" : "",
            }
        }
    
        return(
            <React.Fragment>
                <div className="accept" style={ style.accept }  onClick={ () => this.accept(this.props.index) }>{this.state.confirm ? "accepted" : "accept"}</div>
                <div className="deny" style={ style.deny } onClick={ () => this.deny(this.props.index) }>{this.state.confirm == null ? "denied" : "deny"}</div>
            </React.Fragment>
        )
    }
}




const mapStateToProps = (state, ownprops) => {
    return {
        firebaseUid: state.firebaseUid,
        index: ownprops.index,
        userFirebaseuid: ownprops.userFirebaseuid,
        confirm : ownprops.confirm,
    }
}  

export default connect(mapStateToProps)(ReplyButtons);