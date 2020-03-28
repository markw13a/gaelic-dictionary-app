import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import {Provider, useDispatch, useSelector} from "react-redux";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs"
import {NavigationContainer} from "@react-navigation/native";

import {SavedView, SavedTabBarIcon} from './js/components/Pages/SavedView';
import {SearchView, SearchTabBarIcon} from './js/components/Pages/SearchView';
import {AddWordView, EditWordView} from './js/components/Pages/WordView';
import store from "./js/redux/store";

import PAGE_NAMES from "./js/components/Pages/PAGE_NAMES";
import { colours } from './js/styles';
import { initialiseDb, closeDb, DB_STATES } from './js/redux/thunks';
import LoadingView from './js/components/Pages/LoadingView';

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
		</DatabaseSetUpAndTearDown>
	</Provider>
);

export default Main;
