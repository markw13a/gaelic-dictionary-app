import React, {useState, useCallback} from "react";
import {useSelector, useDispatch} from "react-redux";
import {Alert, Button, View} from 'react-native';
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import {saveWord} from "../../redux/thunks";
import styles from '../../styles';
import {TextInputWithCross, ThemedButton} from '../Common';

const SaveButton = ({gaelic, english, rowid}) => {
	const db = useSelector(state => state.db.db);
	const dispatch = useDispatch();
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
					dispatch(saveWord({gaelic, english, rowid}));
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
	const db = useSelector(state => state.db.db);
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
