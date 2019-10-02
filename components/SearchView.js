import React, {useState, useEffect} from 'react';
import {Image, TextInput, Text, TouchableOpacity, View} from 'react-native';

import styles from '../res/styles';
import SearchResults from './SearchResults';
import {AddWordButton} from './AddWord';

const SearchView = ({db}) => {
	const [searchTerm, setSearchTerm] = useState();
	const [results, setResults] = useState();

	// Retrieve and display results as the user is typing
	useEffect(() => {
		if(db) {
			db.executeSql(
				"SELECT "+
					"gaelic,english,audio,favourited,rowid,user_created, 1 AS sortby, length(gaelic) "+
				"FROM faclair "+
				"WHERE "+
					"faclair.gaelic LIKE '%"+searchTerm+"%' "+
					"OR faclair.gaelic_no_accents LIKE '%"+searchTerm+"%' "+
					"OR faclair.english LIKE '%"+searchTerm+"%';",
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
						<AddWordButton initialValues={{gaelic: searchTerm}} />
					</View>
				)
				: <SearchResults items={results} db={db} />
			}
		</>
	);
};

const SearchBar = ({searchTerm, setSearchTerm}) => (
	<View style={{...styles.buttonGroup, backgroundColor: '#F3F3F3'}}>
		<TextInput
			onChangeText={text => setSearchTerm(text)}
			value={searchTerm} 
			style={{...styles.searchBar, ...styles.textInput}}
			placeholder="Search..."
		/>
		<TouchableOpacity
            onPress={e => {
				// Clear search bar
				setSearchTerm('');
			}}
			style={{
				width: '10%',
				justifyContent: 'center'
			}}
        >
			<Image style={{width: '60%', height: undefined, aspectRatio: 1}} source={require('../res/cross.png')} />
        </TouchableOpacity>
	</View>
);

export default SearchView;