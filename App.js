/**
 * Focusing first on building the interface with dummy data
 * Doing this as both react-native and SQLite are new to me, and react-native seems like it'll be easiest to start with 
 */

import React, {useState, useEffect} from 'react';
import {ScrollView, Text, View} from 'react-native';

import DBConnection from './components/DB';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResult';

import styles from './res/styles';

const Main = () => {
	// Store SQLite dictionary db in state
	// Managed via DBConnection component
	const [db, setdb] = useState();
	const [searchTerm, setSearchTerm] = useState();
	const [results, setResults] = useState();
	
	// Retrieve and display results as the user is typing
	useEffect(() => {
		if(db) {
			db.executeSql(
				"SELECT "+
				"id,gaelic,english,audio,book,letter, 1 AS sortby, length(gaelic) "+
			  "FROM faclair "+
			  "WHERE "+
				"faclair.gaelic_no_accents LIKE '"+searchTerm+"' "+
				"OR  faclair.english LIKE '"+searchTerm+"' "+
				"OR faclair.gaelic_no_accents LIKE '"+searchTerm+".' "+
				"OR faclair.gaelic_no_accents LIKE '"+searchTerm+"!' "+
				"OR faclair.gaelic_no_accents LIKE '"+searchTerm+"?' "+
				"OR faclair.english LIKE '"+searchTerm+"?' "+
				"OR faclair.english LIKE '"+searchTerm+"!' "+
				"OR faclair.english LIKE '"+searchTerm+".' "+
			"UNION "+
			  "SELECT "+
				"id,gaelic,english,audio,book,letter, 2 AS sortby, length(gaelic) "+
			  "FROM faclair "+
			  "WHERE "+
			   "faclair.gaelic_no_accents LIKE '"+searchTerm+" %' "+
			   "OR  faclair.english LIKE '"+searchTerm+" %' "+
			   "OR  faclair.gaelic LIKE '"+searchTerm+",%' "+
			   "OR  faclair.english LIKE '"+searchTerm+",%' "+
			   "OR  faclair.gaelic LIKE '"+searchTerm+"/%' "+
			   "OR  faclair.english LIKE '"+searchTerm+"/%' "+
			"UNION "+
			  "SELECT "+
				"id,gaelic,english,audio,book,letter, 3 AS sortby, length(gaelic) "+
			  "FROM faclair "+
			  "WHERE id IN "+
			  "(SELECT faclair_search.id FROM faclair_search WHERE faclair_search.gaelic MATCH '\""+searchTerm+"\"') "+
			"UNION "+
			  "SELECT "+
				"id,gaelic,english,audio,book,letter, 3 AS sortby, length(gaelic) "+
			  "FROM faclair "+
			  "WHERE id IN "+
			  "(SELECT faclair_search.id FROM faclair_search WHERE faclair_search.english MATCH '\""+searchTerm+"\"') "+
			"UNION "+
			  "SELECT "+
				"id,gaelic,english,audio,book,letter, 4 AS sortby, length(gaelic) "+
			  "FROM faclair "+
			  "WHERE id IN "+
			  "(SELECT faclair_search.id FROM faclair_search WHERE faclair_search.gaelic MATCH '"+searchTerm+"*') "+
			"UNION "+
			  "SELECT "+
				"id,gaelic,english,audio,book,letter, 4 AS sortby, length(gaelic) "+
			  "FROM faclair "+
			  "WHERE id IN "+
			  "(SELECT faclair_search.id FROM faclair_search WHERE faclair_search.english MATCH '"+searchTerm+"*') "+
			"ORDER BY sortby ASC, length(gaelic) ASC LIMIT 25;",
			[])
			.then((queryResponse) => {
				const rows = queryResponse[0].rows;
				const processedResults = [];
				// Haven't seen a less silly alternative to processing the results of the query

				for(i=0; i < rows.length; i++) {
					processedResults.push(rows.item(i));
				}
				setResults(processedResults);
			});
		}
	}, [searchTerm]);

	return (
		<>
			<DBConnection db={db} setdb={setdb} />
			<View style={styles.appContainer}>
				<SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
				<SearchResults results={results} />
			</View>
		</>
	);
};

export default Main;
