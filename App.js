import 'react-native-gesture-handler';
import React from 'react';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs"
import {NavigationContainer} from "@react-navigation/native";

import {SavedView, SavedViewIcon} from './js/components/Pages/SavedView';
import {SearchView, SearchViewIcon} from './js/components/Pages/SearchView';
import {WordView} from './js/components/Pages/WordView';

import PAGE_NAMES from "./js/components/Pages/PAGE_NAMES";
import {DbProvider} from "./js/db";
import { colours } from './js/styles';

const Tab = createBottomTabNavigator();

const Main = () => (
	<DbProvider>
		<NavigationContainer>
			<Tab.Navigator 
				initialRouteName={PAGE_NAMES.SEARCH} 
				tabBarOptions={{
					activeTintColor: colours.tabBarButtons,
					showIcon: true
				}}
			>
				<Tab.Screen 
					name={PAGE_NAMES.SEARCH} 
					component={SearchView}
					options={{
						tabBarIcon: SearchViewIcon
					}} 
				/>
				<Tab.Screen 
					name={PAGE_NAMES.SAVED}
					component={SavedView}
					options={{
						tabBarIcon: SavedViewIcon
					}} 
				/>
				<Tab.Screen 
					name={PAGE_NAMES.WORD}
					component={WordView}
					options={{
						// Don't want this screen to be reachable via the tab bar
						tabBarButton: () => null
					}}
				/>
			</Tab.Navigator>
		</NavigationContainer>
	</DbProvider>
);

export default Main;
