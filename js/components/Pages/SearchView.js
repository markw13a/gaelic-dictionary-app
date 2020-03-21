import React, {useState, useEffect} from 'react';
import {Text, Image, View} from 'react-native';

import {fontScale} from '../../styles';
import { useToggleModal } from '../../Hooks';
import SearchResults from '../SearchResults';
import {AddWordButton} from '../AddWord';
import {TextInputWithCross} from '../Common';
import { useDb } from '../../db';
import LoadingView from "./LoadingView";
import AddWordDialog from '../AddWordDialog';

const editOnPress = item => {
	setModalItem(item);
	toggleIsModalVisible();
};

const addWordOnPress = item => {
	setModalItem(item);
	toggleIsModalVisible();
};

const SearchViewIcon = ({color}) => (
	<Image
		source={require('../../../res/search.png')}
		style={{
			width: 25,
			height: 25,
		}}
		tintColor={color}
	/>
);

const SearchView = () => {
	const db = useDb();
	const [searchTerm, setSearchTerm] = useState();
	const [results, setResults] = useState();
	const {isModalVisible, toggleIsModalVisible} = useToggleModal();

	// Retrieve and display results as the user is typing
	useEffect(() => {
		let mounted = true;

		if(!db) return;

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
	}, [db, searchTerm]);

	if(!db) {
		return <LoadingView />;
	}

	return (
		<>
			<SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
			{
				results && results.length === 0 && searchTerm
				? (
					<View style={{flex:1, alignItems: 'center'}}>
						<Text style={{...fontScale.fontSmall}}> 
							No results. Click below to add this word to your saved searches 
						</Text>
						<AddWordButton onPress={toggleIsModalVisible} />
					</View>
				)
				: <SearchResults items={results} />
			}
			{
				isModalVisible
				&& <AddWordDialog gaelic={searchTerm} onDismiss={toggleIsModalVisible} />
			}
		</>
	);
};

const SearchBar = ({searchTerm, setSearchTerm}) => (
	<View style={{backgroundColor: '#055577', paddingVertical: '3%'}}>
		<TextInputWithCross value={searchTerm} setValue={setSearchTerm} placeholder="Search..." />
	</View>
);

export {
	SearchView,
	SearchViewIcon
}