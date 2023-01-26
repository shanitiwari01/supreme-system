import { BOOLEAN_STATUS, ERROR_CODES, USER_ROLES, ACCOUNT_API_TYPES } from "utility";
import { RunQuery } from "./Config/Sql";
import { BaseDTO, UserDTO, UserModel, VerifyUserModel } from "datamodels";
import CommonSDL from "./CommonSDL";
import brcypt from "bcryptjs";

type ValueOf<T> = T[keyof T];
export default class AccountSDL extends CommonSDL {

    /**
     * verify user for sign up
     * @param userDTO
     * @return userDTO 
     */
    public VerifySignUpUserAsync = async (userDTO: UserDTO) => {
        userDTO = await this.CheckDuplicateAccountAsync(userDTO, ACCOUNT_API_TYPES.VERIFY_USER);
        if (userDTO.StatusCode == ERROR_CODES.NO_ACCOUNT_FOUND) {
            userDTO = await this.SaveOtpAsync(userDTO);
        }
        return userDTO;
    }

    /**
     * sign up user
     * @param userDTO
     * @return userDTO 
     */
    public SignUpUserAsync = async (userDTO: UserDTO) => {
        userDTO = await this.CheckDuplicateAccountAsync(userDTO, ACCOUNT_API_TYPES.SIGN_UP);
        if (userDTO.StatusCode == ERROR_CODES.NO_ACCOUNT_FOUND) {
            userDTO = await this.ValidateOtpAsync(userDTO, ACCOUNT_API_TYPES.SIGN_UP);
            if (userDTO.StatusCode == ERROR_CODES.OK) {
                userDTO = await this.AddNewUserAsync(userDTO);
            }
        }
        return userDTO;
    }

    /**
     * verify login user
     * @param userDTO
     * @return userDTO 
     */
    public VerifyLoginUserAsync = async (userDTO: UserDTO) => {
        userDTO = await this.VerifyUserAsync(userDTO);
        if (userDTO.StatusCode == ERROR_CODES.OK) {
            userDTO = await this.SaveOtpAsync(userDTO);
        }
        return userDTO;
    }

    /**
     * Login user
     * @param userDTO
     * @return userDTO 
     */
    public LoginUserAsync = async (userDTO: UserDTO) => {
        userDTO = await this.VerifyUserAsync(userDTO);
        if (userDTO.StatusCode == ERROR_CODES.OK) {
            userDTO = await this.ValidateOtpAsync(userDTO, ACCOUNT_API_TYPES.LOGIN);
            if (userDTO.StatusCode == ERROR_CODES.OK) {
                userDTO = await this.GetUserIDAsync(userDTO);
            }
        }
        return userDTO;
    }

    /**
     * Delete user account
     * @param userDTO
     * @return userDTO 
     */
    public DeleteUserAccount = async (userDTO: UserDTO) => {
        if (userDTO.User && userDTO.User.UserID) {
            let deleteResult = await RunQuery(
                `DELETE FROM Users
                WHERE UserID = '${userDTO.User.UserID}'`
            );
            userDTO.StatusCode = deleteResult.StatusCode;
            userDTO.StatusMessage = deleteResult.StatusMessage;
        } else {
            userDTO.StatusCode = ERROR_CODES.INVALID_DATA;
        }
        return userDTO;
    }

    /**
     * verify the user for forgot password
     * @param userDTO 
     * @return baseDTO 
     */
    public VerifyUserAccountAsync = async (userDTO: UserDTO) => {
        if (userDTO.VerifyUser) {
            userDTO = await this.CheckUserExistsAsync(userDTO);
            if (userDTO.StatusCode == ERROR_CODES.ACCOUNT_EXISTS) {
                userDTO = await this.SaveOtpAsync(userDTO);
            }
        } else {
            userDTO.StatusCode = ERROR_CODES.INVALID_DATA;
        }
        return userDTO;
    }

