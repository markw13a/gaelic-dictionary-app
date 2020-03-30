import React from "react";
import {useSelector, useDispatch} from "react-redux";
import {Alert, Button, View} from 'react-native';
import { useNavigation } from "@react-navigation/native";

import {setWordKey, resetWordState} from "../../redux/actions";
import {saveWord, deleteWordAndRefresh} from "../../redux/thunks";
import styles from '../../styles';
import {TextInputWithCross, ThemedButton} from '../Common';

const SaveButton = () => {
	const dispatch = useDispatch();
	const navigation = useNavigation();
	const {gaelic, english, rowid} = useSelector(state => state.word);

	return (
		<View style={styles.themedButton}>
			<ThemedButton 
				title="Save" 
				onPress={() => {
					if( !gaelic || !english ) {
						Alert.alert('Fields must not be blank');
						return;
					}
					dispatch(saveWord({gaelic, english, rowid}))
					// .catch(err => Alert.alert(`Save failed: ${JSON.stringify(err)}`))
					.then(() => {
						dispatch(resetWordState());
						navigation.goBack();
					});
				}} 
			/>
		</View>
	);
};
const CancelButton = () => {
	const dispatch = useDispatch();
	const navigation = useNavigation();

	return (
		<View style={styles.themedButton}>
			<ThemedButton 
				title="Cancel" 
				onPress={() => {
					dispatch(resetWordState());
					navigation.goBack();
				}} 
			/>
		</View>
	);
};
const DeleteButton = () => {
	const dispatch = useDispatch();
	const navigation = useNavigation();
	const rowid = useSelector(state => state.word.rowid);

	// No rowid indicates that we're creating a new word rather than editing an existing one
	if(!rowid) return null;

	return (
		<View style={styles.themedButton}>
			<Button 
				title="Delete" 
				onPress={() => {
					dispatch(deleteWordAndRefresh(rowid))
					.then(() => {
						dispatch(resetWordState());
						navigation.goBack();
					});
				}} 
				color='red'
			/>
		</View>
	);
};

const WordView = () => {
	const dispatch = useDispatch();
	const {gaelic, english} = useSelector(state => state.word);
	return (
		<View>
			<View>
				<TextInputWithCross 
					onClear={() => dispatch(setWordKey({key: "gaelic", value: ""}))} 
					onChange={text => dispatch(setWordKey({key: "gaelic", value: text}))} 
					label="Gaelic" 
					value={gaelic} 
				/>
				<TextInputWithCross 
					onClear={() => dispatch(setWordKey({key: "english", value: ""}))} 
					onChange={text => dispatch(setWordKey({key: "english", value: text}))} 
					label="English"
					value={english} 
				/>
			</View>
			<View style={styles.verticalButtonGroup}>
				<SaveButton />
				<CancelButton />
				<DeleteButton />
			</View>
		</View>
	);
};

export default WordView;
