import { ExecuteQuery } from "./Config/Sql";
import { ERROR_CODES, SYNC_STATUS, RESOURCE_GROUPS, BOOLEAN_STATUS, ConvertToQuote } from "utility";
import { BaseDTO, ResourceDTO, ResourceModel } from "datamodels";

export default class CommonMDL {

    /**
     * Get last synced date time by api url
     * @param serviceName 
     * @returns LastSyncedAt datetime
     */
    public GetLastSyncedDateTimeAsync = async (serviceName: string) => {
        let baseDTO = new BaseDTO();
        let serviceSync: any = await ExecuteQuery(
            `SELECT strftime('%Y-%m-%d %H:%M', LastSyncedAt) AS SyncedTime
            FROM ServicesSyncedAt 
            WHERE ServiceEndPoint = '${serviceName}'`
        );
        baseDTO.StatusCode = serviceSync.StatusCode;
        baseDTO.StatusMessage = serviceSync.StatusMessage;
        if (serviceSync.StatusCode == ERROR_CODES.OK) {
            baseDTO.LastSyncedAt = null;
            if (serviceSync.Data && serviceSync.Data.length > 0) {
                baseDTO.LastSyncedAt = serviceSync.Data[0].SyncedTime;
            }
        }
        return baseDTO;
    }

    /**
     * update last synced date time
     * @param serviceName 
     * @param anyDTO 
     * @returns operation status
     */
    public UpdateLastSyncedDateTimeAsync = async (anyDTO: any) => {
        let serviceSync: any = await ExecuteQuery(
            `UPDATE ServicesSyncedAt 
            SET LastSyncedAt = datetime('now')
            WHERE ServiceEndPoint = '${anyDTO.ServiceName}'`
        );
        anyDTO.StatusCode = serviceSync.StatusCode;
        anyDTO.StatusMessage = serviceSync.StatusMessage;
        return anyDTO;
    }

    /**
     * get setting value by key
     * @param baseDTO Base DTO
     * @returns setting list
     */
    public GetSettingValueAsync = async (baseDTO: BaseDTO) => {
        if (baseDTO.Keys && baseDTO.Keys != "") {
            let fetchSettings: any = await ExecuteQuery(
                `SELECT SettingKey, SettingValue
                FROM Settings
                WHERE SettingKey IN(${baseDTO.Keys}) AND IsActive = ${BOOLEAN_STATUS.STATUS_TRUE}`
            );
            baseDTO.StatusCode = fetchSettings.StatusCode;
            baseDTO.StatusMessage = fetchSettings.StatusMessage;
            baseDTO.Data = {};
            if (fetchSettings.StatusCode == ERROR_CODES.OK && fetchSettings.Data && fetchSettings.Data.length > 0) {
                for (let row of fetchSettings.Data) {
                    baseDTO.Data[row.SettingKey] = ConvertToQuote(row.SettingValue);
                }
            }
        }
        return baseDTO;
    }

    /**
     * Log every error into the db
     * @param errorMessage
     * @param errorStack 
     * @param errorLocation
     */
    public LogErrorAsync = async (errorMessage: string, errorStack: string, errorLocation: string) => {
        await ExecuteQuery(
            `INSERT INTO RequestLogs (ErrorMessage, ErrorStack, ErrorLocation, AddedOn, IsSync)
            VALUES ('${errorMessage.replace(/'/g, "")}', '${errorStack.replace(/'/g, "")}', '${errorLocation}', datetime('now'), ${SYNC_STATUS.NOT_SYNCED})`
        );
    }

    /**
     * get page resources based on language id
     * @param anyDTO any kind of DTO
     * @returns list of resources
     */
    public GetPageResourcesAsync = async (anyDTO: any) => {
        if (anyDTO.GroupIDs && anyDTO.GroupIDs != "" && anyDTO.LanguageID && anyDTO.LanguageID > 0) {
            anyDTO.GroupIDs = anyDTO.GroupIDs + "," + RESOURCE_GROUPS.COMMON + "," + RESOURCE_GROUPS.ERRORS;
            let fetchResult: any = await ExecuteQuery(
                `SELECT ResourceKeyID, ResourceKey, GroupID, IsRequired, MinLength, MaxLength, FieldType, ResourceValue, PlaceholderValue, InfoValue
                FROM MobileResources
                WHERE GroupID IN(${anyDTO.GroupIDs}) AND LanguageID = ${anyDTO.LanguageID} AND IsActive = ${BOOLEAN_STATUS.STATUS_TRUE}`
            );
            anyDTO.StatusCode = fetchResult.StatusCode;
            anyDTO.StatusMessage = fetchResult.StatusMessage;
            anyDTO.ResourceDTO = new ResourceDTO();
            if (fetchResult.StatusCode == ERROR_CODES.OK && fetchResult.Data && fetchResult.Data.length > 0) {
                for (let record of fetchResult.Data) {
                    let resourceModel: ResourceModel = {
                        ResourceKeyID: record.ResourceKeyID,
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
}