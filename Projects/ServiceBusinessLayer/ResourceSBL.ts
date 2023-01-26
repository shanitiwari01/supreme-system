import { ERROR_CODES, HEADER_NULL } from "utility";
import { BaseDTO } from "datamodels";
import { ResourceSDL } from "servicedatalayer";
import CommonSBL from "./CommonSBL";
import express from "express";

export default class ResourceSBL extends CommonSBL {

    /**
     * get all resources for the given language
     * @param req express request
     * @param res express response
     * @return resource list
     */
    public GetResourcesAsync = async (req: express.Request, res: express.Response) => {
        let baseDTO = new BaseDTO();
        try {
            baseDTO.LastSyncedAt = req.headers.lastsyncedat && req.headers.lastsyncedat != HEADER_NULL ? req.headers.lastsyncedat.toString() : "";
            baseDTO.LanguageID = req.headers.languageid ? parseInt(req.headers.languageid.toString()) : 0;
            if (baseDTO.LanguageID > 0) {
                baseDTO = await new ResourceSDL().GetResourcesAsync(baseDTO);
                if (baseDTO.StatusCode != ERROR_CODES.OK) {
                    throw new Error(this.CreateErrorMessage(baseDTO));
                }
            } else {
                baseDTO.StatusCode = ERROR_CODES.INVALID_DATA;
            }
        } catch (error) {
            baseDTO.StatusCode = ERROR_CODES.DATA_RETRIEVAL_ERROR;
            baseDTO.StatusMessage = "";
            await this.LogCatchErrorAsync(error as Error);
        } finally {
            res.status(ERROR_CODES.OK).send(baseDTO);
        }
    }
}