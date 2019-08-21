import React, {useState, useEffect} from 'react';
import SQLite from 'react-native-sqlite-storage';

import SearchResults from '../components/SearchResult';

const SavedSearchesView = ({userdb}) => {
	const [savedSearches, setSavedSearches] = useState();
	useEffect(() => {
		if(userdb) {
			userdb.executeSql(
				"SELECT * FROM Saved;",
			 	[]
			).then(res => setSavedSearches(res));
		} else {
			console.warn("userdb not available when SavedSearchesView instantiated");
		}
	}, [userdb]);

	return <SearchResults results={savedSearches} />
};

export default SavedSearchesView;
