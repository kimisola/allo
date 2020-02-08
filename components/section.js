import React from 'react';
import Comments from "../components/comments";
import ThemeTitle from "../components/themeTitle";
import AddComment from "../components/addComment";
import Plus from "../images/plus.png";
import { connect } from 'react-redux';


class Section extends React.Component {
    constructor(props){
        super(props);
    }

    addComment = (i) => {
        this.props.dispatch({ type: "addComment", i })
    }

    render(){
        console.log("render list title", this.props.listTitle)
        console.log("render text", this.props.text)
        return(
            <React.Fragment>

            {this.props.listTitle.map((item , i) =>
                <React.Fragment>
                <div className="sectionWrapper" >
                    <div className="section">
                        
                        <ThemeTitle title={ item } indexWin={ i } />
                           
                        <Comments listIndex={ i }/>
                        <div className="addItem" style={{display: this.props.commentWindow[i] ? 'block' : 'none' }}>
                        <AddComment listTitle={ this.props.listTitle } text={ this.props.text }/>
                        </div>
                        <div className="itemFooter">
                            <div className="add">
                                <img src={ Plus } onClick={ () => this.addComment(i)}/>
                            </div>
                        </div>
                    </div>
                </div>

                </React.Fragment>  
            )}
          
            </React.Fragment>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        text: state.text,
        listTitle: state.listTitle,
        addNewCommentOpen: state.addNewCommentOpen,
        deleteThemeConfirmOpen: state.deleteThemeConfirmOpen,
        whichWindowOpen: state.whichWindowOpen,
        commentWindow: state.commentWindow,
    }
}

export default connect(mapStateToProps)(Section);