/**
 * Focusing first on building the interface with dummy data
 * Doing this as both react-native and SQLite are new to me, and react-native seems like it'll be easiest to start with 
 */

import React, {useState} from 'react';
import {View} from 'react-native';

import SavedView from './js/components/Pages/SavedView';
import SearchView from './js/components/Pages/SearchView';
import {DbProvider} from "./js/db";
import HotBar from './js/components/HotBar';
import {styles} from "./js/styles";

const Main = () => {
	// User can switch between searching the dictionary, viewing previous searches and viewing saved words/phrases
	const [activeView, setActiveView] = useState();

	return (
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
	);
};

export default Main;
