import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';

import { AddWordButton } from './AddWord';
import SearchResults from './SearchResults';
import {useAddWordState, useAddWordDispatch} from '../AddWordContext';

const fetchDbItems = ({db, setItems}) => {
	db.executeSql(
		"SELECT gaelic, english, favourited, rowid, user_created FROM search WHERE favourited >= 1 ORDER BY CAST(favourited AS INTEGER) DESC;",
		 []
	).then(queryResponse => {
		const rows = queryResponse[0].rows;
		const processedResults = [];

		for(i=0; i < rows.length; i++) {
			processedResults.push(rows.item(i));
		}
		setItems(processedResults);
	});
};

/**
 * Displays all words favourited or created by the user
 */
const SavedView = ({db}) => {
	const [items, setItems] = useState();

	const {refresh} = useAddWordState();
	const dispatch = useAddWordDispatch();

	// Always want this to run on first mount
	useEffect(() => {
		if(!db) return;

		fetchDbItems({db, setItems});
	}, [db]);

	// Run the query again if a user action necessitates a refresh
	useEffect(() => {
		if(!db || !refresh) return;

		fetchDbItems({db, setItems});
		dispatch({type: 'toggleRefresh'});
	}, [db, refresh]);

	return (
		<>
			{
				(items && items.length === 0)
				? <View style={{flex:1}}><Text>You haven't favourited any words or phrases yet.</Text></View>
				: <SearchResults items={items} db={db} />
			}
			<AddWordButton />
		</>
		);
};

export default SavedView;