import { USER_ROLES } from "./GenericConstants";

export const SETTING_ROUTES = {
    GET_SETTINGS: "/setting/get-settings",
}

export const LANGUAGE_ROUTES = {
    GET_LANGUAGES: "/language/get-languages",
}

export const RESOURCE_ROUTES = {
    GET_RESOURCES: "/resource/get-resources",
}

export const ERROR_LOG_ROUTES = {
    SAVE_ERROR_LOGS: "/error-log/save-error-logs",
}

export const STUDENT_ROUTES = {
    GET_STUDENTS: "/student/get-students",
    GET_STUDENT: "/student/get-student",
    SAVE_STUDENTS: "/student/save-students",
}

export const USER_ROUTES = {
    VERIFY_SIGNUP_USER: "/verify-signup-user",
    SIGN_UP: "/sign-up",
    VERIFY_LOGIN: "/verify-login",
    LOGIN: "/login",
    FORGOT_PASSWORD: "/forgot-password",
    VALIDATE_OTP: "/validate-otp",
    CHANGE_PASSWORD: "/change-password"
}

export const AUTH_ROUTES = {
    RESET_TOKEN: "/auth/reset-token"
}

export const API_PERMISSIONS = {
    GET_STUDENTS: [USER_ROLES.ASHA_WORKER],
    GET_STUDENT: [USER_ROLES.ASHA_WORKER],
    SAVE_STUDENTS: [USER_ROLES.ASHA_WORKER],
}

export const SIGNUP_API_CONSTANTS = {
    USER: "user",
    USER_PHOTO: "UserPhoto",
    KYC_DOCUMENT: "KycDocument"
}