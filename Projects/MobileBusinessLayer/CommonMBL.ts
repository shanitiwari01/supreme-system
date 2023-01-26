import { CommonMDL } from "mobiledatalayer";
import EncryptedStorage from "react-native-encrypted-storage";
import { MOBILE_CONFIG, GLOBAL_API, ERROR_CODES, API_METHODS, API_HEADER_TOKEN, TOKEN_STATUS_CONSTANTS, CHECK_TOKEN_STATUS_INTERVAL, AUTH_ROUTES, PLATFORM } from "utility";
import Axios from "axios";
import NetInfo from "@react-native-community/netinfo";
import { BaseDTO, ServiceApiDTO, ResourceDTO, ApiHeaderModel } from "datamodels";
import DeviceInfo from "react-native-device-info";

type ValueOf<T> = T[keyof T];
export default class CommonMBL {

    /**
     * get saved language id
     * @returns language id
     */
    public GetLanguageIDAsync = async () => {
        let languageID = await this.GetNumberValueFromStorageAsync(MOBILE_CONFIG.LANGUAGE_ID);
        return languageID ? languageID : 0;
    }

    /**
     * Check internet connection
     * @returns boolean
     */
    public IsNetConnectedAsync = async () => {
        let netFlag = false;
        await NetInfo.fetch().then((state: { isConnected: any; }) => {
            netFlag = state.isConnected;
        });
        return netFlag;
    }

    /**
     * get value from async storage and convert it into string
     * @param name
     * @returns value in string
     */
    public GetStringValueFromStorageAsync = async (name: string) => {
        let value = await EncryptedStorage.getItem(name);
        return value ? value : null;
    }

    /**
     * get value from async storage and convert it into boolean
     * @param name
     * @returns value in boolean
     */
    public GetBooleanValueFromStorageAsync = async (name: string) => {
        let value = await this.GetStringValueFromStorageAsync(name);
        return value ? !!+value : null;
    }

    /**
     * get value from async storage and convert it into number
     * @param name
     * @returns value in number
     */
    public GetNumberValueFromStorageAsync = async (name: string) => {
        let value = await this.GetStringValueFromStorageAsync(name);
        return value ? +value : null;
    }

    /**
     * store value in async storage
     * @param name 
     * @param value 
     */
    public SaveValueInStorageAsync = async (name: string, value: string) => {
        await EncryptedStorage.setItem(name, value);
    }

    /**
     * remove value in async storage
     * @param name 
     */
    public RemoveValueInStorageAsync = async (name: string) => {
        await EncryptedStorage.removeItem(name);
    }

    /**
     * Get setting value
     * @param settingKeys 
     * @returns baseDTO setting value
     */
    public GetSettingValueAsync = async (settingKeys: string) => {
        let baseDTO = new BaseDTO();
        try {
            baseDTO.Keys = settingKeys;
            baseDTO = await new CommonMDL().GetSettingValueAsync(baseDTO);
            if (baseDTO.StatusCode != ERROR_CODES.OK) {
                throw new Error(this.CreateErrorMessage(baseDTO));
            }
        } catch (error) {
            baseDTO.StatusCode = ERROR_CODES.DATA_RETRIEVAL_ERROR;
            await this.LogCatchErrorAsync(error as Error);
        }
        return baseDTO;
    }

    /**
     * fetch resources
     * @param anyDTO any DTO
     * @returns list of resources
     */
    public GetPageResourcesAsync = async (anyDTO: any) => {
        try {
            anyDTO.LanguageID = await this.GetLanguageIDAsync();
            anyDTO = await new CommonMDL().GetPageResourcesAsync(anyDTO);
            if (anyDTO.StatusCode != ERROR_CODES.OK) {
                throw new Error(this.CreateErrorMessage(anyDTO));
            }
        } catch (error) {
            anyDTO.StatusCode = ERROR_CODES.DATA_RETRIEVAL_ERROR;
            await this.LogCatchErrorAsync(error as Error);
        }
        return anyDTO;
    }

    /**
     * Reset all the unwanted data before sending the api response
     * @param anyDTO 
     * @returns updated DTO
     */
    protected ResetApiData = (anyDTO: any) => {
        anyDTO.StatusMessage = "";
        anyDTO.ID = "";
        anyDTO.Keys = "";
        anyDTO.LastSyncedAt = "";
        anyDTO.ResourceDTO = new ResourceDTO();
        anyDTO.LanguageID = 0;
        anyDTO.GroupIDs = "";
        anyDTO.LoggedInUserID = "";
        anyDTO.Files = [];
        return anyDTO;
    }

