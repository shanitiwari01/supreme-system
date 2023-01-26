import { LanguageModel } from "../Models/LanguageModel";
import { BaseDTO } from "./BaseDTO";

export class LanguageDTO extends BaseDTO {
    Languages: Array<LanguageModel> = [];
}