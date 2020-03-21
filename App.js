import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';

import SavedView from './js/components/Pages/SavedView';
import SearchView from './js/components/Pages/SearchView';
import {DbProvider} from "./js/db";
import HotBar from './js/components/HotBar';
import {styles} from "./js/styles";

const Main = () => {
	// User can switch between searching the dictionary, viewing previous searches and viewing saved words/phrases
	const [activeView, setActiveView] = useState();

	return (
		<NavigationContainer>
			<DbProvider>
				<View style={styles.appContainer}>
						{
							activeView === 'saved'
							? <SavedView />
							: <SearchView />
						}
					<HotBar setActiveView={setActiveView} />
				</View>
			</DbProvider>
		</NavigationContainer>
	);
};

export default Main;
