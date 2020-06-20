import produce from "immer";
import {
	UPDATE_SEARCH,
	UPDATE_SEARCH_RESULTS
} from "../actions";

const SEARCH_TYPES = ["Gaelic to English", "English to Gaelic"];

const initialState = {
	searchTerm: "",
	searchType: SEARCH_TYPES[0],
	searchResults: []
};

const UPDATE_SEARCH_TYPE = "UPDATE_SEARCH_TYPE";
const updateSearchType = searchType => ({
	type: UPDATE_SEARCH_TYPE,
	searchType
});

const searchReducer = (state=initialState, action) => {
	switch(action.type) {
		case UPDATE_SEARCH: {
			return produce(state, nextState => { nextState.searchTerm = action.searchTerm });
		}
		case UPDATE_SEARCH_RESULTS: {
			return produce(state, nextState => { nextState.searchResults = action.searchResults });
		}
		case UPDATE_SEARCH_TYPE: {
			return produce(state, nextState => {
				if( !SEARCH_TYPES.includes(action.searchType) ) {
					throw new Error(`Unrecognised search type ${action.searchType}`);
				}
				nextState.searchType = action.searchType; 
			});
		}
		default: {
			return state;
		}
	}
};

export default searchReducer;
export {
	searchReducer,
	SEARCH_TYPES,
	updateSearchType
};
