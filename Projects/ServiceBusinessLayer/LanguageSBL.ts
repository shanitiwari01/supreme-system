import { ERROR_CODES, HEADER_NULL } from "utility";
import { LanguageDTO } from "datamodels";
import { LanguageSDL } from "servicedatalayer";
import CommonSBL from "./CommonSBL";
import express from "express";

export default class LanguageSBL extends CommonSBL {

    /**
     * get all language list
     * @param req express request
     * @param res express response
     * @return language list
     */
    public GetLanguagesAsync = async (req: express.Request, res: express.Response) => {
        let languageDTO = new LanguageDTO();
        try {
            languageDTO.LastSyncedAt = req.headers.lastsyncedat && req.headers.lastsyncedat != HEADER_NULL ? req.headers.lastsyncedat.toString() : "";
            languageDTO = await new LanguageSDL().GetLanguagesAsync(languageDTO);
            if (languageDTO.StatusCode != ERROR_CODES.OK) {
                throw new Error(this.CreateErrorMessage(languageDTO));
            }
        } catch (error) {
            languageDTO.StatusCode = ERROR_CODES.DATA_RETRIEVAL_ERROR;
            await this.LogCatchErrorAsync(error as Error);
        } finally {
            languageDTO = this.ResetApiData(languageDTO);
            res.status(ERROR_CODES.OK).send(languageDTO);
        }
    }
}