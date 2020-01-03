/**
 * Focusing first on building the interface with dummy data
 * Doing this as both react-native and SQLite are new to me, and react-native seems like it'll be easiest to start with 
 */

import React, {useState} from 'react';
import {Text, View} from 'react-native';

import useDb from './js/components/DB';

import styles, {fontScale} from './js/styles';
import SavedView from './js/components/SavedView';
import SearchView from './js/components/SearchView';
import AddNewWordDialog from './js/components/AddWord';
import {AddWordProvider} from './js/AddWordContext';
import HotBar from './js/components/HotBar';


const Main = () => {
	// Store SQLite dictionary db in state
	// Managed via DBConnection component
	const db = useDb();
	// User can switch between searching the dictionary, viewing previous searches and viewing saved words/phrases
	const [activeView, setActiveView] = useState();

	if(!db) {
		// TODO: Make a proper loading screen
		return (
			<View style={styles.appContainer}>
				<Text style={fontScale.fontLarge} > 
					Initialising database... 
				</Text>
			</View>
		);
	}

	return (
		<>
			<View style={styles.appContainer}>
				<AddWordProvider>
					{
						activeView === 'saved'
						? <SavedView db={db} />
						: <SearchView db={db} />
					}
					<AddNewWordDialog db={db} />
				</AddWordProvider>
				<HotBar setActiveView={setActiveView} />
			</View>
		</>
	);
};

export default Main;
