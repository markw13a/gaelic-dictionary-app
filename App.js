import 'react-native-gesture-handler';
import React from 'react';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs"
import {NavigationContainer} from "@react-navigation/native";

import {SavedView, SavedViewIcon} from './js/components/Pages/SavedView';
import {SearchView, SearchViewIcon} from './js/components/Pages/SearchView';
import {DbProvider} from "./js/db";
import { colours } from './js/styles';

const Tab = createBottomTabNavigator();

const Main = () => (
	<DbProvider>
		<NavigationContainer>
			<Tab.Navigator 
				initialRouteName="Search" 
				tabBarOptions={{
					activeTintColor: colours.tabBarButtons,
					showIcon: true
				}}
			>
				<Tab.Screen 
					name="Search" 
					component={SearchView}
					options={{
						tabBarIcon: SearchViewIcon
					}} 
				/>
				<Tab.Screen 
					name="Save" 
					component={SavedView}
					options={{
						tabBarIcon: SavedViewIcon
					}} 
				/>
			</Tab.Navigator>
		</NavigationContainer>
	</DbProvider>
);

export default Main;
