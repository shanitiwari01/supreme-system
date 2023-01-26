import 'react-native-gesture-handler';
import React from 'react';
import { Home } from "../screens/Home";
import { Students } from './../screens/Student/Students';
import { Splash } from "./../screens/Splash";
import { Languages } from '../screens/Languages';
import { SignIn } from '../screens/SignIn';
import { SignUp } from '../screens/SignUp';
import { OTPCode } from '../screens/OTPCode';
import { AddEditStudent } from '../screens/Student/AddEditStudent';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LHSvgIcon } from '../Components/SvgIcons';
import { navigationRef } from './NavigationService';
import { HOME_ICON, USERS_ICON, LOGOUT_ICON, MOBILE_SCREENS, ELEMENT_STYLES } from 'utility';
import { PassCode } from '../screens/PassCode';
import { ErrorScreen } from "../screens/ErrorScreen";
import { Settings } from '../screens/Settings';
import { ForgotPassword } from '../screens/forgotPassword';

import RNBootSplash from "react-native-bootsplash";

const Tab = createBottomTabNavigator();

function TabNavigation() {
    return (
        <Tab.Navigator screenOptions={({ route }) => ({
            tabBarIcon: ({ color }) => {
                if (route.name === MOBILE_SCREENS.HOME) {
                    return <LHSvgIcon color={color} icon={HOME_ICON} />
                } else if (route.name === MOBILE_SCREENS.STUDENTS) {
                    return <LHSvgIcon color={color} icon={USERS_ICON} />
                } else if (route.name === MOBILE_SCREENS.SETTINGS) {
                    return <LHSvgIcon color={color} icon={LOGOUT_ICON} />
                }
            },
            tabBarActiveTintColor: ELEMENT_STYLES.COLORS.PRIMARY,
            tabBarInactiveTintColor: ELEMENT_STYLES.COLORS.TEXT,
        })}>
            <Tab.Screen name={MOBILE_SCREENS.HOME} component={Home} options={{ headerShown: false }} />
            <Tab.Screen name={MOBILE_SCREENS.STUDENTS} component={Students} options={{ headerShown: false }} />
            <Tab.Screen name={MOBILE_SCREENS.SETTINGS} component={Settings} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
}

const Stack = createStackNavigator();
export default function StackNavigation() {
    return (
        <NavigationContainer ref={navigationRef} onReady={() => RNBootSplash.hide()}>
            <Stack.Navigator>
                <Stack.Screen
                    name={MOBILE_SCREENS.SPLASH}
                    component={Splash}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name={MOBILE_SCREENS.OTP_CODE}
                    component={OTPCode}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name={MOBILE_SCREENS.SIGNIN}
                    component={SignIn}
                    options={{ headerShown: false }}
                />
                 <Stack.Screen
                    name={MOBILE_SCREENS.FORGOT_PASSWORD}
                    component={ForgotPassword}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name={MOBILE_SCREENS.SIGNUP}
                    component={SignUp}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name={MOBILE_SCREENS.OTP_USER}
                    component={OTPCode}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name={MOBILE_SCREENS.PASSCODE}
                    component={PassCode}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name={MOBILE_SCREENS.LANGUAGE}
                    component={Languages}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name={MOBILE_SCREENS.HOME}
                    component={TabNavigation}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name={MOBILE_SCREENS.STUDENTS}
                    component={Students}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name={MOBILE_SCREENS.ADD_EDIT_STUDENT}
                    component={AddEditStudent}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name={MOBILE_SCREENS.ERROR_SCREEN}
                    component={ErrorScreen}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}