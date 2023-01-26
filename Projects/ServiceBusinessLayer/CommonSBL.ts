import express from "express";
import { CommonSDL } from "servicedatalayer";
import { ERROR_CODES, VALIDATION_FIELD_TYPES, FILE_BUCKET_TYPES, SETTING_CONSTANTS, ValidateTextField, ValidateNumberField, ValidateDateField, GetExtension, ValidateFile } from "utility";
import { ResourceKeyModel, BaseDTO, ContextDTO, ResourceDTO } from "datamodels";

type ValueOf<T> = T[keyof T];

export default class CommonSBL {

    // /**
    //  * Connect redis 
    //  */
    // private ConnectRedisAsync = async () => {
    //     let client = redis.createClient({
    //         url: "redis://127.0.0.1:6379"
    //     });
    //     redisDB = await client.connect()
    // }

    // private StoreStringInRedisAsync = async (key: string, value: string) => {
    //     if(!redisDB){
    //         await this.ConnectRedisAsync();
    //     }
    //     redisDB.set(key, value);
    // }

    /**
     * fetch resources
     * @param anyDTO any DTO
     * @returns list of resources
     */
    public GetPageResourcesAsync = async (anyDTO: any) => {
        try {
            if (anyDTO.LanguageID > 0) {
                anyDTO = await new CommonSDL().GetPageResourcesAsync(anyDTO);
                if (anyDTO.StatusCode != ERROR_CODES.OK) {
                    throw new Error(this.CreateErrorMessage(anyDTO));
                }
            } else {
                anyDTO.StatusCode = ERROR_CODES.VALIDATION_ERROR;
            }
        } catch (error) {
            anyDTO.StatusCode = ERROR_CODES.DATA_RETRIEVAL_ERROR;
            await this.LogCatchErrorAsync(error as Error);
        }
        return anyDTO;
    }

    /**
     * Get setting value
     * @param settingKeys 
     * @returns baseDTO setting value
     */
    protected GetSettingValueAsync = async (settingKeys: string) => {
        let baseDTO = new BaseDTO();
        try {
            baseDTO.Keys = settingKeys;
            baseDTO = await new CommonSDL().GetSettingValueAsync(baseDTO);
            if (baseDTO.StatusCode != ERROR_CODES.OK) {
                throw new Error(this.CreateErrorMessage(baseDTO));
            }
        } catch (error) {
            baseDTO.StatusCode = ERROR_CODES.DATA_RETRIEVAL_ERROR;
            await this.LogCatchErrorAsync(error as Error);
        }
        return baseDTO;
    }

    /**
     * fetch resource keys
     * @param anyDTO any DTO
     * @returns list of resource keys
     */
    protected GetResourceKeysAsync = async (anyDTO: any) => {
        try {
            anyDTO = await new CommonSDL().GetResourceKeysAsync(anyDTO);
            if (anyDTO.StatusCode != ERROR_CODES.OK) {
                throw new Error(this.CreateErrorMessage(anyDTO));
            }
        } catch (error) {
            anyDTO.StatusCode = ERROR_CODES.DATA_RETRIEVAL_ERROR;
            await this.LogCatchErrorAsync(error as Error);
        }
        return anyDTO;
    }

    /**
     * validate header data
     * @param contextDTO 
     * @param withToken 
     * @returns validation status
     */
    protected ValidateHeaderData = (contextDTO: ContextDTO, withToken: boolean = false) => {
        if (withToken && (!contextDTO.AccessToken && !contextDTO.RefreshToken)) {
            return false;
        }
        if (contextDTO.DeviceID && contextDTO.DeviceType && contextDTO.DeviceOS && contextDTO.DeviceOSVersion && contextDTO.DeviceModel) {
            return true;
        }
        return false;
    }

