import { BaseDTO } from "./BaseDTO";
import { API_PERMISSIONS } from "utility";

export class ContextDTO extends BaseDTO {
    AccessTokenExpiryTime?: string;
    RefreshTokenExpiryTime?: string;
    DeviceID?: string;
    DeviceType?: string;
    DeviceOS?: string;
    DeviceOSVersion?: string;
    DeviceModel?: string;
    DeviceDetail?: string;
    IsRemembered?: boolean;
    PinCode?: string;
    Api?: keyof typeof API_PERMISSIONS | string;
    RoleID?: number;
}