/**
 * Focusing first on building the interface with dummy data
 * Doing this as both react-native and SQLite are new to me, and react-native seems like it'll be easiest to start with 
 */

import React, {useState} from 'react';
import {View} from 'react-native';

import DictionaryDBConnection from './js/components/DB';

import styles from './js/styles';
import SavedView from './js/components/SavedView';
import SearchView from './js/components/SearchView';
import AddNewWordDialog from './js/components/AddWord';
import {AddWordProvider} from './js/AddWordContext';
import HotBar from './js/components/HotBar';

const Main = () => {
	// Store SQLite dictionary db in state
	// Managed via DBConnection component
	const [db, setdb] = useState();

	// User can switch between searching the dictionary, viewing previous searches and viewing saved words/phrases
	const [activeView, setActiveView] = useState();

	return (
		<>
			<DictionaryDBConnection db={db} setdb={setdb} />
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
