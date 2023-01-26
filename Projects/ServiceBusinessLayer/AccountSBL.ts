import { BaseDTO, ContextDTO, UserDTO, UserModel, VerifyUserModel } from "datamodels";
import { ERROR_CODES, SETTING_CONSTANTS, PASSWORD_HASH_SALT, VALIDATION_DATA_VARIABLES, RESOURCE_GROUPS, ACCOUNT_API_TYPES, FILE_BUCKET_TYPES, SMS_TEMPLATE, SMS_CONSTANTS, GenerateRandomNumber, AddSecondsToDate, GenerateUUID, ValidatePhoneNumber, ValidateEmail, ValidatePassword } from "utility";
import { AccountSDL } from "servicedatalayer";
import express from "express";
import CommonSBL from "./CommonSBL";
import AuthenticationSBL from "./AuthenticationSBL";
import brcypt from "bcryptjs";
import { SmsServiceES, StorageServiceES } from "externalservices";
import multer from "multer";

type ValueOf<T> = T[keyof T];
export default class AccountSBL extends CommonSBL {

    /**
     * Verify user for sign up
     * @param req 
     * @param res 
     * @returns api status
     */
    public VerifySignUpUserAsync = async (req: express.Request, res: express.Response) => {
        let userDTO = req.body.user ? req.body.user : new UserDTO();
        try {
            if (userDTO.VerifyUser) {
                userDTO = await this.VerifyUserAsync(userDTO);
                if (userDTO.StatusCode != ERROR_CODES.OK && userDTO.StatusMessage) {
                    throw new Error(this.CreateErrorMessage(userDTO));
                }
            } else {
                userDTO.StatusCode = ERROR_CODES.INVALID_DATA;
            }
        } catch (error) {
            userDTO.StatusCode = ERROR_CODES.DATA_RETRIEVAL_ERROR;
            await this.LogCatchErrorAsync(error as Error);
        } finally {
            userDTO.VerifyUser = new VerifyUserModel();
            userDTO = this.ResetApiData(userDTO);
            res.status(ERROR_CODES.OK).send(userDTO);
        }
    }

    /**
     * Sign up for account registration
     * @param req 
     * @param res 
     * @returns status
     */
    public SignUpAsync = async (req: express.Request, res: express.Response) => {
        let userDTO = new UserDTO();
        try {
            userDTO.User = req.body.user ? JSON.parse(req.body.user) : {};
            userDTO.Files = req.files ? req.files : null;
            if (userDTO.User && userDTO.Files) {
                userDTO = await this.ValidateSignUpUserAsync(userDTO);
                if (userDTO.StatusCode == ERROR_CODES.OK) {
                    userDTO = await this.SignUpUserAsync(userDTO);
                }
                if (userDTO.StatusCode != ERROR_CODES.OK && userDTO.StatusMessage) {
                    throw new Error(this.CreateErrorMessage(userDTO));
                }
            } else {
                userDTO.StatusCode = ERROR_CODES.INVALID_DATA;
            }
        } catch (error) {
            userDTO.StatusCode = ERROR_CODES.DATA_SAVE_ERROR;
            await this.LogCatchErrorAsync(error as Error);
        } finally {
            userDTO.User = new UserModel();
            userDTO = this.ResetApiData(userDTO);
            res.status(ERROR_CODES.OK).send(userDTO);
        }
    }

    /**
     * Verify the user for sign in
     * @param req 
     * @param res 
     * @returns user details
     */
    public VerifyLoginUserAsync = async (req: express.Request, res: express.Response) => {
        let userDTO = req.body.user ? req.body.user : new UserDTO();
        try {
            if (userDTO.VerifyUser) {
                userDTO = await this.LoginUserVerificationAsync(userDTO);
                if (userDTO.StatusCode != ERROR_CODES.OK && userDTO.StatusMessage) {
                    throw new Error(this.CreateErrorMessage(userDTO));
                }
            } else {
                userDTO.StatusCode = ERROR_CODES.INVALID_DATA;
            }
        } catch (error) {
            userDTO.StatusCode = ERROR_CODES.DATA_RETRIEVAL_ERROR;
            await this.LogCatchErrorAsync(error as Error);
        } finally {
            userDTO.VerifyUser = new VerifyUserModel();
            userDTO = this.ResetApiData(userDTO);
            res.status(ERROR_CODES.OK).send(userDTO);
        }
    }

