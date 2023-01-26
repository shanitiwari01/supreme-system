import Axios from "axios";
import { GLOBAL_API, METHODLOCATION, TokenHttpCodes, TokenStatusValues } from '../Utils/TypesWC';
import { httpHeaderOwn, logOut, getTokenStatus } from '../Functions/CommonFunctionWC';
import platform from "platform";

/**
 * Logout user when user click on logout button
 * 
 * @param {*} value 
 * @param {*} link 
 * @returns 
 */
 export const logoutUser = async (value, link) => {
    try{
        let proceedApi = await getTokenStatus(value, link);

        if(proceedApi) {
            let header = await httpHeaderOwn(value, link);
            return Axios.post(`${GLOBAL_API}/auth/logout-user`, {}, {
                headers: header
            }).then(res => {
                if(res.data.StatusCode === 401 || res.data.StatusCode === 500){
                    logOut(value, link)
                }
                return res
            }).catch(err => {
                console.log(err)
            })
        }
    } catch (error) {
        let errorObject = {
            methodName: "logoutUser",
            errorStake: error.toString(),
        };

        errorLogger(errorObject);
    }
}

export const errorLogger = async (obj) => {

    // system information
    let systemInfo = `${platform.os}/${platform.name}/${platform.version}`;

    // default values
    let defaultObj = {
        methodLocation: METHODLOCATION,
        systemInfo: systemInfo
    };

    // merge
    obj = {...obj, ...defaultObj};

    // header
    let headers = {};

    let token  = localStorage.getItem('token');
    if(token){
        let device  = platform.name;
        headers = {token: token, device: device};
    }

    return Axios.post(`${GLOBAL_API}/api/error-logger`, obj, {
        headers: headers
    }).then(res => {
        console.log(res);
        return res
    }).catch(err => {
        console.log(err)
    })
}

export const checkRefreshTokenApi = async (value, link) => {
    try {

        let refresh_token  = localStorage.getItem('refresh_token');
        let language_id = localStorage.getItem('language_id'); 
        return Axios.post(`${GLOBAL_API}/auth/reset-token`, {}, {
            headers: {
                refresh_token: refresh_token,
                device: platform.name,
                language_id: language_id,
                page_id: null
            }
        }).then(res => {

            if(res.data.StatusCode == 200){
                if(res.data.data.statusCode == TokenHttpCodes.TOKEN_VALID){
                    localStorage.setItem('token', res.data.data.token);
                    localStorage.setItem('refresh_token', res.data.data.refresh_token);
                    localStorage.setItem('token_status', TokenStatusValues.ALIVE);
                    return true;
                }
                else {
                    localStorage.setItem('token_status', TokenStatusValues.EXPIRED);
                    logOut(value, link)
                }
            }
            else {
                localStorage.setItem('token_status', TokenStatusValues.EXPIRED);
                logOut(value, link)
            }

        }).catch(err => {
            console.log(err)
        });

    } catch (error) {
        let errorObject = {
            methodName: "checkRefreshTokenApi",
            errorStake: error.toString(),
        };

        errorLogger(errorObject);
    }
}

export const getResourcesData = async (obj, value, link) => {
    try{

        return Axios.post(`${GLOBAL_API}/api/get-resources`, obj, {
            headers: {}
        }).then( async res => {
            return res;
        }).catch(err => {
            console.log(err)
        })
        
    } catch (error) {
        let errorObject = {
            methodName: "getDashboardApi",
            errorStake: error.toString(),
        };

        errorLogger(errorObject);
    }
}