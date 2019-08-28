import React, {useState} from 'react';
import {Alert, Button, Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';

import styles from '../res/styles';

/**
 * @param {boolean} deleteButton if true, favourite button is replaced by a delete button which will attempt to remove the entry from the UserCreatedTerms table. 
 * Initially wanted to have favouritedItems and userCreatedItems just use two separate instances of SearchResults, but combining <ScrollView /> components is non-trivial.
 */ 
const SearchResults = ({items, userCreatedItems, db}) => ( 
    <ScrollView>
        {items && items.map( (result, i) => 
            <Result 
                key={i} 
                result={result} 
                db={db} 
                Button={FavouriteButton} 
            />
        )}
        {userCreatedItems && userCreatedItems.map((result, i) => 
            <Result 
                key={i} 
                result={result} 
                db={db} 
                Button={DeleteButton} 
            />
        )}
    </ScrollView>
);

/**
 * @param Button will be either a favourite button or a delete button. Need to be different as entries for favourites and user created terms are kept in separate tables
 */
const Result = ({result, db, Button}) => (
    <View style={styles.searchResultContainer}>
        <View style={styles.searchResultText}>
            <Text style={{fontSize: 20}}> {result.gaelic} </Text>
            <Text style={{fontSize: 20}}> {result.english} </Text>
        </View>
        {Button({db, result})}
    </View>
);

const FavouriteButton = ({db, result}) => {
    // Use state to immediately show effects of favourite/unfavourite without having to refresh data from database
    const [favourited, setFavourited] = useState(result.favourited);

    return (
        <TouchableOpacity
            onPress={() => {
                // Toggle value of favourited
                db.executeSql(
                    "UPDATE faclair " + 
                    "SET favourited = " + (favourited === 0 ? 1 : 0) + 
                    " WHERE id = " + result.id + ";", 
                    []
                ).then(() => {
                    // Update local copy so that user sees feedback
                    setFavourited(favourited === 0 ? 1 : 0); 
                });
            }} 
            style={styles.favouriteButtonContainer}
        >
            {favourited 
                ? <Image style={styles.favouriteButtonImage} source={require('../res/star-solid.png')} /> 
                : <Image style={styles.favouriteButtonImage} source={require('../res/star-regular.png')} />
            }
        </TouchableOpacity>
    );
};

const DeleteButton = ({db, result}) => (
    <TouchableOpacity
        title="Delete"
        onPress={() => {
            db.executeSql(
                `DELETE FROM UserCreatedTerms WHERE id = ${result.id};`, 
                []
            ).catch(err => Alert.alert('An error has occured ' + JSON.stringify(err)))
            .then(() => Alert.alert('Item deleted'));
        }} 
        style={styles.favouriteButtonContainer}
    >
        <Image style={styles.favouriteButtonImage} source={require('../res/delete.png')} />
    </TouchableOpacity>
);

export default SearchResults;