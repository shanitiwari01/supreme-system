import StudentSDL from "./StudentSDL";
import AuthenticationSDL from "./AuthenticationSDL";
import CommonSDL from "./CommonSDL";
import LanguageSDL from "./LanguageSDL";
import ResourceSDL from "./ResourceSDL";
import SettingSDL from "./SettingSDL";
import ErrorLogSDL from "./ErrorLogSDL";
import AccountSDL from "./AccountSDL";

declare global {
    var DB: any;
}

export {
    StudentSDL,
    AuthenticationSDL,
    CommonSDL,
    LanguageSDL,
    ResourceSDL,
    SettingSDL,
    ErrorLogSDL,
    AccountSDL
}