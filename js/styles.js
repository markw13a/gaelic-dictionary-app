import {StyleSheet} from 'react-native';

const colours = {
	background: '#f3f3f3',
	text: '#000000',
	// Use different colours for buttons that control current view vs buttons that switch views
	// Helps to emphasise that these are fundamentally different
	interactables: '#2685AD',
	hotBarButtons: '#20BA96'
};

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
		height: '100%',
		backgroundColor: colours.background
	},
	searchBar: {
		// width: '90%',
		backgroundColor: '#ffffff'
	},
	searchResultContainer: {
		flexDirection: 'row',
		width: '100%',
		marginVertical: '5%'
	},
	searchResultText: {
		flexDirection: 'column',
		width: '85%',
		color: colours.text
	},
	scrollView: {
		width: '100%'
	},
	buttonGroup: {
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'space-evenly'
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
		// marginVertical: '2%',
		...fontScale.fontLarge,
		color: colours.text
	},
	// Button is sometimes unclickable without this property set
	favouriteButtonContainer: {
		height: 50,
		width: 50,
		borderRadius: 25,
		
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colours.interactables
	},
	// Apparently React-Native needs both dimensions to be specified. Feel like there must be a way to only set one dimension and have the other automatically determined by aspect-ratio.
	favouriteButtonImage: {
		height: 40,
		width: 40
	}
});

export default styles;
export {
	styles,
	fontScale,
	colours
}