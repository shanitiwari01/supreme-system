import React, { useEffect, useRef, useState } from "react";
import { View, Text } from "react-native";
import { LHContainer } from "../Components/Container";
import { SignInStyle, CommonStyle, PassCodeStyle, OTPCodeStyle, ForgotPasswordStyle, SignUpStyle } from "../css/Styles";
import { LHForm } from "../Components/Form";
import { LHSubmitButton, LHTextBox } from "../Components/CustomFields";
import { CUSTOM_CONSTANTS, RESOURCE_CONSTANTS, RESOURCE_GROUPS, MOBILE_ICON, LOCK_ICON, EYE_ON_ICON, EYE_OFF_ICON, ERROR_CODES, LIBERATELITE_ICON, MOBILE_SCREENS, OTPCODE_TYPE, FormatInMinute, SETTING_CONSTANTS, BACK_ICON } from "utility";
import { AccountMBL, CommonMBL } from "mobilebusinesslayer";
import { GetResourceValue, GetSingleResourceValue } from "../Functions/CommonFunctions";
import { useDispatch } from "react-redux";
import { setLoader } from "../store/actions/loaderActions";
import { setShowSnackBar } from "../store/actions/snackBarAction";
import { SvgXml } from "react-native-svg";
import { BaseDTO, ResourceModel, UserDTO, VerifyUserModel } from "datamodels";
import { LHStatusBar } from "../Components/StatusBar";
import { Navigate } from "./../navigation/NavigationService";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { LHBackButton } from "../Components/BackButton";

