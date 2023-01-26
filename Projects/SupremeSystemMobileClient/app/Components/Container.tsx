import React from "react";
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { ModeStyle, HeaderStyle, CommonStyle } from "../css/Styles";
import { IState } from "./ReducerInterface";
import { LHLoading } from "./Loader";
import { LHSnackBar } from "./SnackBar";
import { ScrollView } from "react-native-gesture-handler";

export const LHContainer = (props: any) => {
    let isPortrait = useSelector((state: IState) => state.themeReducer.isPortrait);

    const RenderContainer = () => {
        return (
            <View style={isPortrait ? ModeStyle.portrait : ModeStyle.landscape}>
                <>{props.children}</>
            </View>
        )
    }

    return (
        <>
            <LHLoading />
            <View style={HeaderStyle.snackBar}>
                <LHSnackBar />
            </View>
            {props.scrollView === false ? (
                <View style={CommonStyle.container}>
                    {RenderContainer()}
                </View>
            ) : (
                <ScrollView >
                    <View style={CommonStyle.container}>
                        {RenderContainer()}
                    </View>
                </ScrollView>
            )}
        </>
    );
}
