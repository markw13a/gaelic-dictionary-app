import {StyleSheet} from 'react-native';

export default StyleSheet.create({
	appContainer: {
		flex: 1,
		flexDirection: 'column',
		width: '100%',
		height: '100%'
	},
	searchBar: {
		backgroundColor: '#F3F3F3',
		width: '100%'
	},
	searchResultContainer: {
		flexDirection: 'row',
		width: '100%',
		marginVertical: '5%'
	},
	searchResultText: {
		flexDirection: 'column',
		width: '85%'
	},
	scrollView: {
		width: '100%'
	},
	buttonGroup: {
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'space-evenly',
		backgroundColor: '#333333'
	},
	button: {
		width: '30%',
		backgroundColor: '#808080'
	},
	verticalButtonGroup: {
		flexDirection: 'column',
		justifyContent: 'space-evenly'
	},
	addWordOptionButton: {
		flex: 1,
		marginVertical: "8%"
	},
	addWordTextInput: {
		backgroundColor: '#F5F5F5',
		marginVertical: 5
	},
	// Button is sometimes unclickable without this property set
	favouriteButtonContainer: {
		flex: 1
	},
	// Apparently React-Native needs both dimensions to be specified. Feel like there must be a way to only set one dimension and have the other automatically determined by aspect-ratio.
	favouriteButtonImage: {
		height: 35,
		width: 39.375
	}
});