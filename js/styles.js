import {StyleSheet} from 'react-native';

const colours = {
	background: '#effbff',
	text: '#000000',
	// Use different colours for buttons that control current view vs buttons that switch views
	// Helps to emphasise that these are fundamentally different
	interactables: '#2685AD',
	interactablesDark: '#195771',
	tabBarButtons: '#20BA96'
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
	horizontalButtonGroup: {
		flexDirection: 'row',
		alignItems: 'stretch'
	},
	verticalButtonGroup: {
		flexDirection: 'column',
		justifyContent: 'space-evenly',
		alignItems: 'center'
	},
	themedButton: {
		marginVertical: "4%",
		width: '60%',
		backgroundColor: colours.background
	},
	favouriteButtonContainer: {
		height: 45,
		width: 45,
		borderRadius: 22.5,
		
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colours.interactables
	},
	favouriteButtonImage: {
		height: 27,
		width: 27
	}
});

export default styles;
export {
	styles,
	fontScale,
	colours
}