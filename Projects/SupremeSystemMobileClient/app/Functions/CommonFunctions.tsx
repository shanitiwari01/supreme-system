import { Navigate } from "./../navigation/NavigationService";
import { CommonMBL, SyncDataMBL } from "mobilebusinesslayer";
import JailMonkey from "jail-monkey";
import ScreenCaptureSecure from "react-native-screen-capture-secure";
import { RESOURCE_CONSTANTS, RESOURCE_FIELDS, MOBILE_CONFIG, MOBILE_SCREENS, REG_EXP_CONSTANTS, PASSCODE_TYPE, ERROR_CODES, SETTING_CONSTANTS, SYNC_CONSTANTS, VALIDATION_FIELD_TYPES, BOOLEAN_STATUS, GetFieldLimitMessage, ValidateDateField, ValidateTextField, ValidateNumberField, ValidateFile } from "utility";
import { BaseDTO, ResourceModel, ResourceKeyModel } from "datamodels";
import { ValidationModel } from "../models/Validation";
import { DropdownModel } from "../models/Dropdown";
type ValueOf<T> = T[keyof T];

/**
 * intial set up of the application
 */
export const SetUpApplicationAsync = async () => {
    let commonMBL = new CommonMBL();
    if (await FirstTimeSyncDataAsync(commonMBL)) {
        if (await CheckAppSecurityAsync(commonMBL)) {
            await GetNextScreenAsync();
        }
    }
}

/**
 * It will decide which screen should show when app starts
 */
export const GetNextScreenAsync = async () => {
    let commonMBL = new CommonMBL();
    if (await commonMBL.GetNumberValueFromStorageAsync(MOBILE_CONFIG.LANGUAGE_ID)) {
        await CheckUserTokenAsync(commonMBL);
    } else {
        Navigate(MOBILE_SCREENS.LANGUAGE);
    }
}

/**
 * checks if the app is opened for the fist time
 * @param commonMBL 
 * @returns status
 */
const FirstTimeSyncDataAsync = async (commonMBL: CommonMBL) => {
    let isFirstTime: boolean | null = await commonMBL.GetBooleanValueFromStorageAsync(MOBILE_CONFIG.IS_FIRST_TIME);
    if (isFirstTime == null || isFirstTime) {
        //TODO: decrypt DB with unique key
        if (isFirstTime == null) {
            await commonMBL.SaveValueInStorageAsync(MOBILE_CONFIG.IS_FIRST_TIME, BOOLEAN_STATUS.STATUS_TRUE.toString());
        }
        if (await commonMBL.IsNetConnectedAsync()) {
            let syncResult: BaseDTO = await new SyncDataMBL().SyncDataAsync(SYNC_CONSTANTS.MASTER_DATA);
            if (syncResult.StatusCode != ERROR_CODES.OK) {
                Navigate(MOBILE_SCREENS.ERROR_SCREEN, { errorcode: ERROR_CODES.DATA_SYNC_ERROR });
                return false;
            }
        } else {
            Navigate(MOBILE_SCREENS.ERROR_SCREEN, { errorcode: ERROR_CODES.NO_INTERNET });
            return false;
        }
    }
    return true;
}

/**
 * checks for the security operations
 * @param commonMBL 
 * @returns status
 */
const CheckAppSecurityAsync = async (commonMBL: CommonMBL) => {
    let settings: BaseDTO = await commonMBL.GetSettingValueAsync(`'${SETTING_CONSTANTS.ALLOW_IN_ROOTED_DEVICES}', '${SETTING_CONSTANTS.ALLOW_SCREEN_CAPTURE}'`);
    if (settings.StatusCode == ERROR_CODES.OK) {
        if (parseInt(settings.Data[SETTING_CONSTANTS.ALLOW_IN_ROOTED_DEVICES]) == 0 && JailMonkey.isJailBroken()) {
            Navigate(MOBILE_SCREENS.ERROR_SCREEN, { errorcode: ERROR_CODES.JAIL_BROKEN });
            return false;
        }
        if (parseInt(settings.Data[SETTING_CONSTANTS.ALLOW_SCREEN_CAPTURE])) {
            //enable screen capture
            ScreenCaptureSecure.disableSecure();
        } else {
            //disable screen capture
            ScreenCaptureSecure.enableSecure();
        }
    } else {
        Navigate(MOBILE_SCREENS.ERROR_SCREEN, { errorcode: ERROR_CODES.DATA_RETRIEVAL_ERROR });
        return false;
    }
    return true;
}