    /**
     * Verify the user and sign in
     * @param req 
     * @param res 
     * @returns user details
     */
    public LoginAsync = async (req: express.Request, res: express.Response) => {
        let userDTO = req.body.user ? req.body.user : new UserDTO();
        try {
            let contextDTO = new ContextDTO();
            contextDTO = this.CreateContextData(contextDTO, req);
            if (userDTO.VerifyUser && contextDTO) {
                userDTO = await this.ValidateLoginAsync(userDTO, contextDTO);
                if (userDTO.StatusCode == ERROR_CODES.OK) {
                    userDTO = await this.LoginUserAsync(userDTO, contextDTO);
                }
                if (userDTO.StatusCode != ERROR_CODES.OK && userDTO.StatusMessage) {
                    throw new Error(this.CreateErrorMessage(userDTO));
                }
            } else {
                userDTO.StatusCode = ERROR_CODES.INVALID_DATA;
            }
        } catch (error) {
            userDTO.StatusCode = ERROR_CODES.DATA_RETRIEVAL_ERROR;
            await this.LogCatchErrorAsync(error as Error);
        } finally {
            userDTO.VerifyUser = new VerifyUserModel();
            userDTO.User = new UserModel();
            userDTO = this.ResetApiData(userDTO);
            res.status(ERROR_CODES.OK).send(userDTO);
        }
    }

    /**
     * Forgot password api
     * @param req 
     * @param res 
     * @returns user details
     */
    public ForgotPasswordAsync = async (req: express.Request, res: express.Response) => {
        let userDTO = new UserDTO();
        try {
            userDTO.VerifyUser = new VerifyUserModel();
            userDTO.VerifyUser.Phone = req.body.phone ? req.body.phone : "";
            if (userDTO.VerifyUser) {
                userDTO = await this.CheckUserExistsAsync(userDTO);
                if (userDTO.StatusCode != ERROR_CODES.OK && userDTO.StatusMessage) {
                    throw new Error(this.CreateErrorMessage(userDTO));
                }
            } else {
                userDTO.StatusCode = ERROR_CODES.INVALID_DATA;
            }
        } catch (error) {
            userDTO.StatusCode = ERROR_CODES.DATA_RETRIEVAL_ERROR;
            await this.LogCatchErrorAsync(error as Error);
        } finally {
            userDTO.VerifyUser = new VerifyUserModel();
            userDTO = this.ResetApiData(userDTO);
            res.status(ERROR_CODES.OK).send(userDTO);
        }
    }

    /**
     * Validate otp for forgot password
     * @param req 
     * @param res 
     * @returns user details
     */
    public ValidateOtpAsync = async (req: express.Request, res: express.Response) => {
        let userDTO = req.body.user ? req.body.user : new UserDTO();
        try {
            if (userDTO.VerifyUser && userDTO.VerifyUser.UserOtp) {
                userDTO = await this.VerifyUserOtpAsync(userDTO);
                if (userDTO.StatusCode != ERROR_CODES.OK && userDTO.StatusMessage) {
                    throw new Error(this.CreateErrorMessage(userDTO));
                }
            } else {
                userDTO.StatusCode = ERROR_CODES.INVALID_DATA;
            }
        } catch (error) {
            userDTO.StatusCode = ERROR_CODES.DATA_SAVE_ERROR;
            await this.LogCatchErrorAsync(error as Error);
        } finally {
            userDTO.VerifyUser = new VerifyUserModel();
            userDTO = this.ResetApiData(userDTO);
            res.status(ERROR_CODES.OK).send(userDTO);
        }
    }

