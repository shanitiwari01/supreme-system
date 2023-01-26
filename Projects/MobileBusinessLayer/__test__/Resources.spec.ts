import { ResourceMDL } from "mobiledatalayer";
import { ERROR_CODES, GLOBAL_API, RESOURCE_ROUTES, RESOURCE_GROUPS, MOBILE_CONFIG } from "utility";
import CommonMBL from "./../CommonMBL";
import Axios from "axios";
import { BaseDTO } from "datamodels";
import EncryptedStorage from 'react-native-encrypted-storage';

jest.mock("react-native", () => ({
    show: () => null,
}));

jest.mock("@react-native-community/netinfo", () => ({
    fetch: () => true,
}));

jest.mock("react-native-encrypted-storage");

describe("Resources test cases", () => {
    beforeAll(async () => {
        await EncryptedStorage.setItem(MOBILE_CONFIG.LANGUAGE_ID, "1");
    });
    it("Get resources from server", async () => {
        let resourceMDL = new ResourceMDL();
        let syncedDetail: BaseDTO = await resourceMDL.GetLastSyncedDateTimeAsync(RESOURCE_ROUTES.GET_RESOURCES);
        expect(syncedDetail.StatusCode).toEqual(ERROR_CODES.OK);
        if (syncedDetail.StatusCode == ERROR_CODES.OK) {
            let lastsyncedat = syncedDetail.LastSyncedAt ? syncedDetail.LastSyncedAt : "null";
            await Axios.request({
                method: "GET",
                url: `${GLOBAL_API}${RESOURCE_ROUTES.GET_RESOURCES}`,
                headers: { lastsyncedat: lastsyncedat, languageid: "1"},
                data: {},
            }).then(async (res: any) => {
                if(res.data && res.data.ResourceDTO && res.data.ResourceDTO.Resources.length > 0) {
                    let baseDTO = new BaseDTO();
                    baseDTO.ResourceDTO = res.data.ResourceDTO;
                    baseDTO = await resourceMDL.SaveResourcesAsync(baseDTO);
                    expect(baseDTO.StatusCode).toEqual(ERROR_CODES.OK);
                    expect(baseDTO.ResourceDTO?.Resources.length).toBeGreaterThan(0);
                } else {
                    expect(res.status).toEqual(ERROR_CODES.OK);
                }
            }).catch((err: any) => {
                console.log("error : ", err);
            });
        }
    });
    it("get students resoures data", async () => {
        let anyDTO = { 
            GroupIDs: `${RESOURCE_GROUPS.STUDENTS}`,
        }
        let baseDTO: BaseDTO = await new CommonMBL().GetPageResourcesAsync(anyDTO);
        expect(baseDTO.StatusCode).toEqual(ERROR_CODES.OK);
        expect(baseDTO.ResourceDTO?.Resources.length).toBeGreaterThan(0);
    });
});