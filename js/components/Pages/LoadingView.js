import React from "react";
import {View, Text} from 'react-native';
import styles, {fontScale} from '../../../js/styles';

export const LOADING_ROUTE = "Loading";

// TODO: implement a proper loading view
const LoadingView = ({message="Loading..."}) => (
	<View style={styles.appContainer}>
		<Text style={fontScale.fontLarge} > 
			{message}
		</Text>
	</View>
);

export default LoadingView;
