export class VerifyUserModel {
    Phone: string = "";
    Email: string = "";
    AccountPassword: string = "";
    UserOtp?: number;
    AdminOtp?: number;
    OtpValidTill?: string;
}