import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { RESOURCE_CONSTANTS, MOBILE_SCREENS, STUDENT_CONSTANTS, RESOURCE_GROUPS, ERROR_CODES } from "utility";
import { ResourceModel, BaseDTO } from "datamodels";
import { ListStyles } from "../../css/Styles";
import { LHContainer } from "../../Components/Container";
import { LHHeaderBar } from "../../Components/HeaderBar";
import { Navigate } from "./../../navigation/NavigationService";
import { LHStudentList } from "../../Components/StudentList";
import { useDispatch } from "react-redux";
import { setLoader } from "../../store/actions/loaderActions";
import { setShowSnackBar } from "../../store/actions/snackBarAction";
import { CommonMBL } from "mobilebusinesslayer";
import { useIsFocused } from "@react-navigation/native";

export const Students = () => {
    let [resources, setResources] = useState<ResourceModel[]>([]);
    let dispatch = useDispatch();
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            FetchResourcesAsync();
        }
    }, [isFocused]);

    const FetchResourcesAsync = async () => {
        dispatch(setLoader(true));
        let baseDTO = new BaseDTO();
        baseDTO.GroupIDs = `${RESOURCE_GROUPS.GENDER_DROPDOWN},${RESOURCE_GROUPS.STUDENTS}`;
        baseDTO = await new CommonMBL().GetPageResourcesAsync(baseDTO);
        if (baseDTO.StatusCode == ERROR_CODES.OK) {
            if (baseDTO.ResourceDTO && baseDTO.ResourceDTO.Resources) {
                setResources(baseDTO.ResourceDTO.Resources);
            }
        } else {
            dispatch(setShowSnackBar(true, RESOURCE_CONSTANTS.ERRORS.ERROR_VIA_RETRIEVAL_DATA));
        }
        dispatch(setLoader(false));
    }

    return (
        <View style={ListStyles.container}>
            {
                resources.length > 0 &&
                <>
                    <LHHeaderBar
                        resources={resources}
                        title={RESOURCE_CONSTANTS.COMMON.STUDENTS}
                        rightText={RESOURCE_CONSTANTS.STUDENT.ADD_PATIENT}
                        rightButtonClick={async () => Navigate(MOBILE_SCREENS.ADD_EDIT_STUDENT, { resources: resources })}
                    />
                    <LHContainer>
                        <View style={{ paddingTop: 20 }}>
                            {isFocused ? <LHStudentList
                                listType={STUDENT_CONSTANTS.RECORDS_TYPE.ALL}
                                resources={resources}
                            />: null}
                        </View>
                    </LHContainer>
                </>
            }
        </View>
    );
}
