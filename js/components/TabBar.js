import React from 'react';
import {View} from 'react-native';

import {IconButton} from './Common';
import {styles, colours} from '../styles'

const TabBar = () => (
	<View style={{...styles.buttonGroup, backgroundColor: '#ffffff'}}>
		<View style={{width: 60, height: 60, borderRadius: 30, backgroundColor: colours.tabBarButtons, alignItems: 'center', justifyContent: 'center'}}>
			<IconButton
				style={{
					width: 35,
					height: 35,
				}}
				source={require('../../res/search.png')}
				onPress={() => setActiveView('search')}
			/>
		</View>
		<View style={{width: 60, height: 60, borderRadius: 30, backgroundColor: colours.tabBarButtons, alignItems: 'center', justifyContent: 'center'}}>
			<IconButton
				style={{
					width: 35,
					height: 35,
				}}
				source={require('../../res/save.png')}
				onPress={() => setActiveView('saved')}
			/>
		</View>
	</View>
);

export default TabBar;