    /**
     * Log only catch errors
     * @param error
     */
    protected LogCatchErrorAsync = async (error: Error) => {
        let errorStack = (error).stack;
        var caller_line = (error).stack?.split("\n")[6];
        var index = (caller_line as string).indexOf("at");
        var className = (caller_line as string).slice(index + 2, caller_line?.length).split(".")[0];
        var functionLine = (caller_line as string).slice(index + 2, caller_line?.length).split(".")[1];
        var functionName = (functionLine).split("(")[0];
        var errorLocation = className + "/" + functionName;
        await this.LogErrorAsync((error as { message: string }).message, errorStack ? errorStack.toString() : "", errorLocation);
    }

    /**
     * creates a new error message
     * @param anyDTO 
     * @returns error message
     */
    protected CreateErrorMessage = (anyDTO: any) => {
        return anyDTO.StatusCode + " : " + anyDTO.StatusMessage;
    }

    /**
     * get all the headers that to be passed in api call
     * @returns header list
     */
    protected GetApiHeadersAsync = async (extraParam: ValueOf<typeof API_HEADER_TOKEN> = API_HEADER_TOKEN.NO_TOKEN) => {
        let headerList = new ApiHeaderModel();
        if (extraParam == API_HEADER_TOKEN.ACCESS_TOKEN) {
            headerList.accesstoken = await this.GetStringValueFromStorageAsync(MOBILE_CONFIG.ACCESS_TOKEN);
        } else if (extraParam == API_HEADER_TOKEN.REFRESH_TOKEN) {
            headerList.refreshtoken = await this.GetStringValueFromStorageAsync(MOBILE_CONFIG.REFRESH_TOKEN);
        }
        headerList.deviceid = DeviceInfo.getUniqueId();
        headerList.devicetype = DeviceInfo.getDeviceType();
        headerList.deviceos = PLATFORM.ANDROID;
        headerList.deviceosversion = DeviceInfo.getSystemVersion();
        headerList.devicemodel = DeviceInfo.getModel();
        headerList.devicedetail = await DeviceInfo.getDeviceName();
        headerList.isremembered = true;
        headerList.pincode = "";
        return headerList;
    }

    /**
    * Service api call
    * @param serviceApiDTO Service Api DTO
    * @returns api response
    */
    protected CallServiceApiAsync = async (serviceApiDTO: ServiceApiDTO) => {
        try {
            serviceApiDTO = await this.CheckConditionsBeforeApiRequest(serviceApiDTO);
            if (serviceApiDTO.StatusCode == ERROR_CODES.OK) {
                serviceApiDTO = await this.MakeApiRequestAsync(serviceApiDTO);
                if (serviceApiDTO.StatusCode == ERROR_CODES.OK && serviceApiDTO.StatusMessage) {
                    serviceApiDTO = await this.CheckApiResponseAsync(serviceApiDTO);
                }
                if (serviceApiDTO.StatusCode != ERROR_CODES.OK && serviceApiDTO.StatusMessage) {
                    throw new Error(this.CreateErrorMessage(serviceApiDTO));
                }
            }
            if (serviceApiDTO.StatusCode == ERROR_CODES.LOGOUT_USER) {
                //Discuss: logout user from here
                await this.RemoveValueInStorageAsync(MOBILE_CONFIG.ACCESS_TOKEN);
                await this.RemoveValueInStorageAsync(MOBILE_CONFIG.REFRESH_TOKEN);
                await this.RemoveValueInStorageAsync(MOBILE_CONFIG.PASS_CODE);
            }
        } catch (error) {
            serviceApiDTO.StatusCode = ERROR_CODES.API_RESPONSE_ERROR;
            serviceApiDTO.StatusMessage = "";
            await this.LogCatchErrorAsync(error as Error);
        }
        return serviceApiDTO;
    }

    /**
     * Checks the status of the token
     * @param serviceApiDTO Service Api DTO
     * @returns boolean
     */
    private CheckConditionsBeforeApiRequest = async (serviceApiDTO: ServiceApiDTO) => {
        if (await this.IsNetConnectedAsync()) {
            let callApiFlag: boolean = false;
            if (serviceApiDTO.Service.Header.accesstoken) {
                if (await this.CheckTokenStatusAsync()) {
                    callApiFlag = true;
                }
            } else {
                callApiFlag = true;
            }
            if (callApiFlag) {
                serviceApiDTO.StatusCode = ERROR_CODES.OK;
            } else {
                await this.SaveValueInStorageAsync(MOBILE_CONFIG.TOKEN_STATUS, TOKEN_STATUS_CONSTANTS.EXPIRED);
                serviceApiDTO.StatusCode = ERROR_CODES.LOGOUT_USER;
            }
        } else {
            serviceApiDTO.StatusCode = ERROR_CODES.NO_INTERNET;
        }
        return serviceApiDTO;
    }

