import { ServiceApiModel } from "../Models/ServiceApiModel";
import { BaseDTO } from "./BaseDTO";

export class ServiceApiDTO extends BaseDTO {
    Service: ServiceApiModel = new ServiceApiModel();
}