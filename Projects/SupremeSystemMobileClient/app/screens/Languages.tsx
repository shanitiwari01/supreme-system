import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { RESOURCE_CONSTANTS, ERROR_CODES, MOBILE_CONFIG, CUSTOM_RESOURCE_CONSTANTS, MOBILE_SCREENS, RESOURCE_GROUPS, BACK_ICON } from "utility";
import { LHContainer } from "../Components/Container";
import { LHSubmitButton } from "../Components/CustomFields";
import { LanguagesStyle } from "../css/Styles";
import { useDispatch } from "react-redux";
import { setLoader } from "../store/actions/loaderActions";
import { LanguageMBL, ResourceMBL } from "mobilebusinesslayer";
import { setShowSnackBar } from "../store/actions/snackBarAction";
import { BaseDTO, ResourceModel } from "datamodels";
import { GetNextScreenAsync, GetResourceValue } from "../Functions/CommonFunctions";
import { Navigate, GoBack } from "../navigation/NavigationService";
import { LHStatusBar } from "../Components/StatusBar";
import { LHHeaderBar } from "../Components/HeaderBar";
import { LHLanguageList } from "../Components/LanguageList";
import { useIsFocused } from "@react-navigation/native";

export const Languages = () => {
    let [resources, setResources] = useState<ResourceModel[]>([]);
    let [selectedLangauge, setSelectedLangauge] = useState(0);
    let [savedLanguage, setSavedLanguage] = useState(0);
    let [heading, setHeading] = useState("");
    let [buttonName, setButtonName] = useState("");
    let dispatch = useDispatch();
    const isFocused = useIsFocused();
    let languageMBL = new LanguageMBL();

    useEffect(() => {
        if (isFocused) {
            SetUpLanguagePageAsync();
        }
    }, [isFocused]);

    const SetUpLanguagePageAsync = async () => {
        dispatch(setLoader(true));
        setSavedLanguage(await languageMBL.GetLanguageIDAsync());
        if (global.BEFORE_LOGIN == false) {
            let baseDTO = new BaseDTO();
            baseDTO.GroupIDs = `${RESOURCE_GROUPS.LANGUAGE}`;
            baseDTO = await languageMBL.GetPageResourcesAsync(baseDTO);
            if (baseDTO.StatusCode == ERROR_CODES.OK && baseDTO.ResourceDTO && baseDTO.ResourceDTO.Resources && baseDTO.ResourceDTO.Resources.length > 0 && isFocused) {
                setResources(baseDTO.ResourceDTO.Resources);
                setHeading(GetResourceValue(baseDTO.ResourceDTO.Resources, RESOURCE_CONSTANTS.LANGUAGRE.CHANGE_LANGUAGE));
                setButtonName(RESOURCE_CONSTANTS.STUDENT.UPDATE);
            }
        } else {
            setHeading(CUSTOM_RESOURCE_CONSTANTS.SELECT_LANGUAGE);
            setButtonName(CUSTOM_RESOURCE_CONSTANTS.NEXT);
        }
        dispatch(setLoader(false));
    };

    const ValidateSelectedLanguageAsync = async () => {
        dispatch(setLoader(true));
        if (selectedLangauge > 0) {
            if (selectedLangauge == savedLanguage) {
                await GetNextScreenAsync();
            } else if (await languageMBL.IsNetConnectedAsync()) {
                await languageMBL.SaveValueInStorageAsync(MOBILE_CONFIG.LANGUAGE_ID, selectedLangauge.toString());
                let syncResult: BaseDTO = await new ResourceMBL().SyncResourcesFromServerAsync(true);
                if (syncResult.StatusCode == ERROR_CODES.OK) {
                    await GetNextScreenAsync();
                } else {
                    await languageMBL.SaveValueInStorageAsync(MOBILE_CONFIG.LANGUAGE_ID, savedLanguage.toString());
                    Navigate(MOBILE_SCREENS.ERROR_SCREEN, { errorcode: ERROR_CODES.DATA_SYNC_ERROR });
                }
            } else {
                dispatch(setShowSnackBar(true, CUSTOM_RESOURCE_CONSTANTS.NO_INTERNET_TITLE));
            }
        } else {
            dispatch(setShowSnackBar(true, CUSTOM_RESOURCE_CONSTANTS.NO_LANGUAGE));
        }
        dispatch(setLoader(false));
    }

    return (
        <View style={LanguagesStyle.container}>
            {global.BEFORE_LOGIN == false && resources.length > 0 ?
                <LHHeaderBar
                    leftIcon={BACK_ICON}
                    leftButtonClick={() => GoBack()}
                    resources={resources}
                    title={RESOURCE_CONSTANTS.LANGUAGRE.LANGUAGES}
                />
                :
                <LHStatusBar />
            }
            <LHContainer>
                <View style={LanguagesStyle.containt}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={LanguagesStyle.headerStyle}>{heading}</Text>
                        {heading != "" &&
                            <LHLanguageList
                                languagePage={true}
                                languageSelected={savedLanguage}
                                languageChanged={(languageID: number) => setSelectedLangauge(languageID)}
                            />
                        }
                        {selectedLangauge > 0 &&
                            <LHSubmitButton
                                testID={RESOURCE_CONSTANTS.SIGN_IN.SIGNIN}
                                resourceKey={buttonName}
                                onClick={() => ValidateSelectedLanguageAsync()}
                            />
                        }
                    </ScrollView>
                </View>
            </LHContainer>
        </View>
    )
}