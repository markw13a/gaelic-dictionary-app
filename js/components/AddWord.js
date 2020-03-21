import React from 'react';	
import {Image, View, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles';
import {ThemedButton} from './Common';
import PAGE_NAMES from './Pages/PAGE_NAMES';

const AddWordButton = () => {
	const navigation = useNavigation();
	
	return (
		<View style={styles.verticalButtonGroup}>
			<View style={styles.themedButton}>
				<ThemedButton 
					title="Add new word"
					onPress={() => navigation.navigate(PAGE_NAMES.WORD)}
				/>
			</View>
		</View>
	);
}

// TODO: figure out how to pass details on word to edit to WordView
const EditWordButton = ({item}) => { 
	const navigation = useNavigation();

	return (
		<TouchableOpacity
			title="Edit"
			onPress={() => navigation.navigate(PAGE_NAMES.WORD, item)}
            style={styles.favouriteButtonContainer}
		>
			<Image style={styles.favouriteButtonImage} source={require('../../res/edit.png')} />
		</TouchableOpacity>
	);
}

export {
	AddWordButton,
	EditWordButton
};