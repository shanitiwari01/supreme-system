import React, { useEffect, useRef, useState } from "react";
import { View, Text } from "react-native";
import { LHContainer } from "../Components/Container";
import { SignInStyle, CommonStyle } from "../css/Styles";
import { LHForm } from "../Components/Form";
import { LHSubmitButton, LHTextBox } from "../Components/CustomFields";
import { CUSTOM_CONSTANTS, RESOURCE_CONSTANTS, RESOURCE_GROUPS, MOBILE_ICON, LOCK_ICON, EYE_ON_ICON, EYE_OFF_ICON, ERROR_CODES, LIBERATELITE_ICON, MOBILE_SCREENS, OTPCODE_TYPE } from "utility";
import { AccountMBL } from "mobilebusinesslayer";
import { GetResourceValue, GetSingleResourceValue } from "../Functions/CommonFunctions";
import { useDispatch } from "react-redux";
import { setLoader } from "../store/actions/loaderActions";
import { setShowSnackBar } from "../store/actions/snackBarAction";
import { SvgXml } from "react-native-svg";
import { BaseDTO, ResourceModel, UserDTO, VerifyUserModel } from "datamodels";
import { LHStatusBar } from "../Components/StatusBar";
import { Navigate } from "./../navigation/NavigationService";

export const SignIn = () => {
    let [resources, setResources] = useState<ResourceModel[]>([]);
    let [showPassword, setShowPassword] = useState(true);
    let [prevData, setPrevData] = useState<UserDTO>({});
    let dispatch = useDispatch();
    let formRef = useRef<any>();
    let phoneNumberRef = useRef<any>();
    let passwordRef = useRef<any>();
    let accountMBL = new AccountMBL();

    useEffect(() => {
        FetchResourcesAsync();
    }, [])

    const FetchResourcesAsync = async () => {
        dispatch(setLoader(true));
        let baseDTO = new BaseDTO();
        baseDTO.GroupIDs = `${RESOURCE_GROUPS.SIGNIN},${RESOURCE_GROUPS.USER}`;
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

    const ValidateLoginData = async () => {
        dispatch(setLoader(true));
        if (formRef?.current) {
            let GetFeildsArray = await formRef.current.onSubmit();
            if (GetFeildsArray && GetFeildsArray !== undefined) {
                let userDTO = new UserDTO();
                userDTO.VerifyUser = new VerifyUserModel();
                userDTO.VerifyUser.Phone = GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.USER.PHONE)?.value;
                userDTO.VerifyUser.AccountPassword = GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.USER.ACCOUNT_PASSWORD)?.value;
                userDTO = await accountMBL.VerifySignInUserAsync(userDTO);
                if (userDTO.StatusCode == ERROR_CODES.OK) {
                    setPrevData(userDTO);
                    Navigate(MOBILE_SCREENS.OTP_CODE, { type: OTPCODE_TYPE.SIGN_IN_OTP, userDTO: userDTO });
                } else {
                    dispatch(setShowSnackBar(true, GetResourceValue(resources, userDTO.StatusCode?.toString())));
                }
            }
        }
        dispatch(setLoader(false));
    }
    return (
        <LHContainer scrollView={false}>
            <LHStatusBar />
            {resources && resources.length > 0 &&
                <>
                    <View style={CommonStyle.divSpace}>
                        <SvgXml width={CUSTOM_CONSTANTS.SVG.WIDTH.LIBERATELITE_ICON} xml={LIBERATELITE_ICON} style={SignInStyle.imgStyle} />

                        <View style={CommonStyle.fullWidth}>
                            <LHForm ref={formRef} resources={resources}>
                                <LHTextBox
                                    ref={phoneNumberRef}
                                    resourceKey={RESOURCE_CONSTANTS.USER.PHONE}
                                    resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.USER.PHONE)}
                                    label={false}
                                    keyboardType={CUSTOM_CONSTANTS.KEYBOARD_TYPE.NUMERIC}
                                    leftIcon={MOBILE_ICON}
                                    type={CUSTOM_CONSTANTS.INPUT_TYPE.INTEGER}
                                />
                                <LHTextBox
                                    ref={passwordRef}
                                    resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.USER.ACCOUNT_PASSWORD)}
                                    secureTextEntry={showPassword}
                                    resourceKey={RESOURCE_CONSTANTS.USER.ACCOUNT_PASSWORD}
                                    rightIcon={!showPassword ? EYE_ON_ICON : EYE_OFF_ICON}
                                    leftIcon={LOCK_ICON}
                                    label={false}
                                    clickRightIcon={() => setShowPassword(!showPassword)}
                                    type={CUSTOM_CONSTANTS.INPUT_TYPE.STRING}
                                />
                            </LHForm>
                        </View>

                    </View>
                    <LHSubmitButton
                        resourceKey={RESOURCE_CONSTANTS.SIGN_IN.SIGNIN}
                        resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.SIGN_IN.SIGNIN)}
                        onClick={() => ValidateLoginData()}
                    />
                    <Text onPress={() => Navigate(MOBILE_SCREENS.FORGOT_PASSWORD)} style={SignInStyle.bottomText}>{GetResourceValue(resources, RESOURCE_CONSTANTS.SIGN_IN.FORGOT_PASSWORD)}</Text>
                    <Text onPress={() => Navigate(MOBILE_SCREENS.SIGNUP)} style={SignInStyle.bottomText}>{GetResourceValue(resources, RESOURCE_CONSTANTS.USER.CREATE_NEW_ACCOUNT)}</Text>
                </>
            }
        </LHContainer>
    )
}
