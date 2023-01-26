import CommonRoute from "./CommonRouteSL";
import { AuthenticationSBL } from "servicebusinesslayer";
import { AUTH_ROUTES } from "utility";
import express from "express";

export default class AuthRoutesSL extends CommonRoute {
    constructor(app: express.Application) {
        super(app, "AuthRoutes");
    }

    configureRoutes() {
        let authenticationSBL = new AuthenticationSBL();
        this.app.route(AUTH_ROUTES.RESET_TOKEN).get(authenticationSBL.ResetTokenAsync);
        return this.app;
    }
}