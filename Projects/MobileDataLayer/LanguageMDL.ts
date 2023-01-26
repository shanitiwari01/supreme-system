import { ERROR_CODES, BOOLEAN_STATUS, LANGUAGE_ROUTES, REG_EXP_CONSTANTS } from "utility";
import { ExecuteQuery } from "./Config/Sql";
import { LanguageDTO, LanguageModel } from "datamodels";
import CommonMDL from "./CommonMDL";

export default class LanguageMDL extends CommonMDL {

    /**
     * add/update all languages
     * @param languageDTO language DTO
     * @returns status
     */
    public SaveLanguagesAsync = async (languageDTO: LanguageDTO) => {
        if (languageDTO.Languages && languageDTO.Languages.length > 0) {
            let storeQuery: string =
                `INSERT OR REPLACE INTO Languages 
                (LanguageID, LanguageName, LanguageCode, IsDefaultLanguage, IsActive)
                VALUES `;
            for (let language of languageDTO.Languages) {
                storeQuery += `(${language.LanguageID}, '${language.LanguageName}', '${language.LanguageCode}', ${language.IsDefaultLanguage}, ${language.IsActive}),`;
            }
            storeQuery = storeQuery.replace(REG_EXP_CONSTANTS.LAST_COMMA, ";");
            let storeResult: any = await ExecuteQuery(storeQuery);
            languageDTO.StatusCode = storeResult.StatusCode;
            languageDTO.StatusMessage = storeResult.StatusMessage;
            if (languageDTO.StatusCode == ERROR_CODES.OK) {
                languageDTO.ServiceName = LANGUAGE_ROUTES.GET_LANGUAGES;
                languageDTO = await this.UpdateLastSyncedDateTimeAsync(languageDTO);
            }
        }
        return languageDTO;
    }

    /**
     * get all languages
     * @param languageDTO Language DTO
     * @returns language list
     */
    public GetLanguagesAsync = async (languageDTO: LanguageDTO) => {
        let fetchLanguages: any = await ExecuteQuery(
            `SELECT LanguageID, LanguageName, LanguageCode, IsDefaultLanguage 
            FROM Languages
            WHERE IsActive = ${BOOLEAN_STATUS.STATUS_TRUE}
            ORDER BY LanguageName ASC`
        );
        languageDTO.StatusCode = fetchLanguages.StatusCode;
        languageDTO.StatusMessage = fetchLanguages.StatusMessage;
        if (fetchLanguages.StatusCode == ERROR_CODES.OK && fetchLanguages.Data && fetchLanguages.Data.length > 0) {
            for (let record of fetchLanguages.Data) {
                let languageModel: LanguageModel = {
                    LanguageID: record.LanguageID,
                    LanguageName: record.LanguageName,
                    LanguageCode: record.LanguageCode,
                    IsDefaultLanguage: record.IsDefaultLanguage
                }
                languageDTO.Languages.push(languageModel);
            }
        }
        return languageDTO;
    }
}