/**
 * checks if the user has logged in or not
 * @param commonMBL 
 * @returns status
 */
const CheckUserTokenAsync = async (commonMBL: CommonMBL) => {
    if (await commonMBL.GetStringValueFromStorageAsync(MOBILE_CONFIG.ACCESS_TOKEN)) {
        if (global.BEFORE_LOGIN === true) {
            let passcodeType: string = await commonMBL.GetNumberValueFromStorageAsync(MOBILE_CONFIG.PASS_CODE) ? PASSCODE_TYPE.LOGIN_WITH_PASSCODE : PASSCODE_TYPE.SET_PASSCODE;
            Navigate(MOBILE_SCREENS.PASSCODE, { type: passcodeType });
        } else {
            Navigate(MOBILE_SCREENS.HOME);
        }
    } else {
        Navigate(MOBILE_SCREENS.SIGNIN);
    }
}

/**
 * Get resource value based on its key
 * @param resources 
 * @param key 
 * @param column 
 * @returns Value
 */
export const GetResourceValue = (resources: ResourceModel[], key: ResourceKeyModel[typeof RESOURCE_FIELDS.KEY], column: ValueOf<typeof RESOURCE_FIELDS> | null = null) => {
    let result: any = "";
    if (!column) {
        column = RESOURCE_FIELDS.VALUE;
    }
    let keyIndex: number = CheckResourceExists(resources, key);
    if (keyIndex >= 0) {
        result = resources[keyIndex][column] ? resources[keyIndex][column] : "";
    }
    return result;
}

/**
 * Get single resource object based on its key
 * @param resources 
 * @param key
 * @returns Value in string
 */
export const GetSingleResourceValue = (resources: ResourceModel[], key: ResourceKeyModel[typeof RESOURCE_FIELDS.KEY]) => {
    let result: ResourceModel | null = null;
    let keyIndex: number = CheckResourceExists(resources, key);
    if (keyIndex >= 0) {
        result = resources[keyIndex];
    }
    return result;
}

/**
 * checks if the resource exists of the particular resource key
 * @param resources 
 * @param key 
 * @returns index of the resource
 */
const CheckResourceExists = (resources: ResourceModel[], key: ResourceKeyModel[typeof RESOURCE_FIELDS.KEY]) => {
    if (resources && resources.length > 0) {
        return resources.findIndex((e: ResourceModel) => e[RESOURCE_FIELDS.KEY] == key);
    }
    return -1;
}

/**
 * Get value from the nested resource key
 * @param resources 
 * @param key 
 * @returns Value in string
 */
export const GetNestedResources = (resources: ResourceModel[], key: ResourceKeyModel[typeof RESOURCE_FIELDS.KEY]) => {
    let result: any = GetResourceValue(resources, key);
    if (result != "") {
        var subKeys: Array<string> = result.match(REG_EXP_CONSTANTS.KEY);
        if (subKeys && subKeys.length > 0) {
            subKeys.forEach((keyVal: string) => {
                result = result.replace(keyVal, GetResourceValue(resources, keyVal.slice(1, -1)));
            });
        }
    }
    return result;
}

/**
 * Validate all fields available in form
 * @param formData 
 * @param resources 
 * @returns validation status object
 */
export const ValidateFormFieldsAsync = async (formData: any, resources: ResourceModel[]) => {
    let result: ValidationModel[] = [];
    if (formData && formData.length > 0) {
        for (let data of formData) {
            let itemResource: ResourceModel | null = GetSingleResourceValue(resources, data.name);
            let validation = new ValidationModel();
            if (itemResource) {
                validation = await CommonValidateFunctionAsync(data, itemResource, resources, validation);
            }
            result.push(validation);
        }
    }
    return result;
}

/**
 * Common validate function
 * @param item 
 * @param itemResource
 * @param resources 
 * @param resultObj 
 * @returns validation result object
 */
