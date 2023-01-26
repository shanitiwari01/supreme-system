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
    let userOtp = 0;
    let adminOtp = 0;
    it("Verify Signup user", async () => {
        let userDTO = new UserDTO();
        userDTO.VerifyUser = new VerifyUserModel();
        userDTO.VerifyUser.Phone = "9292929292";
        userDTO.VerifyUser.Email = "92@maini.co.in";
        await Axios.request({
            method: "POST",
            url: `${GLOBAL_API}${USER_ROUTES.VERIFY_SIGNUP_USER}`,
            data: { user: userDTO },
        }).then(async (res: any) => {
            expect(res.status).toEqual(ERROR_CODES.OK);
            expect(res.data.StatusCode).toEqual(ERROR_CODES.OK);
        }).catch((err: any) => {
            console.log("SIGN_UP ERROR", err);
        });
    });

    it("Verify Signin user", async () => {
        let userDTO = new UserDTO();
        userDTO.VerifyUser = new VerifyUserModel();
        userDTO.VerifyUser.Phone = "9137157524";
        userDTO.VerifyUser.AccountPassword = "SH@ni123";
        await Axios.request({
            method: "POST",
            url: `${GLOBAL_API}${USER_ROUTES.VERIFY_LOGIN}`,
            data: { user: userDTO },
        }).then(async (res: any) => {
            expect(res.status).toEqual(ERROR_CODES.OK);
            expect(res.data.StatusCode).toEqual(ERROR_CODES.OK);
        }).catch((err: any) => {
            console.log("SIGN_IN ERROR", err);
        });
    });

    it("Verify Forgot Password user", async () => {
        await Axios.request({
            method: "POST",
            url: `${GLOBAL_API}${USER_ROUTES.FORGOT_PASSWORD}`,
            data: { phone: "9191919191" },
        }).then(async (res: any) => {
            expect(res.status).toEqual(ERROR_CODES.OK);
            expect(res.data.StatusCode).toEqual(ERROR_CODES.OK);
        }).catch((err: any) => {
            console.log("SIGN_IN ERROR", err);
        });
    });
});