    /**
     * verify the user and otp
     * @param userDTO 
     * @return baseDTO 
     */
    public VerifyOtpAsync = async (userDTO: UserDTO) => {
        if (userDTO.VerifyUser) {
            userDTO = await this.CheckUserExistsAsync(userDTO);
            if (userDTO.StatusCode == ERROR_CODES.ACCOUNT_EXISTS) {
                userDTO = await this.ValidateOtpAsync(userDTO, ACCOUNT_API_TYPES.FORGOT_PASSWORD);
            }
        } else {
            userDTO.StatusCode = ERROR_CODES.INVALID_DATA;
        }
        return userDTO;
    }

    /**
     * verify the user and change password
     * @param userDTO 
     * @return baseDTO 
     */
    public ChangePasswordAsync = async (userDTO: UserDTO) => {
        if (userDTO.VerifyUser) {
            userDTO = await this.CheckUserExistsAsync(userDTO);
            if (userDTO.StatusCode == ERROR_CODES.ACCOUNT_EXISTS) {
                userDTO = await this.ValidateOtpAsync(userDTO, ACCOUNT_API_TYPES.FORGOT_PASSWORD);
                if (userDTO.StatusCode == ERROR_CODES.OK) {
                    userDTO = await this.SaveNewPasswordAsync(userDTO);
                    if (userDTO.StatusCode == ERROR_CODES.OK) {
                        userDTO = await this.GetUserIDAsync(userDTO);
                    }
                }
            }
        } else {
            userDTO.StatusCode = ERROR_CODES.INVALID_DATA;
        }
        return userDTO;
    }

    /**
     * checks if the account already exists
     * @param userDTO
     * @param apiType
     * @return userDTO 
     */
    private CheckDuplicateAccountAsync = async (userDTO: UserDTO, apiType: ValueOf<typeof ACCOUNT_API_TYPES>) => {
        let userData = apiType == ACCOUNT_API_TYPES.SIGN_UP ? userDTO.User : userDTO.VerifyUser;
        if (userData) {
            let whereCondition: string = userData.Email ? ` OR (Email IS NOT NULL AND Email = '${userData.Email}')` : ``;
            let accountResult = await RunQuery(
                `SELECT COUNT(UserID) AS userCount
                FROM Users
                WHERE Phone = '${userData.Phone}' ${whereCondition}`
            );
            if (accountResult.StatusCode == ERROR_CODES.OK && accountResult.Data) {
                userDTO.StatusCode = accountResult.Data[0].userCount > 0 ? ERROR_CODES.ACCOUNT_EXISTS : ERROR_CODES.NO_ACCOUNT_FOUND;
            } else {
                userDTO.StatusCode = accountResult.StatusCode;
                userDTO.StatusMessage = accountResult.StatusMessage;
            }
        } else {
            userDTO.StatusCode = ERROR_CODES.INVALID_DATA;
        }
        return userDTO;
    }

    /**
     * save otp to be sent
     * @param userDTO
     * @return userDTO 
     */
    private SaveOtpAsync = async (userDTO: UserDTO) => {
        if (userDTO.VerifyUser) {
            let checkOldOtpResult = await RunQuery(
                `DELETE FROM UserOTPs
                WHERE Phone = '${userDTO.VerifyUser.Phone}' OR OtpValidTill < UTC_TIMESTAMP()`
            );
            if (checkOldOtpResult.StatusCode == ERROR_CODES.OK) {
                let saveResult = await RunQuery(
                    `INSERT INTO UserOTPs
                    (Phone, UserOtp, AdminOtp, OtpValidTill, AddedOn)
                    VALUES ('${userDTO.VerifyUser.Phone}', ${userDTO.VerifyUser.UserOtp}, ${userDTO.VerifyUser.AdminOtp}, '${userDTO.VerifyUser.OtpValidTill}', UTC_TIMESTAMP())`
                );
                userDTO.StatusCode = saveResult.StatusCode;
                userDTO.StatusMessage = saveResult.StatusMessage;
            } else {
                userDTO.StatusCode = checkOldOtpResult.StatusCode;
                userDTO.StatusMessage = checkOldOtpResult.StatusMessage;
            }
        } else {
            userDTO.StatusCode = ERROR_CODES.INVALID_DATA;
        }
        return userDTO;
    }

