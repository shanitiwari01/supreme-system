import * as React from 'react';
import { Text } from 'react-native';
import { HELP_ICON, CUSTOM_CONSTANTS } from 'utility';
import { SvgXml } from 'react-native-svg';
import { Popable } from 'react-native-popable';
import { CommonStyle } from "../css/Styles";

export const LHInfoValue = (props: any) => {
    return (
        <>
            {
                props.message ?
                    <Popable content={<Text style={CommonStyle.InfoLabelStyle}>{props.message}</Text>}>
                        <><SvgXml width={CUSTOM_CONSTANTS.SVG.WIDTH.SMALL} height={CUSTOM_CONSTANTS.SVG.HEIGHT.SMALL} xml={HELP_ICON} hitSlop={CommonStyle.hitSlop} /></>
                    </Popable> : <></>
            }
        </>
    )
}
