import React, {useCallback} from 'react';
import {useSelector, useDispatch} from "react-redux";
import {Image, View, Text} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import SearchResults from "../SearchResults";
import {AddWordButton} from "../AddWord";
import {refreshSaved} from "../../redux/thunks";

export const SAVED_ROUTE  = "Saved";

export const SavedTabBarIcon = ({color}) => (
	<Image
		source={require('../../../res/save.png')}
		style={{
			width: 25,
			height: 25,
		}}
		tintColor={color}
	/>
);

/**
 * Displays all words favourited or created by the user
 */
export const SavedView = () => {
	const savedItems = useSelector(state => state.saved.savedItems);
	const dispatch = useDispatch();

	useFocusEffect(
		useCallback(() => {
			dispatch(refreshSaved())
		}, [])
	);
	
	return (
		<>
			{
				(savedItems && savedItems.length === 0)
				? <View style={{flex:1}}><Text>You haven't favourited any words or phrases yet.</Text></View>
				: <SearchResults items={savedItems} />
			}
			<AddWordButton />
		</>
	);
};
