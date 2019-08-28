import React, {useEffect, useState} from 'react';
import {Button, Modal, View, Text, TextInput} from 'react-native';
import SQLite from 'react-native-sqlite-storage';

import SearchResults from './SearchResults';
import SearchBar from './SearchBar';

// Basically a switch statement for the different bits of the app
const ActiveView = ({activeView, db}) => {
	if( activeView === 'saved' ) {
		return <SavedSearchesView db={db} />;
	} else {
		console.warn("No view found for " + activeView);
		return <SearchResultsView db={db} />;
	}
};

const SearchResultsView = ({db}) => {
	const [searchTerm, setSearchTerm] = useState();
	const [results, setResults] = useState();

	// Retrieve and display results as the user is typing
	useEffect(() => {
		if(db) {
			db.executeSql(
				"SELECT "+
				"id,gaelic,english,audio,book,letter,favourited, 1 AS sortby, length(gaelic) "+
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
				"id,gaelic,english,audio,book,letter,favourited, 2 AS sortby, length(gaelic) "+
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
				"id,gaelic,english,audio,book,letter,favourited, 3 AS sortby, length(gaelic) "+
			  "FROM faclair "+
			  "WHERE id IN "+
			  "(SELECT faclair_search.id FROM faclair_search WHERE faclair_search.gaelic MATCH '\""+searchTerm+"\"') "+
			"UNION "+
			  "SELECT "+
				"id,gaelic,english,audio,book,letter,favourited, 3 AS sortby, length(gaelic) "+
			  "FROM faclair "+
			  "WHERE id IN "+
			  "(SELECT faclair_search.id FROM faclair_search WHERE faclair_search.english MATCH '\""+searchTerm+"\"') "+
			"UNION "+
			  "SELECT "+
				"id,gaelic,english,audio,book,letter,favourited, 4 AS sortby, length(gaelic) "+
			  "FROM faclair "+
			  "WHERE id IN "+
			  "(SELECT faclair_search.id FROM faclair_search WHERE faclair_search.gaelic MATCH '"+searchTerm+"*') "+
			"UNION "+
			  "SELECT "+
				"id,gaelic,english,audio,book,letter,favourited, 4 AS sortby, length(gaelic) "+
			  "FROM faclair "+
			  "WHERE id IN "+
			  "(SELECT faclair_search.id FROM faclair_search WHERE faclair_search.english MATCH '"+searchTerm+"*') "+
			"ORDER BY sortby ASC, length(gaelic) ASC LIMIT 25;",
			[])
			.then(queryResponse => {
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
			<SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
			<SearchResults items={results} db={db} />
		</>
	);
};

const SavedSearchesView = ({db}) => {
	const [showAddWordDialog, setShowAddWordDialog] = useState(false);
	const [items, setItems] = useState();
	const [userCreatedItems, setUserCreatedItems] = useState();

	useEffect(() => {
		if(db) {
			db.executeSql(
				"SELECT id, gaelic, english, favourited FROM faclair WHERE favourited = 1;",
			 	[]
			).then(queryResponse => {
				const rows = queryResponse[0].rows;
				const processedResults = [];

				for(i=0; i < rows.length; i++) {
					processedResults.push(rows.item(i));
				}
				setItems(processedResults); 
			});

			db.executeSql(
				"SELECT id, gaelic, english FROM UserCreatedTerms;",
			 	[]
			).then(queryResponse => {
				const rows = queryResponse[0].rows;
				const processedResults = [];

				for(i=0; i < rows.length; i++) {
					processedResults.push(rows.item(i));
				}
				setUserCreatedItems(processedResults); 
			});
		} else {
			console.warn("db not available when SavedSearchesView instantiated");
		}
	}, [db]);

	return (
		<>
			{
				(items && items.length === 0) && (userCreatedTerms && userCreatedTerms.length > 0)
				? <View><Text>You haven't favourited any words or phrases yet.</Text></View>
				: <SearchResults items={items} db={db} userCreatedItems={userCreatedItems} />
			}
			<Modal
				transparent={false}
				visible={showAddWordDialog}
			>
				<AddNewWordDialog db={db} setShowAddWordDialog={setShowAddWordDialog} />
			</Modal>
			<View>
				<Button 
					title="Add new word"
					onPress={() => setShowAddWordDialog(true)}
				/>
			</View>
		</>
		);
};

const AddNewWordDialog = ({db, setShowAddWordDialog}) => {
	const [gaelic, setGaelic] = useState();
	const [english, setEnglish] = useState();

	return (
		<View>
			<View>
				<TextInput value={gaelic} onChangeText={text => setGaelic(text)} />
				<TextInput value={english} onChangeText={text => setEnglish(text)} />
			</View>
			<View>
				<Button title="Save" onPress={() => {
					if(db) {
						db.executeSql(`INSERT INTO UserCreatedTerms (gaelic, english) VALUES ('${gaelic}', '${english}');`, [])
						.then(() => setShowAddWordDialog(false));
					}
				}} />
				<Button title="Cancel" onPress={() => setShowAddWordDialog(false)} />
			</View>
		</View>
	);
};

export default ActiveView;