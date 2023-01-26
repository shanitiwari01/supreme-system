import { BOOLEAN_STATUS, ERROR_CODES, SETTING_CONSTANTS, AddSecondsToDate } from "utility";
import { RunQuery } from "./Config/Sql";
import { BaseDTO, ContextDTO } from "datamodels";
import CommonSDL from "./CommonSDL";

export default class AuthenticationSDL extends CommonSDL {

    /**
     * clear all old sessions and add new session
     * @param contextDTO contextDTO
     * @returns status
     */
    public AddNewUserSessionAsync = async (contextDTO: ContextDTO) => {
        let checkOldSessions = await RunQuery(
            `SELECT * 
            FROM UserSessions 
            WHERE UserID = '${contextDTO.LoggedInUserID}' AND DeviceID = '${contextDTO.DeviceID}' AND IsActive = ${BOOLEAN_STATUS.STATUS_TRUE}`
        );
        contextDTO.StatusCode = checkOldSessions.StatusCode;
        contextDTO.StatusMessage = checkOldSessions.StatusMessage;
        if (checkOldSessions.StatusCode == ERROR_CODES.OK) {
            if (checkOldSessions.Data && checkOldSessions.Data.length > 0) {
                let deleteOldSessions = await RunQuery(
                    `UPDATE UserSessions 
                    SET IsActive = ${BOOLEAN_STATUS.STATUS_FALSE}, ModifiedOn = UTC_TIMESTAMP() 
                    WHERE UserID = '${contextDTO.LoggedInUserID}' AND DeviceID = '${contextDTO.DeviceID}'`
                );
                contextDTO.StatusCode = deleteOldSessions.StatusCode;
                contextDTO.StatusMessage = deleteOldSessions.StatusMessage;
                if (deleteOldSessions.StatusCode != ERROR_CODES.OK) {
                    return contextDTO;
                }
            }
            let addNewSession = await RunQuery(
                `INSERT INTO UserSessions 
                VALUES('${contextDTO.LoggedInUserID}', '${contextDTO.AccessToken}', '${contextDTO.AccessTokenExpiryTime}', '${contextDTO.RefreshToken}', '${contextDTO.RefreshTokenExpiryTime}', '${contextDTO.DeviceID}', '${contextDTO.DeviceType}', '${contextDTO.DeviceOS}', '${contextDTO.DeviceOSVersion}', '${contextDTO.DeviceModel}', '${contextDTO.DeviceDetail}', ${contextDTO.IsRemembered}, '${contextDTO.PinCode}', ${BOOLEAN_STATUS.STATUS_TRUE}, UTC_TIMESTAMP(), '${contextDTO.LoggedInUserID}', UTC_TIMESTAMP(), '${contextDTO.LoggedInUserID}')`
            );
            contextDTO.StatusCode = addNewSession.StatusCode;
            contextDTO.StatusMessage = addNewSession.StatusMessage;
        }
        return contextDTO;
    }

    /**
     * check if token is valid
     * @param contextDTO 
     * @returns user data if token is valid
     */
    public VerifyTokenAsync = async (contextDTO: ContextDTO) => {
        let whereCondition: string = contextDTO.RefreshToken ? `RefreshToken = '${contextDTO.RefreshToken}'` : `AccessToken = '${contextDTO.AccessToken}'`;
        let sessionResult = await RunQuery(
            `SELECT UserID, AccessTokenExpiry, RefreshTokenExpiry 
            FROM UserSessions 
            WHERE ${whereCondition} AND DeviceID = '${contextDTO.DeviceID}' AND DeviceType = '${contextDTO.DeviceType}' AND DeviceOS = '${contextDTO.DeviceOS}' AND DeviceOSVersion = '${contextDTO.DeviceOSVersion}' AND DeviceModel = '${contextDTO.DeviceModel}' AND PinCode = '${contextDTO.PinCode}' AND IsActive = ${BOOLEAN_STATUS.STATUS_TRUE} 
            LIMIT 1`
        );
        contextDTO.StatusCode = sessionResult.StatusCode;
        contextDTO.StatusMessage = sessionResult.StatusMessage;
        if (sessionResult.StatusCode == ERROR_CODES.OK) {
            if (sessionResult.Data && sessionResult.Data.length > 0) {
                contextDTO = await this.VerifySessionDataAsync(contextDTO, whereCondition);
            } else {
                contextDTO.StatusCode = ERROR_CODES.TOKEN_INVALID;
            }
        }
        return contextDTO;
    }

