import { GLOBAL_LOADER, GLOBAL_ALERT, GLOBAL_ALERT_REMOVE, ROUTES, LANGUAGEID, LANGUAGELIST } from '../../Utils/TypesWC';

import { appstore } from '../StoreWC';
 
/**
 * Loader flag handler
 * 
 * @param {*} value 
 */
export const globalLoader = (value) => {

    appstore.dispatch({
        type: GLOBAL_LOADER,
        payload: value,
    })

}

/**
 * Update langauge id in redux
 * 
 * @param {*} val 
 * @returns boolean
 */
export const updateLanguageId = (val) => {

    appstore.dispatch({
        type: LANGUAGEID,
        payload: val,
    });

    return true;

}

/**
 * Update langauge list in redux
 * 
 * @param {*} val 
 */
export const updateLanguageList = (val) => {

    appstore.dispatch({
        type: LANGUAGELIST,
        payload: val,
    })

}

/**
 * Update routes in redux based on user role
 * 
 * @param {*} val 
 */
export const changeRoutes = (val) => {
    appstore.dispatch({
        type: ROUTES,
        payload: val,
    })
}

/**
 * Show global alert message
 * 
 * @param {*} alertType 
 * @param {*} msg 
 */
export const globalAlert = (alertType, msg) => {
    appstore.dispatch({
        type: GLOBAL_ALERT,
        payload: alertType,
        msg: msg,
    })
}

/**
 * Remove alert message
 */
export const globalAlertRemove = () => {
    appstore.dispatch({
        type: GLOBAL_ALERT_REMOVE,

    })
}