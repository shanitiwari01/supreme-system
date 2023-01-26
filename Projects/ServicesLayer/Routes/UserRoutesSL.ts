import CommonRoute from "./CommonRouteSL";
import { AccountSBL } from "servicebusinesslayer";
import { USER_ROUTES } from "utility";
import express from "express";

export default class UserRoutesSL extends CommonRoute {
    constructor(app: express.Application) {
        super(app, "UserRoutes");
    }

    configureRoutes() {
        let accountSBL = new AccountSBL();
        this.app.route(USER_ROUTES.VERIFY_SIGNUP_USER).post(accountSBL.VerifySignUpUserAsync);
        this.app.route(USER_ROUTES.SIGN_UP).post(accountSBL.SignUpAsync);
        this.app.route(USER_ROUTES.VERIFY_LOGIN).post(accountSBL.VerifyLoginUserAsync);
        this.app.route(USER_ROUTES.LOGIN).post(accountSBL.LoginAsync);
        this.app.route(USER_ROUTES.FORGOT_PASSWORD).post(accountSBL.ForgotPasswordAsync);
        this.app.route(USER_ROUTES.VALIDATE_OTP).post(accountSBL.ValidateOtpAsync);
        this.app.route(USER_ROUTES.CHANGE_PASSWORD).post(accountSBL.ChangePasswordAsync);
        return this.app;
    }
}