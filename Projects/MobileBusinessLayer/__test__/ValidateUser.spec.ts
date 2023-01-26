import { ERROR_CODES, GLOBAL_API, USER_ROUTES, PLATFORM, SIGNUP_API_CONSTANTS } from "utility";
import { UserDTO, VerifyUserModel, UserModel } from "datamodels";
import Axios from "axios";

jest.mock("react-native", () => ({
    show: () => null,
}));

jest.mock("@react-native-community/netinfo", () => ({
    fetch: () => true,
}));

describe("User Sign Up and sign in test cases", () => {
    let userPhone = "9292929292";
    let userEmail = "92@maini.co.in";
    let userPassword = "Admin@123";
    let userOtp = 990901;
    let adminOtp = 616479;
    // it("Signup user", async () => {
    //     let userDTO = new UserDTO();
    //     let userData: UserModel = {
    //         UserPhoto: "",
    //         FirstName: "Vrinda",
    //         MiddleName: "",
    //         LastName: "AshaWorker",
    //         MothersName: "",
    //         DateOfBirth: "2010-01-01",
    //         GenderKey: 'Female',
    //         Phone: userPhone,
    //         Email: userEmail,
    //         AccountPassword: userPassword,
    //         KycTypeKey: 'PanCard',
    //         KycID: "3012-1234-2345-0987",
    //         KycDocument: "",
    //         UserOtp: userOtp,
    //         AdminOtp: adminOtp
    //     }
    //     userDTO.User = userData;
    //     let formData = new FormData();
    //     formData.append(SIGNUP_API_CONSTANTS.USER, JSON.stringify(userDTO.User));
    //     formData.append(SIGNUP_API_CONSTANTS.KYC_DOCUMENT, {
    //         uri: "file:///C:/Users/user/Downloads/kyc.jpg",
    //         name: "kyc.jpg",
    //         type: "image/jpg"
    //     });
    //     console.log("formData", formData)
    //     await Axios.request({
    //         method: "POST",
    //         url: `${GLOBAL_API}${USER_ROUTES.SIGN_UP}`,
    //         data: formData,
    //     }).then(async (res: any) => {
    //         console.log("Sign up res ", res);
    //         expect(res.status).toEqual(ERROR_CODES.OK);
    //         expect(res.data.StatusCode).toEqual(ERROR_CODES.OK);
    //     }).catch((err: any) => {
    //         console.log("SIGN_UP VERIFY ERROR", err);
    //     });
    // });

    it("Signin user verify OTP", async () => {
        let userDTO = new UserDTO();
        userDTO.VerifyUser = new VerifyUserModel();
        userDTO.VerifyUser.Phone = '9137157524';
        userDTO.VerifyUser.AccountPassword = "SH@ni123";
        userDTO.VerifyUser.UserOtp = 823707;
        await Axios.request({
            method: "POST",
            headers: { deviceid: "H1323", devicetype: "Mobile", deviceos: PLATFORM.ANDROID, deviceosversion: '10', devicemodel: 'Redmi', isremembered: 'true' },
            url: `${GLOBAL_API}${USER_ROUTES.LOGIN}`,
            data: { user: userDTO },
        }).then(async (res: any) => {
            expect(res.status).toEqual(ERROR_CODES.OK);
            expect(res.data.StatusCode).toEqual(ERROR_CODES.OK);
            expect(res.data.AccessToken).toBeTruthy();
            expect(res.data.RefreshToken).toBeTruthy();
        }).catch((err: any) => {
            console.log("SIGN_IN VERIFY ERROR", err);
        });
    });


    it("Forgot Password Verify OTP", async () => {
        let userDTO = new UserDTO();
        userDTO.VerifyUser = new VerifyUserModel();
        userDTO.VerifyUser.Phone = '9191919191';
        userDTO.VerifyUser.UserOtp = 203045;
        await Axios.request({
            method: "POST",
            url: `${GLOBAL_API}${USER_ROUTES.VALIDATE_OTP}`,
            data: { user: userDTO },
        }).then(async (res: any) => {
            expect(res.status).toEqual(ERROR_CODES.OK);
            expect(res.data.StatusCode).toEqual(ERROR_CODES.OK);
        }).catch((err: any) => {
            console.log("FORGOT PASSWORD VERIFY OTP ERROR", err);
        });
    });

    it("Change Password After forgot", async () => {
        let userDTO = new UserDTO();
        userDTO.VerifyUser = new VerifyUserModel();
        userDTO.VerifyUser.Phone = '9191919191';
        userDTO.VerifyUser.AccountPassword = "SH@ni123";
        userDTO.VerifyUser.UserOtp = 203045;
        await Axios.request({
            method: "POST",
            url: `${GLOBAL_API}${USER_ROUTES.CHANGE_PASSWORD}`,
            data: { user: userDTO },
        }).then(async (res: any) => {
            expect(res.status).toEqual(ERROR_CODES.OK);
            expect(res.data.StatusCode).toEqual(ERROR_CODES.OK);
        }).catch((err: any) => {
            console.log("CHANGE PASSWORD ERROR", err);
        });
    });
});