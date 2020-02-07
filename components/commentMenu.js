import React from 'react';
import { connect } from 'react-redux';
import fire from "../src/fire";
import priceTag from "../images/tag.png";
import pencil from "../images/pencil.png";
import clock from "../images/clock.png";
import bin from"../images/bin.png";


class CommentMenu extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            menuShowed: false
        }
    }

    showMenu = () => {
        this.setState( prevState => {
            let showMenu = !prevState.menuShowed
            return { menuShowed: showMenu }
        });
    }


    deleteComment = () => {
        let listId = this.props.listId;
        let comId = this.props.comId;
        console.log(listId,"listId")
        console.log(comId,"comId")
        this.props.dispatch({ type: "deleteComment", listId, comId }) //delete comment

        const db = fire.firestore();
        const coll = db.collection("Boards/BEUG8sKBRg2amOD19CCD/Lists");
        coll.get().then((querySnapshot) => {                                 //取得第一層主題內容
            let docId = querySnapshot.docs[listId].id                          //取得第一層主題 id
            const coll2 = db.collection("Boards/BEUG8sKBRg2amOD19CCD/Lists/" + docId + "/Items")
            coll2.get().then((querySnapshot) => {                            //取得第二層留言內容
                let docId2 = querySnapshot.docs[comId].id                      //取得第二層留言 id
                //避免誤刪 code 維持 get 改成 delete 就可以刪除了
                coll2.doc(docId2).delete().then((querySnapshot) => {                        //取得第二層留言 id 內容
                    console.log(querySnapshot)
                    alert("刪除成功")
                    
                }).catch((error) => {
                    console.error("Error removing document: ", error);
                })
            })
        })
        
    }

    render() {
        return (
            <React.Fragment>
                <div className="tagDiv" onClick={ () => this.showMenu() } >
                    <div className="tagImgDiv"></div>
                    <div className="showMenuBackground" style={{display: this.state.menuShowed ? 'block' : 'none' }}></div>
                    <div className="commentMenu"  style={{display: this.state.menuShowed ? 'flex' : 'none' }}>
                        <div className="menuLeft">
                            <input />
                            <div>儲存</div>
                        </div>
                        <div className="menuRight">
                            <div className="menuList">
                                <div className="editTag">
                                    <img src={ priceTag } />
                                </div>
                                <div>編輯標籤</div>
                            </div>
                            <div className="menuList">
                                <div className="editText">
                                    <img src={ pencil } />
                                </div>
                                <div>編輯文字</div>
                            </div>
                            <div className="menuList">
                                <div className="setTime">
                                    <img src={ clock } />
                                </div>
                                <div>到期設定</div>
                            </div>                        
                            <div className="menuList">
                                <div className="deleteText">
                                    <img src={ bin } />
                                </div>
                                <div onClick={ () => this.deleteComment() }>刪除留言</div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state ,ownprops) => {
    return {
        text: state.text,
        listId : ownprops.listId,
        comId :ownprops.comId,
    }
}

export default connect(mapStateToProps)(CommentMenu)