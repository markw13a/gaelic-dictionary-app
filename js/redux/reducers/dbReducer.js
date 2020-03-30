import produce from "immer";
import {SET_DB, SET_DB_FLAG} from "../actions";

const initialState = {
	db: null,
	flag: null
};
const dbReducer = (state=initialState, action) => {
	switch(action.type) {
		case SET_DB_FLAG: {
			return produce(state, nextState => {
				nextState.flag = action.flag;
			});
		}
		case SET_DB: {
			return produce(state, nextState => {
				nextState.db = action.db;
			});
		}
		default: {
			return state;
		}
	}
};

export default dbReducer;