import React, {useState, useEffect} from "react";
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

const WordView = ({route: {params}}) => {
	const db = useDb();
	const navigation = useNavigation();
	const [gaelic, setGaelic] = useState();
	const [english, setEnglish] = useState();

	console.warn(params)

	useFocusEffect(() => {
		// Set params when screen is opened
		setGaelic(params.gaelic);
		setEnglish(params.english);

		// Nullify fields when user switches screen
		return () => {
			setGaelic();
			setEnglish();
		};
	});

	const sqlInsertWord = ({db, gaelic, gaelic_no_accents, english}) => db.executeSql(`INSERT INTO search (gaelic, gaelic_no_accents, english, favourited, user_created) VALUES ("${gaelic}", "${gaelic_no_accents}", "${english}", "${new Date().getTime()}", "1");`, []);

	// TODO: Use something like an upsert instead?
	const sqlDeleteWord = ({db, rowid}) => db.executeSql(`DELETE FROM search WHERE rowid=${rowid} AND user_created = '1';`, []);

	return (
		<View>
			<View>
				<TextInputWithCross value={gaelic} setValue={setGaelic} label="Gaelic" />
				<TextInputWithCross value={english} setValue={setEnglish} label="English" />
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

							if(params['user_created']) {
								// Insert new entry before deleting old one
								// Would rather have double entries than delete user's data
								sqlInsertWord({db, english, gaelic, gaelic_no_accents})
								.then(() => sqlDeleteWord({db, rowid: params.rowid}))
								.then(() => navigation.goBack());
							} else {
								sqlInsertWord({db, english, gaelic, gaelic_no_accents})
								.then(() => navigation.goBack())
							}
						}} 
					/>
				</View>
				<View style={styles.themedButton}>
					<ThemedButton 
						title="Cancel" 
						onPress={() => navigation.goBack()} 
					/>
				</View>
				{params['user_created'] && (
					<View style={styles.themedButton}>
						<Button 
							title="Delete" 
							onPress={
								() => sqlDeleteWord({db, rowid: params.rowid})
									.then(() => navigation.goBack())
							} 
							color='red'
						/>
					</View>
				)}
			</View>
		</View>
	);
};

export {WordView};
