import express from "express";

export default abstract class CommonRoute {
    app: express.Application;
    name: string;

    constructor(app: express.Application, name: string) {
        this.app = app;
        this.name = name;
        this.app.route('/').get((req: express.Request, res: express.Response) => {
            res.status(200).send(`Server running`)
        });
        this.configureRoutes();
    }

    getName() {
        return this.name;
    }

    abstract configureRoutes(): express.Application;
}