    /**
     * verify the otp details
     * @param userDTO 
     * @param apiType 
     * @return userDTO 
     */
    private ValidateOtpAsync = async (userDTO: UserDTO, apiType: ValueOf<typeof ACCOUNT_API_TYPES>) => {
        userDTO.StatusCode = ERROR_CODES.INVALID_DATA;
        let userData = apiType == ACCOUNT_API_TYPES.SIGN_UP ? userDTO.User : userDTO.VerifyUser;
        if (userData) {
            let whereCondition: string = apiType == ACCOUNT_API_TYPES.SIGN_UP ? ` AND AdminOtp = ${userData.AdminOtp}` : ``;
            let otpResult = await RunQuery(
                `SELECT OtpValidTill  
                FROM UserOTPs
                WHERE Phone = '${userData.Phone}' AND UserOtp = ${userData.UserOtp} ${whereCondition}
                LIMIT 1`
            );
            if (otpResult.StatusCode == ERROR_CODES.OK) {
                if (otpResult.Data && otpResult.Data.length > 0) {
                    userDTO = await this.CheckOtpExpiryAsync(userDTO, userData, whereCondition);
                }
            } else {
                userDTO.StatusCode = otpResult.StatusCode;
                userDTO.StatusMessage = otpResult.StatusMessage;
            }
        }
        return userDTO;
    }

    /**
     * Checks if the otp has expired
     * @param userDTO 
     * @param userData 
     * @param whereCondition 
     * @returns userDTO
     */
    private CheckOtpExpiryAsync = async (userDTO: UserDTO, userData: UserModel | VerifyUserModel, whereCondition: string) => {
        let otpExpiryResult = await RunQuery(
            `SELECT *  
            FROM UserOTPs
            WHERE Phone = '${userData.Phone}' AND UserOtp = ${userData.UserOtp} AND OtpValidTill >= UTC_TIMESTAMP() ${whereCondition}
            LIMIT 1`
        );
        if (otpExpiryResult.StatusCode == ERROR_CODES.OK) {
            if (otpExpiryResult.Data && otpExpiryResult.Data.length > 0) {
                userDTO.StatusCode = ERROR_CODES.OK;
            } else {
                userDTO.StatusCode = ERROR_CODES.OTP_EXPIRED;
            }
        } else {
            userDTO.StatusCode = otpExpiryResult.StatusCode;
            userDTO.StatusMessage = otpExpiryResult.StatusMessage;
        }
        return userDTO;
    }

    /**
     * verify user details and sign up
     * @param userDTO 
     * @return userDTO 
     */
    private AddNewUserAsync = async (userDTO: UserDTO) => {
        if (userDTO.User) {
            let userResult = await RunQuery(this.CreateUserQuery(userDTO.User));
            if (userResult.StatusCode == ERROR_CODES.OK) {
                userDTO = await this.AddUserRoleAsync(userDTO);
            } else {
                userDTO.StatusCode = userResult.StatusCode;
                userDTO.StatusMessage = userResult.StatusMessage;
            }
        } else {
            userDTO.StatusCode = ERROR_CODES.INVALID_DATA;
        }
        return userDTO;
    }

    /**
     * gives add user query
     * @param user
     * @returns query
     */
    private CreateUserQuery = (user: UserModel) => {
        let insertQuery = `'${user.UserID}', '${user.FirstName}', '${user.LastName}', '${user.DateOfBirth}', '${user.GenderKey}', '${user.Phone}', '${user.KycTypeKey}', '${user.KycID}', '${user.KycDocument}', ${user.ActivationStatus}, '${user.AccountPassword}', ${BOOLEAN_STATUS.STATUS_FALSE}, ${user.IsTwoFactorAuthenticationDone}, ${BOOLEAN_STATUS.STATUS_TRUE}, UTC_TIMESTAMP(), UTC_TIMESTAMP(), `;
        insertQuery += user.UserPhoto ? `'${user.UserPhoto}', ` : `NULL, `;
        insertQuery += user.MiddleName ? `'${user.MiddleName}', ` : `NULL, `;
        insertQuery += user.MothersName ? `'${user.MothersName}', ` : `NULL, `;
        insertQuery += user.Email ? `'${user.Email}'` : `NULL`;
        return `
            INSERT INTO Users
            (UserID, FirstName, LastName, DateOfBirth, GenderKey, Phone, KycTypeKey, KycID, KycDocument, ActivationStatus, AccountPassword, IsTempPassword, IsTwoFactorAuthenticationDone, IsActive, AddedOn, ModifiedOn, UserPhoto, MiddleName, MotherName, Email)
            VALUES (${insertQuery})`;
    }

