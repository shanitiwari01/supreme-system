import React, { useEffect, useState, useRef } from "react";
import { View } from "react-native";
import { LHTextBox, LHDropDown, LHDatePick } from "./CustomFields";
import { RESOURCE_CONSTANTS, CUSTOM_CONSTANTS, RESOURCE_GROUPS } from "utility";
import { StudentModel, ResourceModel } from "datamodels";
import { GetDropdownValues, GetSingleResourceValue } from "../Functions/CommonFunctions";
import { AddEditStudentStyle, CommonStyle } from "../css/Styles";
import { LHForm } from "./Form";

export const LHStudentForm = (props: any) => {
    let [resources, setResources] = useState<ResourceModel[]>([]);
    let [studentDetail, setStudentDetail] = useState<any>({});
    let [genderData, setGenderData] = useState([]);
    let formRef = useRef<any>();

    useEffect(() => {
        setResources(props.resources);
        setStudentDetail(props.studentDetail);
        GetGenderDropdown();
    }, []);

    const GetGenderDropdown = async () => {
        let groupIds = `${RESOURCE_GROUPS.GENDER_DROPDOWN}`;
        let temGenderArray = await GetDropdownValues(+groupIds, resources);
        setGenderData(temGenderArray);
    }

    return (
        <>
            {
                resources.length > 0 &&
                <LHForm ref={formRef} resources={resources}>
                    <LHTextBox
                        ref={useRef()}
                        type={CUSTOM_CONSTANTS.INPUT_TYPE.STRING}
                        resourceKey={RESOURCE_CONSTANTS.STUDENT.FIRST_NAME}
                        resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.STUDENT.FIRST_NAME)}
                        value={studentDetail ? studentDetail.FirstName : ""}
                    />
                    {/* <LHTextBox
                        ref={useRef()}
                        type={CUSTOM_CONSTANTS.INPUT_TYPE.STRING}
                        resourceKey={RESOURCE_CONSTANTS.MIDDLE_NAME}
                        value={studentDetail ? studentDetail.MiddleName : ""}
                        resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.MIDDLE_NAME)}
                    />
                    <LHTextBox
                        ref={useRef()}
                        type={CUSTOM_CONSTANTS.INPUT_TYPE.STRING}
                        resourceKey={RESOURCE_CONSTANTS.LAST_NAME}
                        value={studentDetail ? studentDetail.LastName : ""}
                        resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.LAST_NAME)}

                    />
                    <LHTextBox
                        ref={useRef()}
                        type={CUSTOM_CONSTANTS.INPUT_TYPE.STRING}
                        resourceKey={RESOURCE_CONSTANTS.MOTHERS_NAME}
                        value={studentDetail ? studentDetail.MothersName : ""}
                        resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.MOTHERS_NAME)}
                    />
                    <View style={CommonStyle.multiInputRowContainer}>
                        <View style={CommonStyle.multiInputWrapper}>
                            <LHDatePick
                                ref={useRef()}
                                type={CUSTOM_CONSTANTS.INPUT_TYPE.DATE}
                                resourceKey={RESOURCE_CONSTANTS.DOB}
                                value={studentDetail ? studentDetail.Dob : ""}
                                resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.DOB)}
                            />
                        </View>
                        <View style={CommonStyle.multiInputMidWrapper}>
                            <LHTextBox
                                ref={useRef()}
                                type={CUSTOM_CONSTANTS.INPUT_TYPE.INTEGER}
                                resourceKey={RESOURCE_CONSTANTS.AGE}
                                resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.AGE)}
                                value={studentDetail ? studentDetail.Age : ""}
                                keyboardType={CUSTOM_CONSTANTS.KEYBOARD_TYPE.NUMERIC}
                            />
                        </View>
                        <View style={CommonStyle.multiInputWrapper}>
                            <LHDropDown
                                ref={useRef()}
                                type={CUSTOM_CONSTANTS.INPUT_TYPE.STRING}
                                style={AddEditStudentStyle.dropdown}
                                containerStyle={AddEditStudentStyle.shadow}
                                data={genderData}
                                value={studentDetail ? studentDetail.Gender : ""}
                                resourceKey={RESOURCE_CONSTANTS.GENDER}
                                resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.GENDER)}
                                placeholder={RESOURCE_CONSTANTS.SELECT_GENDER}
                            />
                        </View>
                    </View>
                    <LHTextBox
                        ref={useRef()}
                        type={CUSTOM_CONSTANTS.INPUT_TYPE.INTEGER}
                        resourceKey={RESOURCE_CONSTANTS.PHONE_NUMBER}
                        resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.PHONE_NUMBER)}
                        value={studentDetail ? studentDetail.PhoneNumber : ""}
                        required={true}
                        keyboardType={CUSTOM_CONSTANTS.KEYBOARD_TYPE.NUMERIC}
                    />
                    <LHTextBox
                        ref={useRef()}
                        type={CUSTOM_CONSTANTS.INPUT_TYPE.STRING}
                        resourceKey={RESOURCE_CONSTANTS.ADDRESS_LINE1}
                        resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.ADDRESS_LINE1)}
                        value={studentDetail ? studentDetail.AddressLine1 : ""}
                    />
                    <LHTextBox
                        ref={useRef()}
                        type={CUSTOM_CONSTANTS.INPUT_TYPE.STRING}
                        resourceKey={RESOURCE_CONSTANTS.ADDRESS_LINE2}
                        resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.ADDRESS_LINE2)}
                        value={studentDetail ? studentDetail.AddressLine2 : ""}
                    />
                    <View style={CommonStyle.multiInputRowContainer}>
                        <View style={CommonStyle.multiInputWrapper}>
                            <LHTextBox
                                ref={useRef()}
                                type={CUSTOM_CONSTANTS.INPUT_TYPE.STRING}
                                resourceKey={RESOURCE_CONSTANTS.STATE}
                                resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.STATE)}
                                value={studentDetail ? studentDetail.State : ""}
                            />
                        </View>
                        <View style={CommonStyle.multiInputMidWrapper}>
                            <LHTextBox
                                ref={useRef()}
                                type={CUSTOM_CONSTANTS.INPUT_TYPE.STRING}
                                resourceKey={RESOURCE_CONSTANTS.CITY}
                                resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.CITY)}
                                value={studentDetail ? studentDetail.City : ""}
                            />
                        </View>
                        <View style={CommonStyle.multiInputWrapper}>
                            <LHTextBox
                                ref={useRef()}
                                type={CUSTOM_CONSTANTS.INPUT_TYPE.INTEGER}
                                resourceKey={RESOURCE_CONSTANTS.PINCODE}
                                resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.PINCODE)}
                                value={studentDetail ? studentDetail.Pincode : ""}
                                required={false}
                                keyboardType={CUSTOM_CONSTANTS.KEYBOARD_TYPE.NUMERIC}
                            />
                        </View>

                    </View>
                    <LHTextBox
                        ref={useRef()}
                        type={CUSTOM_CONSTANTS.INPUT_TYPE.NUMERIC}
                        resourceKey={RESOURCE_CONSTANTS.WEIGHT}
                        resource={GetSingleResourceValue(resources, RESOURCE_CONSTANTS.WEIGHT)}
                        value={studentDetail ? studentDetail.Weight : ""}
                        keyboardType={CUSTOM_CONSTANTS.KEYBOARD_TYPE.NUMERIC}
                    /> */}
                </LHForm>
            }
        </>
    )
}