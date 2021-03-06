import React from 'react';
import { Button, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles, { colours, fontScale } from '../styles';

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
const ThemedButton = props => (
	<Button 
		{...props} 
		color={colours.interactables} 
	/>
);

const ButtonGroup = ({ buttonLabels, selectedButtonLabel, onPress }) => (
	<View style={styles.horizontalButtonGroup}>
		{
			buttonLabels.map( buttonLabel =>
				<View style={{ flex: 1 }} key={buttonLabel}>
					{
						buttonLabel === selectedButtonLabel
						? <Button title={buttonLabel} onPress={() => onPress(buttonLabel)} color={colours.interactablesDark}  />
						: <Button title={buttonLabel} onPress={() => onPress(buttonLabel)} color={colours.interactables} /> 
					}
				</View>
			)
		}
	</View>
);

const TextInputWithCross = ({value, onChange, onClear, label, ...props}) => (
	<View>
		{label && <Text style={{...fontScale.fontMedium}}>{label}</Text>}
		<View style={{
				flexDirection: 'row', 
				backgroundColor: '#ffffff',
				alignItems: 'center',
				paddingHorizontal: 5
			}}
		>
			<TextInput
				onChangeText={onChange}
				value={value} 
				style={{...fontScale.fontMedium, borderRadius: 20, flex: 9, padding: 10, minHeight: 60}}
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
	ThemedButton,
	ButtonGroup
};