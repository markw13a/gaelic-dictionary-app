/**
 * Focusing first on building the interface with dummy data
 * Doing this as both react-native and SQLite are new to me, and react-native seems like it'll be easiest to start with 
 */

import React, {useState} from 'react';
import {Button, ScrollView, View} from 'react-native';

import DictionaryDBConnection from './components/DB';

import styles from './res/styles';
import ActiveView from './components/ActiveView';

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
				<ActiveView activeView={activeView} db={db} />
				<View style={styles.buttonGroup}>
						<Button 
							title="Search"
							style={styles.button}
							onPress={() => setActiveView('search')}
						/>
						<Button 
							title="Saved"
							style={styles.button}
							onPress={() => setActiveView('saved')}
						/>
					</View>
			</View>
		</>
	);
};

export default Main;
