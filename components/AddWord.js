import React, {useEffect, useState} from 'react';	
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
 * @param {boolean} edit Are we creating a new word or editing an existing one? Need to delete old entry if it's the latter 
 */
const AddNewWordDialog = ({db, initialValues={}, AddWordButton=AddDefaultWordButton, edit}) => {
	// If search term is not found, want to provide "Add word" button for user to click
	// Their search-term should already be filled in. Nice time-saver.
	const [gaelic, setGaelic] = useState(initialValues.gaelic);
	const [english, setEnglish] = useState(initialValues.english);
	const [visible, setVisible] =  useState(false);

	// Special-case handling for use with search-bar
	// Found that clicking on "Add new word" after unsuccesful search would sometimes give AddNewWordDialog with part of the Gaelic term clipped off
	// e.g you might search for "somemediumlengthword" and, after clicking "Add new word", the gaelic field would be set to "somemedi" or similar
	// This happens as initialValues are put in to AddNewWordDialog's state only when the component is first initialised
	// TODO: feel like this is getting a bit complicated. Maybe look at adjusting component logic to remove need for special-case handling
	useEffect(() => {
		setGaelic(initialValues.gaelic);
	}, [initialValues.gaelic]);

	const closeDialog = () => {
		// Hide dialog
		setVisible(false);

		// Clear text fields
		setGaelic('');
		setEnglish('');
	};

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
									.then(() => closeDialog());
								} else {
									sqlInsertWord({db, english, gaelic})
									.then(() => closeDialog());
								}
							}} 
						/>
					</View>
					<View style={styles.addWordOptionButton}>
						<Button 
							title="Cancel" 
							onPress={() => closeDialog()} 
						/>
					</View>
					{edit && (
						<View style={styles.addWordOptionButton}>
							<Button 
								title="Delete" 
								onPress={
									() => sqlDeleteWord({db, id: initialValues.id})
										.then(() => closeDialog())
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