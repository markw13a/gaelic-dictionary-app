import React, {useEffect, useState} from 'react';
import {View, Text, Image} from 'react-native';

import { AddWordButton } from '../AddWord';
import SearchResults from '../SearchResults';
import { useDb } from '../../db';
import LoadingView from './LoadingView';
import { useFocusEffect } from '@react-navigation/native';

const SavedViewIcon = ({color}) => (
	<Image
		source={require('../../../res/save.png')}
		style={{
			width: 25,
			height: 25,
		}}
		tintColor={color}
	/>
);

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
const SavedView = () => {
	const db = useDb();
	const [items, setItems] = useState();

	useFocusEffect(() => {
		if(!db) return;
		fetchDbItems({db, setItems});
	});

	if(!db) {
		return <LoadingView />;
	}

	return (
		<>
			{
				(items && items.length === 0)
				? <View style={{flex:1}}><Text>You haven't favourited any words or phrases yet.</Text></View>
				: <SearchResults items={items} />
			}
			<AddWordButton />
		</>
	);
};

export {
	SavedView,
	SavedViewIcon
}