import { ERROR_CODES, SYNC_CONSTANTS } from "utility";
import CommonMBL from "./CommonMBL";
import SettingMBL from "./SettingMBL";
import LanguageMBL from "./LanguageMBL";
import ResourceMBL from "./ResourceMBL";
import StudentMBL from "./StudentMBL";
import ErrorLogMBL from "./ErrorLogMBL";
import { BaseDTO } from "datamodels";

type ValueOf<T> = T[keyof T];
export default class SyncDataMBL extends CommonMBL {

    /**
     * sync data
     * @param syncType
     * @returns operation status 
     */
    public SyncDataAsync = async (syncType: ValueOf<typeof SYNC_CONSTANTS>) => {
        let baseDTO = new BaseDTO();
        let methods: any;
        baseDTO.StatusCode = ERROR_CODES.OK;
        if (syncType == SYNC_CONSTANTS.ALL_DATA) {
            methods = [
                this.SyncMasterDataFromServerAsync(),
                await this.SyncToServer(),
                this.SyncTransactionalDataFromServerAsync()
            ];
        } else if (syncType == SYNC_CONSTANTS.MASTER_DATA) {
            methods = [
                this.SyncMasterDataFromServerAsync()
            ];
        } else if (syncType == SYNC_CONSTANTS.TRANSACTIONAL_DATA) {
            methods = [
                this.SyncTransactionalDataFromServerAsync()
            ];
        }
        if (methods && methods.length > 0) {
            let statuses: BaseDTO[] = await Promise.all(methods);
            for (let status of statuses) {
                if (status.StatusCode != ERROR_CODES.OK) {
                    baseDTO.StatusCode = ERROR_CODES.DATA_SYNC_ERROR;
                    break;
                }
            }
            if (baseDTO.StatusCode == ERROR_CODES.OK) {
                baseDTO.Data = statuses;
            }
        } else {
            baseDTO.StatusCode = ERROR_CODES.DATA_SYNC_ERROR;
        }
        return baseDTO;
    }

    /**
     * Sync master data from server 
     * @returns operation status
     */
    private SyncMasterDataFromServerAsync = async () => {
        let baseDTO = new BaseDTO();
        baseDTO.StatusCode = ERROR_CODES.OK;
        let methods: any = [
            new SettingMBL().SyncSettingsFromServerAsync(),
            await new LanguageMBL().SyncLanguagesFromServerAsync()
        ];
        if (await this.GetLanguageIDAsync() > 0) {
            methods.push(new ResourceMBL().SyncResourcesFromServerAsync());
        }
        let statuses: any = await Promise.all(methods);
        for (let status of statuses) {
            if (status.StatusCode != ERROR_CODES.OK) {
                baseDTO.StatusCode = ERROR_CODES.DATA_SYNC_ERROR;
                break;
            }
        }
        if (baseDTO.StatusCode == ERROR_CODES.OK) {
            baseDTO.Data = statuses;
        }
        return baseDTO;
    }

    /**
     * sync all data to server
     * @returns operation status
     */
    private SyncToServer = async () => {
        let baseDTO = new BaseDTO();
        baseDTO.StatusCode = ERROR_CODES.OK;
        let statuses: any = await Promise.all([
            new StudentMBL().SyncStudentsToServerAsync(),
            new ErrorLogMBL().SyncErrorLogsToServerAsync()
        ]);
        for (let status of statuses) {
            if (status.StatusCode != ERROR_CODES.OK) {
                baseDTO.StatusCode = ERROR_CODES.DATA_SYNC_ERROR;
                break;
            }
        }
        return baseDTO;
    }

    /**
     *  Sync transactional data from server 
     * @returns operation status
     */
    private SyncTransactionalDataFromServerAsync = async () => {
        let baseDTO = new BaseDTO();
        baseDTO.StatusCode = ERROR_CODES.OK;
        let statuses: any = await Promise.all([
            new StudentMBL().SyncStudentsFromServerAsync(),
        ]);
        for (let status of statuses) {
            if (status.StatusCode != ERROR_CODES.OK) {
                baseDTO.StatusCode = ERROR_CODES.DATA_SYNC_ERROR;
                break;
            }
        }
        if (baseDTO.StatusCode == ERROR_CODES.OK) {
            baseDTO.Data = statuses;
        }
        return baseDTO;
    }
}