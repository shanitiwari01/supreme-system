import { ERROR_CODES, SYNC_STATUS } from "utility";
import { ExecuteQuery } from "./Config/Sql";
import { ErrorLogDTO, ErrorLogModel } from "datamodels";
import CommonMDL from "./CommonMDL";

export default class ErrorLogMDL extends CommonMDL {

    /**
     * get unsynced Error logs
     * @param logDTO
     * @returns error logs 
     */
    public GetUnsyncedErrorLogsAsync = async (logDTO: ErrorLogDTO) => {
        let fetchErrorLogs: any = await ExecuteQuery(
            `SELECT ID, ErrorCode, ErrorMessage, ErrorStack, ErrorLocation, AddedOn
            FROM RequestLogs
            WHERE IsSync = ${SYNC_STATUS.NOT_SYNCED}`
        );
        logDTO.StatusCode = fetchErrorLogs.StatusCode;
        logDTO.StatusMessage = fetchErrorLogs.StatusMessage;
        if (fetchErrorLogs.StatusCode == ERROR_CODES.OK && fetchErrorLogs.Data && fetchErrorLogs.Data.length > 0) {
            for (let record of fetchErrorLogs.Data) {
                let errorLogModel: ErrorLogModel = {
                    ID: record.ID,
                    ErrorCode: record.ErrorCode,
                    ErrorMessage: record.ErrorMessage,
                    ErrorStack: record.ErrorStack,
                    ErrorLocation: record.ErrorLocation,
                    AddedOn: record.AddedOn
                }
                logDTO.ErrorLogs.push(errorLogModel);
            }
        }
        return logDTO;
    }

    /**
    * update Error logs synced status
    * @param logDTO ErrorLog DTO
    * @returns status of the operation
    */
    public UpdateSyncedErrorLogsAsync = async (logDTO: ErrorLogDTO) => {
        if (logDTO.ErrorLogs && logDTO.ErrorLogs.length > 0) {
            let updateErrorLogsResult: any = await ExecuteQuery(
                `UPDATE RequestLogs 
                SET IsSync = ${SYNC_STATUS.SYNCED}
                WHERE ID IN(${(logDTO.ErrorLogs.map((e) => { return e.ID })).join(",")})`
            );
            logDTO.StatusCode = updateErrorLogsResult.StatusCode;
            logDTO.StatusMessage = updateErrorLogsResult.StatusMessage;
        }
        return logDTO;
    }
}