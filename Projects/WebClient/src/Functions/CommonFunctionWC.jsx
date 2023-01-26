import { logoutUser, checkRefreshTokenApi, errorLogger  } from '../Services/CommonServicesWC';
import { globalAlert, changeRoutes } from '../Redux/Actions/CommonActionsWC';
import { TokenStatusValues, resourceFields } from '../Utils/TypesWC';
import platform from "platform";

/**
 * Logout user session and redirect to login page
 * 
 * @param {*} value 
 * @param {*} link 
 */
export const logOut = async (value, link) => {

    let token  = localStorage.getItem('token');
    let tokenStatus  = localStorage.getItem('token_status');

    if(token && tokenStatus !== TokenStatusValues.EXPIRED){
        let logoutUserResult = await logoutUser(value, link);

        if(logoutUserResult){
            if(logoutUserResult?.data.StatusCode == 200){
                globalAlert('success', global.logoutMessage);
            }else{
                globalAlert('error', logoutUserResult.data.message)
            }
        }else{
            globalAlert('success', global.logoutMessage);
        }

        value.push(link);
        clearStorage();

    }else{
        globalAlert('success', global.logoutMessage);
        localStorage.removeItem('token');
        value.push(link);
        clearStorage();
    }
}

/**
 * Clear local storage after logout
 */
export const clearStorage = () => {
    localStorage.removeItem('userDetail');
    localStorage.removeItem('token_status');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('roles');
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    changeRoutes([]);
}

/**
 * Common api headers handler
 * 
 * @param {*} value 
 * @param {*} link 
 * @returns headers
 */
export const httpHeaderOwn =async (value,link)=>{
   let token  = localStorage.getItem('token');
   let language_id = localStorage.getItem('language_id');
   if(token){
       return {
            token: token,
            language_id: language_id,
            page_id: null,
            device: platform.name
       }
   } 
   else{
    logOut(value, link) 
   } 
}

/**
 * validate email address using REGEX
 * 
 * @param {*} value 
 * @returns boolean
 */
export const validEmail = async (value)=>{
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(!value.match(mailformat)){
        return false
    }
    else{
        return true
    }
}

/**
 * 
 * Get Text language based using resource key
 * 
 * @param {*} resourceData 
 * @param {*} key 
 * @param {*} column 
 * @returns Text
 */
export const getResourceValue = (resourceData, key, column='') => {
    let resultValue =  "";
    let resourceKey     =   resourceFields.Key;
    
    if(column == "") {
        column  =   resourceFields.Value;
    }

    if(resourceData && resourceData.length > 0) {
        let keyIndex    =   resourceData.findIndex(e => e[resourceKey] == key);

        if(keyIndex >= 0) {
            let resource   =   resourceData[keyIndex];

            resultValue   =   resource[column] ? resource[column] : "";
        }
    }

    return resultValue;
}

/**
 * Nested resource handler
 * 
 * @param {*} resourceData 
 * @param {*} key 
 * @returns Text
 */
export const getNestedResources = (resourceData, key) => {
    let resultValue  =   getResourceValue(resourceData, key);
    let finalValue   =   resultValue;

    if(resultValue != "") {
        var subKeys  =  resultValue.match(/\{(.*?)\}/g);

        if(subKeys && subKeys.length > 0) {
            subKeys.forEach(keyVal => {
                var newKey     =   keyVal.slice(1,-1);
                let newValue   =   getResourceValue(resourceData, newKey);
                finalValue     =   finalValue.replace(keyVal, newValue);
            });
        }
    }

    return finalValue;
}

/**
 * Format NHS number
 * 
 * @param {*} nhsNumber 
 * @returns NHS-NUMBER
 */
export const formatNHSNumber = (nhsNumber) => {
    if(nhsNumber){
        if (nhsNumber.length > 3 && nhsNumber.length < 7) {
            return nhsNumber.slice(0, 3) + "-" + nhsNumber.slice(3, 6);
        }
        else if (nhsNumber.length >= 7) {
            return nhsNumber.slice(0, 3) + "-" + nhsNumber.slice(3, 6) + "-" + nhsNumber.slice(6, 10);
        }
        else {
            return nhsNumber;
        }
    }else{
        return null;
    }
    
}

/**
 * Get Language name
 * 
 * @param {*} languageId 
 * @param {*} languageList 
 */
export const getLanguageName = (languageId, languageList)=>{
    let language = languageList && languageList.length > 0 && languageList.find(e => e.language_id ==  languageId);
    if(language){
        return language.language_name;
    }
}

/**
 * verify Routes using route name
 * 
 * @param {*} routeName 
 */
 export const verifyRoute = async (history, routeName) => {

    let routes = localStorage.getItem('featuresList');

    if(routes){
        routes = JSON.parse(routes);
    }else{
        routes = [];
    }

    let index = routes.findIndex(e => e.route_name === routeName);

    if(index < 0){
        
        history.push('page-not-found');

    }else{
        history.push(routeName);
    }
}

/**
 * Token status handler, it will check current token status and call api
 * 
 * @param {*} value 
 * @param {*} link 
 * @returns call api
 */