    /**
     * Change password
     * @param req 
     * @param res 
     * @returns user details
     */
    public ChangePasswordAsync = async (req: express.Request, res: express.Response) => {
        let userDTO = req.body.user ? req.body.user : new UserDTO();
        try {
            if (userDTO.VerifyUser && userDTO.VerifyUser.UserOtp) {
                userDTO = await this.VerifyAndChangePasswordAsync(userDTO);
                if (userDTO.StatusCode != ERROR_CODES.OK && userDTO.StatusMessage) {
                    throw new Error(this.CreateErrorMessage(userDTO));
                }
            } else {
                userDTO.StatusCode = ERROR_CODES.INVALID_DATA;
            }
        } catch (error) {
            userDTO.StatusCode = ERROR_CODES.DATA_SAVE_ERROR;
            await this.LogCatchErrorAsync(error as Error);
        } finally {
            userDTO.VerifyUser = new VerifyUserModel();
            userDTO.User = new UserModel();
            userDTO = this.ResetApiData(userDTO);
            res.status(ERROR_CODES.OK).send(userDTO);
        }
    }

    /**
     * Verify for sign up
     * @param userDTO 
     * @returns userDTO
     */
    private VerifyUserAsync = async (userDTO: UserDTO) => {
        userDTO = await this.ValidateUserLoginDataAsync(userDTO, ACCOUNT_API_TYPES.VERIFY_USER);
        if (userDTO.StatusCode == ERROR_CODES.OK) {
            userDTO = await this.GenerateOtpAsync(userDTO, ACCOUNT_API_TYPES.VERIFY_USER);
            if (userDTO.StatusCode == ERROR_CODES.OK) {
                userDTO = await new AccountSDL().VerifySignUpUserAsync(userDTO);
                if (userDTO.StatusCode == ERROR_CODES.OK && userDTO.VerifyUser) {
                    if (await new SmsServiceES().SendSMSAsync(userDTO.VerifyUser.Phone, SMS_TEMPLATE.USER_LOGIN.replace(SMS_CONSTANTS.USER_OTP, `${userDTO.VerifyUser.UserOtp} | ${userDTO.VerifyUser.AdminOtp}`)) === false) {
                        userDTO.StatusCode = ERROR_CODES.SMS_SENDING_FAILED;
                    }
                }
            }
        }
        return userDTO;
    }

    /**
     * Validation for user verification
     * @param userDTO 
     * @param apiType 
     * @returns userDTO
     */
    private ValidateUserLoginDataAsync = async (userDTO: UserDTO, apiType: ValueOf<typeof ACCOUNT_API_TYPES>) => {
        userDTO.StatusCode = ERROR_CODES.INVALID_DATA;
        let userData = apiType == ACCOUNT_API_TYPES.SIGN_UP ? userDTO.User : userDTO.VerifyUser;
        if (userData) {
            let baseDTO: BaseDTO = await this.GetSettingValueAsync(`'${SETTING_CONSTANTS.PHONE_NO_REGEX}', '${SETTING_CONSTANTS.EMAIL_REGEX}', '${SETTING_CONSTANTS.PASSWORD_REGEX}'`);
            if (baseDTO.StatusCode == ERROR_CODES.OK) {
                if (baseDTO.Data && this.ValidateUser(userData, baseDTO.Data, apiType)) {
                    userDTO.StatusCode = ERROR_CODES.OK;
                }
            }
        }
        return userDTO;
    }

    /**
     * Validation of user
     * @param userData 
     * @param settingData 
     * @param apiType 
     * @returns validation status
     */
    private ValidateUser = (userData: UserModel | VerifyUserModel, settingData: any, apiType: ValueOf<typeof ACCOUNT_API_TYPES>) => {
        if (userData.Phone && ValidatePhoneNumber(userData.Phone, settingData[SETTING_CONSTANTS.PHONE_NO_REGEX])) {
            if (userData.Email && !ValidateEmail(userData.Email, settingData[SETTING_CONSTANTS.EMAIL_REGEX])) {
                return false;
            }
            if (apiType == ACCOUNT_API_TYPES.VERIFY_LOGIN || apiType == ACCOUNT_API_TYPES.LOGIN || apiType == ACCOUNT_API_TYPES.CHANGE_PASSWORD) {
                if (userData.AccountPassword && ValidatePassword(userData.AccountPassword, settingData[SETTING_CONSTANTS.PASSWORD_REGEX])) {
                    return true;
                }
            } else {
                return true;
            }
        }
        return false;
    }

