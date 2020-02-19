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
        
        return(
            <React.Fragment>

            {this.props.listTitle.map((item , i) =>
                <React.Fragment  key={ i }>
                <div className="sectionWrapper" >
                    <div className="section">                  
                        <ThemeTitle title={ item } indexWin={ i } />                         
                        <Comments listIndex={ i }/>
                        <AddComment index={ i }/>
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