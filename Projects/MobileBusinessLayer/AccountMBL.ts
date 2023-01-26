import { ERROR_CODES, USER_ROUTES, API_METHODS, TOKEN_STATUS_CONSTANTS, MOBILE_CONFIG, SIGNUP_API_CONSTANTS } from "utility";
import { ServiceApiDTO, UserDTO } from "datamodels";
import CommonMBL from "./CommonMBL";

export default class AccountMBL extends CommonMBL {

    /**
     * verify user for sign up
     * @param userDTO
     * @returns operation status
     */
    public VerifySignUpUserAsync = async (userDTO: UserDTO) => {
        try {
            let serviceApiDTO = new ServiceApiDTO();
            serviceApiDTO.Service = {
                Method: API_METHODS.POST,
                Api: USER_ROUTES.VERIFY_SIGNUP_USER,
                Header: {},
                Body: { user: userDTO }
            }
            serviceApiDTO = await this.CallServiceApiAsync(serviceApiDTO);
            userDTO.StatusCode = serviceApiDTO.StatusCode;
        } catch (error) {
            userDTO.StatusCode = ERROR_CODES.DATA_SAVE_ERROR;
            await this.LogCatchErrorAsync(error as Error);
        }
        return userDTO;
    }

    /**
     * sign up for account registration
     * @param userDTO
     * @returns operation status
     */
    public SignUpAsync = async (userDTO: UserDTO) => {
        try {
            let serviceApiDTO = new ServiceApiDTO();
            let formData = new FormData();
            formData.append(SIGNUP_API_CONSTANTS.USER, JSON.stringify(userDTO.User));
            if (userDTO.Files.UserPhoto) {
                formData.append(SIGNUP_API_CONSTANTS.USER_PHOTO, userDTO.Files.UserPhoto);
            }
            formData.append(SIGNUP_API_CONSTANTS.KYC_DOCUMENT, userDTO.Files.KycDocument);
            serviceApiDTO.Service = {
                Method: API_METHODS.POST,
                Api: USER_ROUTES.SIGN_UP,
                Header: {},
                Body: formData
            }
            serviceApiDTO = await this.CallServiceApiAsync(serviceApiDTO);
            userDTO.StatusCode = serviceApiDTO.StatusCode;
        } catch (error) {
            userDTO.StatusCode = ERROR_CODES.DATA_SAVE_ERROR;
            await this.LogCatchErrorAsync(error as Error);
        }
        return userDTO;
    }

    /**
     * verify user for login
     * @param userDTO
     * @returns operation status
     */
    public VerifySignInUserAsync = async (userDTO: UserDTO) => {
        try {
            let serviceApiDTO = new ServiceApiDTO();
            serviceApiDTO.Service = {
                Method: API_METHODS.POST,
                Api: USER_ROUTES.VERIFY_LOGIN,
                Header: {},
                Body: { user: userDTO }
            }
            serviceApiDTO = await this.CallServiceApiAsync(serviceApiDTO);
            userDTO.StatusCode = serviceApiDTO.StatusCode;
        } catch (error) {
            userDTO.StatusCode = ERROR_CODES.DATA_RETRIEVAL_ERROR;
            await this.LogCatchErrorAsync(error as Error);
        }
        return userDTO;
    }

    /**
     * user login api
     * @param userDTO
     * @returns operation status
     */
    public SignInAsync = async (userDTO: UserDTO) => {
        try {
            let serviceApiDTO = new ServiceApiDTO();
            serviceApiDTO.Service = {
                Method: API_METHODS.POST,
                Api: USER_ROUTES.LOGIN,
                Header: await this.GetApiHeadersAsync(),
                Body: { user: userDTO }
            }
            serviceApiDTO = await this.CallServiceApiAsync(serviceApiDTO);
            userDTO.StatusCode = serviceApiDTO.StatusCode;
            if (serviceApiDTO.StatusCode == ERROR_CODES.OK) {
                userDTO = await this.SaveUserDataAsync(userDTO, serviceApiDTO);
            } else {
                await this.SaveValueInStorageAsync(MOBILE_CONFIG.TOKEN_STATUS, TOKEN_STATUS_CONSTANTS.EXPIRED);
            }
        } catch (error) {
            userDTO.StatusCode = ERROR_CODES.DATA_RETRIEVAL_ERROR;
            await this.LogCatchErrorAsync(error as Error);
        }
        return userDTO;
    }

