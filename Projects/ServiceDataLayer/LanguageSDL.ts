import { ERROR_CODES } from "utility";
import { RunQuery } from "./Config/Sql";
import { LanguageDTO, LanguageModel } from "datamodels";
import CommonSDL from "./CommonSDL";

export default class LanguageSDL extends CommonSDL {

    /**
     * get all language list
     * @param languageDTO Language DTO
     * @returns language list
     */
    public GetLanguagesAsync = async (languageDTO: LanguageDTO) => {
        let whereCondition = languageDTO.LastSyncedAt ? `WHERE ModifiedOn > '${languageDTO.LastSyncedAt}'` : ``;
        let fetchLanguages = await RunQuery(
            `SELECT LanguageID, LanguageName, LanguageCode, IsDefaultLanguage, IsActive
            FROM Languages 
            ${whereCondition}`
        );
        languageDTO.StatusCode = fetchLanguages.StatusCode;
        languageDTO.StatusMessage = fetchLanguages.StatusMessage;
        if (fetchLanguages.StatusCode == ERROR_CODES.OK && fetchLanguages.Data && fetchLanguages.Data.length > 0) {
            for (let record of fetchLanguages.Data) {
                let languageModel: LanguageModel = {
                    LanguageID: record.LanguageID,
                    LanguageName: record.LanguageName,
                    LanguageCode: record.LanguageCode,
                    IsDefaultLanguage: record.IsDefaultLanguage,
                    IsActive: record.IsActive
                }
                languageDTO.Languages.push(languageModel); 
            }
        }
        return languageDTO;
    }
}