// TODO: break up actions, thunks files and replace with something more along the lines of the ducks pattern
import SQLite from 'react-native-sqlite-storage';
import {
	updateSearch, 
	updateSearchResults,
	updateSavedItems,
	setDb,
	setDbFlag,
	setWordKey
} from "./actions";
import { SEARCH_TYPES } from './reducers/searchReducer';
SQLite.enablePromise(true);

const DB_STATES = {
	LOADING: "LOADING",
	UPDATING: "UPDATING",
	READY: "READY",
	CLOSED: "CLOSED"
};

const fetchDb = () => dispatch => {
	dispatch(setDbFlag(DB_STATES.LOADING));
	return (
		SQLite.openDatabase({name: 'test.db', createFromLocation: '~faclair-ur.db'})
		.then(db => dispatch(setDb(db)))
	);
};

const initialiseDb = () => dispatch => {
	dispatch(fetchDb())
	.then(() => dispatch(setDbFlag(DB_STATES.READY)));
};

const closeDb = () => (dispatch, getState) => {
	const state = getState();
	const db = state.db.db;

	if(!db) throw new Error("closeDb called where db is undefined");

	db.close();
	dispatch(setDb(null));
	dispatch(setDbFlag(DB_STATES.CLOSED));
};

const refreshSearch = () => (dispatch, getState) => {
	const state = getState();
	const { searchTerm, searchType } = state.search;
	const db = state.db.db;

	if( !searchTerm ) {
		return;
	}

	let query = (
		"SELECT "+
			"gaelic,english,favourited,id,user_created,ipa,gaelic_no_accents, 1 AS sortby "+
		"FROM faclair "+
		"WHERE "+
			"faclair.gaelic_no_accents LIKE '"+searchTerm+"' "+
			"OR faclair.gaelic_no_accents LIKE '"+searchTerm+"-%' "+
		"ORDER BY length(gaelic) ASC "+
		"LIMIT 50;"
	);

	// Searching English to Gaelic
	if( searchType === SEARCH_TYPES[1] ) {
		query = (
			"SELECT "+
			"gaelic,english,favourited,id,user_created,ipa,gaelic_no_accents "+
			"FROM faclair "+
			"WHERE "+
				"faclair.english LIKE '"+searchTerm+"' "+
				"OR faclair.english LIKE '"+searchTerm+" %' "+
				"OR faclair.english LIKE '% "+searchTerm+"' "+
				"OR faclair.english LIKE '% "+searchTerm+" %' "+
			"ORDER BY length(gaelic) ASC "+
			"LIMIT 50;"
		);
	}

	db.executeSql(query,[])
	.catch(err => console.warn(JSON.stringify(err)))
	.then(queryResponse => {
		const rows = queryResponse[0].rows;
		const processedResults = [];
		// Haven't seen a less silly alternative to processing the results of the query
		for(i=0; i < rows.length; i++) {
			processedResults.push(rows.item(i));
		}
		dispatch(updateSearchResults(processedResults));
	});
};

const updateSearchAndRefresh = (searchTerm) => dispatch => {
	dispatch(updateSearch(searchTerm));
	dispatch(refreshSearch());
	dispatch(setWordKey({key: "gaelic", searchTerm}));
};

const refreshSaved = () => (dispatch, getState) => {
	const state = getState();
	const db = state.db.db;

	db.executeSql("SELECT gaelic, english, favourited, id, ipa, user_created FROM faclair WHERE favourited >= 1 ORDER BY CAST(favourited AS INTEGER) DESC;", [])
	.then(queryResponse => {
		const rows = queryResponse[0].rows;
		const processedResults = [];

		for(i=0; i < rows.length; i++) {
			processedResults.push(rows.item(i));
		}
		dispatch(updateSavedItems(processedResults));
	});
};

const toggleFavourite = ({id, favourited}) => (dispatch, getState) => {
	const state = getState();
	const db = state.db.db;

	db.executeSql(
		"UPDATE faclair " + 
		"SET favourited = " + (favourited === 0 ? new Date().getTime() : 0) + 
		" WHERE id = " + id + ";", 
		[]
	)
	.catch(err => console.error('An error has occured ' + JSON.stringify(err)));
	dispatch(refreshSearch(db));
	dispatch(refreshSaved(db));
};

const CHARACTER_CONVERSION_TABLE = {
	'á': 'a', 
	'Á': 'A', 
	'é': 'e', 
	'É': 'E', 
	'í': 'i', 
	'Í': 'I',
	'ó': 'o', 
	'Ó': 'O', 
	'ú': 'u', 
	'Ú': 'U',

	'à': 'a',
	'è': 'e',
	'ì': 'i',
	'ò': 'o',
	'ù': 'u',
	'À': 'A',
	'È': 'E',
	'Ì': 'I',
	'Ò': 'O',
	'Ù': 'U'
};
const insertWord = ({gaelic, english}) => (dispatch, getState) => {
	const state = getState();
	const db = state.db.db;

	// Used later to allow the user to look up word without typing out correct accents
	const gaelic_no_accents = gaelic.replace(/[áÁéÉíÍóÓúÚàèìòùÀÈÌÒÙ]/gi, (match) => CHARACTER_CONVERSION_TABLE[match]);

	return db.executeSql(`INSERT INTO faclair (gaelic, gaelic_no_accents, english, favourited, user_created) VALUES ("${gaelic}", "${gaelic_no_accents}", "${english}", "${new Date().getTime()}", "1");`, []);
};
const deleteWord = id => (dispatch, getState) => {
	const state = getState();
	const db = state.db.db;

	return db.executeSql(`DELETE FROM faclair WHERE id=${id} AND user_created = '1';`, []);
};
const saveWord = ({gaelic, english, id}) => (dispatch, getState) => {
	if(!gaelic || !english) {
		throw new Error(`saveWord undefined variable: gaelic: ${gaelic}, english: ${english}`);
	}
	const state = getState();
	const db = state.db.db;

	return (
		dispatch(deleteWord(id))
		.then(() => dispatch(insertWord({gaelic, english})))
		.then(() => {
			dispatch(refreshSearch(db));
			dispatch(refreshSaved(db));
		})
	);
};
const deleteWordAndRefresh = id => (dispatch) => (
	dispatch(deleteWord(id))
	.then(() => {
		dispatch(refreshSearch());
		dispatch(refreshSaved());
	})
);
export {
	fetchDb,
	updateSearchAndRefresh,
	toggleFavourite,
	initialiseDb,
	closeDb,
	refreshSaved,
	refreshSearch,
	saveWord,
	deleteWord,
	deleteWordAndRefresh,
	DB_STATES
};