    /**
     * Checks for any existing user role and add new one
     * @param userDTO 
     * @returns userDTO
     */
    private AddUserRoleAsync = async (userDTO: UserDTO) => {
        if (userDTO.User) {
            userDTO = await this.CheckUserRoleDuplicacyAsync(userDTO);
            if (userDTO.StatusCode == ERROR_CODES.OK && userDTO.User) {
                let baseDTO: BaseDTO = await this.GetRoleIDFromNameAsync(USER_ROLES.ASHA_WORKER);
                if (baseDTO.StatusCode == ERROR_CODES.OK && baseDTO.Data) {
                    let roleResult = await RunQuery(
                        `INSERT INTO UserRoles
                        (UserID, RoleID, IsActive, AddedOn, ModifiedOn)
                        VALUES ('${userDTO.User.UserID}', ${baseDTO.Data.RoleID}, ${BOOLEAN_STATUS.STATUS_TRUE}, UTC_TIMESTAMP(), UTC_TIMESTAMP())`
                    );
                    userDTO.StatusCode = roleResult.StatusCode;
                    userDTO.StatusMessage = roleResult.StatusMessage;
                } else {
                    userDTO.StatusCode = baseDTO.StatusCode;
                    userDTO.StatusMessage = baseDTO.StatusMessage;
                }
            }
        } else {
            userDTO.StatusCode = ERROR_CODES.INVALID_DATA;
        }
        return userDTO;
    }

    /**
     * Checks if the user has duplicate role
     * @param userDTO 
     * @returns userDTO
     */
    private CheckUserRoleDuplicacyAsync = async (userDTO: UserDTO) => {
        if (userDTO.User) {
            let checkDuplicateRole = await RunQuery(
                `SELECT UserID
                FROM UserRoles
                WHERE UserID = '${userDTO.User.UserID}' AND IsActive = ${BOOLEAN_STATUS.STATUS_TRUE}`
            );
            if (checkDuplicateRole.StatusCode == ERROR_CODES.OK) {
                if (checkDuplicateRole.Data && checkDuplicateRole.Data.length > 0) {
                    userDTO.StatusCode = ERROR_CODES.INVALID_DATA;
                } else {
                    userDTO.StatusCode = ERROR_CODES.OK;
                }
            } else {
                userDTO.StatusCode = checkDuplicateRole.StatusCode;
                userDTO.StatusMessage = checkDuplicateRole.StatusMessage;
            }
        } else {
            userDTO.StatusCode = ERROR_CODES.INVALID_DATA;
        }
        return userDTO;
    }

    /**
     * Get role id from role name
     * @param roleName 
     * @returns baseDTO
     */
    private GetRoleIDFromNameAsync = async (roleName: string) => {
        let baseDTO = new BaseDTO();
        let roleResult = await RunQuery(
            `SELECT RoleID
            FROM Roles
            WHERE RoleName = '${roleName}' 
            LIMIT 1`
        );
        if (roleResult.StatusCode == ERROR_CODES.OK) {
            if (roleResult.Data && roleResult.Data.length > 0) {
                baseDTO.Data = roleResult.Data[0];
                baseDTO.StatusCode = ERROR_CODES.OK
            } else {
                baseDTO.StatusCode = ERROR_CODES.INVALID_DATA;
            }
        } else {
            baseDTO.StatusCode = roleResult.StatusCode;
            baseDTO.StatusMessage = roleResult.StatusMessage;
        }
        return baseDTO;
    }

