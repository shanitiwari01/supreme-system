import { Navigate } from "../navigation/NavigationService";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { CUSTOM_CONSTANTS, MOBILE_SCREENS, RESOURCE_CONSTANTS, RESOURCE_GROUPS, PASSCODE_TYPE, LIBERATELITE_ICON, ERROR_CODES, MOBILE_CONFIG, SYNC_CONSTANTS, BOOLEAN_STATUS, SETTING_CONSTANTS } from "utility";
import { LHContainer } from "../Components/Container";
import { PassCodeStyle, SignInStyle } from "../css/Styles";
import { GetResourceValue, LogoutUserAsync } from "../Functions/CommonFunctions";
import { CommonMBL, SyncDataMBL } from "mobilebusinesslayer";
import { SvgXml } from "react-native-svg";
import { BaseDTO, ResourceModel } from "datamodels";
import { useDispatch } from "react-redux";
import { setRefreshStudents, setRefreshLanguages } from "../store/actions/refreshActions";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { setShowSnackBar } from "../store/actions/snackBarAction";
import { setLoader } from "../store/actions/loaderActions";
import { LHStatusBar } from "../Components/StatusBar";
import { LHDialog } from "./../Components/Dialog";
import { useIsFocused } from "@react-navigation/native";

export const PassCode = (props: any) => {
    let [resources, setResources] = useState<ResourceModel[]>([]);
    let [passcodeLength, setPasscodeLength] = useState(0);
    let [passCode, setPassCode] = useState(0);
    let [codeText, setCodeText] = useState("");
    let [passcodeType, setPasscodeType] = useState("");
    let [headingName, setHeadingName] = useState("");
    let [visible, setVisible] = useState(false);
    let isFocused = useIsFocused();
    let commonMBL = new CommonMBL();
    let baseDTO = new BaseDTO();
    let dispatch = useDispatch();

    useEffect(() => {
        if(isFocused){
            setVisible(false);
            dispatch(setLoader(true));
            FetchResourcesAsync();
            GetSettingValueAsync();
            if (props.route.params.type == PASSCODE_TYPE.SET_PASSCODE) {
                //TODO: write code for otp validation before setting passcode
                setPasscodeType(PASSCODE_TYPE.SET_PASSCODE);
                setHeadingName(RESOURCE_CONSTANTS.SIGN_IN.SET_PASSCODE);
            } else if (props.route.params.type == PASSCODE_TYPE.LOGIN_WITH_PASSCODE) {
                //TODO: return to login page if passcode length is changed
                setPasscodeType(PASSCODE_TYPE.LOGIN_WITH_PASSCODE);
                setHeadingName(RESOURCE_CONSTANTS.SIGN_IN.ENTER_PASSCODE);
            }
            dispatch(setLoader(false));
        }

    }, [isFocused]);

    const FetchResourcesAsync = async () => {
        baseDTO.GroupIDs = `${RESOURCE_GROUPS.SIGNIN}`;
        baseDTO = await commonMBL.GetPageResourcesAsync(baseDTO);
        if (baseDTO.StatusCode == ERROR_CODES.OK && baseDTO.ResourceDTO) {
            setResources(baseDTO.ResourceDTO.Resources);
        }
    }

    const GetSettingValueAsync = async () => {
        baseDTO = await commonMBL.GetSettingValueAsync(`'${SETTING_CONSTANTS.PASS_CODE_LENGTH}'`);
        if (baseDTO.StatusCode == ERROR_CODES.OK) {
            setPasscodeLength(parseInt(baseDTO.Data[SETTING_CONSTANTS.PASS_CODE_LENGTH]));
        }
    }

    const ValidatePassCodeAsync = async (enteredCode: number) => {
        dispatch(setLoader(true));
        if (enteredCode > 0 && enteredCode.toString().length == passcodeLength) {
            if (passcodeType == PASSCODE_TYPE.SET_PASSCODE) {
                setPassCode(enteredCode);
                setPasscodeType(PASSCODE_TYPE.CONFIRM_PASSCODE);
                setHeadingName(RESOURCE_CONSTANTS.SIGN_IN.CONFIRM_PASSCODE);
            } else if (passcodeType == PASSCODE_TYPE.CONFIRM_PASSCODE) {
                if (enteredCode === passCode) {
                    await commonMBL.SaveValueInStorageAsync(MOBILE_CONFIG.PASS_CODE, passCode.toString());
                    await GotoNextScreenAsync();
                } else {
                    dispatch(setShowSnackBar(true, GetResourceValue(resources, RESOURCE_CONSTANTS.SIGN_IN.WRONG_PASSCODE)));
                }
            } else if (passcodeType == PASSCODE_TYPE.LOGIN_WITH_PASSCODE) {
                if (enteredCode == await commonMBL.GetNumberValueFromStorageAsync(MOBILE_CONFIG.PASS_CODE)) {
                    await GotoNextScreenAsync();
                } else {
                    dispatch(setShowSnackBar(true, GetResourceValue(resources, RESOURCE_CONSTANTS.SIGN_IN.WRONG_PASSCODE)));
                }
            }
            setCodeText("");
        } else {
            dispatch(setShowSnackBar(true, GetResourceValue(resources, RESOURCE_CONSTANTS.SIGN_IN.PASSCODE_REQUIRED)));
        }
        dispatch(setLoader(false));
    }

    const GotoNextScreenAsync = async () => {
        let isFirstTime = await commonMBL.GetBooleanValueFromStorageAsync(MOBILE_CONFIG.IS_FIRST_TIME);
        if (await commonMBL.IsNetConnectedAsync()) {
            if (isFirstTime) {
                FirstTimeSyncDataAsync();
            } else {
                SecondTimeSyncDataAsync();
            }
        } else if (isFirstTime) {
            Navigate(MOBILE_SCREENS.ERROR_SCREEN, { errorcode: ERROR_CODES.NO_INTERNET });
        } else {
            Navigate(MOBILE_SCREENS.HOME);
        }
    }

    const FirstTimeSyncDataAsync = async () => {
        let syncResult: BaseDTO = await new SyncDataMBL().SyncDataAsync(SYNC_CONSTANTS.ALL_DATA);
        if (syncResult.StatusCode == ERROR_CODES.OK) {
            await commonMBL.SaveValueInStorageAsync(MOBILE_CONFIG.IS_FIRST_TIME, BOOLEAN_STATUS.STATUS_FALSE.toString());
            global.BEFORE_LOGIN = false;
            Navigate(MOBILE_SCREENS.HOME);
        } else {
            Navigate(MOBILE_SCREENS.ERROR_SCREEN, { errorcode: ERROR_CODES.DATA_SYNC_ERROR });
        }
    }

    const SecondTimeSyncDataAsync = async () => {
        global.BEFORE_LOGIN = false;
        Navigate(MOBILE_SCREENS.HOME);
        let syncResult: BaseDTO = await new SyncDataMBL().SyncDataAsync(SYNC_CONSTANTS.ALL_DATA);
        if (syncResult.StatusCode == ERROR_CODES.OK && syncResult.Data && syncResult.Data.length > 0) {
            for (let syncedData of syncResult.Data) {
                if (syncedData.Data && syncedData.Data.length > 0) {
                    for (let data of syncedData.Data) {
                        CheckAndRefreshData(data);
                    }
                }
            }
        }
    }

    const CheckAndRefreshData = (data: BaseDTO) => {
        if (data.StatusCode == ERROR_CODES.OK && data.DataSyncedFor && data.NoOfRecords) {
            if (data.DataSyncedFor == SYNC_CONSTANTS.STUDENTS && data.NoOfRecords > 0) {
                dispatch(setRefreshStudents(true));
            }
            if (data.DataSyncedFor == SYNC_CONSTANTS.LANGUAGES && data.NoOfRecords > 0) {
                dispatch(setRefreshLanguages(true));
            }
        }
    }

    return (
        <View style={PassCodeStyle.container}>
            {resources.length > 0 &&
                <LHContainer>
                    <LHStatusBar />
                    <View style={PassCodeStyle.passcodeContainer}>
                        <SvgXml
                            width={CUSTOM_CONSTANTS.SVG.WIDTH.LIBERATELITE_ICON}
                            xml={LIBERATELITE_ICON}
                            style={SignInStyle.imgStyle}
                        />
                        <Text style={PassCodeStyle.passcodeHeadingText} testID={headingName}>{GetResourceValue(resources, headingName)}</Text>
                        <OTPInputView
                            style={PassCodeStyle.passInput}
                            autoFocusOnLoad={true}
                            pinCount={passcodeLength}
                            code={codeText}
                            onCodeChanged={(code: string) => {
                                setCodeText(code);
                                if (codeText.length + 1 == passcodeLength) {
                                    ValidatePassCodeAsync(parseInt(code))
                                }
                            }}
                            codeInputFieldStyle={PassCodeStyle.underlineStyleBase}
                            codeInputHighlightStyle={PassCodeStyle.underlineStyleHighLighted}
                            keyboardType={CUSTOM_CONSTANTS.KEYBOARD_TYPE.NUMBER_PAD}
                            secureTextEntry={true}
                        />
                    </View>
                    {passcodeType == PASSCODE_TYPE.LOGIN_WITH_PASSCODE && <Text onPress={() => setVisible(true)} style={[SignInStyle.bottomText,SignInStyle.forgotPass]}>{GetResourceValue(resources, RESOURCE_CONSTANTS.SIGN_IN.FORGOT_PASSCODE)}</Text>}
                </LHContainer>
            }
            <LHDialog
                visible={visible}
                hideDialog={() => setVisible(false)}
                messageText={GetResourceValue(resources, RESOURCE_CONSTANTS.SIGN_IN.FORGOT_PASSCODE_CONFIRMATION)}
                negativeText={GetResourceValue(resources, RESOURCE_CONSTANTS.COMMON.NO)}
                positiveText={GetResourceValue(resources, RESOURCE_CONSTANTS.COMMON.YES)}
                onPostiveCallback={() => LogoutUserAsync()}
            />
        </View>
    )
}