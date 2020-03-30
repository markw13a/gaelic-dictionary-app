import React from 'react';
import { useDispatch } from 'react-redux';
import {FlatList, Text, View} from 'react-native';

import styles, {fontScale} from '../styles';
import {EditWordButton} from './AddWord';
import { IconButton } from './Common';
import { toggleFavourite } from '../redux/thunks';

class Result extends React.PureComponent {
    render() {
        const {gaelic, english, favourited, rowid, "user_created": isUserCreated} = this.props;

        return (
            <View style={styles.searchResultContainer}>
                <View style={styles.searchResultText}>
                    <Text style={{...fontScale.fontMedium, color: '#000000'}}> {gaelic} </Text>
                    <Text style={{...fontScale.fontMedium, color: '#000000'}}> {english} </Text>
                </View>
                <View>
                    {
                        isUserCreated
                        ? <EditWordButton gaelic={gaelic} english={english} favourited={favourited} rowid={rowid} isUserCreated={isUserCreated} />
                        : <FavouriteButton favourited={favourited} rowid={rowid} />
                    }
                </View>
            </View>
        );
    }
};

const SearchResults = ({items}) => (
    <FlatList 
        data={items}
        keyExtractor={item => "" + item.rowid}
        renderItem={({item}) => <Result {...item} />}
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