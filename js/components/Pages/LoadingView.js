import React from "react";
import {View, Text} from 'react-native';
import styles, {fontScale} from '../../../js/styles';

// TODO: implement a proper loading view
const LoadingView = () => (
	<View style={styles.appContainer}>
		<Text style={fontScale.fontLarge} > 
			Initialising database... 
		</Text>
	</View>
);

export default LoadingView;
