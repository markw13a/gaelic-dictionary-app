import React, {useEffect, useState} from 'react';
import {Alert, Button, Modal, View, Text, TextInput} from 'react-native';
import SQLite from 'react-native-sqlite-storage';

import SearchResults from './SearchResults';

/**
 * Displays all words favourited or created by the user
 */
const SavedView = ({db}) => {
	const [showAddWordDialog, setShowAddWordDialog] = useState(false);
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
				(items && items.length === 0) && (userCreatedItems && userCreatedItems.length > 0)
				? <View><Text>You haven't favourited any words or phrases yet.</Text></View>
				: <SearchResults items={items} db={db} userCreatedItems={userCreatedItems} />
			}
			<Modal
				transparent={false}
				visible={showAddWordDialog}
			>
				<AddNewWordDialog db={db} setShowAddWordDialog={setShowAddWordDialog} />
			</Modal>
			<View>
				<Button 
					title="Add new word"
					onPress={() => setShowAddWordDialog(true)}
				/>
			</View>
		</>
		);
};

const AddNewWordDialog = ({db, setShowAddWordDialog}) => {
	const [gaelic, setGaelic] = useState();
	const [english, setEnglish] = useState();

	return (
		<View>
			<View>
				<TextInput value={gaelic} onChangeText={text => setGaelic(text)} />
				<TextInput value={english} onChangeText={text => setEnglish(text)} />
			</View>
			<View>
				<Button title="Save" onPress={() => {
					if( !gaelic || !english ) {
						Alert.alert('Fields must not be blank');
						return;
					}

					if(db) {
						db.executeSql(`INSERT INTO UserCreatedTerms (gaelic, english) VALUES ("${gaelic}", "${english}");`, [])
						.then(() => setShowAddWordDialog(false));
					}
				}} />
				<Button title="Cancel" onPress={() => setShowAddWordDialog(false)} />
			</View>
		</View>
	);
};

export default SavedView;