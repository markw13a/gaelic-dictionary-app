import SQLite from 'react-native-sqlite-storage';
import dbUpgrade from '../dbUpgrade';
import {
	updateSearch, 
	updateSearchResults,
	setDb,
	setDbFlag
} from "./actions";
SQLite.enablePromise(true);

const DB_STATES = {
	LOADING: "LOADING",
	UPDATING: "UPDATING",
	READY: "READY",
	CLOSED: "CLOSED"
};
// Fetch db
// Upgrade db
// Close db
// Flags to signal loading/updating?
const fetchDb = () => dispatch => {
	dispatch(setDbFlag(DB_STATES.LOADING));
	return (
		SQLite.openDatabase({name: 'test.db', createFromLocation: '~faclair-ur.db'})
		.then(db => dispatch(setDb(db)))
	);
};
const doUpgradeDb = db => (
	db.executeSql("SELECT MAX(version) FROM Version;", [])
	.then(res => {
		const version = Object.values(res[0].rows.item(0))[0];
		if( version == dbUpgrade.targetVersion ) return;
		const upgradeVersion = version + 1;
			
		// Apply version upgrades one at a time (e.g upgrade 1 -> 3 in steps of 1 -> 2 and then 2 -> 3)
		// Call function recursively if user is multiple updates behind targetVersion
		return (
			db.sqlBatch([
				...dbUpgrade.upgradeStatements[`to_v${upgradeVersion}`],
				`INSERT INTO Version (version) VALUES (${upgradeVersion});`            
			]).then(() => doUpgradeDb(db))
		);
	})
);

const upgradeDb = () => (dispatch, getState) => {
	const state = getState();
	const db = state.db.db;
	
	dispatch(setDbFlag(DB_STATES.UPDATING));
	return doUpgradeDb(db);
};

const initialiseDb = () => dispatch => {
	dispatch(fetchDb())
	.then(() => dispatch(upgradeDb()))
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

const refreshSearch = db => (dispatch, getState) => {
	const state = getState();
	const searchTerm = state.search.searchTerm;
	// TODO: ordering by length of gaelic is a bit dodgy.
	// Will not give intended effect if user searches for something in English
	// Sorting by length is a primitive way of ordering by "relevance"
	// Guess that shortest result will be most similar to string provided
	// Seems to work ok
	db.executeSql(
		"SELECT "+
			"gaelic,english,favourited,rowid,user_created, 1 AS sortby, length(gaelic) "+
		"FROM search "+
		"WHERE "+
			"search.gaelic MATCH '"+searchTerm+"' "+
			"OR search.gaelic_no_accents MATCH '"+searchTerm+"' "+
			"OR search.english MATCH '"+searchTerm+"'"+
		"ORDER BY length(gaelic) ASC;",
	[])
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

const updateSearchAndRefresh = (searchTerm, db) => dispatch => {
	dispatch(updateSearch(searchTerm));
	dispatch(refreshSearch(db));
};

const toggleFavourite = ({rowid, favourited}) => (dispatch, getState) => {
	const state = getState();
	const db = state.db.db;

	db.executeSql(
		"UPDATE search " + 
		"SET favourited = " + (favourited === 0 ? new Date().getTime() : 0) + 
		" WHERE rowid = " + rowid + ";", 
		[]
	)
	.catch(err => console.error('An error has occured ' + JSON.stringify(err)))
	.then(() => dispatch(refreshSearch(db)));
};

export {
	fetchDb,
	updateSearchAndRefresh,
	toggleFavourite,
	initialiseDb,
	closeDb,
	DB_STATES
};