import crypto from "crypto";
import { ALGORITHM, CIPHER_KEY, CIPHER_IV_KEY } from "utility";

/**
 * Encrypt text key based
 * @param text 
 * @returns encrypted text
 */
export const EncryptAsync = async (text: any) => {
    if (text) {
        const iv = Buffer.from(CIPHER_IV_KEY);
        const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(CIPHER_KEY), iv);
        let encrypted = cipher.update(text.toString());
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        const encData = iv.toString("hex") + ":" + encrypted.toString("hex");
        return Buffer.from(encData).toString("base64");
    } else {
        return text;
    }
};

/**
 * Decrypt encrypted text key based
 * @param encText 
 * @returns decrypted text
 */
export const DecryptAsync = async (encText: string) => {
    if (encText) {
        const text = Buffer.from(encText, "base64").toString("ascii");
        const textParts: any = text.split(":");
        const iv = Buffer.from(textParts.shift(), "hex");
        const encryptedText = Buffer.from(textParts.join(":"), "hex");
        const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(CIPHER_KEY), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } else {
        return encText;
    }
};