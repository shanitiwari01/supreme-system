import { SettingModel } from "../Models/SettingModel";
import { BaseDTO } from "./BaseDTO";

export class SettingDTO extends BaseDTO {
    Settings: Array<SettingModel> = [];
}