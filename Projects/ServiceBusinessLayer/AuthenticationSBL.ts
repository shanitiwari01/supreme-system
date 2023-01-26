import { ContextDTO, BaseDTO } from "datamodels";
import { ERROR_CODES, SETTING_CONSTANTS, STUDENT_ROUTES, VerifyObjectKey, API_PERMISSIONS, GenerateToken, AddSecondsToDate } from "utility";
import { AuthenticationSDL } from "servicedatalayer";
import express from "express";
import CommonSBL from "./CommonSBL";

export default class AuthenticationSBL extends CommonSBL {

    /**
     * generate user session
     * @param contextDTO 
     * @returns token and refresh token
     */
    public GenerateUserSessionAsync = async (contextDTO: ContextDTO) => {
        try {
            contextDTO = await this.GenerateNewTokenAsync(contextDTO);
            if (contextDTO.StatusCode == ERROR_CODES.OK) {
                contextDTO = await new AuthenticationSDL().AddNewUserSessionAsync(contextDTO);
            }
            if (contextDTO.StatusCode != ERROR_CODES.OK && contextDTO.StatusMessage) {
                throw new Error(this.CreateErrorMessage(contextDTO));
            }
        } catch (error) {
            contextDTO = new ContextDTO();
            contextDTO.StatusCode = ERROR_CODES.TOKEN_GENERATE_ERROR;
            await this.LogCatchErrorAsync(error as Error);
        }
        return contextDTO;
    }

