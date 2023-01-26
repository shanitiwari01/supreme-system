import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { ErrorScreenStyle } from "../css/Styles";
import { CUSTOM_RESOURCE_CONSTANTS, CUSTOM_CONSTANTS, ERROR_CODES, LINEAR_GRADIENT, NO_NET, CHECK_INTERNET_INTERVAL } from "utility";
import { LHSubmitButton } from "../Components/CustomFields";
import { SvgXml } from "react-native-svg";
import { SetUpApplicationAsync } from "../Functions/CommonFunctions";
import { CommonMBL } from "mobilebusinesslayer";
import { useIsFocused } from "@react-navigation/native";

export const ErrorScreen = (props: any) => {
    let ERROR_CODE = props.route.params.errorcode;
    let [title, setTitle] = useState("");
    let [description, setDescription] = useState("");
    const isFocused = useIsFocused();
    let commonMBL = new CommonMBL();

    useEffect(() => {
        if (ERROR_CODE == ERROR_CODES.NO_INTERNET) {
            setTitle(CUSTOM_RESOURCE_CONSTANTS.NO_INTERNET_TITLE);
            setDescription(CUSTOM_RESOURCE_CONSTANTS.NO_INTERNET_DESCRIPTION);
            let checkNet = setInterval(async () => {
                if (isFocused) {
                    await RefreshPageAsync();
                }
                clearInterval(checkNet);
            }, CHECK_INTERNET_INTERVAL);
        }
        else if (ERROR_CODE == ERROR_CODES.JAIL_BROKEN) {
            setTitle(CUSTOM_RESOURCE_CONSTANTS.JAILBROKEN_TITLE);
            setDescription(CUSTOM_RESOURCE_CONSTANTS.JAILBROKEN_DESCRIPTION);
        }
        else if (ERROR_CODE == ERROR_CODES.DATA_SYNC_ERROR) {
            setTitle(CUSTOM_RESOURCE_CONSTANTS.SYNC_ERROR_TITLE);
            setDescription(CUSTOM_RESOURCE_CONSTANTS.SYNC_ERROR_DESCRIPTION);
        } else if (ERROR_CODE == ERROR_CODES.DATA_RETRIEVAL_ERROR) {
            setTitle(CUSTOM_RESOURCE_CONSTANTS.RETRIEVAL_ERROR_TITLE);
            setDescription(CUSTOM_RESOURCE_CONSTANTS.RETRIEVAL_ERROR_DESCRIPTION);
        }
    }, []);

    const RefreshPageAsync = async () => {
        if (await commonMBL.IsNetConnectedAsync()) {
            //Discuss: Call function based on the respective screen
            SetUpApplicationAsync();
        }
    }

    return (
        <View style={ErrorScreenStyle.container}>
            {ERROR_CODE == ERROR_CODES.NO_INTERNET &&
                <View style={ErrorScreenStyle.imageContainer}>
                    <SvgXml width={CUSTOM_CONSTANTS.SVG.WIDTH.LARGER} height={CUSTOM_CONSTANTS.SVG.HEIGHT.LARGER} xml={NO_NET} />
                </View>
            }
            <View style={ErrorScreenStyle.titleContainer}>
                <Text style={ErrorScreenStyle.title}>{title}</Text>
                <Text style={ErrorScreenStyle.description}>{description}</Text>
            </View>
            {ERROR_CODE == ERROR_CODES.NO_INTERNET &&
                <View style={ErrorScreenStyle.buttonContainer}>
                    <View style={ErrorScreenStyle.containerSize}>
                        <LHSubmitButton
                            onClick={() => RefreshPageAsync()}
                            type={CUSTOM_CONSTANTS.BUTTON.TYPE}
                            resourceKey={CUSTOM_RESOURCE_CONSTANTS.REFRESH_BUTTON_LABEL}
                            colors={LINEAR_GRADIENT.COLORS.PRIMARY}
                        />
                    </View>
                </View>
            }
        </View>
    );
};


