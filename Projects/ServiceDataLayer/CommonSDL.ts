import { RunQuery } from "./Config/Sql";
import { ERROR_CODES, BOOLEAN_STATUS } from "utility";
import { ResourceDTO, ResourceKeyModel, ResourceModel, BaseDTO } from "datamodels";

export default class CommonSDL {

    /**
     * @param anyDTO any kind of DTO
     * @returns list of resources
     */
    public GetPageResourcesAsync = async (anyDTO: any) => {
        if (anyDTO.GroupIDs && anyDTO.GroupIDs != "" && anyDTO.LanguageID && anyDTO.LanguageID > 0) {
            let fetchResult: any = await RunQuery(
                `SELECT ResourceKeys.ResourceKey, ResourceKeys.GroupID, ResourceKeys.FieldType, ResourceKeys.IsRequired, ResourceKeys.MinLength, ResourceKeys.MaxLength, Resources.ResourceValue, Resources.PlaceholderValue, Resources.InfoValue
                FROM ResourceKeys
                INNER JOIN Resources ON ResourceKeys.ResourceKeyID = Resources.ResourceKeyID
                WHERE ResourceKeys.GroupID IN(${anyDTO.GroupIDs}) AND Resources.LanguageID = ${anyDTO.LanguageID} AND Resources.IsActive = ${BOOLEAN_STATUS.STATUS_TRUE}`
            );
            anyDTO.StatusCode = fetchResult.StatusCode;
            anyDTO.StatusMessage = fetchResult.StatusMessage;
            anyDTO.ResourceDTO = new ResourceDTO();
            if (fetchResult.StatusCode == ERROR_CODES.OK && fetchResult.Data && fetchResult.Data.length > 0) {
                for (let record of fetchResult.Data) {
                    let resourceModel: ResourceModel = {
                        ResourceKey: record.ResourceKey,
                        FieldType: record.FieldType,
                        ResourceValue: record.ResourceValue,
                        PlaceholderValue: record.PlaceholderValue,
                        InfoValue: record.InfoValue,
                        GroupID: record.GroupID,
                        IsRequired: record.IsRequired,
                        MinLength: record.MinLength,
                        MaxLength: record.MaxLength
                    }
                    anyDTO.ResourceDTO.Resources.push(resourceModel);
                }
            }
        }
        return anyDTO;
    }

    /**
     * @param anyDTO any kind of DTO
     * @returns list of resource keys
     */
    public GetResourceKeysAsync = async (anyDTO: any) => {
        if (anyDTO.GroupIDs && anyDTO.GroupIDs != "") {
            let fetchResult: any = await RunQuery(
                `SELECT ResourceKey, FieldType, IsRequired, MinLength, MaxLength
                FROM ResourceKeys
                WHERE GroupID IN(${anyDTO.GroupIDs}) AND IsActive = ${BOOLEAN_STATUS.STATUS_TRUE}`
            );
            anyDTO.StatusCode = fetchResult.StatusCode;
            anyDTO.StatusMessage = fetchResult.StatusMessage;
            anyDTO.ResourceDTO = new ResourceDTO();
            if (fetchResult.StatusCode == ERROR_CODES.OK && fetchResult.Data && fetchResult.Data.length > 0) {
                for (let record of fetchResult.Data) {
                    let resourceKey: ResourceKeyModel = {
                        ResourceKey: record.ResourceKey,
                        FieldType: record.FieldType,
                        IsRequired: record.IsRequired,
                        MinLength: record.MinLength,
                        MaxLength: record.MaxLength
                    }
                    anyDTO.ResourceDTO.ResourceKeys.push(resourceKey);
                }
            }
        }
        return anyDTO;
    }

    /**
     * Log every error into the db
     * @param errorMessage
     * @param errorStack 
     * @param errorLocation 
     * @param userID
     */
    public LogErrorAsync = async (errorMessage: string, errorStack: string, errorLocation: string, userID: string) => {
        await RunQuery(
            `INSERT INTO RequestLogs (ErrorMessage, ErrorStack, ErrorLocation, UserID, AddedOn)
            VALUES ('${errorMessage.replace(/'/g, "")}', '${errorStack.replace(/'/g, "")}', '${errorLocation.replace(/'/g, "")}', ${userID}, UTC_TIMESTAMP())`
        );
    }

    /**
     * get setting value by key
     * @param baseDTO Base DTO
     * @returns setting list
     */
    public GetSettingValueAsync = async (baseDTO: BaseDTO) => {
        if (baseDTO.Keys && baseDTO.Keys != "") {
            let fetchSettings: any = await RunQuery(
                `SELECT SettingKey, SettingValue
                FROM Settings
                WHERE SettingKey IN(${baseDTO.Keys}) AND IsActive = ${BOOLEAN_STATUS.STATUS_TRUE}`
            );
            baseDTO.StatusCode = fetchSettings.StatusCode;
            baseDTO.StatusMessage = fetchSettings.StatusMessage;
            baseDTO.Data = {};
            if (fetchSettings.StatusCode == ERROR_CODES.OK && fetchSettings.Data && fetchSettings.Data.length > 0) {
                for (let row of fetchSettings.Data) {
                    baseDTO.Data[row.SettingKey] = row.SettingValue;
                }
            }
        }
        return baseDTO;
    }
}