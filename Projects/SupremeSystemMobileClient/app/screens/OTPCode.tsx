import { Navigate } from "../navigation/NavigationService";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { CUSTOM_CONSTANTS, MOBILE_SCREENS, RESOURCE_CONSTANTS, RESOURCE_GROUPS, OTPCODE_TYPE, LIBERATELITE_ICON, ERROR_CODES, BACK_ICON, SETTING_CONSTANTS, FormatInMinute } from "utility";
import { LHContainer } from "../Components/Container";
import { PassCodeStyle, SignInStyle, OTPCodeStyle } from "../css/Styles";
import { GetResourceValue, GetNextScreenAsync } from "../Functions/CommonFunctions";
import { CommonMBL, AccountMBL } from "mobilebusinesslayer";
import { SvgXml } from "react-native-svg";
import { BaseDTO, ResourceModel } from "datamodels";
import { useDispatch } from "react-redux";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { setShowSnackBar } from "../store/actions/snackBarAction";
import { setLoader } from "../store/actions/loaderActions";
import { LHStatusBar } from "../Components/StatusBar";
import { LHBackButton } from "../Components/BackButton";
import { LHDialog } from "../Components/Dialog";
import { useIsFocused } from "@react-navigation/native";

export const OTPCode = (props: any) => {
    let type = props.route.params?.type ? props.route.params?.type : '';
    let user = props.route.params?.userDTO ? props.route.params?.userDTO : {};
    let accountMBL = new AccountMBL();
    let otpInterval: any = 0;
    let [visible, setVisible] = React.useState(false);
    let [resources, setResources] = useState<ResourceModel[]>([]);
    let [otpCodeLength, setOtpCodeLength] = useState(0);
    let [otpCode, setOtpCode] = useState(0);
    let [adminOtpCode, setAdminOtpCode] = useState(0);
    let [codeText, setCodeText] = useState("");
    let [headingName, setHeadingName] = useState(RESOURCE_CONSTANTS.COMMON.OTP);
    let [otpTimer, setOtpTimer] = useState(0);
    let [isTimerStart, setIsTimerStart] = useState(false);
    let commonMBL = new CommonMBL();
    let baseDTO = new BaseDTO();
    let dispatch = useDispatch();
    let isFocused = useIsFocused();

    useEffect(() => {
        if(isFocused){
            setVisible(false);
            setOtpCode(0);
            setAdminOtpCode(0);
            dispatch(setLoader(true));
            FetchResourcesAsync();
            FetchSettingAsync();
            dispatch(setLoader(false));
        }
    }, [isFocused]);

    const FetchResourcesAsync = async () => {
        baseDTO.GroupIDs = `${RESOURCE_GROUPS.COMMON}`;
        baseDTO = await commonMBL.GetPageResourcesAsync(baseDTO);
        if (baseDTO.StatusCode == ERROR_CODES.OK && baseDTO.ResourceDTO) {
            setResources(baseDTO.ResourceDTO.Resources);
        }
    }

    const FetchSettingAsync = async () => {
        let settings: BaseDTO = await commonMBL.GetSettingValueAsync(`'${SETTING_CONSTANTS.OTP_COUNT_DOWN}', '${SETTING_CONSTANTS.SMS_LENGTH}'`);
        if (settings.StatusCode == ERROR_CODES.OK) {
            setOtpCodeLength(parseInt(settings.Data[SETTING_CONSTANTS.SMS_LENGTH]));
            let timer = parseInt(settings.Data[SETTING_CONSTANTS.OTP_COUNT_DOWN]);
            if (timer > 0) {
                setOtpTimer(timer);
                setIsTimerStart(true);
                HandleCountDown(timer);
            }
        }
    }

    const HandleCountDown = (timer: number) => {
        let otpCountDown = timer;
        otpInterval = setInterval(() => {
            otpCountDown--;
            setOtpTimer(otpCountDown);
            if (otpCountDown <= 0) {
                setIsTimerStart(false);
                clearInterval(otpInterval);
            }
        }, 1000);
    }

    const ValidateOTPCodeAsync = async (enteredCode: number) => {
        dispatch(setLoader(true));
        if (enteredCode > 0 && enteredCode.toString().length == otpCodeLength) {
            if (otpCode) {
                setAdminOtpCode(enteredCode);
                await GotoNextScreenAsync(otpCode, enteredCode);
            } else {
                setOtpCode(enteredCode);
                if (type == OTPCODE_TYPE.SIGN_IN_OTP) {
                    await GotoNextScreenAsync(enteredCode, adminOtpCode);
                } else if (type == OTPCODE_TYPE.SIGN_UP_OTP) {
                    setHeadingName(RESOURCE_CONSTANTS.COMMON.ADMIN_OTP);
                }
            }
            setCodeText("");
        }
        dispatch(setLoader(false));
    }

    const GotoNextScreenAsync = async (userOtpParam: number, adminOtpParam: number) => {
        let userDTO = user;
        if (type == OTPCODE_TYPE.SIGN_IN_OTP) {
            userDTO.VerifyUser.UserOtp = userOtpParam;
            userDTO = await accountMBL.SignInAsync(userDTO);
            if (userDTO.StatusCode == ERROR_CODES.OK) {
                await GetNextScreenAsync();
            } else if (userDTO.StatusCode == ERROR_CODES.OTP_EXPIRED) {
                setVisible(true)
            } else {
                dispatch(setShowSnackBar(true, GetResourceValue(resources, userDTO.StatusCode?.toString())));
            }
        } else if (type == OTPCODE_TYPE.SIGN_UP_OTP) {
            userDTO.User.UserOtp = userOtpParam;
            userDTO.User.AdminOtp = adminOtpParam;
            userDTO = await accountMBL.SignUpAsync(userDTO);
            if (userDTO.StatusCode == ERROR_CODES.OK) {
                Navigate(MOBILE_SCREENS.SIGNIN);
            } else if (userDTO.StatusCode == ERROR_CODES.OTP_EXPIRED) {
                setVisible(true)
            } else {
                dispatch(setShowSnackBar(true, GetResourceValue(resources, userDTO.StatusCode?.toString())));
            }
        }
        setOtpCode(0);
        setAdminOtpCode(0);
    }

    const HandleBackButton = () => {
        if (type == OTPCODE_TYPE.SIGN_IN_OTP) {
            Navigate(MOBILE_SCREENS.SIGNIN)
        } else if (type == OTPCODE_TYPE.SIGN_UP_OTP) {
            if (otpCode) {
                setCodeText(otpCode.toString());
                setHeadingName(RESOURCE_CONSTANTS.COMMON.OTP)
            }
           
        }
    }

    const ResendOTP = async () => {
        dispatch(setLoader(true));
        let userDTO = user;
        if (type == OTPCODE_TYPE.SIGN_IN_OTP) {
            userDTO = await accountMBL.VerifySignInUserAsync(userDTO);
            if (userDTO.StatusCode == ERROR_CODES.OK) {
                setOtpCode(0);
                setAdminOtpCode(0);
            } 
        }
        else if (type == OTPCODE_TYPE.SIGN_UP_OTP) {
            userDTO = await accountMBL.VerifySignUpUserAsync(userDTO);
            if (userDTO.StatusCode == ERROR_CODES.OK) {
                setOtpCode(0);
                setAdminOtpCode(0);
                setHeadingName(RESOURCE_CONSTANTS.COMMON.OTP);
            }
        }
        setVisible(false);
        dispatch(setLoader(false));
    }

    return (
        <View style={PassCodeStyle.container}>
            {resources.length > 0 &&
                <LHContainer>
                    {type != OTPCODE_TYPE.SIGN_IN_OTP  ? <View>
                        <LHBackButton
                            leftButtonClick={() => HandleBackButton()}
                            leftIcon={BACK_ICON}
                        />
                    </View> : null}
                    <LHStatusBar />
                    <View style={PassCodeStyle.passcodeContainer}>
                        <SvgXml
                            width={CUSTOM_CONSTANTS.SVG.WIDTH.LIBERATELITE_ICON}
                            xml={LIBERATELITE_ICON}
                            style={SignInStyle.imgStyle}
                        />
                        <Text style={PassCodeStyle.passcodeHeadingText}>{GetResourceValue(resources, headingName)}</Text>
                        <OTPInputView
                            style={PassCodeStyle.passInput}
                            autoFocusOnLoad={true}
                            pinCount={otpCodeLength}
                            code={codeText}
                            onCodeChanged={(code: string) => {
                                setCodeText(code);
                                if (codeText.length + 1 == otpCodeLength) {
                                    ValidateOTPCodeAsync(parseInt(code))
                                }
                            }}
                            codeInputFieldStyle={PassCodeStyle.underlineStyleBase}
                            codeInputHighlightStyle={PassCodeStyle.underlineStyleHighLighted}
                            keyboardType={CUSTOM_CONSTANTS.KEYBOARD_TYPE.NUMBER_PAD}
                            secureTextEntry={true}
                        />
                        <View>
                            {
                                isTimerStart && <Text style={OTPCodeStyle.resendOTPLabel}>{GetResourceValue(resources, RESOURCE_CONSTANTS.COMMON.RESEND_OTP_TIME).replace('{TIME}', '')}<Text style={OTPCodeStyle.resendOTPTimer}>{FormatInMinute(otpTimer)}</Text></Text>
                            }

                            {
                                otpTimer <= 0 && <Text style={OTPCodeStyle.resendOTPTimer} onPress={() => ResendOTP()}>{GetResourceValue(resources, RESOURCE_CONSTANTS.COMMON.RESEND_OTP)}</Text>
                            }
                        </View>
                    </View>
                </LHContainer>
            }
            <LHDialog
                visible={visible}
                hideDialog={() => setVisible(false)}
                messageText={GetResourceValue(resources, RESOURCE_CONSTANTS.COMMON.OTP_EXPIRED_MESSAGE)}
                negativeText={GetResourceValue(resources, RESOURCE_CONSTANTS.COMMON.CANCEL)}
                positiveText={GetResourceValue(resources, RESOURCE_CONSTANTS.COMMON.OK)}
                onPostiveCallback={() => ResendOTP()}
            />
        </View>
    )
}