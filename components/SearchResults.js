import React, {useState} from 'react';
import {Button, ScrollView, Text, View} from 'react-native';

import styles from '../res/styles';

const SearchResults = ({results, db}) => ( 
    <ScrollView contentContainerStyle={styles.scrollView}>
        {results && results.map( (result, i) => <Result key={i} result={result} db={db} />)}
    </ScrollView>
);

const Result = ({result:{id, gaelic, english, ...rest}, db}) => {
    // Use state to immediately show effects of favourite/unfavourite without having to refresh data from database
    const [favourited, setFavourited] = useState(rest.favourited);

    return (
        <>
            <View style={styles.searchResult}>
                <Text style={{fontSize: 20}}> {gaelic} </Text>
                <Text style={{fontSize: 20}}> {english} </Text>
            </View>
            <View>
                <Button 
                    title={favourited ? "Unfavourite" : "Favourite"}
                    onPress={() => {
                        // Toggle value of favourited
                        db.executeSql(
                            "UPDATE faclair " + 
                            "SET favourited = " + (favourited ? 0 : 1) + 
                            " WHERE id = " + id + ";", 
                            []
                        ).then(() => {
                            // Update local copy so that user sees feedback
                            setFavourited(favourited ? 0 : 1); 
                        });
                    }} 
                    color={favourited ? "#626F78" : "#D4AF37"}
                />
            </View>
        </>
    );
};

export default SearchResults;
