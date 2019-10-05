import React, {useState} from 'react';
import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';

import styles, {fontScale} from '../styles';
import {EditWordButton} from './AddWord';

const SearchResults = ({items, db}) => (
    <FlatList 
        data={items}
        keyExtractor={(item) => JSON.stringify(item)}
        renderItem={({item}) => <Result item={item} db={db} />}
    />
);

const Result = ({item, db}) => (
    <View style={styles.searchResultContainer}>
        <View style={styles.searchResultText}>
            <Text style={{...fontScale.fontMedium, color: '#000000'}}> {item.gaelic} </Text>
            <Text style={{...fontScale.fontMedium, color: '#000000'}}> {item.english} </Text>
        </View>
        <View>
            {item["user_created"]
                ? EditWordButton({initialValues:item})
                : FavouriteButton({db, item})
            }
        </View>
    </View>
);

const FavouriteButton = ({db, item}) => {
    // Use state to immediately show effects of favourite/unfavourite without having to refresh data from database
    const [favourited, setFavourited] = useState(item.favourited);

    return (
        <TouchableOpacity
            onPress={e => {
                // Toggle value of favourited
                db.executeSql(
                    "UPDATE faclair " + 
                    "SET favourited = " + (favourited === 0 ? new Date().getTime() : 0) + 
                    " WHERE rowid = " + item.rowid + ";", 
                    []
                ).catch(err => console.error('An error has occured ' + JSON.stringify(err)))
                .then(() => {
                    // Update local copy so that user sees feedback
                    setFavourited(favourited === 0 ? new Date().getTime() : 0); 
                });
            }}
            style={styles.favouriteButtonContainer}
        >
            {favourited 
                ? <Image style={styles.favouriteButtonImage} source={require('../../res/star-solid.png')} /> 
                : <Image style={styles.favouriteButtonImage} source={require('../../res/star-regular.png')} />
            }
        </TouchableOpacity>
    );
};

export default SearchResults;