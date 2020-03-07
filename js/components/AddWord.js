import React, {useState} from 'react';	
import {Alert, Button, Image, Modal, View, TouchableOpacity} from 'react-native';

import styles from '../styles';
import {TextInputWithCross, ThemedButton} from './Common';
import { useDb } from '../db';

const CHARACTER_CONVERSION_TABLE = {
	'á': 'a', 
	'Á': 'A', 
	'é': 'e', 
	'É': 'E', 
	'í': 'i', 
	'Í': 'I',
	'ó':'o', 
	'Ó': 'O', 
	'ú': 'u', 
	'Ú': 'U',

	'à': 'a',
	'è': 'e',
	'ì': 'i',
	'ò': 'o',
	'ù': 'u',
	'À': 'A',
	'È': 'E',
	'Ì': 'I',
	'Ò': 'O',
	'Ù': 'U'
};

const AddNewWordDialog = ({toggleVisibility, initialValues}) => {
	const db = useDb();
	const [gaelic, setGaelic] = useState(initialValues.gaelic);
	const [english, setEnglish] = useState(initialValues.english);

	const sqlInsertWord = ({db, gaelic, gaelic_no_accents, english}) => db.executeSql(`INSERT INTO search (gaelic, gaelic_no_accents, english, favourited, user_created) VALUES ("${gaelic}", "${gaelic_no_accents}", "${english}", "${new Date().getTime()}", "1");`, []);

	// TODO: Use something like an upsert instead?
	const sqlDeleteWord = ({db, rowid}) => db.executeSql(`DELETE FROM search WHERE rowid=${rowid} AND user_created = '1';`, []);

	return (
		<Modal
			transparent={false}
			visible={true}
		>
			<View>
				<View>
					<TextInputWithCross value={gaelic} setValue={setGaelic} placeholder="Gaelic" />
					<TextInputWithCross value={english} setValue={setEnglish} placeholder="English" />
				</View>
				<View style={styles.verticalButtonGroup}>
					<View style={styles.themedButton}>
						<ThemedButton 
							title="Save" 
							onPress={() => {
								if( !gaelic || !english ) {
									Alert.alert('Fields must not be blank');
									return;
								}
								
								if(!db) return;

								// Used later to allow the user to look up word without typing out correct accents
								const gaelic_no_accents = gaelic.replace(/[áÁéÉíÍóÓúÚàèìòùÀÈÌÒÙ]/gi, (match) => CHARACTER_CONVERSION_TABLE[match]);

								if(initialValues['user_created']) {
									// Insert new entry before deleting old one
									// Would rather have double entries than deleting user's data
									sqlInsertWord({db, english, gaelic, gaelic_no_accents})
									.then(() => sqlDeleteWord({db, rowid: initialValues.rowid}))
									.then(() => {
										toggleVisibility();
										// dispatch({type: 'toggleRefresh'});
									});
								} else {
									sqlInsertWord({db, english, gaelic, gaelic_no_accents})
									.then(() => {
										toggleVisibility();
										// dispatch({type: 'toggleRefresh'});
									})
								}
							}} 
						/>
					</View>
					<View style={styles.themedButton}>
						<ThemedButton 
							title="Cancel" 
							onPress={toggleVisibility} 
						/>
					</View>
					{initialValues['user_created'] && (
						<View style={styles.themedButton}>
							<Button 
								title="Delete" 
								onPress={
									() => sqlDeleteWord({db, rowid: initialValues.rowid})
										.then(() => {
											toggleVisibility();
											// dispatch({type: 'toggleRefresh'});
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

const useWordDialog = () => {
	const [visible, setIsVisible] = useState(false);	
	const toggleVisibility = () => setIsVisible(!visible);
	
	return ({
		visible,
		toggleVisibility
	});
};

const AddWordButton = ({initialValues, visible, toggleVisibility}) => (
	<>
		<View style={styles.verticalButtonGroup}>
			<View style={styles.themedButton}>
				<ThemedButton 
					title="Add new word"
					onPress={toggleVisibility}
				/>
			</View>
		</View>
		{
			visible
			&& <AddNewWordDialog 
					initialValues={initialValues} 
					toggleVisibility={toggleVisibility} 
				/>
		}
	</>
);

// Displays the modal and pre-fills fields with any values provided
const EditWordButton = ({initialValues, visible, toggleVisibility}) => (
	<>
		<TouchableOpacity
			title="Edit"
			onPress={toggleVisibility}
		>
			<Image style={{height: 50, width: 50}} source={require('../../res/edit.png')} />
		</TouchableOpacity>
		{
			visible
			&& <AddNewWordDialog 
					initialValues={initialValues} 
					toggleVisibility={toggleVisibility} 
				/>
		}
	</>
);

export default AddNewWordDialog;

export {
	AddNewWordDialog,
	AddWordButton,
	EditWordButton
};