import CommonRoute from "./CommonRouteSL";
import { LanguageSBL } from "servicebusinesslayer";
import { LANGUAGE_ROUTES } from "utility";
import express from "express";

export default class LanguageRoutesSL extends CommonRoute {
    constructor(app: express.Application) {
        super(app, "LanguageRoutes");
    }

    configureRoutes() {
        this.app.route(LANGUAGE_ROUTES.GET_LANGUAGES).get(new LanguageSBL().GetLanguagesAsync);
        return this.app;
    }
}