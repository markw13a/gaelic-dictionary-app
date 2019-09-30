import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import {fontScale, styles} from '../res/styles'

const Button = ({title, onPress}) => (
	<TouchableOpacity
		onPress={onPress}
		style={{
			...fontScale.fontMedium,
			...styles.button,
			color: "#808080"
		}}
	>
		<Text 
			style={{
				color: '#ffffff', 
				...fontScale.fontMedium,
				fontWeight: "bold"
			}}
		>
			{title}
		</Text>
	</TouchableOpacity>
);

const HotBar = ({setActiveView}) => (
	<View style={styles.buttonGroup}>
		<Button 
			title="Search"
			onPress={() => setActiveView('search')}
		/>
		<Button 
			title="Saved"
			onPress={() => setActiveView('saved')}
		/>
	</View>
);

export default HotBar;