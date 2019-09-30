import React, {useState} from 'react';
import {Alert, Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';

import styles from '../res/styles';
import {EditWordButton} from './AddWord';

const SearchResults = ({items, db}) => ( 
    <ScrollView>
        {items && items.map( (result, i) => 
            <Result 
                key={JSON.stringify(result)} 
                result={result} 
                db={db} 
            />
        )}
    </ScrollView>
);

const Result = ({result, db}) => (
    <View style={styles.searchResultContainer}>
        <View style={styles.searchResultText}>
            <Text style={{fontSize: 22}}> {result.gaelic} </Text>
            <Text style={{fontSize: 22}}> {result.english} </Text>
        </View>
        <View>
            {result["user_created"]
                ? EditWordButton({initialValues:result})
                : FavouriteButton({db, result})
            }
        </View>
    </View>
);

const FavouriteButton = ({db, result}) => {
    // Use state to immediately show effects of favourite/unfavourite without having to refresh data from database
    const [favourited, setFavourited] = useState(result.favourited);

    return (
        <TouchableOpacity
            onPress={e => {
                // Toggle value of favourited
                db.executeSql(
                    "UPDATE faclair " + 
                    "SET favourited = " + (favourited === 0 ? new Date().getTime() : 0) + 
                    " WHERE rowid = " + result.rowid + ";", 
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
                ? <Image style={styles.favouriteButtonImage} source={require('../res/star-solid.png')} /> 
                : <Image style={styles.favouriteButtonImage} source={require('../res/star-regular.png')} />
            }
        </TouchableOpacity>
    );
};

export default SearchResults;