    /**
     * generate opt for login and registration
     * @param userDTO 
     * @param apiType 
     * @returns userDTO
     */
    private GenerateOtpAsync = async (userDTO: UserDTO, apiType: ValueOf<typeof ACCOUNT_API_TYPES>) => {
        userDTO.StatusCode = ERROR_CODES.INVALID_DATA;
        if (userDTO.VerifyUser) {
            let baseDTO: BaseDTO = await this.GetSettingValueAsync(`'${SETTING_CONSTANTS.SMS_LENGTH}', '${SETTING_CONSTANTS.OTP_EXPIRY_TIME}'`);
            if (baseDTO.StatusCode == ERROR_CODES.OK) {
                if (baseDTO.Data) {
                    userDTO.VerifyUser.UserOtp = GenerateRandomNumber(baseDTO.Data[SETTING_CONSTANTS.SMS_LENGTH]);
                    userDTO.VerifyUser.OtpValidTill = AddSecondsToDate(baseDTO.Data[SETTING_CONSTANTS.OTP_EXPIRY_TIME]);
                    if (apiType == ACCOUNT_API_TYPES.VERIFY_USER) {
                        userDTO.VerifyUser.AdminOtp = GenerateRandomNumber(baseDTO.Data[SETTING_CONSTANTS.SMS_LENGTH]);
                    } else {
                        userDTO.VerifyUser.AdminOtp = 0;
                    }
                    userDTO.StatusCode = ERROR_CODES.OK;
                }
            }
        }
        return userDTO;
    }

    /**
     * Verify sign up user
     * @param userDTO 
     * @returns userDTO
     */
    private ValidateSignUpUserAsync = async (userDTO: UserDTO) => {
        if (userDTO.User && userDTO.User.UserOtp && userDTO.User.AdminOtp) {
            userDTO = await this.ValidateUserLoginDataAsync(userDTO, ACCOUNT_API_TYPES.SIGN_UP);
            if (userDTO.StatusCode == ERROR_CODES.OK) {
                userDTO.GroupIDs = `${RESOURCE_GROUPS.USER}`;
                if (userDTO.User && await this.ValidateDataAsync(userDTO, VALIDATION_DATA_VARIABLES.USER)) {
                    userDTO.StatusCode = ERROR_CODES.OK;
                } else {
                    userDTO.StatusCode = ERROR_CODES.INVALID_DATA;
                }
            }
        } else {
            userDTO.StatusCode = ERROR_CODES.INVALID_DATA;
        }
        return userDTO;
    }

    /**
     * Register new user
     * @param userDTO 
     * @returns userDTO
     */
    private SignUpUserAsync = async (userDTO: UserDTO) => {
        userDTO.StatusCode = ERROR_CODES.INVALID_DATA;
        if (userDTO.User && userDTO.Files && userDTO.Files.KycDocument) {
            let accountSDL = new AccountSDL();
            userDTO.User.UserID = GenerateUUID();
            if (userDTO.Files.UserPhoto) {
                userDTO.User.UserPhoto = this.GenerateFileName(userDTO.Files.UserPhoto.name, userDTO.User.UserID, FILE_BUCKET_TYPES.PROFILE_IMAGES);
            }
            userDTO.User.KycDocument = this.GenerateFileName(userDTO.Files.KycDocument.name, userDTO.User.UserID, FILE_BUCKET_TYPES.KYC_DOCUMENTS);
            userDTO.User.ActivationStatus = true;
            userDTO.User.IsTwoFactorAuthenticationDone = true;
            userDTO.User.AccountPassword = await this.EncryptUserPasswordAsync(userDTO.User.AccountPassword);
            if (userDTO.User.AccountPassword) {
                userDTO = await accountSDL.SignUpUserAsync(userDTO);
                if (userDTO.StatusCode == ERROR_CODES.OK) {
                    userDTO = await this.UploadUserDocuments(userDTO);
                    if (userDTO.StatusCode != ERROR_CODES.OK) {
                        userDTO = await accountSDL.DeleteUserAccount(userDTO);
                    }
                }
            }
        }
        return userDTO;
    }

