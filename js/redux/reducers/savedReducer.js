import produce from "immer";
import { UPDATE_SAVED_ITEMS } from "../actions";

const initialState = {
	savedItems: []
};
const savedReducer = (state=initialState, action) => {
	switch(action.type) {
		case UPDATE_SAVED_ITEMS: {
			return produce(state, nextState => {nextState.savedItems = action.savedItems});
		}
		default: {
			return state;
		}
	}
};

export default savedReducer;
