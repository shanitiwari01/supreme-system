import { ErrorLogModel } from "../Models/ErrorLogModel";
import { BaseDTO } from "./BaseDTO";

export class ErrorLogDTO extends BaseDTO {
    ErrorLogs: Array<ErrorLogModel> = [];
}