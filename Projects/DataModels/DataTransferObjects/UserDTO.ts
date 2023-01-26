import { BaseDTO } from "./BaseDTO";
import { UserModel } from "../Models/UserModel";
import { VerifyUserModel } from "../Models/VerifyUserModel";

export class UserDTO extends BaseDTO {
    VerifyUser?: VerifyUserModel;
    User?: UserModel;
}