import AWS from 'aws-sdk';
import { STRING_TYPE } from "utility";
import { SECRET_DETAILS, SECRET_KEYS, AWS_SM_SECRET_STRING } from "./ConstantsES";

export default class CommonES {

    /**
     * Get Secret value from AWS SM
     * @param SecretId 
     * @returns secret value
     */
    private SecretManagerAsync = async (SecretId: any) => {
        let secrets = await this.GetSecretCredentialAsync(SECRET_KEYS.AWS_REGION);
        let client = new AWS.SecretsManager({
            region: secrets[SECRET_KEYS.AWS_REGION] // Your region
        });
        return new Promise((resolve, reject) => {
            client.getSecretValue({
                SecretId: SecretId
            }, function (err, data: any) {
                if (err) {
                    reject(err);
                } else {
                    if (AWS_SM_SECRET_STRING in data) {
                        resolve(data.SecretString);
                    } else {
                        resolve(Buffer.from(data.SecretBinary, STRING_TYPE.BASE_64).toString(STRING_TYPE.ASCII));
                    }
                }
            });
        });
    }

    /**
     * Get secret value based on secret key
     * @param SecretId 
     * @returns secret value
     */
    protected GetSecretCredentialAsync = async (SecretIds: string) => {
        let secrets: any = [];
        for(let SecretId of SecretIds.split(",")){
            let secretValue = SECRET_DETAILS[SecretId];
            if (!secretValue) {
                //TODO: add this to redis
                secretValue = await this.SecretManagerAsync(SecretId);
                SECRET_DETAILS[SecretId] = secretValue;
            }
            secrets[SecretId] = secretValue;
        }
        return secrets;
    }
}