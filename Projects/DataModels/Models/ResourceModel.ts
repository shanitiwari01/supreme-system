import { ResourceKeyModel } from "./ResourceKeyModel";

export class ResourceModel extends ResourceKeyModel {
    ResourceID?: number = 0;
    LanguageID?: number = 0;
    ResourceValue: string = "";
    PlaceholderValue?: string;
    InfoValue?: string;
    IsActive?: boolean = true;
}