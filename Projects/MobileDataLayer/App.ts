import StudentMDL from "./StudentMDL";
import CommonMDL from "./CommonMDL";
import LanguageMDL from "./LanguageMDL";
import ResourceMDL from "./ResourceMDL";
import SettingMDL from "./SettingMDL";
import ErrorLogMDL from "./ErrorLogMDL";
import AccountMDL from "./AccountMDL";

declare global {
    var DB: any;
}

export {
    StudentMDL,
    CommonMDL,
    LanguageMDL,
    ResourceMDL,
    SettingMDL,
    ErrorLogMDL,
    AccountMDL
}