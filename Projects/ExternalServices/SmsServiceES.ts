import request from "request";
import { SMS_CONSTANTS, SMS_API } from "./ConstantsES";
import CommonES from "./CommonES";

export default class SmsServiceES extends CommonES {

    /**
     * Send SMS using smshorizon
     * @param phone 
     * @param message 
     * @returns operation status
     */
    public SendSMSAsync = async (phone: string, message: string) => new Promise(async (resolve, reject) => {
        //TODO: uncomment the below code before deployment
        let secrets = await this.GetSecretCredentialAsync(`${SMS_CONSTANTS.SMS_USER_NAME},${SMS_CONSTANTS.SMS_API_KEY},${SMS_CONSTANTS.SMS_SENDER_ID},${SMS_CONSTANTS.SMS_TID}`);
        let url = SMS_API.replace(SMS_CONSTANTS.SMS_USER_NAME, secrets[SMS_CONSTANTS.SMS_USER_NAME]).replace(SMS_CONSTANTS.SMS_API_KEY, secrets[SMS_CONSTANTS.SMS_API_KEY]).replace(SMS_CONSTANTS.SMS_SENDER_ID, secrets[SMS_CONSTANTS.SMS_SENDER_ID]).replace(SMS_CONSTANTS.SMS_TID, secrets[SMS_CONSTANTS.SMS_TID]).replace(SMS_CONSTANTS.SMS_NUMBER, phone).replace(SMS_CONSTANTS.SMS_MESSAGE, message);
        // request.get(encodeURI(url), (err: any, res: any, body: any) => {
        //     if (err) { resolve(false) }
        //     resolve(true)
        // });
        resolve(true);
    });
}