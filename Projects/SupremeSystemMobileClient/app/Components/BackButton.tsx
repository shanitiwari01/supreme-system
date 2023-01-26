import React from "react";
import { View, Pressable, Text } from 'react-native';
import { HeaderStyle as styles, CommonStyle } from "../css/Styles";
import { SvgXml } from 'react-native-svg';
import { GetResourceValue } from '../Functions/CommonFunctions';

/**
 * Common LHBackButton component
 * @param {*} props 
 * @returns Header 
 */
export const LHBackButton = (props: any) => {
    return (
        <>
            <View>
                {
                    props.leftText || props.leftIcon ?
                        <Pressable onPress={() => { props.leftButtonClick() }} hitSlop={CommonStyle.hitSlop}>
                            {
                                props.leftText ?
                                    <Text style={[styles.textStyle, CommonStyle.fontBold]}>{GetResourceValue(props.resources, props.leftText)}</Text>
                                    :
                                    <SvgXml width={35} height={35} xml={props.leftIcon} />
                            }
                        </Pressable>
                        : null
                }
            </View>
        </>
    );
}
