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
		if(db) {
			// TODO: this query is very broad, and will always match SOMETHING
			// Feel that, while this could appear a bit strange, it is not a problem. Maybe revisit after I've spent some time using this version
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