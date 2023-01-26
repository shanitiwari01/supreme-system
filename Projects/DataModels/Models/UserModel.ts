import { VerifyUserModel } from "./VerifyUserModel";

export class UserModel extends VerifyUserModel {
    UserID?: string = "";
    UserPhoto: string = "";
    FirstName: string = "";
    MiddleName: string = "";
    LastName: string = "";
    MothersName: string = "";
    DateOfBirth: string = "";
    GenderKey: string = "";
    KycTypeKey: string = "";
    KycID: string = "";
    KycDocument: string = "";
    ActivationStatus?: boolean;
    IsTempPassword?: boolean;
    IsTwoFactorAuthenticationDone?: boolean;
    WrongLoginAttempt?: number;
    AccountLockDateTime?: string;
    IsActive?: boolean;
}