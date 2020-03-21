import React from 'react';	
import {Image, View, TouchableOpacity} from 'react-native';
import styles from '../styles';
import {ThemedButton} from './Common';

const AddWordButton = ({onPress}) => (
	<View style={styles.verticalButtonGroup}>
		<View style={styles.themedButton}>
			<ThemedButton 
				title="Add new word"
				onPress={onPress}
			/>
		</View>
	</View>
);

// Displays the modal and pre-fills fields with any values provided
const EditWordButton = ({item, onPress}) => (
	<TouchableOpacity
		title="Edit"
		onPress={() => onPress(item)}
	>
		<Image style={{height: 50, width: 50}} source={require('../../res/edit.png')} />
	</TouchableOpacity>
);

export {
	AddWordButton,
	EditWordButton
};