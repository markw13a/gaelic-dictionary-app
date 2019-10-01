import React, {useEffect, useState} from 'react';	
import {Alert, Button, Image, Modal, View, TextInput, TouchableOpacity} from 'react-native';

import styles from '../res/styles';
import {useAddWordState, useAddWordDispatch} from '../res/AddWordContext';


// Displays the modal and pre-fills fields with any values provided
// TODO: look at merging/otherwise refactoring with EditWordButton?
const AddWordButton = ({initialValues}) => {
	const dispatch = useAddWordDispatch();

	return (
		<View style={styles.verticalButtonGroup}>
			<View style={styles.addWordOptionButton}>
				<Button 
					title="Add new word"
					onPress={() => {
						// Display modal and pre-fill fields with this word's data
						dispatch({type: 'toggleVisible'});
						dispatch({type: 'setInitialValues', value: initialValues});
					}}
				/>
			</View>
		</View>
	);
};

// Displays the modal and pre-fills fields with any values provided
const EditWordButton = ({initialValues}) => {
	const dispatch = useAddWordDispatch();

	return (
		<TouchableOpacity
			title="Edit"
			onPress={() => {
				// Display modal and pre-fill fields with this word's data
				dispatch({type: 'toggleVisible'});
				dispatch({type: 'setInitialValues', value: initialValues});
			}}
			style={styles.favouriteButtonContainer}
   		>
        	<Image style={styles.favouriteButtonImage} source={require('../res/edit.png')} />
	    </TouchableOpacity>
	);
};

const sqlInsertWord = ({db, gaelic, english}) => db.executeSql(`INSERT INTO faclair (gaelic, english, favourited, user_created) VALUES ("${gaelic}", "${english}", "${new Date().getTime()}", "1");`, []);

// TODO: Use something like an upsert instead?
const sqlDeleteWord = ({db, rowid}) => db.executeSql(`DELETE FROM faclair WHERE rowid = ${rowid} AND user_created = 1;`, []);

const AddNewWordDialog = ({db}) => {
	const [gaelic, setGaelic] = useState();
	const [english, setEnglish] = useState();

	const {visible, initialValues} = useAddWordState();
	const dispatch = useAddWordDispatch();
	
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
					<TextInput style={{...styles.textInput}} value={gaelic} onChangeText={text => setGaelic(text)} placeholder="Gaelic" />
					<TextInput style={{...styles.textInput}} value={english} onChangeText={text => setEnglish(text)} placeholder="English" />
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

								if(initialValues['user_created']) {
									// Insert new entry before deleting old one
									// Would rather have double entries than deleting user's data
									sqlInsertWord({db, english, gaelic})
									.then(() => sqlDeleteWord({db, rowid: initialValues.rowid}))
									.then(() => dispatch({type: 'toggleVisible'}));
								} else {
									sqlInsertWord({db, english, gaelic})
									.then(() => dispatch({type: 'toggleVisible'}));
								}
							}} 
						/>
					</View>
					<View style={styles.addWordOptionButton}>
						<Button 
							title="Cancel" 
							onPress={() => dispatch({type: 'toggleVisible'})} 
						/>
					</View>
					{initialValues['user_created'] && (
						<View style={styles.addWordOptionButton}>
							<Button 
								title="Delete" 
								onPress={
									() => sqlDeleteWord({db, rowid: initialValues.rowid})
										.then(() => dispatch({type: 'toggleVisible'}))
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