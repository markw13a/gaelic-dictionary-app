import React, {useEffect, useState} from 'react';	
import {Alert, Button, Image, Modal, View, TouchableOpacity} from 'react-native';

import styles from '../styles';
import {useAddWordState, useAddWordDispatch} from '../AddWordContext';
import {TextInputWithCross, ThemedButton} from './Common';

// Displays the modal and pre-fills fields with any values provided
// TODO: look at merging/otherwise refactoring with EditWordButton?
const AddWordButton = ({initialValues}) => {
	const dispatch = useAddWordDispatch();

	return (
		<View style={styles.verticalButtonGroup}>
			<View style={styles.addWordOptionButton}>
				<ThemedButton 
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
   		>
        	<Image style={{height: 50, width: 50}} source={require('../../res/edit.png')} />
	    </TouchableOpacity>
	);
};

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


	// Used to transform accent characters in to Latin equivalents
	const characterConversionTable = {'á': 'a', 'Á': 'A', 'é': 'e', 'É': 'E', 'í': 'i', 'Í': 'I', 'ó':'o', 'Ó': 'O', 'ú': 'u', 'Ú': 'U'}

	const sqlInsertWord = ({db, gaelic, gaelic_no_accents, english}) => db.executeSql(`INSERT INTO faclair (gaelic, gaelic_no_accents, english, favourited, user_created) VALUES ("${gaelic}", "${gaelic_no_accents}", "${english}", "${new Date().getTime()}", "1");`, []);

	// TODO: Use something like an upsert instead?
	const sqlDeleteWord = ({db, rowid}) => db.executeSql(`DELETE FROM faclair WHERE rowid = ${rowid} AND user_created = 1;`, []);

	return (
		<Modal
			transparent={false}
			visible={visible}
		>
			<View>
				<View>
					<TextInputWithCross value={gaelic} setValue={setGaelic} placeholder="Gaelic" />
					<TextInputWithCross value={english} setValue={setEnglish} placeholder="English" />
				</View>
				<View style={styles.verticalButtonGroup}>
					<View style={styles.addWordOptionButton}>
						<ThemedButton 
							title="Save" 
							onPress={() => {
								if( !gaelic || !english ) {
									Alert.alert('Fields must not be blank');
									return;
								}
								
								if(!db) return;

								// Used later to allow the user to look up word without typing out correct accents
								const gaelic_no_accents = gaelic.replace(/[áÁéÉíÍóÓúÚ]/gi, (match) => characterConversionTable[match]);

								if(initialValues['user_created']) {
									// Insert new entry before deleting old one
									// Would rather have double entries than deleting user's data
									sqlInsertWord({db, english, gaelic, gaelic_no_accents})
									.then(() => sqlDeleteWord({db, rowid: initialValues.rowid}))
									.then(() => {
										dispatch({type: 'toggleVisible'});
										dispatch({type: 'toggleRefresh'});
									})
								} else {
									sqlInsertWord({db, english, gaelic, gaelic_no_accents})
									.then(() => {
										dispatch({type: 'toggleVisible'});
										dispatch({type: 'toggleRefresh'});
									})
								}
							}} 
						/>
					</View>
					<View style={styles.addWordOptionButton}>
						<ThemedButton 
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
										.then(() => {
											dispatch({type: 'toggleVisible'});
											dispatch({type: 'toggleRefresh'});
										})
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