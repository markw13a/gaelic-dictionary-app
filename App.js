import 'react-native-gesture-handler';
import React from 'react';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs"
import {NavigationContainer} from "@react-navigation/native";

import {SavedView, SavedTabBarIcon} from './js/components/Pages/SavedView';
import {SearchView, SearchTabBarIcon} from './js/components/Pages/SearchView';
import {AddWordView, EditWordView} from './js/components/Pages/WordView';

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
						tabBarIcon: SearchTabBarIcon
					}} 
				/>
				<Tab.Screen 
					name={PAGE_NAMES.SAVED}
					component={SavedView}
					options={{
						tabBarIcon: SavedTabBarIcon
					}} 
				/>
				<Tab.Screen 
					name={PAGE_NAMES.ADD_WORD}
					component={AddWordView}
					options={{
						// Don't want this screen to be reachable via the tab bar
						tabBarButton: () => null
					}}
				/>
				<Tab.Screen 
					name={PAGE_NAMES.EDIT_WORD}
					component={EditWordView}
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
