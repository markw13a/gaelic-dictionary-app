import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {FlatList, Text, View} from 'react-native';

import styles, {fontScale} from '../styles';
import {EditWordButton} from './AddWord';
import { IconButton } from './Common';
import { toggleFavourite } from '../redux/thunks';

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
    const dispatch = useDispatch();

    return (
        <IconButton 
            title="Favourite"
            onPress={() => dispatch(toggleFavourite({rowid, favourited}))}
            source={
                favourited 
                ? require('../../res/star-solid.png')
                : require('../../res/star-regular.png')
            }
        />
    );
};

export default SearchResults;