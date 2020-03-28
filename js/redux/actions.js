const FAVOURITE_ITEM = "FAVOURITE_ITEM";
const favouriteItem = id => ({
	type: FAVOURITE_ITEM,
	id
});

const EDIT_ITEM = "EDIT_ITEM";
const editItem = props => ({
	type: EDIT_ITEM,
	...props
});

const UPDATE_SEARCH = "UPDATE_SEARCH";
const updateSearch = searchTerm => ({
	type: UPDATE_SEARCH,
	searchTerm
});

const UPDATE_SEARCH_RESULTS = "UPDATE_SEARCH_RESULTS";
const updateSearchResults = searchResults => ({
	type: UPDATE_SEARCH_RESULTS,
	searchResults
});

const REFRESH = "REFRESH";
const refresh = () => ({
	type: REFRESH
});

const SET_DB = "SET_DB";
const setDb = db => ({
	type: SET_DB,
	db
});

const SET_DB_FLAG = "SET_DB_FLAG";
const setDbFlag = flag => ({
	type: SET_DB_FLAG,
	flag
});

const UPDATE_SAVED_ITEMS = "UPDATE_SAVED_ITEMS";
const updateSavedItems = savedItems => ({
	type: UPDATE_SAVED_ITEMS,
	savedItems
});

export {
	FAVOURITE_ITEM,
	favouriteItem,
	EDIT_ITEM,
	editItem,
	UPDATE_SEARCH,
	updateSearch,
	REFRESH,
	refresh,
	UPDATE_SEARCH_RESULTS,
	updateSearchResults,
	SET_DB,
	setDb,
	SET_DB_FLAG,
	setDbFlag,
	UPDATE_SAVED_ITEMS,
	updateSavedItems
};