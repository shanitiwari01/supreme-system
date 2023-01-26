import React, { useEffect, useState, useRef } from "react";
import { View, SafeAreaView, KeyboardAvoidingView } from "react-native";
import { LHTextBox, LHDropDown, LHDatePick, LHDeleteButton } from "../../Components/CustomFields";
import { StudentMBL } from "mobilebusinesslayer";
import { ERROR_CODES, BACK_ICON, RESOURCE_CONSTANTS, CUSTOM_CONSTANTS, KEYBOARD_AVOIDING, RESOURCE_GROUPS, ELEMENT_STYLES, SYNC_STATUS, GenerateUUID } from "utility";
import { StudentDTO, StudentModel } from "datamodels";
import { GetDropdownValues, GetResourceValue, GetSingleResourceValue } from "../../Functions/CommonFunctions";
import { AddEditStudentStyle, CommonStyle } from "../../css/Styles";
import { LHContainer } from "../../Components/Container";
import { LHHeaderBar } from "../../Components/HeaderBar";
import { LHForm } from "../../Components/Form";
import { useDispatch } from "react-redux";
import { setShowSnackBar } from "./../../store/actions/snackBarAction";
import { GoBack } from "./../../navigation/NavigationService";
import { setLoader } from "./../../store/actions/loaderActions";
import { setRefreshStudents } from "./../../store/actions/refreshActions";
import { DropdownModel } from "../../models/Dropdown";
import { useIsFocused } from "@react-navigation/native";
import { LHDialog } from "../../Components/Dialog";