    /**
     * Validate token
     * @param req express request
     * @param res express response
     * @param next api to be called next
     * @returns token status
     */
    public ValidateTokenAsync = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let contextDTO = new ContextDTO();
        try {
            contextDTO = this.CreateContextData(contextDTO, req);
            if (contextDTO.AccessToken && this.ValidateHeaderData(contextDTO, true)) {
                contextDTO.Api = this.GetApiConstant(req.url);
                if (contextDTO.Api) {
                    contextDTO = await this.VerifyTokenDetailsAsync(contextDTO);
                    if (contextDTO.StatusCode == ERROR_CODES.TOKEN_VALID) {
                        res.locals.context = contextDTO;
                        next();
                    }
                } else {
                    contextDTO.StatusCode = ERROR_CODES.UNAUTHORIZED_OPERATION;
                }
            } else {
                contextDTO.StatusCode = ERROR_CODES.TOKEN_INVALID;
            }
            if (contextDTO.StatusCode != ERROR_CODES.TOKEN_VALID && contextDTO.StatusMessage) {
                throw new Error(this.CreateErrorMessage(contextDTO));
            }
        } catch (error) {
            contextDTO.StatusCode = ERROR_CODES.TOKEN_INVALID;
            await this.LogCatchErrorAsync(error as Error);
        } finally {
            if (contextDTO.StatusCode !== ERROR_CODES.TOKEN_VALID) {
                contextDTO = this.ResetApiData(contextDTO);
                res.status(ERROR_CODES.OK).send(contextDTO);
            }
        }
    }

    /**
     * Validate refresh token and generate new token
     * @param req express request
     * @param res express response
     * @returns token status
     */
    public ResetTokenAsync = async (req: express.Request, res: express.Response) => {
        let contextDTO = new ContextDTO();
        try {
            contextDTO = this.CreateContextData(contextDTO, req);
            if (contextDTO.RefreshToken && this.ValidateHeaderData(contextDTO, true)) {
                contextDTO = await this.VerifyTokenDetailsAsync(contextDTO);
                if (contextDTO.StatusCode == ERROR_CODES.TOKEN_VALID) {
                    contextDTO = await this.GenerateUserSessionAsync(contextDTO);
                }
            } else {
                contextDTO.StatusCode = ERROR_CODES.TOKEN_INVALID;
            }
            if (contextDTO.StatusCode != ERROR_CODES.OK && contextDTO.StatusMessage) {
                throw new Error(this.CreateErrorMessage(contextDTO));
            }
        } catch (error) {
            contextDTO.StatusCode = ERROR_CODES.TOKEN_INVALID;
            await this.LogCatchErrorAsync(error as Error);
        } finally {
            contextDTO = this.ResetApiData(contextDTO);
            res.status(ERROR_CODES.OK).send(contextDTO);
        }
    }

    /**
     * Delete all user sessions
     * @param contextDTO
     * @returns contextDTO
     */
    public DeleteUserSessionsAsync = async (contextDTO: ContextDTO) => {
        try {
            if (contextDTO.LoggedInUserID) {
                contextDTO = await new AuthenticationSDL().DeleteUserSessionsAsync(contextDTO);
                if (contextDTO.StatusCode != ERROR_CODES.OK && contextDTO.StatusMessage) {
                    throw new Error(this.CreateErrorMessage(contextDTO));
                }
            } else {
                contextDTO.StatusCode = ERROR_CODES.INVALID_DATA;
            }
        } catch (error) {
            contextDTO.StatusCode = ERROR_CODES.DATA_DELETE_ERROR;
            await this.LogCatchErrorAsync(error as Error);
        } finally {
            contextDTO = this.ResetApiData(contextDTO);
        }
        return contextDTO;
    }

    /**
     * Generate new token
     * @param contextDTO 
     * @returns token status
     */
    private GenerateNewTokenAsync = async (contextDTO: ContextDTO) => {
        let baseDTO: BaseDTO = await this.GetSettingValueAsync(`'${SETTING_CONSTANTS.ACCESS_TOKEN_EXPIRY_TIME}','${SETTING_CONSTANTS.REFRESH_TOKEN_EXPIRY_TIME}'`);
        if (baseDTO.StatusCode == ERROR_CODES.OK) {
            if (baseDTO.Data) {
                contextDTO.AccessToken = GenerateToken();
                contextDTO.AccessTokenExpiryTime = AddSecondsToDate(baseDTO.Data[SETTING_CONSTANTS.ACCESS_TOKEN_EXPIRY_TIME]);
                contextDTO.RefreshToken = GenerateToken();
                contextDTO.RefreshTokenExpiryTime = AddSecondsToDate(baseDTO.Data[SETTING_CONSTANTS.REFRESH_TOKEN_EXPIRY_TIME]);
                if (!contextDTO.AccessToken || !contextDTO.RefreshToken) {
                    contextDTO.StatusCode = ERROR_CODES.TOKEN_GENERATE_ERROR;
                } else {
                    contextDTO.StatusCode = ERROR_CODES.OK;
                }
            } else {
                contextDTO.StatusCode = ERROR_CODES.TOKEN_GENERATE_ERROR;
            }
        } else {
            contextDTO.StatusCode = baseDTO.StatusCode;
            contextDTO.StatusMessage = baseDTO.StatusMessage;
        }
        return contextDTO;
    }

    /**
     * verify the api url and return its constant
     * @param apiUrl 
     * @returns api constant
     */
    private GetApiConstant = (apiUrl: string) => {
        if (Object.values(STUDENT_ROUTES).includes(apiUrl)) {
            return Object.keys(STUDENT_ROUTES).find(key => VerifyObjectKey(key, STUDENT_ROUTES) && STUDENT_ROUTES[key] === apiUrl);
        }
        return "";
    }

    /**
     * verify api and token details
     * @param contextDTO 
     * @returns status 
     */
    private VerifyTokenDetailsAsync = async (contextDTO: ContextDTO) => {
        contextDTO = await new AuthenticationSDL().VerifyTokenAsync(contextDTO);
        if (contextDTO.StatusCode == ERROR_CODES.OK) {
            contextDTO = await this.VerifyRolesAndPermissionsAsync(contextDTO);
            if (contextDTO.StatusCode == ERROR_CODES.OK) {
                contextDTO.StatusCode = ERROR_CODES.TOKEN_VALID;
            }
        }
        return contextDTO;
    }

    /**
     * authorize the user
     * @param contextDTO contextDTO
     * @returns authorization status
     */
    private VerifyRolesAndPermissionsAsync = async (contextDTO: ContextDTO) => {
        let apiDetails = contextDTO.Api && VerifyObjectKey(contextDTO.Api, API_PERMISSIONS) ? API_PERMISSIONS[contextDTO.Api] : [];
        if (apiDetails && contextDTO.RoleName && apiDetails.includes(contextDTO.RoleName)) {
            contextDTO = await new AuthenticationSDL().UpdateTokenExpiryTimeAsync(contextDTO);
        } else {
            contextDTO.StatusCode = ERROR_CODES.UNAUTHORIZED_OPERATION;
        }
        return contextDTO;
    }
}