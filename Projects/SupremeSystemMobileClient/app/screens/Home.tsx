import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { MOBILE_SCREENS, STUDENT_CONSTANTS, ERROR_CODES, RESOURCE_GROUPS, RESOURCE_CONSTANTS } from "utility";
import { LHContainer } from "../Components/Container";
import { ListStyles, DashboardStyles } from "../css/Styles";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Navigate } from "../navigation/NavigationService";
import { LHStudentList } from "../Components/StudentList";
import { ResourceModel, BaseDTO } from "datamodels";
import { LHLanguageList } from "../Components/LanguageList";
import { useDispatch } from "react-redux";
import { setLoader } from "../store/actions/loaderActions";
import { CommonMBL } from "mobilebusinesslayer";
import { GetResourceValue } from "../Functions/CommonFunctions";
import { LHHeaderBar } from "../Components/HeaderBar";
import { useIsFocused } from "@react-navigation/native";

export const Home = () => {
    let [resources, setResources] = useState<ResourceModel[]>([]);
    let [studentLength, setStudentLength] = useState(0);
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
        baseDTO.GroupIDs = `${RESOURCE_GROUPS.DASHBOARD},${RESOURCE_GROUPS.GENDER_DROPDOWN},${RESOURCE_GROUPS.STUDENTS}`;
        baseDTO = await new CommonMBL().GetPageResourcesAsync(baseDTO);
        if (baseDTO.StatusCode == ERROR_CODES.OK && baseDTO.ResourceDTO && baseDTO.ResourceDTO.Resources && isFocused) {
            setResources(baseDTO.ResourceDTO.Resources);
        }
        dispatch(setLoader(false));
    }

    return (
        <View style={ListStyles.container}>
            {resources.length > 0 &&
                <>
                    <LHHeaderBar
                        resources={resources}
                        title={RESOURCE_CONSTANTS.COMMON.HOME}
                    />
                    <LHContainer>
                        <View style={DashboardStyles.mainHeader}>
                            <Text testID={RESOURCE_CONSTANTS.DASHBOARD.WELCOME} style={DashboardStyles.mainHeaderText}>{GetResourceValue(resources, RESOURCE_CONSTANTS.DASHBOARD.WELCOME)}</Text>
                        </View>
                        {studentLength > 0 && <View style={DashboardStyles.listHeading}>
                            <Text style={DashboardStyles.listHeadingText}>{GetResourceValue(resources, RESOURCE_CONSTANTS.DASHBOARD.RECENT_STUDENTS)}</Text>
                            <TouchableOpacity onPress={() => Navigate(MOBILE_SCREENS.STUDENTS)}>
                                <Text style={DashboardStyles.seeAllText}>{GetResourceValue(resources, RESOURCE_CONSTANTS.DASHBOARD.SEE_ALL)}</Text>
                            </TouchableOpacity>
                        </View>}
                        <LHStudentList
                            listType={STUDENT_CONSTANTS.RECORDS_TYPE.RECENT}
                            resources={resources}
                            onFetch={(count: number) => setStudentLength(count)}
                        />
                        <View style={DashboardStyles.listHeading}>
                            <Text style={DashboardStyles.listHeadingText}>{GetResourceValue(resources, RESOURCE_CONSTANTS.DASHBOARD.AVAILABLE_LANGUAGES)}</Text>
                            <TouchableOpacity onPress={() => Navigate(MOBILE_SCREENS.LANGUAGE)}>
                                <Text style={DashboardStyles.seeAllText}>{GetResourceValue(resources, RESOURCE_CONSTANTS.DASHBOARD.SEE_ALL)}</Text>
                            </TouchableOpacity>
                        </View>
                        <LHLanguageList />
                    </LHContainer>
                </>
            }
        </View >
    );
}