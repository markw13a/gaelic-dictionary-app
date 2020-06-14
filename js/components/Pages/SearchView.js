import React from 'react';
import {useSelector, useDispatch} from "react-redux";
import {Text, Image, View} from 'react-native';

import {fontScale, colours} from '../../styles';
import SearchResults from '../SearchResults';
import {AddWordButton} from '../AddWord';
import {TextInputWithCross} from '../Common';
import {updateSearchAndRefresh} from "../../redux/thunks";
import {setWordKey} from "../../redux/actions";

const SearchTabBarIcon = ({color}) => (
	<Image
		source={require('../../../res/search.png')}
		style={{
			width: 25,
			height: 25,
		}}
		tintColor={color}
	/>
);

const SearchView = () => {
	const dispatch = useDispatch();
	const { searchTerm, searchResults } = useSelector(state => state.search);
	return (
		<>
			<SearchBar searchTerm={searchTerm} />
			{
				searchResults && searchResults.length === 0 && searchTerm
				? (
					<View style={{flex:1, alignItems: 'center', backgroundColor: colours.background, padding: 15}}>
						<Text style={{...fontScale.fontSmall}}> 
							No results. Click below to add this word to your saved searches 
						</Text>
						<AddWordButton onPress={() => dispatch(setWordKey({key: "gaelic", value: searchTerm}))} />
					</View>
				)
				: <SearchResults items={searchResults} />
			}
		</>
	);
};

const SearchBar = ({searchTerm}) => {
	const dispatch = useDispatch();

	return (
		<View style={{backgroundColor: '#055577', paddingVertical: '3%'}}>
			<TextInputWithCross
				onChange={text => dispatch(updateSearchAndRefresh(text))} 
				onClear={() => dispatch(updateSearchAndRefresh(""))}
				value={searchTerm} 
				placeholder="Search..." 
			/>
		</View>
	);
};

export {
	SearchView,
	SearchTabBarIcon
}