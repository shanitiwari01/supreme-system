import { ERROR_CODES, HEADER_NULL } from "utility";
import { SettingDTO } from "datamodels";
import { SettingSDL } from "servicedatalayer";
import CommonSBL from "./CommonSBL";
import express from "express";

export default class SettingSBL extends CommonSBL {

    /**
     * get all Setting list
     * @param req express request
     * @param res express response
     * @return Setting list
     */
    public GetSettingsAsync = async (req: express.Request, res: express.Response) => {
        let settingDTO = new SettingDTO();
        try {
            settingDTO.LastSyncedAt = req.headers.lastsyncedat && req.headers.lastsyncedat != HEADER_NULL ? req.headers.lastsyncedat.toString() : "";
            settingDTO = await new SettingSDL().GetSettingsAsync(settingDTO);
            if (settingDTO.StatusCode != ERROR_CODES.OK) {
                throw new Error(this.CreateErrorMessage(settingDTO));
            }
        } catch (error) {
            settingDTO.StatusCode = ERROR_CODES.DATA_RETRIEVAL_ERROR;
            await this.LogCatchErrorAsync(error as Error);
        } finally {
            settingDTO = this.ResetApiData(settingDTO);
            res.status(ERROR_CODES.OK).send(settingDTO);
        }
    }
}