import {StyleSheet} from 'react-native';

const baseFont = 18;
const fontScale = StyleSheet.create({
	fontSmall: {
		fontSize: baseFont
	},
	fontMedium: {
		fontSize: baseFont * 1.333
	},
	fontLarge: {
		fontSize: baseFont * 1.777
	}
});

// TODO: break this up in to smaller, more easily searchable, stylesheets
const styles = StyleSheet.create({
	appContainer: {
		flex: 1,
		flexDirection: 'column',
		width: '100%',
		height: '100%'
	},
	searchBar: {
		width: '80%'
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
		minHeight: fontScale.fontMedium.fontSize * 2,
		backgroundColor: '#808080',
		alignItems: "center",
		justifyContent: "center"
	},
	verticalButtonGroup: {
		flexDirection: 'column',
		justifyContent: 'space-evenly',
		alignItems: 'center'
	},
	addWordOptionButton: {
		marginVertical: "4%",
		width: '60%'
	},
	textInput: {
		backgroundColor: '#F3F3F3',
		marginBottom: '4%',
		...fontScale.fontLarge
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

export default styles;
export {
	styles,
	fontScale
}