export const ForgotPassword = () => {
    let [resources, setResources] = useState<ResourceModel[]>([]);
    let [isValidPhone, setValidPhone] = useState(false);
    let [headingName, setHeadingName] = useState(RESOURCE_CONSTANTS.COMMON.OTP);
    let [otpCodeLength, setOtpCodeLength] = useState(0);
    let otpInterval: any = 0;
    let [codeText, setCodeText] = useState("");
    let [showResend, setShowResend] = useState(true)
    let [otpTimer, setOtpTimer] = useState(0);
    let [phone, setPhone] = useState("");
    let [otpCode, setOtpCode] = useState(0);
    let [adminOtpCode, setAdminOtpCode] = useState(0);
    let [isShowSetPassword, setShowSetPassword] = useState(false);
    let [isTimerStart, setIsTimerStart] = useState(false);
    let dispatch = useDispatch();
    let formRef = useRef<any>();
    let phoneNumberRef = useRef<any>();
    let passwordRef = useRef<any>();
    let confirmPasswordRef = useRef<any>();
    let [showPassword, setShowPassword] = useState(true);
    let [showConfirmPassword, setShowConfirmPassword] = useState(true);
    let accountMBL = new AccountMBL();
    let commonMBL = new CommonMBL();

    useEffect(() => {
        FetchResourcesAsync();
        FetchSettingAsync();
    }, [])

    const FetchResourcesAsync = async () => {
        dispatch(setLoader(true));
        let baseDTO = new BaseDTO();
        baseDTO.GroupIDs = `${RESOURCE_GROUPS.FORGOT_PASSWORD}`;
        baseDTO = await accountMBL.GetPageResourcesAsync(baseDTO);
        if (baseDTO.StatusCode == ERROR_CODES.OK) {
            if (baseDTO.ResourceDTO && baseDTO.ResourceDTO.Resources) {
                setResources(baseDTO.ResourceDTO.Resources);
            }
        } else {
            dispatch(setShowSnackBar(true, RESOURCE_CONSTANTS.ERRORS.ERROR_VIA_RETRIEVAL_DATA));
        }
        dispatch(setLoader(false));
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

    const ValidatePhone = async () => {
        dispatch(setLoader(true));
        if (formRef?.current) {
            let GetFeildsArray = await formRef.current.onSubmit();
            if (GetFeildsArray && GetFeildsArray !== undefined) {
                let userDTO = new UserDTO();
                userDTO.VerifyUser = new VerifyUserModel();
                userDTO.VerifyUser.Phone = GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.FORGOT_PASSWORD.PHONE)?.value;
                userDTO = await accountMBL.ForgotPasswordAsync(userDTO);
                if (userDTO.StatusCode == ERROR_CODES.OK) {
                    setPhone(GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.FORGOT_PASSWORD.PHONE)?.value);
                    setValidPhone(true)
                } else {
                    dispatch(setShowSnackBar(true, GetResourceValue(resources, userDTO.StatusCode?.toString())));
                }
            }
        }
        dispatch(setLoader(false));
    }
    const ValidatePassword = async () => {
        dispatch(setLoader(true));
        if (formRef?.current) {
            let GetFeildsArray = await formRef.current.onSubmit();
            if (GetFeildsArray && GetFeildsArray !== undefined) {
                if (GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.FORGOT_PASSWORD.ACCOUNT_PASSWORD)?.value === GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.FORGOT_PASSWORD.CONFIRM_PASSWORD)?.value) {
                    let userDTO = new UserDTO();
                    userDTO.VerifyUser = new VerifyUserModel();
                    userDTO.VerifyUser.Phone = phone;
                    userDTO.VerifyUser.UserOtp = parseInt(codeText);
                    userDTO.VerifyUser.AccountPassword = GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.FORGOT_PASSWORD.ACCOUNT_PASSWORD)?.value;
                    userDTO = await accountMBL.ChangePaswordAsync(userDTO);
                    if (userDTO.StatusCode == ERROR_CODES.OK) {
                        Navigate(MOBILE_SCREENS.SIGNIN);
                    } else {
                        dispatch(setShowSnackBar(true, GetResourceValue(resources, userDTO.StatusCode?.toString())));
                    }
                }
                else {
                    dispatch(setShowSnackBar(true, GetResourceValue(resources, RESOURCE_CONSTANTS.FORGOT_PASSWORD.PASSWORD_NOT_MATCH)));
                }

            }
        }
        dispatch(setLoader(false));
    }

    const ValidateOTPCodeAsync = async (enteredCode: number) => {
        dispatch(setLoader(true));
        if (enteredCode > 0 && enteredCode.toString().length == otpCodeLength) {
            let userDTO = new UserDTO();
            userDTO.VerifyUser = new VerifyUserModel();
            userDTO.VerifyUser.Phone = phone;
            userDTO.VerifyUser.UserOtp = enteredCode;
            userDTO = await accountMBL.ValidateOtpAsync(userDTO);
            if (userDTO.StatusCode == ERROR_CODES.OK) {
                setShowSetPassword(true);
            } else {
                setCodeText('');
                dispatch(setShowSnackBar(true, GetResourceValue(resources, userDTO.StatusCode?.toString())));
            }
        }
        dispatch(setLoader(false));
    }

    const ResendOTP = async () => {
        dispatch(setLoader(true));
        let userDTO = new UserDTO();
        userDTO.VerifyUser = new VerifyUserModel();
        userDTO.VerifyUser.Phone = phone;
        userDTO = await accountMBL.ForgotPasswordAsync(userDTO);
        if (userDTO.StatusCode == ERROR_CODES.OK) {
            setOtpCode(0);
            setAdminOtpCode(0);
            setHeadingName(RESOURCE_CONSTANTS.COMMON.OTP);
        } else {
            dispatch(setShowSnackBar(true, GetResourceValue(resources, userDTO.StatusCode?.toString())));
        }
        setShowResend(false)
        dispatch(setLoader(false));
    }
    const HandleBackButton = () => {
        // Navigate(MOBILE_SCREENS.SIGNIN);
        if(isShowSetPassword){
            setShowSetPassword(false)
        }
        else if(isValidPhone){
            setValidPhone(false)
        }
        else{
            Navigate(MOBILE_SCREENS.SIGNIN);
        }
    }


    return (
        <View style={PassCodeStyle.container}>
            <LHContainer>
                <View>
                    <LHStatusBar />
                    <LHBackButton
                        leftButtonClick={() => HandleBackButton()}
                        leftIcon={BACK_ICON}
                    />
                </View>
                {resources && resources.length > 0 &&
                    <>
                        <View style={PassCodeStyle.passcodeContainer} >
                            <SvgXml width={CUSTOM_CONSTANTS.SVG.WIDTH.LIBERATELITE_ICON} xml={LIBERATELITE_ICON} style={ForgotPasswordStyle.imgStyle} />
                            {
                                !isShowSetPassword ?
                                    <>
                                        {!isValidPhone ?
                                            <View style={[CommonStyle.fullWidth, ForgotPasswordStyle.mainContainer]}>
                                                <LHForm ref={formRef} resources={resources}>
                                                    <Text style={ForgotPasswordStyle.phoneHeadingText}>{GetResourceValue(resources, RESOURCE_CONSTANTS.FORGOT_PASSWORD.PHONE_LABEL)}</Text>
                                                    <LHTextBox
                                                        ref={phoneNumberRef}
                                                        resourceKey={RESOURCE_CONSTANTS.FORGOT_PASSWORD.PHONE}
                                                        resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.FORGOT_PASSWORD.PHONE)}
                                                        keyboardType={CUSTOM_CONSTANTS.KEYBOARD_TYPE.NUMERIC}
                                                        leftIcon={MOBILE_ICON}
                                                        label={false}
                                                        type={CUSTOM_CONSTANTS.INPUT_TYPE.INTEGER}
                                                    />

                                                </LHForm>
                                                <LHSubmitButton
                                                    resourceKey={RESOURCE_CONSTANTS.COMMON.SUBMIT}
                                                    resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.COMMON.SUBMIT)}
                                                    onClick={() => ValidatePhone()}
                                                />

                                            </View> :
                                            <>
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
                                                        showResend &&
                                                        <>
                                                            {
                                                                isTimerStart && <Text style={OTPCodeStyle.resendOTPLabel}>{GetResourceValue(resources, RESOURCE_CONSTANTS.COMMON.RESEND_OTP_TIME).replace('{TIME}', '')}<Text style={OTPCodeStyle.resendOTPTimer}>{FormatInMinute(otpTimer)}</Text></Text>
                                                            }

                                                            {
                                                                otpTimer <= 0 && <Text style={OTPCodeStyle.resendOTPTimer} onPress={() => ResendOTP()}>{GetResourceValue(resources, RESOURCE_CONSTANTS.COMMON.RESEND_OTP)}</Text>
                                                            }
                                                        </>
                                                    }

                                                </View>
                                            </>
                                        }</> :
                                    <>
                                        <View style={CommonStyle.fullWidth}>
                                            <LHForm ref={formRef} resources={resources}>
                                                <Text style={ForgotPasswordStyle.phoneHeadingText}>{GetResourceValue(resources, RESOURCE_CONSTANTS.FORGOT_PASSWORD.SET_NEW_PASSWORD)}</Text>
                                                <LHTextBox
                                                    ref={passwordRef}
                                                    resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.FORGOT_PASSWORD.ACCOUNT_PASSWORD)}
                                                    secureTextEntry={showPassword}
                                                    resourceKey={RESOURCE_CONSTANTS.USER.ACCOUNT_PASSWORD}
                                                    rightIcon={!showPassword ? EYE_ON_ICON : EYE_OFF_ICON}
                                                    clickRightIcon={() => setShowPassword(!showPassword)}
                                                    type={CUSTOM_CONSTANTS.INPUT_TYPE.STRING}
                                                />
                                                <LHTextBox
                                                    ref={confirmPasswordRef}
                                                    resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.FORGOT_PASSWORD.CONFIRM_PASSWORD)}
                                                    secureTextEntry={showConfirmPassword}
                                                    resourceKey={RESOURCE_CONSTANTS.FORGOT_PASSWORD.CONFIRM_PASSWORD}
                                                    rightIcon={!showConfirmPassword ? EYE_ON_ICON : EYE_OFF_ICON}
                                                    clickRightIcon={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    type={CUSTOM_CONSTANTS.INPUT_TYPE.STRING}
                                                />

                                            </LHForm>
                                            <LHSubmitButton
                                                resourceKey={RESOURCE_CONSTANTS.COMMON.SUBMIT}
                                                resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.COMMON.SUBMIT)}
                                                onClick={() => ValidatePassword()}
                                            />
                                        </View>
                                    </>
                            }

                        </View>
                    </>
                }
            </LHContainer>
        </View>
    )
}
