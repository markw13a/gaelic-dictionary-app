import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import AddNewWordDialog from './AddWord';

import SearchResults from './SearchResults';

/**
 * Displays all words favourited or created by the user
 */
const SavedView = ({db}) => {
	const [items, setItems] = useState();

	useEffect(() => {
		if(db) {
			db.executeSql(
				"SELECT id, gaelic, english, favourited, rowid, user_created FROM faclair WHERE favourited >= 1 ORDER BY favourited DESC;",
			 	[]
			).then(queryResponse => {
				const rows = queryResponse[0].rows;
				const processedResults = [];

				for(i=0; i < rows.length; i++) {
					processedResults.push(rows.item(i));
				}
				setItems(processedResults); 
			});
		} else {
			console.warn("db not available when SavedSearchesView instantiated");
		}
	}, [db]);

	return (
		<>
			{
				(items && items.length === 0)
				? <View style={{flex:1}}><Text>You haven't favourited any words or phrases yet.</Text></View>
				: <SearchResults items={items} db={db} />
			}
			<AddNewWordDialog db={db} />
		</>
		);
};

export default SavedView;