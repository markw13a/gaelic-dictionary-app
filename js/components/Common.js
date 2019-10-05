import React from 'react';
import {Button, Image, TextInput, TouchableOpacity, View} from 'react-native';

import styles, {colours} from '../styles';

/**
 * Wraps image in a clickable area
 * @param {String} source location of image file to use 
 */
const IconButton = ({source, onPress, style}) => (
	<TouchableOpacity
		onPress={onPress}
		style={{
			justifyContent: 'center',
			flex: 1
		}}
	>
		<Image style={style} source={source} />
	</TouchableOpacity>
);

/**
 * Thin wrapper for Button component with app's colours already set in place
 * Having some trouble adjusting from CSS to React-Native's pseudo-CSS, not sure if this is the most effective way to manage things
 */
const ThemedButton = (props) => (
	<Button {...props} color={colours.interactables} />
);

const TextInputWithCross = ({value, setValue, ...props}) => (
	<View style={{
			flexDirection: 'row', 
			width: '90%', 
			borderRadius: 20, 
			backgroundColor: '#ffffff',
			marginHorizontal: '5%', 
		}}
	>
		<TextInput
			onChangeText={text => setValue(text)}
			value={value} 
			style={{...styles.searchBar, ...styles.textInput, borderRadius: 20, flex: 9, height: 80}}
			{...props}
		/>
		<IconButton style={{width: 30, height: 30}} source={require('../../res/cross.png')} onPress={() => setValue('')} />
	</View>
);

export {
	IconButton,
	TextInputWithCross,
	ThemedButton
};