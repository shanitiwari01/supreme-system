import AWS from 'aws-sdk';
import { SECRET_KEYS } from "./ConstantsES";
import { FILE_BUCKET_TYPES, STRING_TYPE, GetExtension } from "utility";
import CommonES from "./CommonES";

type ValueOf<T> = T[keyof T];
export default class StorageServiceES extends CommonES {

    /**
     * Generate file name for the given file
     * @param filename 
     * @param uid 
     * @param type 
     * @returns filename
     */
     protected GenerateFileName = (filename: string, uid: string, bucket: ValueOf<typeof FILE_BUCKET_TYPES>) => {
        return bucket + "_" + uid + "." + GetExtension(filename);
    }

    /**
     * Get S3 object to do operation
     * @returns s3 object
     */
    private S3ObjectFunctionAsync = async () => {
        let secrets = await this.GetSecretCredentialAsync(`${SECRET_KEYS.AWS_ACCESS_ID},${SECRET_KEYS.AWS_SECRET_KEY}`);
        return new AWS.S3({
            accessKeyId: secrets[SECRET_KEYS.AWS_ACCESS_ID],
            secretAccessKey: secrets[SECRET_KEYS.AWS_SECRET_KEY],
        });
    };

    /**
     * Upload file to S3
     * @param file 
     * @param filename 
     * @param bucket 
     * @returns filename
     */
    public UploadFileAsync = async (file: any, filename: string, bucket: ValueOf<typeof FILE_BUCKET_TYPES>) => {
        let s3Object = await this.S3ObjectFunctionAsync();
        let status = await s3Object.upload({
            Bucket: bucket,
            Key: filename,
            Body: Buffer.from(file.data, STRING_TYPE.BINARY),
        }).promise();
        return status;
    };
}