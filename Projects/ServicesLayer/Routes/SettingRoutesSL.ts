import CommonRoute from "./CommonRouteSL";
import { SettingSBL } from "servicebusinesslayer";
import { SETTING_ROUTES } from "utility";
import express from "express";

export default class SettingsRoutesSL extends CommonRoute {
    constructor(app: express.Application) {
        super(app, "SettingRoutes");
    }

    configureRoutes() {
        this.app.route(SETTING_ROUTES.GET_SETTINGS).get(new SettingSBL().GetSettingsAsync);
        return this.app;
    }
}