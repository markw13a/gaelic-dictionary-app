import React, {useEffect, useState} from 'react';	
import {Alert, Button, Image, Modal, View, TextInput, TouchableOpacity} from 'react-native';

import styles from '../res/styles';

const AddWordButton = ({onPress}) => (
	<View>
		<Button 
			title="Add new word"
			onPress={onPress}
		/>
	</View>
);

const EditWordButton = ({onPress}) => (
    <TouchableOpacity
        title="Edit"
        onPress={onPress}
        style={styles.favouriteButtonContainer}
    >
        <Image style={styles.favouriteButtonImage} source={require('../res/edit.png')} />
    </TouchableOpacity>
);

const sqlInsertWord = ({db, gaelic, english}) => db.executeSql(`INSERT INTO faclair (gaelic, english, favourited, user_created) VALUES ("${gaelic}", "${english}", "${new Date().getTime()}", "1");`, []);

const sqlDeleteWord = ({db, rowid}) => db.executeSql(`DELETE FROM faclair WHERE rowid = ${rowid} AND user_created = 1;`, []);

/**
 * TODO: Fix misuse of AddNewWordDialog. Is supposed to just be a modal hidden in page, therefore should only be one instance.
 *  am currently attempting to instantiate multiple with Result. Might need to work with global state so that modal can be shown, hidden by button 
 * 	presses from different sources across the app
 * @param {boolean} edit Are we creating a new word or editing an existing one? Need to delete old entry if it's the latter 
 */
const AddNewWordDialog = ({db, initialValues={}, setVisible, visible, edit}) => {
	const [gaelic, setGaelic] = useState();
	const [english, setEnglish] = useState();

	useEffect(() => {
		// Pre-fill fields with available data when modal is made visible
		if(visible) {
			setGaelic(initialValues.gaelic);
			setEnglish(initialValues.english);
		} else {
		// Clear fields again when modal is hidden
			setGaelic('');
			setEnglish('');
		}
	}, [visible]);

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
									.then(() => sqlDeleteWord({db, rowid: initialValues.rowid}))
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
									() => sqlDeleteWord({db, rowid: initialValues.rowid})
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

export {
	AddNewWordDialog,
	AddWordButton,
	EditWordButton
};