import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { ERROR_CODES, RESOURCE_GROUPS, RESOURCE_CONSTANTS } from "utility";
import { LHContainer } from "../Components/Container";
import { ListStyles, DashboardStyles } from "../css/Styles";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ResourceModel, BaseDTO } from "datamodels";
import { useDispatch } from "react-redux";
import { setLoader } from "../store/actions/loaderActions";
import { CommonMBL } from "mobilebusinesslayer";
import { GetResourceValue, LogoutUserAsync } from "../Functions/CommonFunctions";
import { LHHeaderBar } from "../Components/HeaderBar";
import { useIsFocused } from "@react-navigation/native";

export const Settings = () => {
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
        baseDTO.GroupIDs = `${RESOURCE_GROUPS.DASHBOARD}`;
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
                        title={RESOURCE_CONSTANTS.COMMON.SETTINGS}
                    />
                    <LHContainer>
                        <TouchableOpacity onPress={() => LogoutUserAsync()}>
                            <Text style={DashboardStyles.mainHeaderText}>{GetResourceValue(resources, RESOURCE_CONSTANTS.COMMON.LOGOUT)}</Text>
                        </TouchableOpacity>
                    </LHContainer>
                </>
            }
        </View >
    );
}