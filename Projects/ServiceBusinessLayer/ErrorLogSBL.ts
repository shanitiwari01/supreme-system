import { ERROR_CODES } from "utility";
import { ErrorLogDTO, ContextDTO } from "datamodels";
import { ErrorLogSDL } from "servicedatalayer";
import CommonSBL from "./CommonSBL";
import express from "express";

export default class ErrorLogSBL extends CommonSBL {

    /**
     * Sync error logs list 
     * @param req express request
     * @param res express response
     * @returns opration status
     */
    public SaveErrorLogsAsync = async (req: express.Request, res: express.Response) => {
        let contextDTO: ContextDTO = res.locals.context;
        let errorLogDTO = new ErrorLogDTO();
        try {
            if (contextDTO.LoggedInUserID) {
                if (req.body.errorLogs) {
                    errorLogDTO = req.body.errorLogs;
                }
                errorLogDTO.LoggedInUserID = contextDTO.LoggedInUserID;
                if (errorLogDTO.ErrorLogs && errorLogDTO.ErrorLogs.length > 0) {
                    errorLogDTO = await new ErrorLogSDL().SaveErrorLogsAsync(errorLogDTO);
                    if (errorLogDTO.StatusCode != ERROR_CODES.OK) {
                        throw new Error(this.CreateErrorMessage(errorLogDTO));
                    }
                } else {
                    errorLogDTO.StatusCode = ERROR_CODES.INVALID_DATA;
                }
            } else {
                errorLogDTO.StatusCode = ERROR_CODES.UNAUTHORIZED_OPERATION;
            }
        } catch (error) {
            errorLogDTO.StatusCode = ERROR_CODES.DATA_SAVE_ERROR;
            await this.LogCatchErrorAsync(error as Error, contextDTO.LoggedInUserID);
        } finally {
            errorLogDTO = this.ResetApiData(errorLogDTO);
            res.status(ERROR_CODES.OK).send(errorLogDTO);
        }
    }
}