    /**
     * verify user exist in system or not
     * @param userDTO 
     * @return baseDTO 
     */
    private VerifyUserAsync = async (userDTO: UserDTO) => {
        if (userDTO.VerifyUser) {
            let checkResult = await RunQuery(
                `SELECT AccountPassword, ActivationStatus, IsTwoFactorAuthenticationDone
                FROM Users 
                WHERE Phone = '${userDTO.VerifyUser.Phone}' AND IsActive = ${BOOLEAN_STATUS.STATUS_TRUE} 
                LIMIT 1`
            );
            if (checkResult.StatusCode == ERROR_CODES.OK) {
                if (checkResult.Data && checkResult.Data.length > 0 && userDTO.VerifyUser.AccountPassword && checkResult.Data[0].AccountPassword && checkResult.Data[0].ActivationStatus && checkResult.Data[0].IsTwoFactorAuthenticationDone && await brcypt.compare(userDTO.VerifyUser.AccountPassword, checkResult.Data[0].AccountPassword)) {
                    userDTO.StatusCode = ERROR_CODES.OK;
                } else {
                    userDTO.StatusCode = ERROR_CODES.INVALID_DATA;
                }
            } else {
                userDTO.StatusCode = checkResult.StatusCode;
                userDTO.StatusMessage = checkResult.StatusMessage;
            }
        } else {
            userDTO.StatusCode = ERROR_CODES.INVALID_DATA;
        }
        return userDTO;
    }

    /**
     * get user data after login
     * @param userDTO 
     * @return userDTO 
     */
    private GetUserIDAsync = async (userDTO: UserDTO) => {
        userDTO.StatusCode = ERROR_CODES.INVALID_DATA;
        if (userDTO.VerifyUser) {
            let userResult = await RunQuery(
                `SELECT UserID, ActivationStatus, IsTwoFactorAuthenticationDone
                FROM Users 
                WHERE Phone = '${userDTO.VerifyUser.Phone}' AND IsActive = ${BOOLEAN_STATUS.STATUS_TRUE} 
                LIMIT 1`
            );
            if (userResult.StatusCode == ERROR_CODES.OK) {
                if (userResult.Data && userResult.Data.length > 0) {
                    if (userResult.Data[0].ActivationStatus && userResult.Data[0].IsTwoFactorAuthenticationDone) {
                        userDTO.User = new UserModel();
                        userDTO.User.UserID = userResult.Data[0].UserID;
                        userDTO.StatusCode = ERROR_CODES.OK;
                    }
                }
            } else {
                userDTO.StatusCode = userResult.StatusCode;
                userDTO.StatusMessage = userResult.StatusMessage;
            }
        }
        return userDTO;
    }

    /**
     * verify user exist in system or not
     * @param userDTO 
     * @return baseDTO 
     */
    private CheckUserExistsAsync = async (userDTO: UserDTO) => {
        if (userDTO.VerifyUser) {
            let checkResult = await RunQuery(
                `SELECT UserID
                FROM Users 
                WHERE Phone = '${userDTO.VerifyUser.Phone}' AND IsActive = ${BOOLEAN_STATUS.STATUS_TRUE} 
                LIMIT 1`
            );
            if (checkResult.StatusCode == ERROR_CODES.OK) {
                if (checkResult.Data && checkResult.Data.length > 0) {
                    userDTO.StatusCode = ERROR_CODES.ACCOUNT_EXISTS;
                } else {
                    userDTO.StatusCode = ERROR_CODES.NO_ACCOUNT_FOUND;
                }
            } else {
                userDTO.StatusCode = checkResult.StatusCode;
                userDTO.StatusMessage = checkResult.StatusMessage;
            }
        } else {
            userDTO.StatusCode = ERROR_CODES.INVALID_DATA;
        }
        return userDTO;
    }

    /**
     * save the user password
     * @param userDTO
     * @param apiType
     * @return userDTO 
     */
    private SaveNewPasswordAsync = async (userDTO: UserDTO) => {
        if (userDTO.VerifyUser) {
            let accountResult = await RunQuery(
                `UPDATE Users
                SET AccountPassword = '${userDTO.VerifyUser.AccountPassword}'
                WHERE Phone = '${userDTO.VerifyUser.Phone}'
                LIMIT 1`
            );
            userDTO.StatusCode = accountResult.StatusCode;
            userDTO.StatusMessage = accountResult.StatusMessage;
        } else {
            userDTO.StatusCode = ERROR_CODES.INVALID_DATA;
        }
        return userDTO;
    }
}