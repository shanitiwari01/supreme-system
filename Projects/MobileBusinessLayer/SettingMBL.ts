import { ERROR_CODES, SETTING_ROUTES, API_METHODS } from "utility";
import { SettingDTO, ServiceApiDTO, BaseDTO } from "datamodels";
import { SettingMDL } from "mobiledatalayer";
import CommonMBL from "./CommonMBL";

export default class SettingMBL extends CommonMBL {

    /**
     * get all settings from the server based on the last modified time and save them to local DB
     * @returns operation status
     */
    public SyncSettingsFromServerAsync = async () => {
        let settingDTO = new SettingDTO();
        try {
            let settingMDL = new SettingMDL();
            let syncedDetail: BaseDTO = await settingMDL.GetLastSyncedDateTimeAsync(SETTING_ROUTES.GET_SETTINGS);
            if (syncedDetail.StatusCode == ERROR_CODES.OK) {
                let serviceApiDTO = new ServiceApiDTO();
                serviceApiDTO.Service = {
                    Method: API_METHODS.GET,
                    Api: SETTING_ROUTES.GET_SETTINGS,
                    Header: { lastsyncedat: syncedDetail.LastSyncedAt }
                }
                serviceApiDTO = await this.CallServiceApiAsync(serviceApiDTO);
                settingDTO.StatusCode = serviceApiDTO.StatusCode;
                if (serviceApiDTO.StatusCode == ERROR_CODES.OK && serviceApiDTO.Data.Settings && serviceApiDTO.Data.Settings.length > 0) {
                    settingDTO.Settings = serviceApiDTO.Data.Settings;
                    settingDTO = await settingMDL.SaveSettingsAsync(settingDTO);
                }
            } else {
                settingDTO.StatusCode = syncedDetail.StatusCode;
                settingDTO.StatusMessage = syncedDetail.StatusMessage;
            }
            if (settingDTO.StatusCode != ERROR_CODES.OK && settingDTO.StatusMessage) {
                throw new Error(this.CreateErrorMessage(settingDTO));
            }
        } catch (error) {
            settingDTO.StatusCode = ERROR_CODES.DATA_SYNC_ERROR;
            await this.LogCatchErrorAsync(error as Error);
        } finally {
            settingDTO = this.ResetApiData(settingDTO);
        }
        return settingDTO;
    }
}