import React, {useState, useEffect} from 'react';
import {TextInput, Text, View} from 'react-native';

import styles from '../res/styles';
import SearchResults from './SearchResults';
import AddNewWordDialog from './AddWord';

const SearchView = ({db}) => {
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
			{
				results && results.length === 0 && searchTerm
				? (
					<View style={{flex:1, alignItems: 'center'}}>
						<Text> No results. Click below to add this word to your saved searches </Text>
						<AddNewWordDialog db={db} initialValues={{gaelic: searchTerm}} />
					</View>
				)
				: <SearchResults items={results} db={db} />
			}
		</>
	);
};

const SearchBar = ({searchTerm, setSearchTerm}) => (
	<TextInput
		onChangeText={text => setSearchTerm(text)}
		value={searchTerm} 
		style={styles.searchBar}
		placeholder="Search..."
	/>
);

export default SearchView;