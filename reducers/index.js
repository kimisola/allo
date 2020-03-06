import { combineReducers } from "redux";
import boardReducer from "./boardReducer";
import homePageReducer from "./homePageReducer";

const rootReducer = combineReducers({
    board: boardReducer,
    homePage: homePageReducer
})

export default rootReducer