import { ERROR_CODES } from "utility";
import { RunQuery } from "./Config/Sql";
import { SettingDTO, SettingModel } from "datamodels";
import CommonSDL from "./CommonSDL";

export default class SettingSDL extends CommonSDL {

    /**
     * get all settings list
     * @param SettingDTO Setting DTO
     * @returns Setting list
     */
    public GetSettingsAsync = async (settingDTO: SettingDTO) => {
        let whereCondition = settingDTO.LastSyncedAt ? `WHERE ModifiedOn > '${settingDTO.LastSyncedAt}'` : ``;
        let fetchSettings = await RunQuery(
            `SELECT SettingID, SettingKey, GroupID, SettingValue, SettingDescription, IsActive
            FROM Settings 
            ${whereCondition}`
        );
        settingDTO.StatusCode = fetchSettings.StatusCode;
        settingDTO.StatusMessage = fetchSettings.StatusMessage;
        if (fetchSettings.StatusCode == ERROR_CODES.OK && fetchSettings.Data && fetchSettings.Data.length > 0) {
            for (let record of fetchSettings.Data) {
                let settingModel: SettingModel = {
                    SettingID: record.SettingID,
                    SettingKey: record.SettingKey,
                    GroupID: record.GroupID,
                    SettingValue: record.SettingValue,
                    SettingDescription: record.SettingDescription,
                    IsActive: record.IsActive
                }
                settingDTO.Settings.push(settingModel); 
            }
        }
        return settingDTO;
    }
}