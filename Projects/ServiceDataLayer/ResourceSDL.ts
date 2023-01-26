import { ERROR_CODES } from "utility";
import { RunQuery } from "./Config/Sql";
import { BaseDTO, ResourceDTO, ResourceModel } from "datamodels";
import CommonSDL from "./CommonSDL";

export default class ResourceSDL extends CommonSDL {

    /**
     * get all resources of the given language
     * @param baseDTO base DTO
     * @returns resource list
     */
    public GetResourcesAsync = async (baseDTO: BaseDTO) => {
        if (baseDTO.LanguageID) {
            baseDTO.ResourceDTO = new ResourceDTO();
            let whereCondition = `Resources.LanguageID = ${baseDTO.LanguageID}`;
            if (baseDTO.LastSyncedAt) {
                whereCondition += ` AND (ResourceKeys.ModifiedOn > '${baseDTO.LastSyncedAt}' OR Resources.ModifiedOn > '${baseDTO.LastSyncedAt}')`;
            }
            let fetchResources: any = await RunQuery(
                `SELECT Resources.ResourceID, ResourceGroups.GroupID, ResourceKeys.ResourceKeyID, ResourceKeys.FieldType, Resources.LanguageID, ResourceKeys.ResourceKey, Resources.ResourceValue, Resources.PlaceholderValue, Resources.InfoValue, ResourceKeys.IsRequired, ResourceKeys.MinLength, ResourceKeys.MaxLength, Resources.IsActive
                FROM Resources
                INNER JOIN ResourceKeys ON Resources.ResourceKeyID = ResourceKeys.ResourceKeyID
                INNER JOIN ResourceGroups ON ResourceKeys.GroupID = ResourceGroups.GroupID
                WHERE ${whereCondition}`
            );
            baseDTO.StatusCode = fetchResources.StatusCode;
            baseDTO.StatusMessage = fetchResources.StatusMessage;
            if (fetchResources.StatusCode == ERROR_CODES.OK && fetchResources.Data && fetchResources.Data.length > 0) {
                for (let record of fetchResources.Data) {
                    let resourceModel: ResourceModel = {
                        ResourceID: record.ResourceID,
                        GroupID: record.GroupID,
                        ResourceKeyID: record.ResourceKeyID,
                        FieldType: record.FieldType,
                        LanguageID: record.LanguageID,
                        ResourceKey: record.ResourceKey,
                        ResourceValue: record.ResourceValue,
                        PlaceholderValue: record.PlaceholderValue,
                        InfoValue: record.InfoValue,
                        IsRequired: record.IsRequired,
                        MinLength: record.MinLength,
                        MaxLength: record.MaxLength,
                        IsActive: record.IsActive
                    }
                    baseDTO.ResourceDTO.Resources.push(resourceModel);
                }
            }
        }
        return baseDTO;
    }
}