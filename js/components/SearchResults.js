import React, {useState} from 'react';
import {FlatList, Text, View} from 'react-native';

import styles, {fontScale} from '../styles';
import {EditWordButton} from './AddWord';
import { useDb } from '../db';
import { IconButton } from './Common';

const SearchResults = ({items}) => (
    <FlatList 
        data={items}
        keyExtractor={item => "" + item.rowid}
        renderItem={({item}) => <Result {...item} />}
    />
);

const Result = ({gaelic, english, favourited, rowid, "user_created": userCreated}) => (
    <View style={styles.searchResultContainer}>
        <View style={styles.searchResultText}>
            <Text style={{...fontScale.fontMedium, color: '#000000'}}> {gaelic} </Text>
            <Text style={{...fontScale.fontMedium, color: '#000000'}}> {english} </Text>
        </View>
        <View>
            {
                userCreated
                ? EditWordButton({gaelic, english, favourited, rowid, "user_created": userCreated})
                : FavouriteButton({favourited, rowid})
            }
        </View>
    </View>
);

const FavouriteButton = ({favourited, rowid}) => {
    const db = useDb();
    // Use state to immediately show effects of favourite/unfavourite without having to refresh data from database
    const [localFavourited, setLocalFavourited] = useState(favourited);
    
    return (
        <IconButton 
            title="Favourite"
            onPress={() => {
                // Toggle value of favourited
                db.executeSql(
                    "UPDATE search " + 
                    "SET favourited = " + (localFavourited === 0 ? new Date().getTime() : 0) + 
                    " WHERE rowid = " + rowid + ";", 
                    []
                )
                .catch(err => console.error('An error has occured ' + JSON.stringify(err)))
                .then(() => {
                    // Update local copy so that user sees feedback
                    setLocalFavourited(localFavourited === 0 ? new Date().getTime() : 0); 
                });
            }}
            source={
                localFavourited 
                ? require('../../res/star-solid.png')
                : require('../../res/star-regular.png')
            }
        />
    );
};

export default SearchResults;