    /**
     * Checks the status of the token
     * @returns boolean
     */
    private CheckTokenStatusAsync = async () => {
        let tokenStatus: string | null = await this.GetStringValueFromStorageAsync(MOBILE_CONFIG.TOKEN_STATUS);
        if (tokenStatus == TOKEN_STATUS_CONSTANTS.ALIVE) {
            return true;
        } else if (tokenStatus == TOKEN_STATUS_CONSTANTS.USING_REFRESH_TOKEN) {
            let checkTokenStatusTimer = setInterval(async () => {
                tokenStatus = await this.GetStringValueFromStorageAsync(MOBILE_CONFIG.TOKEN_STATUS);
                if (tokenStatus == TOKEN_STATUS_CONSTANTS.ALIVE) {
                    clearInterval(checkTokenStatusTimer);
                    return true;
                } else if (tokenStatus == TOKEN_STATUS_CONSTANTS.EXPIRED) {
                    clearInterval(checkTokenStatusTimer);
                }
            }, CHECK_TOKEN_STATUS_INTERVAL);
        }
        return false;
    }

    /**
     * Checks if the token is expired and do the necessary actions
     * @param serviceApiDTO 
     * @param response 
     * @returns serviceApiDTO
     */
    private CheckApiResponseAsync = async (serviceApiDTO: ServiceApiDTO) => {
        if (serviceApiDTO.Service.Header.accesstoken && serviceApiDTO.StatusCode != ERROR_CODES.OK) {
            if (serviceApiDTO.StatusCode == ERROR_CODES.TOKEN_EXPIRED) {
                if (await this.IsNetConnectedAsync()) {
                    await this.SaveValueInStorageAsync(MOBILE_CONFIG.TOKEN_STATUS, TOKEN_STATUS_CONSTANTS.USING_REFRESH_TOKEN);
                    let resetTokenApi = new ServiceApiDTO();
                    resetTokenApi.Service = {
                        Method: API_METHODS.GET,
                        Api: AUTH_ROUTES.RESET_TOKEN,
                        Header: await this.GetApiHeadersAsync(API_HEADER_TOKEN.REFRESH_TOKEN)
                    }
                    resetTokenApi = await this.MakeApiRequestAsync(serviceApiDTO);
                    if (resetTokenApi.StatusCode == ERROR_CODES.OK && resetTokenApi.AccessToken && resetTokenApi.RefreshToken) {
                        await this.SaveValueInStorageAsync(MOBILE_CONFIG.ACCESS_TOKEN, resetTokenApi.AccessToken);
                        await this.SaveValueInStorageAsync(MOBILE_CONFIG.REFRESH_TOKEN, resetTokenApi.RefreshToken);
                        await this.SaveValueInStorageAsync(MOBILE_CONFIG.TOKEN_STATUS, TOKEN_STATUS_CONSTANTS.ALIVE);
                        serviceApiDTO = await this.CallServiceApiAsync(serviceApiDTO);
                    } else {
                        await this.SaveValueInStorageAsync(MOBILE_CONFIG.TOKEN_STATUS, TOKEN_STATUS_CONSTANTS.EXPIRED);
                        serviceApiDTO.StatusCode = ERROR_CODES.LOGOUT_USER;
                    }
                } else {
                    serviceApiDTO.StatusCode = ERROR_CODES.NO_INTERNET;
                }
            } else if (serviceApiDTO.StatusCode == ERROR_CODES.TOKEN_INVALID) {
                serviceApiDTO.StatusCode = ERROR_CODES.LOGOUT_USER;
            }
        }
        return serviceApiDTO;
    }

    /**
     * Service api call
     * @param serviceApiDTO Service Api DTO
     * @returns api response
     */
    private MakeApiRequestAsync = async (serviceApiDTO: ServiceApiDTO) => {
        await Axios.request({
            method: serviceApiDTO.Service.Method,
            url: `${GLOBAL_API}${serviceApiDTO.Service.Api}`,
            headers: serviceApiDTO.Service.Header ? serviceApiDTO.Service.Header : {},
            data: serviceApiDTO.Service.Method == API_METHODS.POST ? serviceApiDTO.Service.Body : {},
        }).then(async (res: any) => {
            if (res.status != ERROR_CODES.OK) {
                serviceApiDTO.StatusCode = res.status;
                serviceApiDTO.StatusMessage = serviceApiDTO.Service.Api + " : " + res.status;
            }
            serviceApiDTO.StatusCode = res.data.StatusCode;
            serviceApiDTO.Data = res.data;
        }).catch((err: any) => {
            serviceApiDTO.StatusCode = ERROR_CODES.API_RESPONSE_ERROR;
            serviceApiDTO.StatusMessage = err;
        });
        return serviceApiDTO;
    }

    /**
     * Error logger
     * @param errorMessage 
     * @param errorStack 
     * @param errorLocation 
     */
    private LogErrorAsync = async (errorMessage: string, errorStack: string, errorLocation: string) => {
        await new CommonMDL().LogErrorAsync(errorMessage, errorStack, errorLocation);
    }
}