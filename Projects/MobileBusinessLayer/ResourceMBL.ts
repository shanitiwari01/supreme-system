import { ERROR_CODES, RESOURCE_ROUTES, API_METHODS } from "utility";
import { BaseDTO, ServiceApiDTO } from "datamodels";
import { ResourceMDL } from "mobiledatalayer";
import CommonMBL from "./CommonMBL";

export default class ResourceMBL extends CommonMBL {

    /**
     * get all resources from the server based on the last modified time and save them to local DB
     * @param newLanguage
     * @returns operation status
     */
    public SyncResourcesFromServerAsync = async (newLanguage: boolean = false) => {
        let baseDTO = new BaseDTO();
        try {
            let resourceMDL = new ResourceMDL();
            if (newLanguage) {
                baseDTO.LastSyncedAt = null;
            } else {
                baseDTO = await resourceMDL.GetLastSyncedDateTimeAsync(RESOURCE_ROUTES.GET_RESOURCES);
                if (baseDTO.StatusCode != ERROR_CODES.OK) {
                    throw new Error(this.CreateErrorMessage(baseDTO));
                }
            }
            let serviceApiDTO = new ServiceApiDTO();
            serviceApiDTO.Service = {
                Method: API_METHODS.GET,
                Api: RESOURCE_ROUTES.GET_RESOURCES,
                Header: { lastsyncedat: baseDTO.LastSyncedAt, languageid: await this.GetLanguageIDAsync() }
            }
            serviceApiDTO = await this.CallServiceApiAsync(serviceApiDTO);
            baseDTO.StatusCode = serviceApiDTO.StatusCode;
            if (serviceApiDTO.StatusCode == ERROR_CODES.OK && serviceApiDTO.Data.ResourceDTO && serviceApiDTO.Data.ResourceDTO.Resources && serviceApiDTO.Data.ResourceDTO.Resources.length > 0) {
                baseDTO.ResourceDTO = serviceApiDTO.Data.ResourceDTO;
                baseDTO = await resourceMDL.SaveResourcesAsync(baseDTO);
                if (baseDTO.StatusCode != ERROR_CODES.OK) {
                    throw new Error(this.CreateErrorMessage(baseDTO));
                }
            }
        } catch (error) {
            baseDTO.StatusCode = ERROR_CODES.DATA_SYNC_ERROR;
            baseDTO.StatusMessage = "";
            await this.LogCatchErrorAsync(error as Error);
        }
        return baseDTO;
    }
}