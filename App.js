import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-gesture-handler';

import LoginScreen from './src/screens/authentication/LoginScreen';
import RegistrationScreen from './src/screens/authentication/RegistrationScreen';
import ProfileScreen from './src/screens/profile/ProfileScreen';
import DashboardScreen from './src/screens/dashboard/DashboardScreen';
import CustomDrawer from './src/components/CustomNavigationDrawer';

import Ionicons from 'react-native-vector-icons/Ionicons';
import ProfilePictureScreen from './src/screens/profile/ProfilePictureScreen';
import EditProfileScreen from './src/screens/profile/EditProfileScreen';
import WeatherScreen from './src/screens/weather/WeatherScreen';
import LiveStreamScreen from './src/screens/live stream/LiveStreamScreen';
import LiveContentScreen from './src/screens/live stream/LiveContentScreen';
import ListBleDevicesScreen from './src/screens/ble/ListBleDevicesScreen';


function SideNavigation() {

	const Drawer = createDrawerNavigator();

	return (
		<Drawer.Navigator initialRouteName="Dashboard"
			drawerContent={props => <CustomDrawer {...props} />}
			screenOptions={
				{
					// headerShown: false,
					// drawerActiveBackgroundColor: '#aa18ea',
					// drawerActiveTintColor: '#fff',
					// drawerInactiveTintColor: '#333',

					drawerStyle: {
						width: 240
					},
					drawerLabelStyle: {
						marginLeft: 5,
						//fontFamily: 'Roboto-Medium',
						fontSize: 15,
					},
				}
			}

		>
			<Drawer.Screen name="Dashboard" component={DashboardScreen} />
			<Drawer.Screen name="Profile" component={ProfileScreen} /*options={ { drawerIcon: ({color}) => (<Ionicons name="person-outline" size={22} color={color} />) } }*/ />
			<Drawer.Screen name="Weather" component={WeatherScreen} />
			<Drawer.Screen name="Live Stream" component={LiveStreamScreen} />
			<Drawer.Screen name="Bluetooth" component={ListBleDevicesScreen} />
		</Drawer.Navigator>
	);
}

const Stack = createNativeStackNavigator();

function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name="Login" component={LoginScreen} />
				<Stack.Screen name="Registration" component={RegistrationScreen} />
				<Stack.Screen options={{ headerShown: false }} name="Side Navigation" component={SideNavigation} />
				<Stack.Screen name="Profile Picture" component={ProfilePictureScreen} /*options={{ drawerItemStyle: { display: "none" } }}*/ />
				<Stack.Screen name="Edit Profile" component={EditProfileScreen} />
				<Stack.Screen name="Live Content" component={LiveContentScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default App;