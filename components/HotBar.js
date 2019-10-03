import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import {IconButton} from './Common';
import {fontScale, styles, colours} from '../res/styles'

const Button = ({title, onPress}) => (
	<TouchableOpacity
		onPress={onPress}
		style={{
			...fontScale.fontMedium,
			...styles.button,
			backgroundColor: "#20BA96"
		}}
	>
		<Text 
			style={{
				...fontScale.fontMedium,
				color: '#ffffff', 
				fontWeight: "bold"
			}}
		>
			{title}
		</Text>
	</TouchableOpacity>
);

const HotBar = ({setActiveView}) => (
	<View style={{...styles.buttonGroup, backgroundColor: '#ffffff'}}>
		<View style={{width: 60, height: 60, borderRadius: 30, backgroundColor: colours.hotBarButtons, alignItems: 'center', justifyContent: 'center'}}>
			<IconButton
				style={{
					width: 35,
					height: 35,
				}}
				source={require('../res/search.png')}
				onPress={() => setActiveView('search')}
			/>
		</View>
		<View style={{width: 60, height: 60, borderRadius: 30, backgroundColor: colours.hotBarButtons, alignItems: 'center', justifyContent: 'center'}}>
			<IconButton
				style={{
					width: 35,
					height: 35,
				}}
				source={require('../res/save.png')}
				onPress={() => setActiveView('saved')}
			/>
		</View>
	</View>
);

export default HotBar;