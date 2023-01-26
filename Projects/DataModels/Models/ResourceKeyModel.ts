import { ResourceGroupModel } from "./ResourceGroupModel";

export class ResourceKeyModel extends ResourceGroupModel {
    ResourceKeyID?: number = 0;
    ResourceKey?: string = "";
    FieldType: string = "";
    IsRequired: boolean = false;
    MinLength: number = 0;
    MaxLength: number = 0;
}