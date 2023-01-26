import express from 'express';
import * as http from 'http';
import * as bodyparser from 'body-parser';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors'
import CommonRoute from './Routes/CommonRouteSL';
import StudentRoutesSL from './Routes/StudentRoutesSL';
import ResourceRoutesSL from './Routes/ResourceRoutesSL';
import UserRoutesSL from './Routes/UserRoutesSL';
import LanguageRoutesSL from './Routes/LanguageRoutesSL';
import SettingRoutesSL from './Routes/SettingRoutesSL';
import ErrorLogRouteSL from './Routes/ErrorLogRouteSL';
import AuthRoutesSL from './Routes/AuthRoutesSL';
const fileUpload = require('express-fileupload');

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = 8083;
const routes: Array<CommonRoute> = [];

app.use(bodyparser.json());
app.use(cors());

app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
}));

// file-upload options
app.use(fileUpload());

routes.push(new StudentRoutesSL(app));
routes.push(new LanguageRoutesSL(app));
routes.push(new ResourceRoutesSL(app));
routes.push(new UserRoutesSL(app));
routes.push(new SettingRoutesSL(app));
routes.push(new ErrorLogRouteSL(app));
routes.push(new AuthRoutesSL(app));

app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
}));

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    routes.forEach((route: CommonRoute) => {
        console.log(`Routes configured for ${route.getName()}`);
    });
});