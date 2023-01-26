/**
 * React Native App
 * Everything starts from the Entry-point
 */
import React, { useEffect } from 'react';
import { ActivityIndicator, Dimensions } from 'react-native';
import { Provider, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { Provider as PaperProvider, DefaultTheme as PaperDefaultTheme } from 'react-native-paper';
import Navigator from './navigation';
import configureStore from './store';
let { persistor, store } = configureStore();
import * as themeActions from './store/actions/themeActions';
import { ELEMENT_STYLES } from "utility";

declare global {
    var BEFORE_LOGIN: boolean;
}
global.BEFORE_LOGIN = true;

export const PaperThemeDefault = {
    ...PaperDefaultTheme,
    colors: {
        ...PaperDefaultTheme.colors,
        primary: ELEMENT_STYLES.COLORS.LIGHT_BLUE,
    },
};

const RootNavigation: React.FC = () => {
    let dispatch = useDispatch();

    useEffect(() => {
        // subscribe event
        HandleDimensions();
        Dimensions.addEventListener("change", () => HandleDimensions());
    }, []);

    const HandleDimensions = () => {
        let dim = Dimensions.get('window');
        if (dim.height >= dim.width) {
            dispatch(themeActions.setIsPortrait(true, dim.height, dim.width));
        } else {
            dispatch(themeActions.setIsPortrait(false, dim.height, dim.width));
        }
    }

    return (
        <PaperProvider theme={PaperThemeDefault}>
            <Navigator />
        </PaperProvider>
    );
};

const EntryPoint: React.FC = () => {
    return (
        <Provider store={store}>
            <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
                <RootNavigation />
            </PersistGate>
        </Provider>
    );
};

export default EntryPoint;
