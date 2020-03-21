import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, Image} from 'react-native';

import {colours} from "../../styles";
import { AddWordButton } from '../AddWord';
import SearchResults from '../SearchResults';
import { useDb } from '../../db';
import LoadingView from './LoadingView';
import { useToggleModal } from '../../Hooks';
import AddWordDialog from '../AddWordDialog';

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
	const [shouldRefreshData, setShouldRefreshData] = useState();
	const {isModalVisible, toggleIsModalVisible} = useToggleModal();

	const addWordDialogOnDismiss = useCallback(() => {
		toggleIsModalVisible();
		setShouldRefreshData(true);
	}, [setShouldRefreshData, toggleIsModalVisible]);

	// Always want this to run on first mount
	useEffect(() => {
		if(!db) return;
		fetchDbItems({db, setItems});
	}, [db]);

	// Run the query again if a user action necessitates a refresh
	useEffect(() => {
		if(!db || !shouldRefreshData) return;

		fetchDbItems({db, setItems});
		setShouldRefreshData(false);
	}, [db, setShouldRefreshData, setItems]);

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
			{
				isModalVisible
				&& <AddWordDialog onDismiss={addWordDialogOnDismiss} />
			}
			<AddWordButton onPress={toggleIsModalVisible} />
		</>
	);
};

export {
	SavedView,
	SavedViewIcon
}