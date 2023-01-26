import { ResourceDTO } from "./ResourceDTO";
import { SYNC_CONSTANTS } from "utility";
import { ErrorModel } from "../Models/ErrorModel";
type ValueOf<T> = T[keyof T];

export class BaseDTO {
    StatusCode?: number;
    StatusMessage?: string = "";
    AccessToken?: string;
    RefreshToken?: string;
    RoleName?: string;
    NoOfRecords?: number;
    ID?: string;
    Keys?: string;
    Data?: any;
    LastSyncedAt?: string | null;
    ResourceDTO?: ResourceDTO;
    LanguageID?: number = 0;
    GroupIDs?: string = "";
    LoggedInUserID?: string = "";
    DataSyncedFor?: ValueOf<typeof SYNC_CONSTANTS>;
    UpdateSyncedDate?: boolean = false;
    Errors?: ErrorModel[];
    ServiceName?: string;
    Files?: any;
}