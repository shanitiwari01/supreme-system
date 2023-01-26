import { ERROR_CODES, ERROR_LOG_ROUTES, API_METHODS, API_HEADER_TOKEN } from "utility";
import { ServiceApiDTO, ErrorLogDTO } from "datamodels";
import { ErrorLogMDL } from "mobiledatalayer";
import CommonMBL from "./CommonMBL";

export default class ErrorLogsMBL extends CommonMBL {

    /**
     * send all unsynced error logs and update isSynced flag after success
     * @returns operation status 
     */
    public SyncErrorLogsToServerAsync = async () => {
        let logDTO = new ErrorLogDTO();
        try {
            let errorLogMDL = new ErrorLogMDL();
            logDTO = await errorLogMDL.GetUnsyncedErrorLogsAsync(logDTO);
            if (logDTO.StatusCode == ERROR_CODES.OK) {
                if (logDTO.ErrorLogs && logDTO.ErrorLogs.length > 0) {
                    let serviceApiDTO = new ServiceApiDTO();
                    serviceApiDTO.Service = {
                        Method: API_METHODS.POST,
                        Api: ERROR_LOG_ROUTES.SAVE_ERROR_LOGS,
                        Header: await this.GetApiHeadersAsync(API_HEADER_TOKEN.ACCESS_TOKEN),
                        Body: { errorLogs: logDTO }
                    }
                    serviceApiDTO = await this.CallServiceApiAsync(serviceApiDTO);
                    logDTO.StatusCode = serviceApiDTO.StatusCode;
                    if (serviceApiDTO.StatusCode == ERROR_CODES.OK) {
                        logDTO = await errorLogMDL.UpdateSyncedErrorLogsAsync(logDTO);
                    }
                }
            }
            if (logDTO.StatusCode != ERROR_CODES.OK && logDTO.StatusMessage) {
                throw new Error(this.CreateErrorMessage(logDTO));
            }
        } catch (error) {
            logDTO.StatusCode = ERROR_CODES.DATA_SYNC_ERROR;
            await this.LogCatchErrorAsync(error as Error);
        } finally {
            logDTO = this.ResetApiData(logDTO);
        }
        return logDTO;
    }
}