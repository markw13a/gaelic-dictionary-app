import React, {useState} from 'react';
import {Alert, Button, ScrollView, Text, View} from 'react-native';

import styles from '../res/styles';

/**
 * @param {boolean} deleteButton if true, favourite button is replaced by a delete button which will attempt to remove the entry from the UserCreatedTerms table. 
 * Initially wanted to have favouritedItems and userCreatedItems just use two separate instances of SearchResults, but combining <ScrollView /> components is non-trivial.
 */ 
const SearchResults = ({favouritedItems, userCreatedItems, db}) => ( 
    <ScrollView contentContainerStyle={styles.scrollView}>
        {favouritedItems && favouritedItems.map( (result, i) => 
            <Result 
                key={i} 
                result={result} 
                db={db} 
                Button={FavouriteButton} 
            />
        )}
        {userCreatedItems && userCreatedItems.map( (result, i) => 
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
    <View>
        <View style={styles.searchResult}>
            <Text style={{fontSize: 20}}> {result.gaelic} </Text>
            <Text style={{fontSize: 20}}> {result.english} </Text>
        </View>
        <View>
            {Button({db, result})}
        </View>
    </View>
);

const FavouriteButton = ({db, result}) => {
    // Use state to immediately show effects of favourite/unfavourite without having to refresh data from database
    const [favourited, setFavourited] = useState(result.favourited);

    return (
        <Button 
            title={favourited ? "Unfavourite" : "Favourite"}
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
            color={favourited ? "#626F78" : "#D4AF37"}
        />
    );
};

const DeleteButton = ({db, result}) => (
    <Button 
        title="Delete"
        onPress={() => {
            db.executeSql(
                `DELETE FROM UserCreatedTerms WHERE id = ${result.id};`, 
                []
            ).catch(err => Alert.alert('An error has occured ' + JSON.stringify(err)))
            .then(() => Alert.alert('Item deleted'));
        }} 
        color="#DE1738"
    />
);

export default SearchResults;
