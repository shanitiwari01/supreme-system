import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { LHContainer } from "../Components/Container";
import { SignInStyle, CommonStyle, AddEditStudentStyle, PassCodeStyle, SignUpStyle } from "../css/Styles";
import { LHForm } from "../Components/Form";
import { LHSubmitButton, LHTextBox, LHImagePicker, LHDropDown, LHDatePick } from "../Components/CustomFields";
import { CUSTOM_CONSTANTS, RESOURCE_CONSTANTS, RESOURCE_GROUPS, OTPCODE_TYPE, EYE_ON_ICON, EYE_OFF_ICON, ERROR_CODES, LIBERATELITE_ICON, PICKER_TYPE, BACK_ICON, IMAGE_FILE_TYPES, GetExtension, MOBILE_SCREENS } from "utility";
import { AccountMBL } from "mobilebusinesslayer";
import { GetSingleResourceValue, GetDropdownValues, GetResourceValue } from "../Functions/CommonFunctions";
import { useDispatch } from "react-redux";
import { setLoader } from "../store/actions/loaderActions";
import { setShowSnackBar } from "../store/actions/snackBarAction";
import { SvgXml } from "react-native-svg";
import { BaseDTO, ResourceModel, UserDTO, UserModel, VerifyUserModel } from "datamodels";
import { DropdownModel } from "../models/Dropdown";
import { LHStatusBar } from "../Components/StatusBar";
import { Navigate, GoBack } from "./../navigation/NavigationService";
import { LHBackButton } from "../Components/BackButton";