    /**
     * encrypt password
     * @param password 
     * @returns encrypted password
     */
    private EncryptUserPasswordAsync = async (password: string) => {
        let encryptedPassword: string = "";
        if (password) {
            encryptedPassword = await brcypt.hash(password, PASSWORD_HASH_SALT);
        }
        return encryptedPassword;
    }

    /**
     * Upload user documents
     * @param userDTO 
     * @returns userDTO
     */
    private UploadUserDocuments = async (userDTO: UserDTO) => {
        //Discuss: Kycdocument resource key required changed
        if (userDTO.User && userDTO.Files && userDTO.Files.KycDocument) {
            let storageServiceES = new StorageServiceES();
            if (userDTO.Files.UserPhoto) {
                let profileStatus = await storageServiceES.UploadFileAsync(userDTO.Files.UserPhoto, userDTO.User.UserPhoto, FILE_BUCKET_TYPES.PROFILE_IMAGES);
                if (!profileStatus.Location) {
                    userDTO.StatusCode = ERROR_CODES.FILE_UPLOAD_ERROR;
                }
            }
            let kycStatus = await storageServiceES.UploadFileAsync(userDTO.Files.KycDocument, userDTO.User.KycDocument, FILE_BUCKET_TYPES.KYC_DOCUMENTS);
            if (!kycStatus.Location) {
                userDTO.StatusCode = ERROR_CODES.FILE_UPLOAD_ERROR;
            }
        } else {
            userDTO.StatusCode = ERROR_CODES.INVALID_DATA;
        }
        return userDTO;
    }

    /**
     * Verify user and generate otp
     * @param userDTO 
     * @returns userDTO
     */
    private LoginUserVerificationAsync = async (userDTO: UserDTO) => {
        userDTO = await this.ValidateUserLoginDataAsync(userDTO, ACCOUNT_API_TYPES.VERIFY_LOGIN);
        if (userDTO.StatusCode == ERROR_CODES.OK) {
            userDTO = await this.GenerateOtpAsync(userDTO, ACCOUNT_API_TYPES.VERIFY_LOGIN);
            if (userDTO.StatusCode == ERROR_CODES.OK) {
                userDTO = await new AccountSDL().VerifyLoginUserAsync(userDTO);
                if (userDTO.StatusCode == ERROR_CODES.OK && userDTO.VerifyUser) {
                    if (await new SmsServiceES().SendSMSAsync(userDTO.VerifyUser.Phone, SMS_TEMPLATE.USER_LOGIN.replace(SMS_CONSTANTS.USER_OTP, `${userDTO.VerifyUser.UserOtp}`)) === false) {
                        userDTO.StatusCode = ERROR_CODES.SMS_SENDING_FAILED;
                    }
                }
            }
        }
        return userDTO;
    }

    /**
     * Verify otp and login user
     * @param userDTO 
     * @param contextDTO 
     * @returns userDTO
     */
    private ValidateLoginAsync = async (userDTO: UserDTO, contextDTO: ContextDTO) => {
        if (this.ValidateHeaderData(contextDTO) && userDTO.VerifyUser && userDTO.VerifyUser.UserOtp) {
            userDTO = await this.ValidateUserLoginDataAsync(userDTO, ACCOUNT_API_TYPES.LOGIN);
            if (userDTO.StatusCode == ERROR_CODES.OK) {
                userDTO.GroupIDs = `${RESOURCE_GROUPS.USER}`;
                userDTO.StatusCode = await this.ValidateDataAsync(userDTO, VALIDATION_DATA_VARIABLES.VERIFY_USER) ? ERROR_CODES.OK : ERROR_CODES.INVALID_DATA;
            }
        } else {
            userDTO.StatusCode = ERROR_CODES.INVALID_DATA;
        }
        return userDTO;
    }

