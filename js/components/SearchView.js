import React, {useState, useEffect} from 'react';
import {Text, View} from 'react-native';

import {fontScale} from '../styles';
import SearchResults from './SearchResults';
import {AddWordButton} from './AddWord';
import {TextInputWithCross} from './Common';

const SearchView = ({db}) => {
	const [searchTerm, setSearchTerm] = useState();
	const [results, setResults] = useState();

	// Retrieve and display results as the user is typing
	useEffect(() => {
		let mounted = true;

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
		.then(queryResponse => {
			const rows = queryResponse[0].rows;
			const processedResults = [];
			// Haven't seen a less silly alternative to processing the results of the query
			for(i=0; i < rows.length; i++) {
				processedResults.push(rows.item(i));
			}

			// Don't set results if user has already changed searchTerm
			if(mounted) {
				setResults(processedResults);
			}
		});

		return () => mounted = false;
	}, [searchTerm]);

	return (
		<>
			<SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
			{
				results && results.length === 0 && searchTerm
				? (
					<View style={{flex:1, alignItems: 'center'}}>
						<Text style={{...fontScale.fontSmall}} > No results. Click below to add this word to your saved searches </Text>
						<AddWordButton initialValues={{gaelic: searchTerm}} />
					</View>
				)
				: <SearchResults items={results} db={db} />
			}
		</>
	);
};

const SearchBar = ({searchTerm, setSearchTerm}) => (
	<View style={{backgroundColor: '#055577', paddingVertical: '3%'}}>
		<TextInputWithCross value={searchTerm} setValue={setSearchTerm} placeholder="Search..." />
	</View>
);

export default SearchView;