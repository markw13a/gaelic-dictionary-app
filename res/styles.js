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
		height: 'auto',
		width: '100%'
	},
	buttonGroup: {
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'space-evenly'
	},
	button: {
		width: '30%'
	},
	favouriteButtonContainer: {
		width: '10%'
	},
	// Apparently React-Native needs both dimensions to be specified. Feel like there must be a way to only set one dimension and have the other automatically determined by aspect-ratio.
	favouriteButtonImage: {
		height: 30,
		width: 33.75
	}
});