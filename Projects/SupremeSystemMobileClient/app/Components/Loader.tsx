import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { CUSTOM_CONSTANTS, ELEMENT_STYLES } from "utility";
import { LoadingStyle, PassCodeStyle } from "../css/Styles";
import { IState } from "./ReducerInterface";

export const LHLoading = () => {
    let loading = useSelector((state: IState) => state.loaderReducer.loading);
    return (
        loading ?
            <View style={LoadingStyle.container}>
               
                <ActivityIndicator
                    size={CUSTOM_CONSTANTS.LOADER_SIZE.LARGE}
                    color={ELEMENT_STYLES.COLORS.PRIMARY}
                    animating={loading}
                />
                <Text style={LoadingStyle.LoadingText}>Please Wait</Text>
            </View> : null
    );
}