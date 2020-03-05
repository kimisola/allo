import React from "react";
import { connect } from "react-redux";
import { render } from "react-dom";
import { updateBeInvitedData } from "./ActionCreators";
import { lib_AccessWhereMethod } from "../library/getDbData";
import fire from "../src/fire";
import { db } from "../src/fire";

class ReplyButtons extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            confirm: this.props.confirm,
        }
        this.lib_AccessWhereMethod = lib_AccessWhereMethod.bind(this)
    }

    accept = (index) =>{
        console.log(index)
        this.setState(prevState => {
            return Object.assign({}, prevState, {
                confirm: true
            })
        })
        this.props.updateBeInvitedData(index, true);
        
        // const db = fire.firestore();
        const firebaseUid = this.props.firebaseUid
        
        //用自己的 userFirebaseuid 反推去找對方 invitation 裡面的文件、將 confirm → true
        db.collection("Users/" + firebaseUid + "/beInvited").orderBy("index").get()
        .then((querySnapshot) => {
            const docId = querySnapshot.docs[index].id
            const ref = db.collection("Users/" + firebaseUid + "/beInvited").doc(docId)
            ref.update({ 
                confirm: true,
                read: false,
            })
            const oppFiredaseUid = querySnapshot.docs[index].data().userFirebaseuid
            this.lib_AccessWhereMethod(`Users/${oppFiredaseUid}/invitation`, "userFirebaseuid", firebaseUid, { confirm: true, read: false })

            // db.collection("Users/" + oppFiredaseUid + "/invitation").where("userFirebaseuid", "==", firebaseUid)
            // .get().then((querySnapshot) => {
            //     const docId = querySnapshot.docs[0].id
            //     const ref = db.collection("Users/" + oppFiredaseUid + "/invitation").doc(docId)
            //     ref.update({ 
            //         confirm: true,
            //         read: false,
            //     })
            // })
        })
    }

    deny = (index) => {
        this.props.updateBeInvitedData(index, null);
        this.setState(prevState => {
            return Object.assign({}, prevState, {
                confirm: null
            })
        })

        // const db = fire.firestore();
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

const mapDispatchToProps = (dispatch) => {
    return {
        updateBeInvitedData: (index, confirm) => { dispatch(updateBeInvitedData(index, confirm)) },
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(ReplyButtons);