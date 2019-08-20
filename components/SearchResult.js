import React from 'react';
import {ScrollView, Text, View} from 'react-native';

import styles from '../res/styles';

const Result = ({result}) => (
    <View style={styles.searchResult}>
        <Text> {result.gaelic} </Text>
        <Text> {result.english} </Text>
    </View>
);

const SearchResults = ({results}) => ( 
    <ScrollView contentContainerStyle={styles.scrollView}>
        {results && results.map( (result, i) => <Result key={i} result={result} />)}
    </ScrollView>
);

export default SearchResults;
