import { GLOBAL_LOADER, GLOBAL_ALERT, GLOBAL_ALERT_REMOVE, LANGUAGEID, LANGUAGELIST, ROUTES, defaultLanguage  } from '../../Utils/TypesWC';


/**
 * featuresList
 */
let routesList = localStorage.getItem('featuresList');

if (routesList) {
    routesList = JSON.parse(routesList);
} else {
    routesList = []
}

/**
 * 
 */
let langId = localStorage.getItem('language_id');

if (!langId || langId == null || langId <= 0) {
    langId = defaultLanguage
    localStorage.setItem('language_id', langId);
}

/**
 * languageList
 */
let languageList = localStorage.getItem('languageList');

if (languageList) {
    languageList = JSON.parse(languageList);
} else {
    languageList = []
}



const INITIAL_STATE = {
    loader: false,                  // global loader handler
    alertArray: [],                 // alert message handler
    routes: routesList,             // avialble routes list 
    languageId: langId,             // selected langauge id
    languageList: languageList      // langauge list
}

export default function (state = INITIAL_STATE, action) {

    switch (action.type) {
        case GLOBAL_LOADER: {
            return {
                ...state,
                loader: action.payload,
            };
        }
        case LANGUAGEID: {
            return {
                ...state,
                languageId: action.payload,
            };
        }
        case LANGUAGELIST: {
            return {
                ...state,
                languageList: action.payload,
            };
        }
        case ROUTES: {
            return {
                ...state,
                routes: action.payload,
            }
        }
        case GLOBAL_ALERT: {
            let obj = {
                alertType: action.payload,
                alertMessage: action.msg,
            }

            return {
                ...state,
                alertArray: [obj],
            };
        }
        case GLOBAL_ALERT_REMOVE: {
            let arr = state.alertArray;
            if (arr.length) state.alertArray.shift()

            return {
                ...state,
                alertArray: [...arr]
            }
        }
        default:
            return state
    }


}