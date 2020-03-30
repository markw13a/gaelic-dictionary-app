import {combineReducers} from "redux";
import savedReducer from "./savedReducer";
import searchReducer from "./searchReducer";
import wordReducer from "./wordReducer";
import dbReducer from "./dbReducer";

export default combineReducers({
	saved: savedReducer,
	search: searchReducer,
	word: wordReducer,
	db: dbReducer
});