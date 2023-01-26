import { ERROR_CODES, RESOURCE_ROUTES } from "utility";
import { ExecuteQuery } from "./Config/Sql";
import { BaseDTO } from "datamodels";
import CommonMDL from "./CommonMDL";

export default class ResourceMDL extends CommonMDL {

    /**
     * add/update all resources
     * @param baseDTO base DTO
     * @returns operation status
     */
    public SaveResourcesAsync = async (baseDTO: BaseDTO) => {
        if (baseDTO.ResourceDTO && baseDTO.ResourceDTO.Resources && baseDTO.ResourceDTO.Resources.length > 0) {
            let insertResource: any;
            for (let resource of baseDTO.ResourceDTO.Resources) {
                insertResource = await ExecuteQuery(
                    `INSERT OR REPLACE INTO MobileResources 
                    (ResourceID, GroupID, ResourceKeyID, LanguageID, ResourceKey, ResourceValue, PlaceholderValue, InfoValue, FieldType, IsRequired, MinLength, MaxLength, IsActive)
                    VALUES (${resource.ResourceID}, ${resource.GroupID}, ${resource.ResourceKeyID}, ${resource.LanguageID}, '${resource.ResourceKey}', '${resource.ResourceValue}', '${resource.PlaceholderValue}', '${resource.InfoValue}', '${resource.FieldType}', ${resource.IsRequired}, ${resource.MinLength}, ${resource.MaxLength}, ${resource.IsActive})`
                );
                baseDTO.StatusCode = insertResource.StatusCode;
                baseDTO.StatusMessage = insertResource.StatusMessage;
                if (insertResource.StatusCode != ERROR_CODES.OK) {
                    break;
                }
            }
            if (baseDTO.StatusCode == ERROR_CODES.OK) {
                baseDTO.ServiceName = RESOURCE_ROUTES.GET_RESOURCES;
                baseDTO = await this.UpdateLastSyncedDateTimeAsync(baseDTO);
            }
        }
        return baseDTO;
    }
}