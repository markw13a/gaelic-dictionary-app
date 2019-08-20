import {StyleSheet} from 'react-native';

export default StyleSheet.create({
	appContainer: {
		flex: 1,
		flexDirection: 'column',
		width: '100%',
		height: '100%',
		// justifyContent: 'center',
		// alignItems: 'center'
	},
	searchBar: {
		backgroundColor: '#F3F3F3',
		width: '100%',
	},
	searchResultContainer: {
		flex: 1,
		flexDirection: 'column',
		width: '100%'
	},
	searchResult: {
		width: '100%',
		marginVertical: '5%'
	},
	scrollView: {
		width: '100%',
	},

	buttonGroup: {
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'space-evenly',
		marginVertical: 20
	},
	button: {
	// 	height: '1rem',
		width: '30%'
	}
});