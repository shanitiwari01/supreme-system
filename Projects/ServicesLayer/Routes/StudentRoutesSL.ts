import CommonRoute from "./CommonRouteSL";
import { StudentSBL, AuthenticationSBL } from "servicebusinesslayer";
import { STUDENT_ROUTES } from "utility";
import express from "express";

export default class StudentRoutesSL extends CommonRoute {
    constructor(app: express.Application) {
        super(app, "StudentRoutes");
    }

    configureRoutes() {
        let studentSBL = new StudentSBL();
        let authenticationSBL = new AuthenticationSBL();
        this.app.route(STUDENT_ROUTES.GET_STUDENTS).all(authenticationSBL.ValidateTokenAsync).get(studentSBL.GetStudentsAsync);
        this.app.route(STUDENT_ROUTES.GET_STUDENT).all(authenticationSBL.ValidateTokenAsync).get(studentSBL.GetStudentAsync);
        this.app.route(STUDENT_ROUTES.SAVE_STUDENTS).all(authenticationSBL.ValidateTokenAsync).post(studentSBL.SaveStudentsAsync);
        return this.app;
    }
}