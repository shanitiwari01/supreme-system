import StudentMBL from "./StudentMBL";
import AccountMBL from "./AccountMBL";
import LanguageMBL from "./LanguageMBL";
import ResourceMBL from "./ResourceMBL";
import SettingMBL from "./SettingMBL";
import SyncDataMBL from "./SyncDataMBL";
import CommonMBL from "./CommonMBL";

declare global {
    interface FormDataValue {
        uri: string;
        name: string;
        type: string;
    }

    interface FormData {
        append(name: string, value: FormDataValue, fileName?: string): void;
        set(name: string, value: FormDataValue, fileName?: string): void;
    }
}

export {
    StudentMBL,
    AccountMBL,
    LanguageMBL,
    ResourceMBL,
    SettingMBL,
    SyncDataMBL,
    CommonMBL
}