    /**
     * Log only catch errors
     * @param error 
     * @param userID 
     */
    protected LogCatchErrorAsync = async (error: Error, userID: string = "") => {
        let errorStack = (error).stack;
        let errorStackArr = (error).stack?.split("\n");
        var errorLocation = "";
        if (errorStackArr && errorStackArr[1]) {
            var caller_line: string = errorStackArr[1];
            var index = (caller_line).indexOf("at");
            var className = (caller_line).slice(index + 2, caller_line?.length).split(".")[0];
            var functionLine = (caller_line).slice(index + 2, caller_line?.length).split(".")[1];
            var functionName = (functionLine).split("(")[0];
            errorLocation = className + "/" + functionName;
        }
        await this.LogErrorAsync((error as { message: string }).message, errorStack ? errorStack.toString() : "", errorLocation, userID);
    }

    /**
     * Validate the data given in the DTO
     * @param anyDTO any DTO
     * @param dataVariable variable name of the array containing data
     * @returns validation status
     */
    protected ValidateDataAsync = async (anyDTO: any, dataVariable: string) => {
        try {
            anyDTO = await this.GetResourceKeysAsync(anyDTO);
            if (anyDTO.StatusCode == ERROR_CODES.OK && anyDTO[dataVariable] && anyDTO.ResourceDTO && anyDTO.ResourceDTO.ResourceKeys && anyDTO.ResourceDTO.ResourceKeys.length > 0) {
                if (anyDTO[dataVariable] instanceof Array) {
                    for (let dataFields of anyDTO[dataVariable]) {
                        if (await this.ValidateDataFieldsAsync(dataFields, anyDTO.ResourceDTO.ResourceKeys, anyDTO.Files) === false) {
                            return false;
                        }
                    }
                    return true;
                } else if (await this.ValidateDataFieldsAsync(anyDTO[dataVariable], anyDTO.ResourceDTO.ResourceKeys, anyDTO.Files)) {
                    return true;
                }
            }
        } catch (error) {
            anyDTO.StatusCode = ERROR_CODES.VALIDATION_ERROR;
            await this.LogCatchErrorAsync(error as Error);
        }
        return false;
    }

    /**
     * Create the context data from the header
     * @param contextDTO
     * @param req
     * @returns contextDTO
     */
    protected CreateContextData = (contextDTO: ContextDTO, req: express.Request) => {
        contextDTO.AccessToken = req.headers.accesstoken ? req.headers.accesstoken.toString() : "";
        contextDTO.RefreshToken = req.headers.refreshtoken ? req.headers.refreshtoken.toString() : "";
        contextDTO.DeviceID = req.headers.deviceid ? req.headers.deviceid.toString() : "";
        contextDTO.DeviceType = req.headers.devicetype ? req.headers.devicetype.toString() : "";
        contextDTO.DeviceOS = req.headers.deviceos ? req.headers.deviceos.toString() : "";
        contextDTO.DeviceOSVersion = req.headers.deviceosversion ? req.headers.deviceosversion.toString() : "";
        contextDTO.DeviceModel = req.headers.devicemodel ? req.headers.devicemodel.toString() : "";
        contextDTO.DeviceDetail = req.headers.devicedetail ? req.headers.devicedetail.toString() : "";
        contextDTO.IsRemembered = req.headers.isremembered ? !!req.headers.isremembered.toString() : false;
        contextDTO.PinCode = req.headers.pincode ? req.headers.pincode.toString() : "";
        return contextDTO;
    }

    /**
     * Reset all the unwanted data before sending the api response
     * @param anyDTO 
     * @returns updated DTO
     */
    protected ResetApiData = (anyDTO: any) => {
        anyDTO.StatusMessage = "";
        anyDTO.ID = "";
        anyDTO.Keys = "";
        anyDTO.LastSyncedAt = "";
        anyDTO.ResourceDTO = new ResourceDTO();
        anyDTO.LanguageID = 0;
        anyDTO.GroupIDs = "";
        anyDTO.LoggedInUserID = "";
        return anyDTO;
    }

    /**
     * creates a new error message
     * @param anyDTO 
     * @returns error message
     */
    protected CreateErrorMessage = (anyDTO: any) => {
        return anyDTO.StatusCode + " : " + anyDTO.StatusMessage;
    }

    /**
     * Generate file name for the given file
     * @param filename 
     * @param uid 
     * @param type 
     * @returns filename
     */
    protected GenerateFileName = (filename: string, uid: string, bucket: ValueOf<typeof FILE_BUCKET_TYPES>) => {
        return bucket + "_" + uid + "." + GetExtension(filename);
    }

