import { ERROR_CODES } from "utility";
import { RunQuery } from "./Config/Sql";
import { ErrorLogDTO } from "datamodels";
import CommonSDL from "./CommonSDL";

export default class ErrorLogSDL extends CommonSDL {

    /**
     * insert Error logs
     * @param {*} errorLogDTO ErrorLog DTO
     * @returns status of the operation
     */
    public SaveErrorLogsAsync = async (errorLogDTO: ErrorLogDTO) => {
        if (errorLogDTO.ErrorLogs && errorLogDTO.ErrorLogs.length > 0) {
            for(let log of errorLogDTO.ErrorLogs){
                let errorLogQuery = await RunQuery(
                    `INSERT INTO RequestLogs (ErrorCode, ErrorMessage, ErrorStack, ErrorLocation, UserID, AddedOn)
                    VALUES ('${log.ErrorCode}', '${log.ErrorMessage}', '${log.ErrorStack}', '${log.ErrorLocation}', ${errorLogDTO.LoggedInUserID}, '${log.AddedOn}')`
                );
                errorLogDTO.StatusCode = errorLogQuery.StatusCode;
                errorLogDTO.StatusMessage = errorLogQuery.StatusMessage;
                if(errorLogDTO.StatusCode != ERROR_CODES.OK){
                    break;
                }
            }
        }
        return errorLogDTO;
    }
}