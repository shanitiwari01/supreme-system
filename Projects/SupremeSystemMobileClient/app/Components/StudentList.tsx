import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ERROR_CODES, LINEAR_GRADIENT, RESOURCE_CONSTANTS, STUDENT_CONSTANTS, CUSTOM_CONSTANTS, RIGHT_ARROW_ICON, MOBILE_SCREENS, RESOURCE_GROUPS, DiffYears } from "utility";
import { LHLinearGradient } from "./LinearGradient";
import { StudentModel, StudentDTO, ResourceModel } from "datamodels";
import { ListStyles, CommonStyle } from "../css/Styles";
import { useIsFocused } from "@react-navigation/native";
import { IState } from "./ReducerInterface";
import { setRefreshStudents } from "../store/actions/refreshActions";
import { useDispatch, useSelector } from "react-redux";
import { StudentMBL } from "mobilebusinesslayer";
import { setLoader } from "../store/actions/loaderActions";
import { Navigate } from "../navigation/NavigationService";
import { SvgXml } from "react-native-svg";
import UserAvatar from 'react-native-user-avatar-component';
import { setShowSnackBar } from "../store/actions/snackBarAction";
import { LHLoading } from "./Loader";
import { GetDropdownValues } from "../Functions/CommonFunctions";
import { DropdownModel } from "../models/Dropdown";

export const LHStudentList = (props: any) => {
    let [students, setStudents] = useState<StudentModel[]>([]);
    let [resources, setResources] = useState<ResourceModel[]>([]);
    let [genderData, setGenderData] = useState<DropdownModel[]>([]);
    let dispatch = useDispatch();
    const isFocused = useIsFocused();
    let refreshStudents = useSelector((state: IState) => state.refreshReducer.refreshStudents);
    let studentMBL = new StudentMBL();

    useEffect(() => {
        FetchStudentsAsync();
        GetGenderDropdown();
        if(props.resources) {
            setResources(props.resources);
        }
    }, []);

    useEffect(() => {
        if (isFocused && refreshStudents) {
            FetchStudentsAsync();
        }
    }, [isFocused, refreshStudents]);

    const FetchStudentsAsync = async () => {
        dispatch(setLoader(true));
        let studentDTO = new StudentDTO();
        studentDTO.NoOfRecords = props.listType == STUDENT_CONSTANTS.RECORDS_TYPE.RECENT ? STUDENT_CONSTANTS.RECENT_RECORDS_LIMIT : 0;
        studentDTO = await studentMBL.GetStudentsAsync(studentDTO);
        if (studentDTO.StatusCode == ERROR_CODES.OK) {
            if(studentDTO.Students.length > 0){
                setStudents(studentDTO.Students);
                props?.onFetch(studentDTO.Students.length);
            }
            
            if (refreshStudents) {
                dispatch(setRefreshStudents(false));
            }
        } else {
            dispatch(setShowSnackBar(true, RESOURCE_CONSTANTS.ERRORS.ERROR_VIA_RETRIEVAL_DATA));
        }
        dispatch(setLoader(false));
    };

    const GetGenderDropdown = async () => {
        dispatch(setLoader(true));
        let temGenderArray = await GetDropdownValues(RESOURCE_GROUPS.GENDER_DROPDOWN, resources);
        setGenderData(temGenderArray);
        dispatch(setLoader(false));
    }

    return (
        <>
            
                {
                students.length > 0 && students.map((student: StudentModel, index: number) => (
                    <TouchableOpacity key={index} onPress={() => Navigate(MOBILE_SCREENS.ADD_EDIT_STUDENT, { studentId: student.StudentID, resources: resources })} testID={RESOURCE_CONSTANTS.COMMON.STUDENTS}>
                        <LHLinearGradient
                            colors={LINEAR_GRADIENT.COLORS.TERTIARY}
                            key={index}
                            style={ListStyles.listContainer}>
                            <View style={ListStyles.leftContaint}>
                                {
                                    student.FirstName && <UserAvatar name={student.FirstName} style={ListStyles.listImage} />
                                }
                                <View>
                                    <Text style={[ListStyles.parentLabelStyle, CommonStyle.fontBold]}>
                                        {student.FirstName} {student.MiddleName} {student.LastName}
                                    </Text>
                                    <Text style={[ListStyles.childLabelStyle, CommonStyle.fontRegular]}>
                                        {genderData.find((e: any) => e.value == student.Gender?.toString())?.label} | {student.Dob ? DiffYears(new Date(student.Dob), new Date()) : ""}
                                    </Text>
                                </View>
                            </View>
                            {
                                props.listType == STUDENT_CONSTANTS.RECORDS_TYPE.ALL && student.StudentID &&
                                <View style={ListStyles.rightContaint}>
                                    <SvgXml width={CUSTOM_CONSTANTS.SVG.WIDTH.EXTRA_MEDIUM} height={CUSTOM_CONSTANTS.SVG.HEIGHT.EXTRA_MEDIUM} xml={RIGHT_ARROW_ICON} style={ListStyles.iconStyles} />
                                </View>
                            }
                        </LHLinearGradient>
                    </TouchableOpacity>
                ))
            }
        </>
    )
}