export const getTokenStatus = async (value, link) => {
    try{

        return new Promise( async (resolve) => {
            let tokenStatus  =   localStorage.getItem('token_status');
            let proceedApi   =   false;
    
            if(tokenStatus == TokenStatusValues.ALIVE) {
                proceedApi  =   true;
                resolve(true);
            }
            else if(tokenStatus == TokenStatusValues.USING_REFRESH_TOKEN) {
    
                const checkStatusTimer = setInterval(() => {
                    let tokenStatus  = localStorage.getItem('token_status');
    
                    if(tokenStatus == TokenStatusValues.ALIVE) {
                        clearInterval(checkStatusTimer);
                        proceedApi  =   true;
                        resolve(true);
                    }else if(tokenStatus == TokenStatusValues.EXPIRED){
                        clearInterval(checkStatusTimer);
                        proceedApi  =   false;
                        logOut(value, link);
                        resolve(false);
                    }
    
                }, 1000);
            }
            else {
                logOut(value, link);
                resolve(false);
            }
        });
    } catch (error) {
        let errorObject = {
            methodName: "resetTokenApi",
            errorStake: error.toString(),
        };

        errorLogger(errorObject);
    }
}

/**
 * 
 * Reset user token
 * 
 * @param {*} value 
 * @param {*} link 
 * @returns 
 */
export const resetTokenApi = async (value, link) => {
    try{

        return new Promise( async (resolve) => {
            let tokenStatus  = localStorage.getItem('token_status');

            if(tokenStatus == TokenStatusValues.ALIVE) {
                localStorage.setItem('token_status', TokenStatusValues.USING_REFRESH_TOKEN);

                const result  =  await checkRefreshTokenApi(value, link);
                resolve(result);
            }
            else if(tokenStatus == TokenStatusValues.USING_REFRESH_TOKEN) {

                resolve(true);

            }
            else {
                logOut(value, link);
            }
        });
        
    } catch (error) {
        let errorObject = {
            methodName: "resetTokenApi",
            errorStake: error.toString(),
        };

        errorLogger(errorObject);
    }
}

/**
 * Validate email text
 * 
 * @param {*} item 
 * @param {*} resources 
 * @returns Error message
 */
export const emailValidate = async (item, resources) => {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let resultObj = {
        name: item.name,
        validation: true,
        error: ''
    };
    if (!mailformat.test(item.value)) {
        resultObj.validation = false;
        resultObj.error = getResourceValue(resources, 'FIELD_INVALID');
    }

    return resultObj
}

/**
 * validate password
 * 
 * @param {*} item 
 * @param {*} resources 
 * @returns Error Meesage
 */
export const passwordValidate = async (item, resources) => {
    var containsNumber = /\d+/;
    var specailChar = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    var variableChar = /[A-Z]/;
    let resultObj = {
        name: item.name,
        validation: true,
        error: ''
    };
    if (!item.value.length >= 8) {
        resultObj.validation = false;
        resultObj.error = getResourceValue(resources, 'CRITERIA_MIN');
    }
    else if (!variableChar.test(item.value)) {
        resultObj.validation = false;
        resultObj.error = getResourceValue(resources, 'CRITERIA_CASE');
    }
    else if (!specailChar.test(item.value)) {
        resultObj.validation = false;
        resultObj.error = getResourceValue(resources, 'CRITERIA_SPECIAL');
    }
    else if (!containsNumber.test(item.value)) {
        resultObj.validation = false;
        resultObj.error = getResourceValue(resources, 'CRITERIA_NUM');
    }


    return resultObj
}

/**
 * validate DOB
 * 
 * @param {*} item 
 * @param {*} resources 
 * @returns Error Message
 */
export const dobValidate = async (item, resources) => {
    let resultObj = {
        name: item.name,
        validation: true,
        error: ''
    };
    let dob = new Date(item.value)
    var month_diff = Date.now() - dob.getTime();
    var age_dt = new Date(month_diff);
    var year = age_dt.getUTCFullYear();
    var age = Math.abs(year - 1970);
    if(age < 16){
        resultObj.validation = false;
        resultObj.error = getResourceValue(resources, 'DOB_CRITERIA')
    }

    return resultObj
}

/**
 * Validate all feilds availble in form
 * 
 * @param {*} data 
 * @param {*} resources 
 * @returns error messages
 */
export const checkInputKey = async (data, resources) => {
    let result = [];

    if (data && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            let name = data[i].name;
            let value = data[i].value;

            let requiredFlag = getResourceValue(resources, name, resourceFields.Is_Required);
            let MinLength = getResourceValue(resources, name, resourceFields.Min_Length);
            let MaxLength = getResourceValue(resources, name, resourceFields.Max_Length);

            let resultObj = {
                name: name,
                validation: true,
                error: ''
            };

            if (requiredFlag > 0) {
                if (value == '') {
                    resultObj.validation = false;
                    resultObj.error = getResourceValue(resources, 'FIELD_REQUIRED')
                }
                else if (value.length < MinLength || value.length > MaxLength) {
                    resultObj.validation = false;
                    resultObj.error = getResourceValue(resources, 'FIELD_LIMIT').replace('{min_length}', MinLength).replace('{max_length}', MaxLength);
                }
            }
            else if (value && (value.length < MinLength || value.length > MaxLength)) {
                resultObj.validation = false;
                resultObj.error = getResourceValue(resources, 'FIELD_LIMIT').replace('{min_length}', MinLength).replace('{max_length}', MaxLength);
            }
            result.push(resultObj);
        }

    }
    return result
}