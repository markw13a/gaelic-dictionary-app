import produce from "immer";
import {
	UPDATE_SEARCH,
	UPDATE_SEARCH_RESULTS
} from "../actions";

const initialState = {
	searchTerm: "",
	searchResults: []
};

const searchReducer = (state=initialState, action) => {
	switch(action.type) {
		case UPDATE_SEARCH: {
			return produce(state, nextState => {nextState.searchTerm = action.searchTerm});
		}
		case UPDATE_SEARCH_RESULTS: {
			return produce(state, nextState => {nextState.searchResults = action.searchResults});
		}
		default: {
			return state;
		}
	}
};

export default searchReducer;