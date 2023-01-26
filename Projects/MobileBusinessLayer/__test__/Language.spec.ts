import { LanguageMDL } from "mobiledatalayer";
import LanguageMBL from "../LanguageMBL";
import { ERROR_CODES, GLOBAL_API, LANGUAGE_ROUTES, MOBILE_CONFIG } from "utility";
import Axios from "axios";
import { LanguageDTO, BaseDTO } from "datamodels";
import EncryptedStorage from 'react-native-encrypted-storage';

jest.mock("react-native", () => ({
    show: () => null,
}));

jest.mock("@react-native-community/netinfo", () => ({
    fetch: () => true,
}))

jest.mock("react-native-encrypted-storage");

describe("Language test cases", () => {
    beforeAll(async () => {
        await EncryptedStorage.setItem(MOBILE_CONFIG.LANGUAGE_ID, "1");
    });
    it("Get languages from server", async () => {
        let languageMDL = new LanguageMDL();
        let syncedDetail: BaseDTO = await languageMDL.GetLastSyncedDateTimeAsync(LANGUAGE_ROUTES.GET_LANGUAGES);
        expect(syncedDetail.StatusCode).toEqual(ERROR_CODES.OK);
        if (syncedDetail.StatusCode == ERROR_CODES.OK) {
            let lastsyncedat = syncedDetail.LastSyncedAt ? syncedDetail.LastSyncedAt : "null";
            await Axios.request({
                method: "GET",
                url: `${GLOBAL_API}${LANGUAGE_ROUTES.GET_LANGUAGES}`,
                headers: {lastsyncedat: lastsyncedat},
                data: {},
            }).then(async (res: any) => {
                if (res.data && res.data.Languages.length > 0) {
                    let languageDTO = new LanguageDTO();
                    languageDTO.Languages = res.data.Languages;
                    languageDTO = await languageMDL.SaveLanguagesAsync(languageDTO);
                    expect(languageDTO.StatusCode).toEqual(ERROR_CODES.OK);
                    expect(languageDTO.Languages.length).toEqual(3);
                } else {
                    expect(res.status).toEqual(ERROR_CODES.OK);
                }
            }).catch((err: any) => {
                console.log("GET_LANGUAGES ERROR", err);
            });
        }
    });
    it("Get active languages", async () => {
        let languageDTO: LanguageDTO = await new LanguageMBL().GetLanguagesAsync();
        expect(languageDTO.StatusCode).toEqual(ERROR_CODES.OK);
        expect(languageDTO.Languages.length).toEqual(2);
    });
});