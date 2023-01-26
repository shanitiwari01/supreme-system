import CommonRoute from "./CommonRouteSL";
import { ErrorLogSBL, AuthenticationSBL } from "servicebusinesslayer";
import { ERROR_LOG_ROUTES } from "utility";
import express from "express";

export default class ErrorLogRouteSL extends CommonRoute {
    constructor(app: express.Application) {
        super(app, "ErrorLogRoutes");
    }

    configureRoutes() {
        let authenticationSBL = new AuthenticationSBL();
        this.app.route(ERROR_LOG_ROUTES.SAVE_ERROR_LOGS).all(authenticationSBL.ValidateTokenAsync).post(new ErrorLogSBL().SaveErrorLogsAsync);
        return this.app;
    }
}