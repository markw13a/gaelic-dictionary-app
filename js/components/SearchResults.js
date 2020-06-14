import React, { memo, useMemo } from 'react';
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
        paddingVertical: 5,
        ...fontScale.fontMedium
    },
    searchResultIPA: {
        color: '#000000',
        flex: 1,
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
const Gaelic = ({ gaelic }) => (
    <View style={resultStyles.searchResultTextHeader}>
        <Text style={resultStyles.searchResultGaelic}>
            {gaelic}
        </Text>
    </View>
);
const English = ({ english }) => {
    // Split the results string in to an array if multiple definitions are returned
    // TODO: might be best to look at a way to handle this on the DB-side in future
    // This is a quick way of achieving the desired result for now
    const definitions = useMemo(() => {
        const entries = english.split(/[0-9]([^0-9]*)/g);

        // String is not in the form of a numbered list
        // No processing required
        if(!entries) {
            return [ english ];
        }

        return entries.reduce((out, entry) => {
            // Remove blank entries
            if(!entry) {
                return out;
            }
            // Remove trailing spaces
            out.push(entry.trim());
            return out;
        }, []);
    }, [english]);

    return (
        <View>
            {
                definitions.length === 1
                ? <Text style={resultStyles.searchResultEnglish}>{ definitions[0] }</Text>
                : (
                    definitions.map((definition, index) => (
                        <Text style={resultStyles.searchResultEnglish} key={definition}>
                            { `${index + 1}. ${definition}` }
                        </Text>
                    ))
                )
            }
        </View>
    );
};
const IPA = ({ ipa }) => ipa ? <Text style={resultStyles.searchResultIPA}>{ipa}</Text> : null;

const Result = memo(
    ({gaelic, english, favourited, id, ipa, "user_created": isUserCreated, index}) => (
        <View style={
                index%2 
                ? resultStyles.searchResultContainerOdd
                : resultStyles.searchResultContainerEven
            }>
            <View style={resultStyles.searchResultText}>
                <Gaelic gaelic={gaelic} />
                <IPA ipa={ipa} />
                <English english={english} />
            </View>
            <View style={resultStyles.favouriteButton}>
                {
                    isUserCreated
                    ? <EditWordButton gaelic={gaelic} english={english} favourited={favourited} id={id} isUserCreated={isUserCreated} />
                    : <FavouriteButton favourited={favourited} id={id} />
                }
            </View>
        </View>
    )
);

const SearchResults = ({items}) => (
    <FlatList 
        data={items}
        keyExtractor={item => "" + item.id}
        renderItem={({item, index}) => <Result {...item} index={index} />}
        style={{backgroundColor: items.length%2 ? colours.background : '#ffffff'}}
    />
);

const FavouriteButton = ({favourited, id}) => {
    const dispatch = useDispatch();

    return (
        <IconButton 
            title="Favourite"
            onPress={() => dispatch(toggleFavourite({id, favourited}))}
            source={
                favourited 
                ? require('../../res/star-solid.png')
                : require('../../res/star-regular.png')
            }
        />
    );
};

export default SearchResults;