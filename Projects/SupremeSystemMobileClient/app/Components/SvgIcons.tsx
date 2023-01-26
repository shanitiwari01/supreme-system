import React from "react";
import { SvgXml } from "react-native-svg";
import { CUSTOM_CONSTANTS, REPLACE_FIELDS } from "utility";

export const LHSvgIcon = (props: any) =>{
    let icon = props.icon.replace(REPLACE_FIELDS.COLOR, props.color);
    
    return(
        <SvgXml width={CUSTOM_CONSTANTS.SVG.WIDTH.LARGE} height={CUSTOM_CONSTANTS.SVG.HEIGHT.LARGE} xml={icon} />
    )
}