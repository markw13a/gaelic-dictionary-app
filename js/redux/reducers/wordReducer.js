import produce from "immer";
import { SET_KEY, SET_ITEM, RESET_WORD_STATE } from "../actions";

const initialState = {
	gaelic: "",
	english: "",
	rowid: null
};
const wordReducer = (state=initialState, action) => {
	switch(action.type) {
		case SET_KEY: {
			return produce(state, nextState => {
				const {key, value} = action;
				nextState[key] = value;
			});
		}
		case SET_ITEM: {
			return produce(state, nextState => {
				nextState.gaelic = action.gaelic;
				nextState.english = action.english;
				nextState.rowid = action.rowid;
			});
		}
		case RESET_WORD_STATE: {
			return initialState;
		}
		default: {
			return state;
		}
	}
};

export default wordReducer;
