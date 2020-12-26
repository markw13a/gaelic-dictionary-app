import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import {Provider, useDispatch, useSelector} from "react-redux";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs"
import {NavigationContainer} from "@react-navigation/native";

import {SavedView, SavedTabBarIcon, SAVED_ROUTE} from './js/components/Pages/SavedView';
import {SearchView, SearchTabBarIcon, SEARCH_ROUTE} from './js/components/Pages/SearchView';
import WordView from './js/components/Pages/WordView';
import store from "./js/redux/store";

import { colours } from './js/styles';
import { initialiseDb, closeDb, DB_STATES } from './js/redux/thunks';
import LoadingView from './js/components/Pages/LoadingView';
import { ADD_WORD_ROUTE } from './js/components/AddWord';

const Tab = createBottomTabNavigator();

const DatabaseSetUpAndTearDown = ({children}) => {
	const dispatch = useDispatch();
	const {flag} = useSelector(state => state.db);

	useEffect(() => {
		dispatch(initialiseDb());
		return () => dispatch(closeDb());
	}, []);
	
	if(flag === DB_STATES.LOADING) return <LoadingView />
	if(flag === DB_STATES.UPDATING) return <LoadingView message="Updating db..." />
	if(flag === DB_STATES.CLOSED) return <LoadingView message="DB connection has been closed. If you are seeing this message, something has gone wrong. Try restarting the app, and please consider sending an email to markw13a@gmail.com" />

	return children;
};

const Main = () => (
	<Provider store={store}>
		<DatabaseSetUpAndTearDown>
			<NavigationContainer>
				<Tab.Navigator 
					initialRouteName={SEARCH_ROUTE} 
					tabBarOptions={{
						activeTintColor: colours.tabBarButtons,
						showIcon: true
					}}
				>
					<Tab.Screen 
						name={SEARCH_ROUTE} 
						component={SearchView}
						options={{
							tabBarIcon: SearchTabBarIcon
						}} 
					/>
					<Tab.Screen 
						name={SAVED_ROUTE}
						component={SavedView}
						options={{
							tabBarIcon: SavedTabBarIcon
						}} 
					/>
					<Tab.Screen 
						name={ADD_WORD_ROUTE}
						component={WordView}
						options={{
							// Don't want this screen to be reachable via the tab bar
							tabBarButton: () => null
						}}
					/>
				</Tab.Navigator>
			</NavigationContainer>
		</DatabaseSetUpAndTearDown>
	</Provider>
);

export default Main;