    /**
     * updates the token expiry time
     * @param contextDTO Context DTO
     * @returns status
     */
    public UpdateTokenExpiryTimeAsync = async (contextDTO: ContextDTO) => {
        let baseDTO = new BaseDTO();
        baseDTO.Keys = `'${SETTING_CONSTANTS.ACCESS_TOKEN_EXPIRY_TIME}','${SETTING_CONSTANTS.REFRESH_TOKEN_EXPIRY_TIME}'`;
        baseDTO = await this.GetSettingValueAsync(baseDTO);
        if (baseDTO.StatusCode == ERROR_CODES.OK && baseDTO.Data) {
            let updateResult = await RunQuery(
                `UPDATE UserSessions 
                SET AccessTokenExpiry = '${AddSecondsToDate(baseDTO.Data[SETTING_CONSTANTS.ACCESS_TOKEN_EXPIRY_TIME])}', RefreshTokenExpiry = '${AddSecondsToDate(baseDTO.Data[SETTING_CONSTANTS.REFRESH_TOKEN_EXPIRY_TIME])}'
                WHERE AccessToken = '${contextDTO.AccessToken}' AND UserID = '${contextDTO.LoggedInUserID}'`
            );
            if (updateResult.StatusCode == ERROR_CODES.OK) {
                contextDTO.StatusCode = ERROR_CODES.TOKEN_VALID;
            }
        }
        return contextDTO;
    }

    /**
     * Delete all old sessions
     * @param contextDTO contextDTO
     * @returns status
     */
    public DeleteUserSessionsAsync = async (contextDTO: ContextDTO) => {
        let deleteResult = await RunQuery(
            `UPDATE UserSessions 
            SET IsActive = ${BOOLEAN_STATUS.STATUS_FALSE}, ModifiedOn = UTC_TIMESTAMP() 
            WHERE UserID = '${contextDTO.LoggedInUserID}'`
        );
        contextDTO.StatusCode = deleteResult.StatusCode;
        contextDTO.StatusMessage = deleteResult.StatusMessage;
        return contextDTO;
    }

    /**
     * Checks if the user session data is valid
     * @param contextDTO 
     * @param whereCondition 
     * @returns status
     */
    private VerifySessionDataAsync = async (contextDTO: ContextDTO, whereCondition: string) => {
        whereCondition += contextDTO.RefreshToken ? ` AND RefreshTokenExpiry >= UTC_TIMESTAMP()` : `AND AccessTokenExpiry >= UTC_TIMESTAMP()`;
        let tokenExpiryResult = await RunQuery(
            `SELECT UserID
            FROM UserSessions 
            WHERE ${whereCondition} AND DeviceID = '${contextDTO.DeviceID}' AND DeviceType = '${contextDTO.DeviceType}' AND DeviceOS = '${contextDTO.DeviceOS}' AND DeviceOSVersion = '${contextDTO.DeviceOSVersion}' AND DeviceModel = '${contextDTO.DeviceModel}' AND PinCode = '${contextDTO.PinCode}' AND IsActive = ${BOOLEAN_STATUS.STATUS_TRUE} 
            LIMIT 1`
        );
        if (tokenExpiryResult.StatusCode == ERROR_CODES.OK) {
            if (tokenExpiryResult.Data && tokenExpiryResult.Data.length > 0) {
                contextDTO.LoggedInUserID = tokenExpiryResult.Data[0].UserID;
                contextDTO = await this.VerifyUserRoleAsync(contextDTO);
            } else {
                contextDTO.StatusCode = ERROR_CODES.TOKEN_EXPIRED;
            }
        } else {
            contextDTO.StatusCode = tokenExpiryResult.StatusCode;
            contextDTO.StatusMessage = tokenExpiryResult.StatusMessage;
        }
        return contextDTO;
    }

    /**
     * checks if the user has a valid role
     * @param contextDTO Context DTO
     * @returns status
     */
    private VerifyUserRoleAsync = async (contextDTO: ContextDTO) => {
        let roleResult = await RunQuery(
            `SELECT UserRoles.RoleID, Roles.RoleName
            FROM UserRoles 
            INNER JOIN Roles ON UserRoles.RoleID = Roles.RoleID 
            WHERE UserRoles.UserID = '${contextDTO.LoggedInUserID}' AND UserRoles.IsActive = ${BOOLEAN_STATUS.STATUS_TRUE}
            LIMIT 1`
        );
        if (roleResult.StatusCode == ERROR_CODES.OK) {
            if (roleResult.Data && roleResult.Data.length > 0) {
                contextDTO.RoleID = roleResult.Data[0].RoleID;
                contextDTO.RoleName = roleResult.Data[0].RoleName;
                contextDTO.StatusCode = ERROR_CODES.OK;
            } else {
                contextDTO.StatusCode = ERROR_CODES.UNAUTHORIZED_OPERATION;
            }
        }
        return contextDTO;
    }
}