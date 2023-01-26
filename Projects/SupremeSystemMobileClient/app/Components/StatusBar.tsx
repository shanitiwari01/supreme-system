import React from "react";
import { StatusBar } from 'react-native';
import { ELEMENT_STYLES } from "utility";

/**
 * Common StatusBar component
 * @param {*} props 
 * @returns Status 
 */
export const LHStatusBar = (props: any) => {
    return (
        <>
            <StatusBar
                animated={true}
                backgroundColor={ELEMENT_STYLES.COLORS.FONT_TEXT}
                barStyle={ELEMENT_STYLES.BAR_FONTS.DARK_CONTENT}
                hidden={false} />
        </>
    );
}
