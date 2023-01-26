export class PatientModel {
    UserID?: string = "";
    RelativeOf?: number;
    RelationID?: number;
    UserPhoto?: string;
    FirstName?: string;
    MiddleName?: string;
    LastName?: string;
    MothersName?: string;
    DateOfBirth?: string;
    GenderKey?: string;
    Phone?: number;
    Email?: string;
    KycTypeKey?: string;
    KycID?: string;
    KycDocument?: string;
    AddressLatitude?: number;
    AddressLongitude?: number;
    LocationID?: number;
    UserAddressID?: number;
    ActivationStatus?: boolean;
    ConsentDateTime?: string;
    AccountPassword?: string;
    IsTempPassword?: boolean;
    IsTwoFactorAuthenticationDone?: boolean;
    WrongLoginAttempt?: number;
    AccountLockDateTime?: string;
    UserOtp?: number;
    AdminOtp?: number;
    OtpValidTill?: string;
    IsActive?: boolean;
}