    /**
     * forgot password api
     * @param userDTO
     * @returns operation status
     */
    public ForgotPasswordAsync = async (userDTO: UserDTO) => {
        try {
            if (userDTO.VerifyUser) {
                let serviceApiDTO = new ServiceApiDTO();
                serviceApiDTO.Service = {
                    Method: API_METHODS.POST,
                    Api: USER_ROUTES.FORGOT_PASSWORD,
                    Header: {},
                    Body: { phone: userDTO.VerifyUser.Phone }
                }
                serviceApiDTO = await this.CallServiceApiAsync(serviceApiDTO);
                userDTO.StatusCode = serviceApiDTO.StatusCode;
            }
        } catch (error) {
            userDTO.StatusCode = ERROR_CODES.DATA_RETRIEVAL_ERROR;
            await this.LogCatchErrorAsync(error as Error);
        }
        return userDTO;
    }

    /**
     * validate otp for forgot password
     * @param userDTO
     * @returns operation status
     */
    public ValidateOtpAsync = async (userDTO: UserDTO) => {
        try {
            let serviceApiDTO = new ServiceApiDTO();
            serviceApiDTO.Service = {
                Method: API_METHODS.POST,
                Api: USER_ROUTES.VALIDATE_OTP,
                Header: {},
                Body: { user: userDTO }
            }
            serviceApiDTO = await this.CallServiceApiAsync(serviceApiDTO);
            userDTO.StatusCode = serviceApiDTO.StatusCode;
        } catch (error) {
            userDTO.StatusCode = ERROR_CODES.DATA_RETRIEVAL_ERROR;
            await this.LogCatchErrorAsync(error as Error);
        }
        return userDTO;
    }

    /**
     * validate otp and change password
     * @param userDTO
     * @returns operation status
     */
    public ChangePaswordAsync = async (userDTO: UserDTO) => {
        try {
            let serviceApiDTO = new ServiceApiDTO();
            serviceApiDTO.Service = {
                Method: API_METHODS.POST,
                Api: USER_ROUTES.CHANGE_PASSWORD,
                Header: {},
                Body: { user: userDTO }
            }
            serviceApiDTO = await this.CallServiceApiAsync(serviceApiDTO);
            userDTO.StatusCode = serviceApiDTO.StatusCode;
        } catch (error) {
            userDTO.StatusCode = ERROR_CODES.DATA_SAVE_ERROR;
            await this.LogCatchErrorAsync(error as Error);
        }
        return userDTO;
    }

    /**
     * save user data after login
     * @param userDTO
     * @param serviceApiDTO
     * @returns operation status
     */
    private SaveUserDataAsync = async (userDTO: UserDTO, serviceApiDTO: ServiceApiDTO) => {
        if (serviceApiDTO.Data.AccessToken && serviceApiDTO.Data.RefreshToken) {
            await this.SaveValueInStorageAsync(MOBILE_CONFIG.ACCESS_TOKEN, serviceApiDTO.Data.AccessToken);
            await this.SaveValueInStorageAsync(MOBILE_CONFIG.REFRESH_TOKEN, serviceApiDTO.Data.RefreshToken);
            await this.SaveValueInStorageAsync(MOBILE_CONFIG.TOKEN_STATUS, TOKEN_STATUS_CONSTANTS.ALIVE);
        } else {
            userDTO.StatusCode = ERROR_CODES.INVALID_DATA;
        }
        return userDTO;
    }
}