import { ResourceKeyModel } from "datamodels";
import { RESOURCE_FIELDS } from "utility";

export class ValidationModel {
    name: ResourceKeyModel[typeof RESOURCE_FIELDS.KEY];
    validation: boolean = true;
    error: string = "";
}