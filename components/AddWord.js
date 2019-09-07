import React, {useState} from 'react';	
import {Alert, Button, Modal, View, TextInput} from 'react-native';

import styles from '../res/styles';

const AddDefaultWordButton = ({setVisible}) => (
	<View>
		<Button 
			title="Add new word"
			onPress={() => setVisible(true)}
		/>
	</View>
);

const sqlInsertWord = ({db, gaelic, english}) => db.executeSql(`INSERT INTO UserCreatedTerms (gaelic, english) VALUES ("${gaelic}", "${english}");`, []);

const sqlDeleteWord = ({db, id}) => db.executeSql(`DELETE FROM UserCreatedTerms WHERE id = ${id};`, []);

/**
 * 
 * @param {boolean} edit Are we creating a new word or editing an existing one? Need to delete previous entry if it's the latter 
 */
const AddNewWordDialog = ({db, initialValues={}, AddWordButton=AddDefaultWordButton, edit}) => {
	// If search term is not found, want to provide "Add word" button for user to click
	// Their search-term should already be filled in. Nice time-saver.
	const [gaelic, setGaelic] = useState(initialValues.gaelic);
	const [english, setEnglish] = useState(initialValues.english);
	const [visible, setVisible] =  useState(false);

	if(!visible) {
		return <AddWordButton setVisible={setVisible} />;
	}

	return (
		<Modal
			transparent={false}
			visible={visible}
		>
			<View>
				<View>
					<TextInput style={styles.addWordTextInput} value={gaelic} onChangeText={text => setGaelic(text)} />
					<TextInput style={styles.addWordTextInput} value={english} onChangeText={text => setEnglish(text)} />
				</View>
				<View style={styles.verticalButtonGroup}>
					<View style={styles.addWordOptionButton}>
						<Button 
							title="Save" 
							onPress={() => {
								if( !gaelic || !english ) {
									Alert.alert('Fields must not be blank');
									return;
								}
								
								if(!db) return;

								if(edit) {
									// Insert new entry before deleting old one
									// Would rather have double entries than deleting user's data
									sqlInsertWord({db, english, gaelic})
									.then(() => sqlDeleteWord({db, id: initialValues.id}))
									.then(() => setVisible(false));
								} else {
									sqlInsertWord({db, english, gaelic})
									.then(() => setVisible(false));
								}
							}} 
						/>
					</View>
					<View style={styles.addWordOptionButton}>
						<Button 
							title="Cancel" 
							onPress={() => setVisible(false)} 
						/>
					</View>
					{edit && (
						<View style={styles.addWordOptionButton}>
							<Button 
								title="Delete" 
								onPress={
									() => sqlDeleteWord({db, id: initialValues.id})
										.then(() => setVisible(false))
								} 
								color='red'
							/>
						</View>
					)}
				</View>
			</View>
		</Modal>
	);
};

export default AddNewWordDialog;