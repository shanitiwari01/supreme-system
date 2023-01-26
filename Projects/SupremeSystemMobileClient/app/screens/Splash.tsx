import React, { useEffect } from 'react';
import { View } from 'react-native';
import { SetUpApplicationAsync } from "../Functions/CommonFunctions";
import { SplashSceenStyle } from '../css/Styles';

export const Splash = () => {
    useEffect(() => {
        SetUpApplicationAsync();
    }, []);

    return (
        <View style={SplashSceenStyle.logoContainer}>
        </View>
    );
};