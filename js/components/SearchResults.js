import React, {memo} from 'react';
import { useDispatch } from 'react-redux';
import { FlatList, Text, View, StyleSheet } from 'react-native';

import { fontScale, colours } from '../styles';
import { EditWordButton } from './AddWord';
import { IconButton } from './Common';
import { toggleFavourite } from '../redux/thunks';

const resultStyles = StyleSheet.create({
    searchResultContainerOdd: {
		flexDirection: 'row',
		width: '100%',
        padding: 15,
        backgroundColor: colours.background
    },
    searchResultContainerEven: {
		flexDirection: 'row',
		width: '100%',
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: '#ffffff'
    },
    searchResultTextHeader: {
        flexDirection: 'row'
    },
    searchResultGaelic: {
        color: '#000000',
        ...fontScale.fontLarge
    },
    searchResultEnglish: {
        color: '#000000',
        ...fontScale.fontMedium
    },
    searchResultIPA: {
        color: '#000000',
        flex: 1,
        alignSelf: "flex-end",
        // Correct fonts sitting at different vertical heights. Annoying bug.
        paddingBottom: 4,
        paddingHorizontal: 10,
        ...fontScale.fontSmall
    },
	searchResultText: {
		flexDirection: 'column',
        width: '85%',
        paddingHorizontal: 10,
		color: colours.text
    },
    favouriteButton: {
        alignSelf: "center"
    }
});

const ResultHeader = ({gaelic, ipa}) => (
    <View style={resultStyles.searchResultTextHeader}>
        <Text style={resultStyles.searchResultGaelic}>{gaelic}</Text>
        <Text style={resultStyles.searchResultIPA}>{ipa}</Text>
    </View>
);

const Result = memo(
    ({gaelic, english, favourited, rowid, ipa, "user_created": isUserCreated, index}) => (
        <View style={
                index%2 
                ? resultStyles.searchResultContainerOdd
                : resultStyles.searchResultContainerEven
            }>
            <View style={resultStyles.searchResultText}>
                <ResultHeader gaelic={gaelic} ipa={ipa} />
                <Text style={resultStyles.searchResultEnglish}>{english}</Text>
            </View>
            <View style={resultStyles.favouriteButton}>
                {
                    isUserCreated
                    ? <EditWordButton gaelic={gaelic} english={english} favourited={favourited} rowid={rowid} isUserCreated={isUserCreated} />
                    : <FavouriteButton favourited={favourited} rowid={rowid} />
                }
            </View>
        </View>
    )
);

const SearchResults = ({items}) => (
    <FlatList 
        data={items}
        keyExtractor={item => "" + item.rowid}
        renderItem={({item, index}) => <Result {...item} index={index} />}
        style={{backgroundColor: items.length%2 ? colours.background : '#ffffff'}}
    />
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