    /**
     * Validate the data given in the DTO
     * @param dataFields fields
     * @param resourceKeys array of resource keys
     * @returns validation status
     */
    private ValidateDataFieldsAsync = async (dataFields: any, resourceKeys: ResourceKeyModel[], files: any) => {
        for (let dataField of Object.keys(dataFields)) {
            let resource: ResourceKeyModel | undefined = resourceKeys.find((e: ResourceKeyModel) => e.ResourceKey == dataField);
            if (resource && resource.FieldType != "") {
                if (Object.values(VALIDATION_FIELD_TYPES).includes(resource.FieldType)) {
                    if (await this.ValidateSingleFieldAsync(resource, dataFields[dataField], files) === false) {
                        return false;
                    }
                } else {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Validate the data given in the DTO
     * @param resource
     * @param fieldValue
     * @returns validation status
     */
    private ValidateSingleFieldAsync = async (resource: ResourceKeyModel, fieldValue: any, files: any) => {
        if (resource.FieldType == VALIDATION_FIELD_TYPES.TEXT) {
            if (ValidateTextField(fieldValue, resource.MinLength, resource.MaxLength, !!resource.IsRequired) === false) {
                return false;
            }
        } else if (resource.FieldType == VALIDATION_FIELD_TYPES.NUMERIC || resource.FieldType == VALIDATION_FIELD_TYPES.INTEGER) {
            if (ValidateNumberField(fieldValue, resource.MinLength, resource.MaxLength, !!resource.IsRequired) === false) {
                return false;
            }
        } else if (resource.FieldType == VALIDATION_FIELD_TYPES.DATE) {
            if (ValidateDateField(fieldValue, resource.MinLength, resource.MaxLength, !!resource.IsRequired) === false) {
                return false;
            }
        } else if (resource.FieldType == VALIDATION_FIELD_TYPES.IMAGE || resource.FieldType == VALIDATION_FIELD_TYPES.DOCUMENT || resource.FieldType == VALIDATION_FIELD_TYPES.FILE) {
            if (await this.ValidateFileFieldAsync(resource, files) === false) {
                return false;
            }
        }
        return true;
    }

    /**
     * Validate image files
     * @param resource
     * @param fieldValue
     * @returns validation status
     */
    private ValidateFileFieldAsync = async (resource: ResourceKeyModel, files: any) => {
        if (files && resource.ResourceKey && files[resource.ResourceKey]) {
            let baseDTO: BaseDTO = await this.GetSettingValueAsync(`'${SETTING_CONSTANTS.IMAGE_EXTENSION}', '${SETTING_CONSTANTS.DOC_EXTENSION}', '${SETTING_CONSTANTS.FILE_EXTENSION}'`);
            if (baseDTO.StatusCode == ERROR_CODES.OK && baseDTO.Data) {
                let fileTypes: string = "";
                if (resource.FieldType == VALIDATION_FIELD_TYPES.IMAGE) {
                    fileTypes = baseDTO.Data[SETTING_CONSTANTS.IMAGE_EXTENSION];
                } else if (resource.FieldType == VALIDATION_FIELD_TYPES.DOCUMENT) {
                    fileTypes = baseDTO.Data[SETTING_CONSTANTS.DOC_EXTENSION];
                } else if (resource.FieldType == VALIDATION_FIELD_TYPES.FILE) {
                    fileTypes = baseDTO.Data[SETTING_CONSTANTS.FILE_EXTENSION];
                }
                if (fileTypes) {
                    return ValidateFile(files[resource.ResourceKey], fileTypes, resource.MinLength, resource.MaxLength, !!resource.IsRequired);
                }
            }
        } else if (+resource.IsRequired == 0) {
            return true;
        }
        return false;
    }

    /**
     * Error logger
     * @param errorMessage 
     * @param errorStack 
     * @param errorLocation 
     * @param userID 
     */
    private LogErrorAsync = async (errorMessage: string, errorStack: string, errorLocation: string, userID: string) => {
        await new CommonSDL().LogErrorAsync(errorMessage, errorStack, errorLocation, userID);
    }
}