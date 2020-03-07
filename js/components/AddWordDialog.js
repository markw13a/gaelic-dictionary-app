import React, {useState} from "react";

import {Alert, Button, Modal, View} from 'react-native';

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

const AddWordDialog = ({onDismiss, ...props}) => {
	const db = useDb();
	const [gaelic, setGaelic] = useState(props.gaelic);
	const [english, setEnglish] = useState(props.english);

	const sqlInsertWord = ({db, gaelic, gaelic_no_accents, english}) => db.executeSql(`INSERT INTO search (gaelic, gaelic_no_accents, english, favourited, user_created) VALUES ("${gaelic}", "${gaelic_no_accents}", "${english}", "${new Date().getTime()}", "1");`, []);

	// TODO: Use something like an upsert instead?
	const sqlDeleteWord = ({db, rowid}) => db.executeSql(`DELETE FROM search WHERE rowid=${rowid} AND user_created = '1';`, []);

	return (
		<Modal
			transparent={false}
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
									.then(onDismiss);
								} else {
									sqlInsertWord({db, english, gaelic, gaelic_no_accents})
									.then(onDismiss)
								}
							}} 
						/>
					</View>
					<View style={styles.themedButton}>
						<ThemedButton 
							title="Cancel" 
							onPress={onDismiss} 
						/>
					</View>
					{initialValues['user_created'] && (
						<View style={styles.themedButton}>
							<Button 
								title="Delete" 
								onPress={
									() => sqlDeleteWord({db, rowid: initialValues.rowid})
										.then(onDismis)
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

export default AddWordDialog;
