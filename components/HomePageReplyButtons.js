import React from "react";
import { connect } from "react-redux";
import { updateBeInvitedData } from "../actions/actionCreators";
import { accessWhereMethod } from "../library/accessDb";
import { db } from "../src/fire";

class ReplyButtons extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            confirm: this.props.confirm,
        }
        this.accessWhereMethod = accessWhereMethod.bind(this)
    }

    accept = (index) =>{
        this.setState({ confirm: true })
        this.props.updateBeInvitedData(index, true);
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
            this.accessWhereMethod(`Users/${oppFiredaseUid}/invitation`, "userFirebaseuid", firebaseUid, { confirm: true, read: false })
        })
    }

    deny = (index) => {
        this.props.updateBeInvitedData(index, null);
        this.setState({ confirm: null })


        const firebaseUid = this.props.firebaseUid
        db.collection("Users/" + firebaseUid + "/beInvited").orderBy("index").get()
        .then((querySnapshot) => {
            const docId = querySnapshot.docs[index].id
            const ref = db.collection("Users/" + firebaseUid + "/beInvited").doc(docId)
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
        firebaseUid: state.board.firebaseUid,
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