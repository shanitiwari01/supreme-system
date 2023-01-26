import { ERROR_CODES, LANGUAGE_ROUTES, API_METHODS, SYNC_CONSTANTS } from "utility";
import { BaseDTO, LanguageDTO, ServiceApiDTO } from "datamodels";
import { LanguageMDL } from "mobiledatalayer";
import CommonMBL from "./CommonMBL";

export default class LanguageMBL extends CommonMBL {

    /**
     * get all languages
     * @returns language list
     */
    public GetLanguagesAsync = async () => {
        let languageDTO = new LanguageDTO();
        try {
            languageDTO = await new LanguageMDL().GetLanguagesAsync(languageDTO);
            if (languageDTO.StatusCode != ERROR_CODES.OK) {
                throw new Error(this.CreateErrorMessage(languageDTO));
            }
        } catch (error) {
            languageDTO.StatusCode = ERROR_CODES.DATA_RETRIEVAL_ERROR;
            await this.LogCatchErrorAsync(error as Error);
        } finally {
            languageDTO = this.ResetApiData(languageDTO);
        }
        return languageDTO;
    }

    /**
     * get languages from the server based on the last modified time and save them to local DB
     * @returns operation status
     */
    public SyncLanguagesFromServerAsync = async () => {
        let languageDTO = new LanguageDTO();
        try {
            let languageMDL = new LanguageMDL();
            let syncedDetail: BaseDTO = await languageMDL.GetLastSyncedDateTimeAsync(LANGUAGE_ROUTES.GET_LANGUAGES);
            if (syncedDetail.StatusCode == ERROR_CODES.OK) {
                let serviceApiDTO = new ServiceApiDTO();
                serviceApiDTO.Service = {
                    Method: API_METHODS.GET,
                    Api: LANGUAGE_ROUTES.GET_LANGUAGES,
                    Header: { lastsyncedat: syncedDetail.LastSyncedAt }
                }
                serviceApiDTO = await this.CallServiceApiAsync(serviceApiDTO);
                languageDTO.StatusCode = serviceApiDTO.StatusCode;
                if (serviceApiDTO.StatusCode == ERROR_CODES.OK && serviceApiDTO.Data.Languages && serviceApiDTO.Data.Languages.length > 0) {
                    languageDTO.Languages = serviceApiDTO.Data.Languages;
                    languageDTO = await languageMDL.SaveLanguagesAsync(languageDTO);
                    if (languageDTO.StatusCode == ERROR_CODES.OK) {
                        languageDTO.NoOfRecords = languageDTO.Languages.length;
                        languageDTO.DataSyncedFor = SYNC_CONSTANTS.LANGUAGES;
                    }
                }
            } else {
                languageDTO.StatusCode = syncedDetail.StatusCode;
                languageDTO.StatusMessage = syncedDetail.StatusMessage;
            }
            if (languageDTO.StatusCode != ERROR_CODES.OK && languageDTO.StatusMessage) {
                throw new Error(this.CreateErrorMessage(languageDTO));
            }
        } catch (error) {
            languageDTO.StatusCode = ERROR_CODES.DATA_SYNC_ERROR;
            await this.LogCatchErrorAsync(error as Error);
        } finally {
            languageDTO = this.ResetApiData(languageDTO);
        }
        return languageDTO;
    }
}