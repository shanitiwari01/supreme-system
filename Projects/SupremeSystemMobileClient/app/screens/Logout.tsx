import React, { useEffect } from "react";
import { View } from "react-native";
import { LogoutUserAsync } from "./../Functions/CommonFunctions";
import { useIsFocused } from "@react-navigation/native";

export const Logout = () => {
    let isFocused = useIsFocused();
    useEffect(() => {
        if(isFocused){
            // LogoutUserAsync();
        }
    }, [isFocused]);

    return (
        <View></View>
    );
};