export const AddEditStudent = (props: any) => {
    let resources = props.route.params?.resources ? props.route.params?.resources : [];
    let studentID = props.route.params?.studentId ? props.route.params?.studentId : "";
    let [studentDetail, setStudentDetail] = useState<StudentModel>();
    let [genderData, setGenderData] = useState<DropdownModel[]>([]);
    const [visible, setVisible] = React.useState(false);
    let dispatch = useDispatch();
    const isFocused = useIsFocused();
    let formRef = useRef<any>();

    useEffect(() => {
        if (studentID) {
            FetchSingleStudentAsync(studentID);
        }
        if (isFocused) {
            GetGenderDropdown();
        }
    }, [isFocused]);



    const FetchSingleStudentAsync = async (SingleStudentID: any) => {
        dispatch(setLoader(true));
        let studentDTO = new StudentDTO();
        studentDTO.ID = SingleStudentID
        let student: any = await new StudentMBL().GetStudentAsync(studentDTO);
        if (student.StatusCode == ERROR_CODES.OK) {
            setStudentDetail(student.Student);
        } else {
            dispatch(setShowSnackBar(true, GetResourceValue(resources, RESOURCE_CONSTANTS.ERRORS.ERROR_VIA_RETRIEVAL_DATA)));
            GoBack();
        }
        dispatch(setLoader(false));
    };

    const SaveStudentsAsync = async (GetFeildsArray: any) => {
        dispatch(setLoader(true));
        let studentDTO = new StudentDTO();
        let studentData = new StudentModel();
        studentData.FirstName = GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.STUDENT.FIRST_NAME)?.value;
        studentData.MiddleName = GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.STUDENT.MIDDLE_NAME)?.value;
        studentData.MothersName = GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.STUDENT.LAST_NAME)?.value;
        studentData.Age = GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.STUDENT.AGE)?.value;
        studentData.PhoneNumber = GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.STUDENT.PHONE_NUMBER)?.value;
        studentData.Gender = GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.STUDENT.GENDER)?.value;
        studentData.AddressLine1 = GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.STUDENT.FIRST_NAME)?.value;
        studentData.AddressLine2 = GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.STUDENT.FIRST_NAME)?.value;
        studentData.Weight = GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.STUDENT.FIRST_NAME)?.value;
        studentData.State = GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.STUDENT.FIRST_NAME)?.value;
        studentData.City = GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.STUDENT.FIRST_NAME)?.value;
        studentData.Pincode = GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.STUDENT.FIRST_NAME)?.value;
        studentData.Dob = GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.STUDENT.FIRST_NAME)?.value;
        studentData.LastLoggedinDatetime = GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.STUDENT.FIRST_NAME)?.value;
        studentData.StudentID = GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.STUDENT.FIRST_NAME)?.value;
        studentData.IsActive = GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.STUDENT.FIRST_NAME)?.value;
        studentData.IsSync = GetFeildsArray.find((e: any) => e.name == RESOURCE_CONSTANTS.STUDENT.FIRST_NAME)?.value;
        studentDTO.Students.push(studentData);
        let submitResult: any = await new StudentMBL().SaveStudentsAsync(studentDTO);
        if (submitResult.StatusCode == ERROR_CODES.OK) {
            studentID ? dispatch(setShowSnackBar(true, GetResourceValue(resources, RESOURCE_CONSTANTS.ERRORS.STUDENT_UPDATE_SUCCESS))) :
                dispatch(setShowSnackBar(true, GetResourceValue(resources, RESOURCE_CONSTANTS.ERRORS.STUDENT_SAVE_SUCCESS)));
            dispatch(setRefreshStudents(true));
            GoBack();
        } else {
            dispatch(setShowSnackBar(true, GetResourceValue(resources, RESOURCE_CONSTANTS.ERRORS.ERROR_VIA_DATA_SAVE)));
        }
        dispatch(setLoader(false));
    }

    const DeleteStudentAsync = async (StudentID: any | undefined) => {
        dispatch(setLoader(true));
        let studentDTO = new StudentDTO();
        let studentData = new StudentModel();
        studentData.StudentID = StudentID;
        studentData.IsActive = false;
        studentDTO.Students.push(studentData);
        let studentResult = await new StudentMBL().SaveStudentsAsync(studentDTO);
        if (studentResult.StatusCode == ERROR_CODES.OK) {
            dispatch(setRefreshStudents(true));
            GoBack();
        } else {
            dispatch(setShowSnackBar(true, RESOURCE_CONSTANTS.ERRORS.ERROR_VIA_DATA_DELETE));
        }
        setVisible(false)
        dispatch(setLoader(false));
    };

    const GetGenderDropdown = async () => {
        dispatch(setLoader(true));
        let temGenderArray = await GetDropdownValues(RESOURCE_GROUPS.GENDER_DROPDOWN, resources);
        setGenderData(temGenderArray);
        dispatch(setLoader(false));
    }

    return (
        <SafeAreaView style={AddEditStudentStyle.container}>
            <KeyboardAvoidingView keyboardVerticalOffset={ELEMENT_STYLES.KEYBOARD_OFFSET.MAX_OFFSET} behavior={KEYBOARD_AVOIDING.BEHAVIOR} style={AddEditStudentStyle.scrollViewContainer}>
                <LHHeaderBar
                    resources={resources}
                    leftIcon={BACK_ICON}
                    leftButtonClick={() => props.navigation.goBack()}
                    title={RESOURCE_CONSTANTS.STUDENT.PATIENT}
                    rightText={studentID ? RESOURCE_CONSTANTS.STUDENT.UPDATE : RESOURCE_CONSTANTS.STUDENT.SAVE}
                    rightButtonClick={async () => {
                        if (formRef?.current) {
                            let GetFeildsArray = await formRef.current.onSubmit();
                            if (GetFeildsArray && GetFeildsArray !== undefined) {
                                SaveStudentsAsync(GetFeildsArray);
                            }
                        }
                    }}
                />
                <LHContainer>
                    <LHForm ref={formRef} resources={resources}>
                        <LHTextBox
                            testID={RESOURCE_CONSTANTS.STUDENT.FIRST_NAME}
                            ref={useRef()}
                            type={CUSTOM_CONSTANTS.INPUT_TYPE.STRING}
                            resourceKey={RESOURCE_CONSTANTS.STUDENT.FIRST_NAME}
                            resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.STUDENT.FIRST_NAME)}
                            value={studentDetail ? studentDetail.FirstName : ""}
                        />
                        <LHTextBox
                            ref={useRef()}
                            type={CUSTOM_CONSTANTS.INPUT_TYPE.STRING}
                            resourceKey={RESOURCE_CONSTANTS.STUDENT.MIDDLE_NAME}
                            value={studentDetail ? studentDetail.MiddleName : ""}
                            resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.STUDENT.MIDDLE_NAME)}
                        />
                        <LHTextBox
                            testID={RESOURCE_CONSTANTS.STUDENT.LAST_NAME}
                            ref={useRef()}
                            type={CUSTOM_CONSTANTS.INPUT_TYPE.STRING}
                            resourceKey={RESOURCE_CONSTANTS.STUDENT.LAST_NAME}
                            value={studentDetail ? studentDetail.LastName : ""}
                            resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.STUDENT.LAST_NAME)}
                        />
                        <LHTextBox
                            ref={useRef()}
                            type={CUSTOM_CONSTANTS.INPUT_TYPE.STRING}
                            resourceKey={RESOURCE_CONSTANTS.STUDENT.MOTHERS_NAME}
                            value={studentDetail ? studentDetail.MothersName : ""}
                            resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.STUDENT.MOTHERS_NAME)}
                        />
                        <View style={CommonStyle.multiInputRowContainer}>
                            <View style={CommonStyle.multiInputWrapper}>
                                <LHDatePick
                                    ref={useRef()}
                                    type={CUSTOM_CONSTANTS.INPUT_TYPE.DATE}
                                    resourceKey={RESOURCE_CONSTANTS.STUDENT.DOB}
                                    value={studentDetail ? studentDetail.Dob : ""}
                                    resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.STUDENT.DOB)}
                                />
                            </View>
                            <View style={CommonStyle.multiInputMidWrapper}>
                                <LHTextBox
                                    testID={RESOURCE_CONSTANTS.STUDENT.AGE}
                                    ref={useRef()}
                                    type={CUSTOM_CONSTANTS.INPUT_TYPE.INTEGER}
                                    resourceKey={RESOURCE_CONSTANTS.STUDENT.AGE}
                                    resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.STUDENT.AGE)}
                                    value={studentDetail ? studentDetail.Age : ""}
                                    keyboardType={CUSTOM_CONSTANTS.KEYBOARD_TYPE.NUMERIC}
                                />
                            </View>
                            <View style={CommonStyle.multiInputWrapper}>
                                <LHDropDown
                                    testID={RESOURCE_CONSTANTS.STUDENT.GENDER}
                                    ref={useRef()}
                                    type={CUSTOM_CONSTANTS.INPUT_TYPE.NUMERIC}
                                    style={AddEditStudentStyle.dropdown}
                                    containerStyle={AddEditStudentStyle.shadow}
                                    data={genderData}
                                    value={studentDetail ? studentDetail.Gender : 0}
                                    resourceKey={RESOURCE_CONSTANTS.STUDENT.GENDER}
                                    resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.STUDENT.GENDER)}
                                    placeholder={RESOURCE_CONSTANTS.STUDENT.SELECT_GENDER}
                                />
                            </View>
                        </View>
                        <LHTextBox
                            testID={RESOURCE_CONSTANTS.STUDENT.PHONE_NUMBER}
                            ref={useRef()}
                            type={CUSTOM_CONSTANTS.INPUT_TYPE.INTEGER}
                            resourceKey={RESOURCE_CONSTANTS.STUDENT.PHONE_NUMBER}
                            resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.STUDENT.PHONE_NUMBER)}
                            value={studentDetail ? studentDetail.PhoneNumber : ""}
                            required={true}
                            keyboardType={CUSTOM_CONSTANTS.KEYBOARD_TYPE.NUMERIC}
                        />
                        <LHTextBox
                            testID={RESOURCE_CONSTANTS.STUDENT.ADDRESS_LINE1}
                            ref={useRef()}
                            type={CUSTOM_CONSTANTS.INPUT_TYPE.STRING}
                            resourceKey={RESOURCE_CONSTANTS.STUDENT.ADDRESS_LINE1}
                            resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.STUDENT.ADDRESS_LINE1)}
                            value={studentDetail ? studentDetail.AddressLine1 : ""}
                        />
                        <LHTextBox
                            ref={useRef()}
                            type={CUSTOM_CONSTANTS.INPUT_TYPE.STRING}
                            resourceKey={RESOURCE_CONSTANTS.STUDENT.ADDRESS_LINE2}
                            resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.STUDENT.ADDRESS_LINE2)}
                            value={studentDetail ? studentDetail.AddressLine2 : ""}
                        />
                        <View style={CommonStyle.multiInputRowContainer}>
                            <View style={CommonStyle.multiInputWrapper}>
                                <LHTextBox
                                    ref={useRef()}
                                    type={CUSTOM_CONSTANTS.INPUT_TYPE.STRING}
                                    resourceKey={RESOURCE_CONSTANTS.STUDENT.STATE}
                                    resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.STUDENT.STATE)}
                                    value={studentDetail ? studentDetail.State : ""}
                                />
                            </View>
                            <View style={CommonStyle.multiInputMidWrapper}>
                                <LHTextBox
                                    ref={useRef()}
                                    type={CUSTOM_CONSTANTS.INPUT_TYPE.STRING}
                                    resourceKey={RESOURCE_CONSTANTS.STUDENT.CITY}
                                    resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.STUDENT.CITY)}
                                    value={studentDetail ? studentDetail.City : ""}
                                />
                            </View>
                            <View style={CommonStyle.multiInputWrapper}>
                                <LHTextBox
                                    testID={RESOURCE_CONSTANTS.STUDENT.PINCODE}
                                    ref={useRef()}
                                    type={CUSTOM_CONSTANTS.INPUT_TYPE.INTEGER}
                                    resourceKey={RESOURCE_CONSTANTS.STUDENT.PINCODE}
                                    resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.STUDENT.PINCODE)}
                                    value={studentDetail ? studentDetail.Pincode : ""}
                                    required={true}
                                    keyboardType={CUSTOM_CONSTANTS.KEYBOARD_TYPE.NUMERIC}
                                />
                            </View>

                        </View>
                        <LHTextBox
                            ref={useRef()}
                            type={CUSTOM_CONSTANTS.INPUT_TYPE.NUMERIC}
                            resourceKey={RESOURCE_CONSTANTS.STUDENT.WEIGHT}
                            resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.STUDENT.WEIGHT)}
                            value={studentDetail ? studentDetail.Weight : ""}
                            keyboardType={CUSTOM_CONSTANTS.KEYBOARD_TYPE.NUMERIC}
                        />
                    </LHForm>
                    {studentID ?
                        <>
                            <View
                                style={{
                                    borderTopColor: '#ccc',
                                    borderTopWidth: 1,
                                    paddingVertical: 10,
                                    marginTop: 20,
                                }}
                            >
                                <LHDeleteButton
                                    resourceKey={RESOURCE_CONSTANTS.STUDENT.DELETE}
                                    resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.STUDENT.DELETE)}
                                    onClick={() => setVisible(true)}
                                />
                            </View>

                        </>
                        : null}
                </LHContainer>
                <LHDialog
                    visible={visible}
                    hideDialog={() => setVisible(false)}
                    messageText={GetResourceValue(resources, RESOURCE_CONSTANTS.COMMON.DELETE_CONFIRMATION_MESSAGE)}
                    negativeText={GetResourceValue(resources, RESOURCE_CONSTANTS.COMMON.CANCEL)}
                    positiveText={GetResourceValue(resources, RESOURCE_CONSTANTS.COMMON.OK)}
                    onPostiveCallback={() => DeleteStudentAsync(studentID)}
                />
            </KeyboardAvoidingView >
        </SafeAreaView >
    );
}