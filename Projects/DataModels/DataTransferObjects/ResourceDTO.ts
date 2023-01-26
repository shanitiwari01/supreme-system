import { ResourceGroupModel } from "../Models/ResourceGroupModel";
import { ResourceKeyModel } from "../Models/ResourceKeyModel";
import { ResourceModel } from "../Models/ResourceModel";

export class ResourceDTO {
    Resources: Array<ResourceModel> = [];
    ResourceKeys?: Array<ResourceKeyModel> = [];
    Groups?: Array<ResourceGroupModel> = [];
}