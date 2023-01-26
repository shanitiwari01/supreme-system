import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ERROR_CODES, LINEAR_GRADIENT, ELEMENT_STYLES, RESOURCE_CONSTANTS, CUSTOM_CONSTANTS, SUCCESS_ICON } from "utility";
import { LHLinearGradient } from "./LinearGradient";
import { LanguageModel, LanguageDTO } from "datamodels";
import { LanguagesStyle, ListStyles } from "../css/Styles";
import { useIsFocused } from "@react-navigation/native";
import { IState } from "./ReducerInterface";
import { setRefreshLanguages } from "../store/actions/refreshActions";
import { useDispatch, useSelector } from "react-redux";
import { LanguageMBL } from "mobilebusinesslayer";
import { setLoader } from "../store/actions/loaderActions";
import { setShowSnackBar } from "../store/actions/snackBarAction";
import { SvgXml } from "react-native-svg";

export const LHLanguageList = (props: any) => {
    let [languages, setLanguages] = useState<LanguageModel[]>([]);
    let [selectedLangauge, setSelectedLangauge] = useState(0);
    let dispatch = useDispatch();
    const isFocused = useIsFocused();
    let refreshLanguages: boolean = useSelector((state: IState) => state.refreshReducer.refreshLanguages);
    let languageMBL = new LanguageMBL();

    useEffect(() => {
        FetchLanguagesAsync();
    }, []);

    useEffect(() => {
        if (isFocused && refreshLanguages) {
            FetchLanguagesAsync();
        }
    }, [isFocused, refreshLanguages]);

    const FetchLanguagesAsync = async () => {
        dispatch(setLoader(true));
        setSelectedLangauge(props.languageSelected ? props.languageSelected : 0);
        let languageDTO: LanguageDTO = await languageMBL.GetLanguagesAsync();
        if (languageDTO.StatusCode == ERROR_CODES.OK && languageDTO.Languages) {
            setLanguages(languageDTO.Languages);
            if (refreshLanguages) {
                dispatch(setRefreshLanguages(false));
            }
        } else {
            dispatch(setShowSnackBar(true, RESOURCE_CONSTANTS.ERRORS.ERROR_VIA_RETRIEVAL_DATA));
        }
        dispatch(setLoader(false));
    };

    const LanguageBox = (language: LanguageModel) => {
        let boxStyle: any = [];
        if (props.languagePage) {
            boxStyle.push(LanguagesStyle.listContainer);
            boxStyle.push({ borderColor: selectedLangauge === language.LanguageID ? ELEMENT_STYLES.COLORS.SECONDARY : ELEMENT_STYLES.COLORS.PLACEHOLDER });
        } else {
            boxStyle.push(ListStyles.listContainer);
        }
        return (
            <LHLinearGradient
                colors={LINEAR_GRADIENT.COLORS.TERTIARY}
                style={boxStyle}
            >
                <Text style={LanguagesStyle.textStyle}>{language.LanguageName}</Text>
                {
                    props.languagePage && selectedLangauge === language.LanguageID &&
                    <SvgXml
                        width={CUSTOM_CONSTANTS.SVG.WIDTH.EXTRA_MEDIUM}
                        height={CUSTOM_CONSTANTS.SVG.HEIGHT.EXTRA_MEDIUM}
                        xml={SUCCESS_ICON}
                    />
                }
            </LHLinearGradient>
        )
    }

    return (
        <>
            {
                languages.length > 0 && languages.map((language: LanguageModel, index: number) => (
                    props.languagePage ?
                        <TouchableOpacity
                            testID={language.LanguageID.toString()}
                            key={index}
                            onPress={() => {
                                setSelectedLangauge(language.LanguageID);
                                if (props.languagePage && props.languageChanged) {
                                    props.languageChanged(language.LanguageID);
                                }
                            }}
                        >
                            {LanguageBox(language)}
                        </TouchableOpacity>
                        :
                        <View key={index}>
                            {LanguageBox(language)}
                        </View>
                ))
            }
        </>
    )
}