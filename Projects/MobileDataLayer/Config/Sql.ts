import SQLite from "react-native-sqlite-storage";
import { BaseDTO } from "datamodels";
import { ERROR_CODES, TESTING } from "utility";

/**
 * Connect SQLite database if not connected
 * @returns dbconnection
 */
export const ConnectDatabase = () => {
    if (!global.DB) {
        global.DB = SQLite.openDatabase(
            {
                name: "SupremeSystem",
                location: "default",
                createFromLocation: "~www/SupremeSystem.db"
            },
            () => { console.log("Connected"); },
            (error: any) => {
                console.log("ERROR: " + error);
            }
        );
        return global.DB;
    }
    else {
        return global.DB;
    }
}

/**
 * Run query in sqlite database
 * @param query 
 * @returns BaseDTO
 */
export const ExecuteQuery = (query: string) => new Promise((resolve, reject) => {
    if(TESTING){
        // var sqlite3 = require('sqlite3').verbose();
        // var db = new sqlite3.Database('./SupremeSystem.db');
        // let response = new BaseDTO();
        // db.serialize(() => {
        //     db.all(query, [], function (error: any, results: any) {
        //         if (error) {
        //             response = {
        //                 StatusCode: error.code,
        //                 StatusMessage: error.message,
        //             }
        //             resolve(response);
        //         } else {
        //             response.StatusCode = ERROR_CODES.OK;
        //             response.StatusMessage = "";
        //             response.Data = results;
        //             resolve(response);
        //         }
        //     });
        // });
    } else {
        let database = ConnectDatabase();
        database.transaction((trans: any) => {
            let response = new BaseDTO();
            trans.executeSql(query, [], (transaction: any, results: any) => {
                response.StatusCode = ERROR_CODES.OK;
                response.StatusMessage = "";
                if (results && results.rows) {
                    response.Data = results.rows.raw();
                }
                resolve(response);
    
            }, (error: any) => {
                response = {
                    StatusCode: error.code,
                    StatusMessage: error.message,
                }
                resolve(response);
            });
        });
    }
});