const CommonValidateFunctionAsync = async (item: any, itemResource: ResourceModel, resources: ResourceModel[], resultObj: ValidationModel) => {
    let minLength = +itemResource.MinLength;
    let maxLength = +itemResource.MaxLength;
    let isRequired = !!+itemResource.IsRequired;
    let checkError = GetResourceValue(resources, RESOURCE_CONSTANTS.ERRORS.FIELD_LIMIT);
    let fieldType = itemResource.FieldType;
    //Discuss: Validation function cannot be used here
    resultObj.name = item.name;
    if (fieldType == VALIDATION_FIELD_TYPES.TEXT) {
        if (ValidateTextField(item.value, minLength, maxLength, isRequired) === false) {
            resultObj.validation = false;
            resultObj.error = GetFieldLimitMessage(fieldType, minLength, maxLength, checkError);
        }
    }
    else if (fieldType == VALIDATION_FIELD_TYPES.NUMERIC || fieldType == VALIDATION_FIELD_TYPES.INTEGER) {
        if (ValidateNumberField(item.value, minLength, maxLength, isRequired) === false) {
            resultObj.validation = false;
            resultObj.error = GetFieldLimitMessage(fieldType, minLength, maxLength, checkError);
        }
    } else if (fieldType == VALIDATION_FIELD_TYPES.DATE) {
        if (ValidateDateField(item.value, minLength, maxLength, isRequired) === false) {
            resultObj.validation = false;
            resultObj.error = GetFieldLimitMessage(fieldType, minLength, maxLength, checkError);
        }
    } else if (fieldType == VALIDATION_FIELD_TYPES.IMAGE || fieldType == VALIDATION_FIELD_TYPES.DOCUMENT || fieldType == VALIDATION_FIELD_TYPES.FILE) {
        if(await ValidateFileFieldAsync(itemResource, item) === false) {
            resultObj.validation = false;
            resultObj.error = GetFieldLimitMessage(fieldType, minLength, maxLength, checkError);
        }
    }
    return resultObj
}

/**
 * Validation for files
 * @param itemResource 
 * @param files 
 * @returns 
 */
const ValidateFileFieldAsync = async (itemResource: ResourceModel, file: any) => {
    if (file && itemResource.ResourceKey && file.value) {
        let baseDTO: BaseDTO = await new CommonMBL().GetSettingValueAsync(`'${SETTING_CONSTANTS.IMAGE_EXTENSION}', '${SETTING_CONSTANTS.DOC_EXTENSION}', '${SETTING_CONSTANTS.FILE_EXTENSION}'`);
        if (baseDTO.StatusCode == ERROR_CODES.OK && baseDTO.Data) {
            let fileTypes: string = "";
            if (itemResource.FieldType == VALIDATION_FIELD_TYPES.IMAGE) {
                fileTypes = baseDTO.Data[SETTING_CONSTANTS.IMAGE_EXTENSION];
            } else if (itemResource.FieldType == VALIDATION_FIELD_TYPES.DOCUMENT) {
                fileTypes = baseDTO.Data[SETTING_CONSTANTS.DOC_EXTENSION];
            } else if (itemResource.FieldType == VALIDATION_FIELD_TYPES.FILE) {
                fileTypes = baseDTO.Data[SETTING_CONSTANTS.FILE_EXTENSION];
            }
            if (fileTypes) {
                return ValidateFile(file.value, fileTypes, itemResource.MinLength, itemResource.MaxLength, !!itemResource.IsRequired);
            }
        }
    } else if (+itemResource.IsRequired == 0) {
        return true;
    }
    return false;
}

/**
 * Get dropdown items from resources
 * @param groupId 
 * @param resources 
 * @returns dropdown item
 */
export const GetDropdownValues = async (groupId: number, resources: ResourceModel[]) => {
    let dropdownValues: DropdownModel[] = [];
    let groupResources = resources.filter((e: ResourceModel) => e.GroupID == groupId);
    if (groupResources && groupResources.length > 0) {
        groupResources.forEach((data: ResourceModel) => {
            if (data.ResourceKey && data.ResourceValue) {
                let dropdown: DropdownModel = {
                    label: data.ResourceValue,
                    value: data.ResourceKey
                };
                dropdownValues.push(dropdown);
            }
        });
    }
    return dropdownValues;
}

/**
 * Logout user 
 * @param groupId 
 * @param resources 
 * @returns dropdown item
 */
export const LogoutUserAsync = async () => {
    let commonMBL = new CommonMBL();
    await commonMBL.RemoveValueInStorageAsync(MOBILE_CONFIG.ACCESS_TOKEN);
    await commonMBL.RemoveValueInStorageAsync(MOBILE_CONFIG.REFRESH_TOKEN);
    await commonMBL.RemoveValueInStorageAsync(MOBILE_CONFIG.PASS_CODE);
    global.BEFORE_LOGIN = true;
    Navigate(MOBILE_SCREENS.SIGNIN);
}