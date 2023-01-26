import { ERROR_CODES, SETTING_ROUTES, REG_EXP_CONSTANTS, ConvertToUnicode } from "utility";
import { ExecuteQuery } from "./Config/Sql";
import { SettingDTO } from "datamodels";
import CommonMDL from "./CommonMDL";

export default class SettingMDL extends CommonMDL {

    /**
     * add/update all Setting
     * @param settingDTO Setting DTO
     * @returns status
     */
    public SaveSettingsAsync = async (settingDTO: SettingDTO) => {
        let settingQuery: string =
            `INSERT OR REPLACE INTO Settings 
            (SettingID, SettingKey, GroupID, SettingValue, SettingDescription, IsActive)
            VALUES `;
        for (let setting of settingDTO.Settings) {
            settingQuery += `(${setting.SettingID}, '${setting.SettingKey}', ${setting.GroupID}, '${setting.SettingValue ? ConvertToUnicode(setting.SettingValue) : null}', '${setting.SettingDescription}', ${setting.IsActive}),`;
        }
        settingQuery = settingQuery.replace(REG_EXP_CONSTANTS.LAST_COMMA, ";");
        let settingResult: any = await ExecuteQuery(settingQuery);
        settingDTO.StatusCode = settingResult.StatusCode;
        settingDTO.StatusMessage = settingResult.StatusMessage;
        if (settingResult.StatusCode == ERROR_CODES.OK) {
            settingDTO.ServiceName = SETTING_ROUTES.GET_SETTINGS;
            settingDTO = await this.UpdateLastSyncedDateTimeAsync(settingDTO);
        }
        return settingDTO;
    }
}