import React from "react";
import { View, Pressable, Text, StatusBar, Image } from 'react-native';
import { HeaderStyle as styles, CommonStyle } from "../css/Styles";
import { ELEMENT_STYLES, LINEAR_GRADIENT } from "utility";
import { useSelector } from 'react-redux';
import { SvgXml } from 'react-native-svg';
import { LHLinearGradient } from "./LinearGradient";
import { IState } from "./ReducerInterface";
import { GetResourceValue } from '../Functions/CommonFunctions';
import { TouchableOpacity } from "react-native-gesture-handler";

/**
 * Common HeaderBar component
 * @param {*} props 
 * @returns Header 
 */
export const LHHeaderBar = (props: any) => {
    let width = useSelector((state: IState) => state.themeReducer.width);

    return (
        <>
            <LHLinearGradient
                colors={LINEAR_GRADIENT.COLORS.PRIMARY}
                style={[styles.container, { width: width }]}>
                <StatusBar
                    animated={true}
                    backgroundColor={ELEMENT_STYLES.COLORS.PRIMARY}
                    barStyle={ELEMENT_STYLES.BAR_FONTS.DEFAULT}
                    hidden={false} />
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
                <View>
                    <Text style={[styles.textStyle, CommonStyle.fontRegular]}>{GetResourceValue(props.resources, props.title) ? GetResourceValue(props.resources, props.title) : ""}</Text>
                </View>
                <View>
                    {
                        props.rightText || props.rightIcon ?
                            <TouchableOpacity testID={props.rightText} onPress={() => { props.rightButtonClick() }} hitSlop={CommonStyle.hitSlop}>
                                {
                                    props.rightText ?
                                        <Text style={[styles.textStyle, CommonStyle.fontBold]}>{GetResourceValue(props.resources, props.rightText)}</Text>
                                        :
                                        <Image source={props.rightIcon} style={styles.icon} />
                                }
                            </TouchableOpacity>
                            : null
                    }
                </View>
            </LHLinearGradient>
        </>
    );
}
