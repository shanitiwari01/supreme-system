import CommonRoute from "./CommonRouteSL";
import { ResourceSBL } from "servicebusinesslayer";
import { RESOURCE_ROUTES } from "utility";
import express from "express";

export default class ResourceRoutesSL extends CommonRoute {
    constructor(app: express.Application) {
        super(app, "ResourceRoutes");
    }

    configureRoutes() {
        this.app.route(RESOURCE_ROUTES.GET_RESOURCES).get(new ResourceSBL().GetResourcesAsync);
        return this.app;
    }
}