    /**
     * Verify otp and login user
     * @param userDTO 
     * @param contextDTO 
     * @returns userDTO
     */
    private LoginUserAsync = async (userDTO: UserDTO, contextDTO: ContextDTO) => {
        userDTO = await new AccountSDL().LoginUserAsync(userDTO);
        if (userDTO.StatusCode == ERROR_CODES.OK) {
            if (userDTO.User) {
                contextDTO.LoggedInUserID = userDTO.User.UserID;
                contextDTO = await new AuthenticationSBL().GenerateUserSessionAsync(contextDTO);
                userDTO.StatusCode = contextDTO.StatusCode;
                if (contextDTO.StatusCode == ERROR_CODES.OK) {
                    userDTO.AccessToken = contextDTO.AccessToken;
                    userDTO.RefreshToken = contextDTO.RefreshToken;
                }
            } else {
                userDTO.StatusCode = ERROR_CODES.INVALID_DATA;
            }
        }
        return userDTO;
    }

    /**
     * Check account exists and send otp
     * @param userDTO 
     * @returns userDTO
     */
    private CheckUserExistsAsync = async (userDTO: UserDTO) => {
        userDTO = await this.ValidateUserLoginDataAsync(userDTO, ACCOUNT_API_TYPES.FORGOT_PASSWORD);
        if (userDTO.StatusCode == ERROR_CODES.OK) {
            userDTO = await this.GenerateOtpAsync(userDTO, ACCOUNT_API_TYPES.FORGOT_PASSWORD);
            if (userDTO.StatusCode == ERROR_CODES.OK) {
                userDTO = await new AccountSDL().VerifyUserAccountAsync(userDTO);
                if (userDTO.StatusCode == ERROR_CODES.OK && userDTO.VerifyUser) {
                    if (await new SmsServiceES().SendSMSAsync(userDTO.VerifyUser.Phone, SMS_TEMPLATE.USER_LOGIN.replace(SMS_CONSTANTS.USER_OTP, `${userDTO.VerifyUser.UserOtp}`)) === false) {
                        userDTO.StatusCode = ERROR_CODES.SMS_SENDING_FAILED;
                    }
                }
            }
        }
        return userDTO;
    }

    /**
     * Verify user and otp
     * @param userDTO 
     * @returns userDTO
     */
    private VerifyUserOtpAsync = async (userDTO: UserDTO) => {
        userDTO = await this.ValidateUserLoginDataAsync(userDTO, ACCOUNT_API_TYPES.FORGOT_PASSWORD);
        if (userDTO.StatusCode == ERROR_CODES.OK) {
            userDTO = await new AccountSDL().VerifyOtpAsync(userDTO);
        }
        return userDTO;
    }

    /**
     * Verify user and change password
     * @param userDTO 
     * @returns userDTO
     */
    private VerifyAndChangePasswordAsync = async (userDTO: UserDTO) => {
        userDTO = await this.ValidateUserLoginDataAsync(userDTO, ACCOUNT_API_TYPES.CHANGE_PASSWORD);
        if (userDTO.StatusCode == ERROR_CODES.OK && userDTO.VerifyUser) {
            userDTO.VerifyUser.AccountPassword = await this.EncryptUserPasswordAsync(userDTO.VerifyUser.AccountPassword);
            if (userDTO.VerifyUser.AccountPassword) {
                //Discuss: otp expired
                userDTO = await new AccountSDL().ChangePasswordAsync(userDTO);
                if (userDTO.StatusCode == ERROR_CODES.OK) {
                    if (userDTO.User) {
                        let contextDTO = new ContextDTO();
                        contextDTO.LoggedInUserID = userDTO.User.UserID;
                        contextDTO = await new AuthenticationSBL().DeleteUserSessionsAsync(contextDTO);
                        userDTO.StatusCode = contextDTO.StatusCode;
                    } else {
                        userDTO.StatusCode = ERROR_CODES.INVALID_DATA;
                    }
                }
            } else {
                userDTO.StatusCode = ERROR_CODES.INVALID_DATA;
            }
        }
        return userDTO;
    }
}