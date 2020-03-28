import React from 'react';	
import { useDispatch } from 'react-redux';
import {View} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import {setItem} from "../redux/actions";
import styles from '../styles';
import {ThemedButton, IconButton} from './Common';
import PAGE_NAMES from './Pages/PAGE_NAMES';

const AddWordButton = () => {
	const navigation = useNavigation();
	
	return (
		<View style={styles.verticalButtonGroup}>
			<View style={styles.themedButton}>
				<ThemedButton 
					title="Add new word"
					onPress={() => navigation.navigate(PAGE_NAMES.ADD_WORD)}
				/>
			</View>
		</View>
	);
}

const EditWordButton = item => {
	const dispatch = useDispatch(); 
	const navigation = useNavigation();

	return (
		<IconButton 
			title="Edit"
			onPress={() => {
				dispatch(setItem(item));
				navigation.navigate(PAGE_NAMES.ADD_WORD);
			}}
			source={require('../../res/edit.png')}
		/>
	);
}

export {
	AddWordButton,
	EditWordButton
};