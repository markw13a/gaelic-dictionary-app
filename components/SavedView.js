import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import AddNewWordDialog from './AddWord';

import SearchResults from './SearchResults';

/**
 * Displays all words favourited or created by the user
 */
const SavedView = ({db}) => {
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
				(items && items.length === 0) && (userCreatedItems && userCreatedItems.length === 0)
				? <View style={{flex:1}}><Text>You haven't favourited any words or phrases yet.</Text></View>
				: <SearchResults items={items} db={db} userCreatedItems={userCreatedItems} />
			}
			<AddNewWordDialog db={db} />
		</>
		);
};

export default SavedView;