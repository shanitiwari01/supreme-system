import mysql2 from 'mysql2/promise';
import mysql from 'mysql';
import { MYSQL } from "./constants";
import { BaseDTO } from 'datamodels';
import { ERROR_CODES } from 'utility';

const connectionNew = mysql.createConnection({
    host: MYSQL.HOST,
    user: MYSQL.USER,
    password: MYSQL.PASSWORD,
    database: MYSQL.DATABASE
});

connectionNew.connect((err: string) => {
    if (err) throw err;
    console.log('Connected to MySQL Server!');
});

export const RunQuery = (query: string): any => {
    return new Promise(function (resolve, reject) {
        connectionNew.query(query, (err: any, rows: any) => {
            let result: BaseDTO = {
                StatusCode: err ? err.errno : ERROR_CODES.OK,
                StatusMessage: err ? err.code : "",
            }
            if (rows) {
                result.Data = rows;
            }
            resolve(result);
        });
    });
}

const ConnectDatabase = async () => {
    if (!global.DB) {
        global.DB = await mysql2.createConnection({
            host: MYSQL.HOST,
            user: MYSQL.USER,
            password: MYSQL.PASSWORD,
            database: MYSQL.DATABASE
        });
        return global.DB;
    }
    else {
        return global.DB;
    }
}

export const RunMultipleSaveQueries = async (saveQuery: Array<string>) => {
    let result = new BaseDTO();
    if(saveQuery.length > 0) {
        let connection = await ConnectDatabase();
        await connection.beginTransaction();
        try {
            for (let query of saveQuery) {
                await connection.execute(query);
            }
            await connection.commit();
            result.StatusCode = ERROR_CODES.OK;
            result.StatusMessage = "";
        } catch (err) {
            connection.rollback();
            result.StatusCode = (err as any).errno;
            result.StatusMessage = (err as any).code;
        }
    }
    return result;
}