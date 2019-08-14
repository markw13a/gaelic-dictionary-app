import {StyleSheet} from 'react-native';

export default StyleSheet.create({
	appContainer: {
		flex: 1,
		flexDirection: 'column',
		width: '100%',
		height: '100%'
		// alignItems: 'flex-start'
	},
	container: {
	  flex: 1,
	  justifyContent: 'center',
	  alignItems: 'center',
	  backgroundColor: '#F5FCFF',
	},
	welcome: {
	  fontSize: 20,
	  textAlign: 'center',
	  margin: 10,
	},
	instructions: {
	  textAlign: 'center',
	  color: '#333333',
	  marginBottom: 5,
	},
	searchBar: {
		backgroundColor: '#F3F3F3',
		width: '100%',
		position: 'absolute',
		top: 0
	}
});