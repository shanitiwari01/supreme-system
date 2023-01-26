import { TOKEN_STRING_MULTIPLY_COUNT, DATE_FORMAT, UNICODE_STRING, SYMBOL_STRING, REG_EXP_CONSTANTS } from "./GenericConstants";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc)


/**
 * generate uuid
 * @returns string uuid
 */
export const GenerateUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Get years differance between two dates
 * @param firstDate 
 * @param secondDate 
 * @returns years
 */
export const DiffYears = (firstDate: Date, secondDate: Date) => {
    let diff = (secondDate.getTime() - firstDate.getTime()) / 1000;
    diff /= (60 * 60 * 24);
    return Math.abs(Math.round(diff / 365.25));
}

/**
 * checks if the key is present in the given object
 * @param key 
 * @param obj 
 * @returns boolean
 */
export const VerifyObjectKey = <T>(key: any, obj: T): key is keyof T => {
    return key in obj;
}

/**
 * generate n digit random number
 * @param digit 
 * @returns number
 */
export const GenerateRandomNumber = (digit: number) => {
    let randomNumber = parseInt(Math.random().toFixed(digit).split('.')[1]);
    if (randomNumber.toString().length != digit) {
        randomNumber = GenerateRandomNumber(digit);
    }
    return randomNumber;
}

/**
 * Get filename extension
 * @param filename 
 * @returns extension
 */
export const GetExtension = (filename: string) => {
    return filename.split(".").pop();
}

/**
 * add seconds to the current date
 * @param seconds 
 * @returns new date string
 */
export const AddSecondsToDate = (seconds: number) => {
    let currentTime = new Date();
    let addedDateTime = new Date(currentTime.getTime() + (1000 * seconds));
    return dayjs(addedDateTime).utc().format(DATE_FORMAT.DATE_TIME);
}

/**
 * covert seconds to minutes format
 * @param seconds 
 * @returns formated minute
 */
export const FormatInMinute = (seconds: number) => {
    seconds = Number(seconds);
    let m = Math.floor(seconds % 3600 / 60);
    let s = Math.floor(seconds % 3600 % 60);
    let mDisplay = '0' + m + ':';
    let sDisplay = s < 10 ? '0' + s : s;
    return mDisplay + sDisplay;
}

/**
 * Generates random string
 * @returns string 
 */
const GenerateRandomString = () => {
    return Math.random().toString(36).substr(2);
};

/**
 * Generate token
 * @returns token
 */
export const GenerateToken = () => {
    let token = "";
    for (let i = 0; i < TOKEN_STRING_MULTIPLY_COUNT; i++) {
        token += GenerateRandomString();
    }
    return token;
};

/**
 * Convert quotes to unicode
 * @param str 
 * @returns 
 */
export const ConvertToUnicode = (str: string) => {
    return str.replace(REG_EXP_CONSTANTS.TINY_QUOTE, UNICODE_STRING.TINY_QUOTE).replace(REG_EXP_CONSTANTS.SINGLE_QUOTE, UNICODE_STRING.TINY_QUOTE).replace(REG_EXP_CONSTANTS.DOUBLE_QUOTE, UNICODE_STRING.TINY_QUOTE);
}

/**
 * Convert unicode to quote
 * @param str 
 * @returns 
 */
export const ConvertToQuote = (str: string) => {
    return str.replace(REG_EXP_CONSTANTS.TINY_UNIQUOTE, SYMBOL_STRING.TINY_QUOTE).replace(REG_EXP_CONSTANTS.SINGLE_UNIQUOTE, SYMBOL_STRING.TINY_QUOTE).replace(REG_EXP_CONSTANTS.DOUBLE_UNIQUOTE, SYMBOL_STRING.TINY_QUOTE);
}