import produce from "immer";
import { SET_WORD_KEY, SET_ITEM, RESET_WORD_STATE } from "../actions";

const initialState = {
	gaelic: "",
	english: "",
	id: null
};
const wordReducer = (state=initialState, action) => {
	switch(action.type) {
		case SET_WORD_KEY: {
			return produce(state, nextState => {
				const {key, value} = action;
				nextState[key] = value;
			});
		}
		case SET_ITEM: {
			return produce(state, nextState => {
				nextState.gaelic = action.gaelic;
				nextState.english = action.english;
				nextState.id = action.id;
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
