import React from 'react';
import {TextInput} from 'react-native';

import styles from '../res/styles';

const SearchBar = ({searchTerm, setSearchTerm}) => (
	<TextInput
		onChangeText={text => setSearchTerm(text)}
		value={searchTerm} 
		style={styles.searchBar}
		placeholder="Search..."
	/>
);

export default SearchBar;
