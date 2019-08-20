import React from 'react';
import {ScrollView, Text, View} from 'react-native';

import styles from '../res/styles';

const Result = ({result}) => (
    <View style={styles.searchResult}>
        <Text style={{fontSize: 20}}> {result.gaelic} </Text>
        <Text style={{fontSize: 20}}> {result.english} </Text>
    </View>
);

const SearchResults = ({results}) => ( 
    <ScrollView contentContainerStyle={styles.scrollView}>
        {results && results.map( (result, i) => <Result key={i} result={result} />)}
    </ScrollView>
);

export default SearchResults;