export const SignUp = () => {
    let [resources, setResources] = useState<ResourceModel[]>([]);
    let [kycData, setKycData] = useState<DropdownModel[]>([]);
    let [showPassword, setShowPassword] = useState(true);
    let [showConfirmPassword, setShowConfirmPassword] = useState(true);
    let [genderData, setGenderData] = useState<DropdownModel[]>([]);
    let [prevData, setPrevData] = useState<UserDTO>({});
    let dispatch = useDispatch();
    let formRef = useRef<any>();
    let firstNameRef = useRef<any>();
    let middleNameRef = useRef<any>();
    let lastNameRef = useRef<any>();
    let motherNameRef = useRef<any>();
    let phoneNumberRef = useRef<any>();
    let emailRef = useRef<any>();
    let passwordRef = useRef<any>();
    let confirmPasswordRef = useRef<any>();
    let userPhotoRef = useRef<any>();
    let kycDocumentRef = useRef<any>();
    let dateOfBirthRef = useRef<any>();
    let genderRef = useRef<any>();
    let kycIdTypeRef = useRef<any>();
    let kycIdRef = useRef<any>();
    let accountMBL = new AccountMBL();

    useEffect(() => {
        FetchResourcesAsync();
    }, [])

    const FetchResourcesAsync = async () => {
        dispatch(setLoader(true));
        let baseDTO = new BaseDTO();
        baseDTO.GroupIDs = `${RESOURCE_GROUPS.SIGNIN},${RESOURCE_GROUPS.KYC_DROPDOWN},${RESOURCE_GROUPS.USER},${RESOURCE_GROUPS.GENDER_DROPDOWN}`;
        baseDTO = await accountMBL.GetPageResourcesAsync(baseDTO);

        if (baseDTO.StatusCode == ERROR_CODES.OK) {
            if (baseDTO.ResourceDTO && baseDTO.ResourceDTO.Resources) {
                setResources(baseDTO.ResourceDTO.Resources);
                SetDropdown(baseDTO.ResourceDTO.Resources);
            }
        } else {
            dispatch(setShowSnackBar(true, RESOURCE_CONSTANTS.ERRORS.ERROR_VIA_RETRIEVAL_DATA));
        }
        dispatch(setLoader(false));
    }

    const SetDropdown = async (resourcesData: any) => {
        dispatch(setLoader(true));
        let kycGroupIds = `${RESOURCE_GROUPS.KYC_DROPDOWN}`;
        let temkycArray = await GetDropdownValues(+kycGroupIds, resourcesData);
        setKycData(temkycArray);
        let genderGroupIds = `${RESOURCE_GROUPS.GENDER_DROPDOWN}`;
        let temGenderArray = await GetDropdownValues(+genderGroupIds, resourcesData);
        setGenderData(temGenderArray);
        dispatch(setLoader(false));
    }

    const SendOTP = async (GetFeildsArray: any) => {
        let userDTO = new UserDTO();
        userDTO.VerifyUser = new VerifyUserModel();
        userDTO.VerifyUser.Phone = GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.USER.PHONE)?.value;
        userDTO.VerifyUser.Email = GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.USER.EMAIL)?.value;
        userDTO = await accountMBL.VerifySignUpUserAsync(userDTO);
        if (userDTO.StatusCode == ERROR_CODES.OK) {
            StoreUserDetail(userDTO, GetFeildsArray)
        } else {
            dispatch(setShowSnackBar(true, GetResourceValue(resources, userDTO.StatusCode?.toString())));
        }
    }

    const StoreUserDetail = (userDTO: UserDTO, GetFeildsArray: any) => {
        userDTO.User = new UserModel();
        userDTO.User.UserOtp = userDTO.User.UserOtp ? userDTO.User.UserOtp : prevData?.User?.UserOtp;
        userDTO.User.AdminOtp = userDTO.User.AdminOtp ? userDTO.User.AdminOtp : prevData?.User?.AdminOtp;
        userDTO.User.FirstName = GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.USER.FIRST_NAME)?.value;
        userDTO.User.MiddleName = GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.USER.MIDDLE_NAME)?.value;
        userDTO.User.MothersName = GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.USER.MOTHERS_NAME)?.value;
        userDTO.User.LastName = GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.USER.LAST_NAME)?.value;
        userDTO.User.DateOfBirth = GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.USER.DATE_OF_BIRTH)?.value;
        userDTO.User.GenderKey = GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.USER.GENDER_KEY)?.value;
        userDTO.User.Phone = GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.USER.PHONE)?.value;
        userDTO.User.Email = GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.USER.EMAIL)?.value;
        userDTO.User.KycTypeKey = GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.USER.KYC_TYPE_KEY)?.value;
        userDTO.User.KycID = GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.USER.KYC_ID)?.value;
        userDTO.User.AccountPassword = GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.USER.ACCOUNT_PASSWORD)?.value;
        userDTO.User.IsTempPassword = false;
        userDTO.User.IsTwoFactorAuthenticationDone = false;
        userDTO.Files = {
            UserPhoto: GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.USER.USER_PHOTO)?.value,
            KycDocument: GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.USER.KYC_DOCUMENT)?.value,
        }
        setPrevData(userDTO);
        Navigate(MOBILE_SCREENS.OTP_CODE, { type: OTPCODE_TYPE.SIGN_UP_OTP, userDTO: userDTO });
    }

    const ValidateSignupData = async () => {
        dispatch(setLoader(true));
        if (formRef?.current) {
            let GetFeildsArray = await formRef.current.onSubmit();
            if (GetFeildsArray && GetFeildsArray !== undefined) {
                let phone = GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.USER.PHONE)?.value;
                let password = GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.USER.ACCOUNT_PASSWORD)?.value;
                let confirmPassword = GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.USER.CONFIRM_PASSWORD)?.value;
                if (password == confirmPassword) {
                    if (prevData && prevData.User && prevData.User.Phone) {
                        if (prevData.User.Phone != phone) {
                            await SendOTP(GetFeildsArray)
                        } else {
                            StoreUserDetail({}, GetFeildsArray)
                        }
                    } else {
                        await SendOTP(GetFeildsArray)
                    }
                }
                else{
                    dispatch(setShowSnackBar(true, GetResourceValue(resources, RESOURCE_CONSTANTS.USER.PASSWORD_NOT_MATCH)));
                }
            }
        }
        dispatch(setLoader(false));
    }

    return (
        <View>
            <LHContainer scrollView={true}>
                <View>
                    <LHStatusBar />

                    <LHBackButton
                        leftButtonClick={() => GoBack()}
                        leftIcon={BACK_ICON}
                    />
                </View>
                {resources && resources.length > 0 &&
                    <>
                        <View style={CommonStyle.divSpace}>
                            <SvgXml width={CUSTOM_CONSTANTS.SVG.WIDTH.LIBERATELITE_ICON} xml={LIBERATELITE_ICON} style={SignInStyle.imgStyle} />

                            <View style={CommonStyle.fullWidth}>
                                <LHForm ref={formRef} resources={resources}>
                                    <LHImagePicker
                                        UIType={PICKER_TYPE.CIRCLE}
                                        type={CUSTOM_CONSTANTS.INPUT_TYPE.STRING}
                                        ref={userPhotoRef}
                                        resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.USER.USER_PHOTO)}
                                        resourceKey={RESOURCE_CONSTANTS.USER.USER_PHOTO}
                                    />
                                    <LHTextBox
                                        ref={firstNameRef}
                                        type={CUSTOM_CONSTANTS.INPUT_TYPE.STRING}
                                        resourceKey={RESOURCE_CONSTANTS.USER.FIRST_NAME}
                                        resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.USER.FIRST_NAME)}
                                    />
                                    <LHTextBox
                                        ref={middleNameRef}
                                        type={CUSTOM_CONSTANTS.INPUT_TYPE.STRING}
                                        resourceKey={RESOURCE_CONSTANTS.USER.MIDDLE_NAME}
                                        resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.USER.MIDDLE_NAME)}
                                    />
                                    <LHTextBox
                                        ref={lastNameRef}
                                        type={CUSTOM_CONSTANTS.INPUT_TYPE.STRING}
                                        resourceKey={RESOURCE_CONSTANTS.USER.LAST_NAME}
                                        resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.USER.LAST_NAME)}
                                    />
                                    <LHTextBox
                                        ref={motherNameRef}
                                        type={CUSTOM_CONSTANTS.INPUT_TYPE.STRING}
                                        resourceKey={RESOURCE_CONSTANTS.USER.MOTHERS_NAME}
                                        resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.USER.MOTHERS_NAME)}
                                    />
                                    <LHTextBox
                                        ref={phoneNumberRef}
                                        resourceKey={RESOURCE_CONSTANTS.USER.PHONE}
                                        resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.USER.PHONE)}
                                        keyboardType={CUSTOM_CONSTANTS.KEYBOARD_TYPE.NUMERIC}
                                        type={CUSTOM_CONSTANTS.INPUT_TYPE.INTEGER}
                                    />
                                    <LHTextBox
                                        ref={emailRef}
                                        type={CUSTOM_CONSTANTS.INPUT_TYPE.STRING}
                                        resourceKey={RESOURCE_CONSTANTS.USER.EMAIL}
                                        resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.USER.EMAIL)}
                                    />
                                    <LHTextBox
                                        ref={passwordRef}
                                        resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.USER.ACCOUNT_PASSWORD)}
                                        secureTextEntry={showPassword}
                                        resourceKey={RESOURCE_CONSTANTS.USER.ACCOUNT_PASSWORD}
                                        rightIcon={!showPassword ? EYE_ON_ICON : EYE_OFF_ICON}
                                        clickRightIcon={() => setShowPassword(!showPassword)}
                                        type={CUSTOM_CONSTANTS.INPUT_TYPE.STRING}
                                    />
                                    <LHTextBox
                                        ref={confirmPasswordRef}
                                        resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.USER.CONFIRM_PASSWORD)}
                                        secureTextEntry={showConfirmPassword}
                                        resourceKey={RESOURCE_CONSTANTS.USER.CONFIRM_PASSWORD}
                                        rightIcon={!showConfirmPassword ? EYE_ON_ICON : EYE_OFF_ICON}
                                        clickRightIcon={() => setShowConfirmPassword(!showConfirmPassword)}
                                        type={CUSTOM_CONSTANTS.INPUT_TYPE.STRING}
                                    />
                                    <LHDropDown
                                        testID={RESOURCE_CONSTANTS.USER.GENDER_KEY}
                                        ref={genderRef}
                                        type={CUSTOM_CONSTANTS.INPUT_TYPE.STRING}
                                        style={AddEditStudentStyle.dropdown}
                                        containerStyle={AddEditStudentStyle.shadow}
                                        data={genderData}
                                        resourceKey={RESOURCE_CONSTANTS.USER.GENDER_KEY}
                                        resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.USER.GENDER_KEY)}
                                        placeholder={RESOURCE_CONSTANTS.USER.GENDER_KEY}
                                    />
                                    <LHDatePick
                                        ref={dateOfBirthRef}
                                        type={CUSTOM_CONSTANTS.INPUT_TYPE.DATE}
                                        resourceKey={RESOURCE_CONSTANTS.USER.DATE_OF_BIRTH}
                                        resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.USER.DATE_OF_BIRTH)}
                                    />
                                    <LHDropDown
                                        ref={kycIdTypeRef}
                                        type={CUSTOM_CONSTANTS.INPUT_TYPE.STRING}
                                        style={AddEditStudentStyle.dropdown}
                                        containerStyle={AddEditStudentStyle.shadow}
                                        data={kycData}
                                        resourceKey={RESOURCE_CONSTANTS.USER.KYC_TYPE_KEY}
                                        resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.USER.KYC_TYPE_KEY)}
                                        placeholder={RESOURCE_CONSTANTS.USER.KYC_TYPE_KEY}
                                    />
                                    <LHTextBox
                                        ref={kycIdRef}
                                        resourceKey={RESOURCE_CONSTANTS.USER.KYC_ID}
                                        resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.USER.KYC_ID)}
                                        keyboardType={CUSTOM_CONSTANTS.KEYBOARD_TYPE.DEFAULT}
                                        type={CUSTOM_CONSTANTS.INPUT_TYPE.STRING}
                                    />
                                    <LHImagePicker
                                        UIType={PICKER_TYPE.RECTANGLE}
                                        type={CUSTOM_CONSTANTS.INPUT_TYPE.STRING}
                                        ref={kycDocumentRef}
                                        resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.USER.KYC_DOCUMENT)}
                                        resourceKey={RESOURCE_CONSTANTS.USER.KYC_DOCUMENT}
                                    />
                                </LHForm>
                            </View>

                        </View>
                        <LHSubmitButton
                            resourceKey={RESOURCE_CONSTANTS.USER.CREATE_NEW_ACCOUNT}
                            resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.USER.CREATE_NEW_ACCOUNT)}
                            onClick={() => ValidateSignupData()}
                        />
                    </>
                }
            </LHContainer>
        </View>
    )
}