import React, {useState, useCallback} from "react";
import {Alert, Button, View} from 'react-native';

import styles from '../../styles';
import { useDb } from '../../db';
import {TextInputWithCross, ThemedButton} from '../Common';
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const CHARACTER_CONVERSION_TABLE = {
	'á': 'a', 
	'Á': 'A', 
	'é': 'e', 
	'É': 'E', 
	'í': 'i', 
	'Í': 'I',
	'ó': 'o', 
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

const sqlInsertWord = ({db, gaelic, gaelic_no_accents, english}) => db.executeSql(`INSERT INTO search (gaelic, gaelic_no_accents, english, favourited, user_created) VALUES ("${gaelic}", "${gaelic_no_accents}", "${english}", "${new Date().getTime()}", "1");`, []);
// TODO: Use something like an upsert instead?
const sqlDeleteWord = ({db, rowid}) => db.executeSql(`DELETE FROM search WHERE rowid=${rowid} AND user_created = '1';`, []);

const SaveButton = ({gaelic, english, rowid, userCreated}) => {
	const db = useDb();
	const navigation = useNavigation();

	return (
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

					if(userCreated) {
						// Insert new entry before deleting old one
						// Would rather have double entries than delete user's data
						sqlInsertWord({db, english, gaelic, gaelic_no_accents})
						.then(() => sqlDeleteWord({db, rowid}))
						.then(() => navigation.goBack());
					} else {
						sqlInsertWord({db, english, gaelic, gaelic_no_accents})
						.then(() => navigation.goBack())
					}
				}} 
			/>
		</View>
	);
};
const CancelButton = () => {
	const navigation = useNavigation();

	return (
		<View style={styles.themedButton}>
			<ThemedButton 
				title="Cancel" 
				onPress={() => navigation.goBack()} 
			/>
		</View>
	);
};
const DeleteButton = ({rowid}) => {
	const db = useDb();
	const navigation = useNavigation();

	return (
		<View style={styles.themedButton}>
			<Button 
				title="Delete" 
				onPress={() => sqlDeleteWord({db, rowid})
						.then(() => navigation.goBack())
				} 
				color='red'
			/>
		</View>
	);
};

// Decided to split AddWord and EditWord in to two screens as they're behaviour when switching to/from the screen is different
// Was becoming very awkward to handle as one screen with two "special cases"
const AddWordView = () => {
	const [gaelic, setGaelic] = useState();
	const [english, setEnglish] = useState();

	useFocusEffect(
		useCallback(() => {
			// Nullify fields when user switches screen
			return () => {
				setGaelic("");
				setEnglish("");
			};
		}, [setGaelic, setEnglish]) 
	);

	return (
		<View>
			<View>
				<TextInputWithCross value={gaelic} setValue={setGaelic} label="Gaelic" />
				<TextInputWithCross value={english} setValue={setEnglish} label="English" />
			</View>
			<View style={styles.verticalButtonGroup}>
				<SaveButton gaelic={gaelic} english={english} rowid={params.rowid} />
				<CancelButton />
			</View>
		</View>
	);
};

const EditWordView = ({route: {params = {}}}) => {
	const [gaelic, setGaelic] = useState();
	const [english, setEnglish] = useState();

	useFocusEffect(
		useCallback(() => {
			// Set params when screen is opened
			setGaelic(params.gaelic);
			setEnglish(params.english);

			// Nullify fields when user switches screen
			return () => {
				setGaelic("");
				setEnglish("");
			};
		}, [setGaelic, setEnglish, params.gaelic, params.english]) 
	);

	return (
		<View>
			<View>
				<TextInputWithCross value={gaelic} setValue={setGaelic} label="Gaelic" />
				<TextInputWithCross value={english} setValue={setEnglish} label="English" />
			</View>
			<View style={styles.verticalButtonGroup}>
				<SaveButton gaelic={gaelic} english={english} userCreated={params["user_created"]} rowid={params.rowid} />
				<CancelButton />
				<DeleteButton rowid={params.rowid} />
			</View>
		</View>
	);
};

export {
	EditWordView, 
	AddWordView
};
