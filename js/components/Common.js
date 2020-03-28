import React from 'react';
import {Button, Image, Text, TextInput, TouchableOpacity, View} from 'react-native';
import styles, {colours, fontScale} from '../styles';

/**
 * Wraps image in a clickable area
 * @param {String} source location of image file to use 
 */
const IconButton = ({source, onPress, title}) => (
	<TouchableOpacity
		title={title}
		onPress={onPress}
		style={styles.favouriteButtonContainer}
	>
		<Image style={styles.favouriteButtonImage} source={source} />
	</TouchableOpacity>
);

/**
 * Thin wrapper for Button component with app's colours already set in place
 * Having some trouble adjusting from CSS to React-Native's pseudo-CSS, not sure if this is the most effective way to manage things
 */
const ThemedButton = props => <Button {...props} color={colours.interactables} />;

const TextInputWithCross = ({value, onChange, onClear, label, ...props}) => (
	<View style={{
			flexDirection: 'column',
			padding: 10
		}}
	>
		{label && <Text style={{...fontScale.fontMedium}}>{label}</Text>}
		<View style={{
				flexDirection: 'row', 
				backgroundColor: '#ffffff',
				alignItems: 'center'
			}}
		>
			<TextInput
				onChangeText={onChange}
				value={value} 
				style={{...fontScale.fontMedium, borderRadius: 20, flex: 9, padding: 15}}
				{...props}
			/>
			<IconButton 
				source={require('../../res/cross.png')} 
				onPress={onClear} 
			/>
		</View>
	</View>

);

export {
	IconButton,
	TextInputWithCross,
	ThemedButton
};