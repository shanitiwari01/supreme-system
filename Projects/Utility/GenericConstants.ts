export const GLOBAL_API = "";
export const TESTING = false;

export const BOOLEAN_STATUS = {
    STATUS_TRUE: 1,
    STATUS_FALSE: 0,
};

export const API_METHODS = {
    GET: "get",
    POST: "post"
}

export const SYNC_STATUS = {
    SYNCED: 1,
    NOT_SYNCED: 0
}

export const ERROR_CODES = {
    OK: 200,
    TOKEN_VALID: 5001,
    TOKEN_INVALID: 5002,
    TOKEN_EXPIRED: 5003,
    UNAUTHORIZED_OPERATION: 5004,
    VALIDATION_ERROR: 5005,
    DATA_RETRIEVAL_ERROR: 5006,
    DATA_SAVE_ERROR: 5007,
    DATA_DELETE_ERROR: 5008,
    DATA_SYNC_ERROR: 5009,
    NO_INTERNET: 5010,
    JAIL_BROKEN: 5011,
    API_RESPONSE_ERROR: 5012,
    TOKEN_GENERATE_ERROR: 5013,
    INVALID_DATA: 5014,
    ACCOUNT_EXISTS: 5015,
    LOGOUT_USER: 5016,
    OTP_EXPIRED: 5017,
    NO_ACCOUNT_FOUND: 5018,
    SMS_SENDING_FAILED: 5019,
    FILE_UPLOAD_ERROR: 5020
}

export const USER_ROLES = {
    SUPER_ADMIN: "SuperAdmin",
    LOCATION_ADMIN: "LocationAdmin",
    DATA_ENTRY_OPERATOR: "DataEntryOperator",
    AUDITOR: "Auditor",
    ASHA_WORKER: "AshaWorker",
    DOCTOR: "Doctor",
    PATIENT: "Patient"
};

export const ALGORITHM = "aes-256-cbc";

export const CIPHER_KEY = "34feb914c099df25794bf9ccSupremeSystem";

export const CIPHER_IV_KEY = "SupremeSystem";

export const SNACKBAR_TIME_OUT = 5000;

export const PLATFORM = {
    IOS: "ios",
    ANDROID: "android",
}

export const REPLACE_FIELDS = {
    MIN_LENGTH: "{min_length}",
    MAX_LENGTH: "{max_length}",
    COLOR: "{COLOR}",
}

export const REG_EXP_CONSTANTS = {
    NUMERIC: /^(?=.*?[\d])/,
    KEY: /\{(.*?)\}/g,
    VALUE: /^[1-9]\D{5,12}$/,
    NUMERIC_DECIMAL: /^\d+\.\d\d\d$/,
    LAST_COMMA: /,\s*$/,
    PHONE_NUMBER: /^[7-9][\d]{9}$/,
    SPECIAL_CHARACTER: /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/,
    ALPHABETS: /[A-z]/,
    EMAIL: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    TINY_QUOTE: /`/g,
    SINGLE_QUOTE: /'/g,
    DOUBLE_QUOTE: /"/g,
    TINY_UNIQUOTE: /&tquo/g,
    SINGLE_UNIQUOTE: /&squo/g,
    DOUBLE_UNIQUOTE: /&dquo/g,
};

export const KEYBOARD_AVOIDING = {
    BEHAVIOR: <const>"height"
}

export const PASSCODE_TYPE = {
    LOGIN_WITH_PASSCODE: "LOGIN_WITH_PASSCODE",
    SET_PASSCODE: "SET_PASSCODE",
    CONFIRM_PASSCODE: "CONFIRM_PASSCODE"
}

export const OTPCODE_TYPE = {
    SIGN_IN_OTP: "SIGN_IN_OTP",
    SIGN_UP_OTP: "SIGN_UP_OTP",
}

export const SYNC_CONSTANTS = {
    MASTER_DATA: "MASTER_DATA",
    TRANSACTIONAL_DATA: "TRANSACTIONAL_DATA",
    ALL_DATA: "ALL_DATA",
    LANGUAGES: "LANGUAGES",
    RESOURCES: "RESOURCES",
    SETTINGS: "SETTINGS",
    STUDENTS: "STUDENTS"
}

export const SYNC_QUERY_LIMIT = 50;

export const SETTING_CONSTANTS = {
    PRIMARY_COLOR: "PrimaryColor",
    ALLOW_IN_ROOTED_DEVICES: "AllowInRootedDevices",
    ALLOW_SCREEN_CAPTURE: "AllowScreenCapture",
    EMAIL_REGEX: "EmailRegex",
    PHONE_NO_REGEX: "PhoneNoRegex",
    NUMBER_REGEX: "NumberRegex",
    DECIMAL_NO_REGEX: "DecimalNoRegex",
    PASS_CODE_LENGTH: "PassCodeLength",
    SMS_LENGTH: "SmsLength",
    ACCESS_TOKEN_EXPIRY_TIME: "AccessTokenExpiryTime",
    REFRESH_TOKEN_EXPIRY_TIME: "RefreshTokenExpiryTime",
    OTP_EXPIRY_TIME: "OtpExpiryTime",
    IMAGE_EXTENSION: "ImageExtension",
    DOC_EXTENSION: "DocExtension",
    FILE_EXTENSION: "FileExtension",
    OTP_COUNT_DOWN: "OtpCountDown",
    NUMERIC_REGEX: "NumericRegex",
    SPECIAL_CHAR_REGEX: "SpecialCharacterRegex",
    ALPHABET_REGEX: "AlphabetRegex",
    PASSWORD_REGEX: "PasswordRegex"
}

export const VALIDATION_FIELD_TYPES = {
    TEXT: "Text",
    NUMERIC: "Numeric",
    INTEGER: "Integer",
    DATE: "Date",
    IMAGE: "Image",
    DOCUMENT: "Document",
    FILE: "File"
}

export const VALIDATION_DATA_VARIABLES = {
    STUDENTS: "Students",
    VERIFY_USER: "VerifyUser",
    USER: "User"
}

export const DATE_FORMAT = {
    DEFAULT: "YYYY-MM-DD",
    DATE_TIME: "YYYY-MM-DD HH:mm:ss",
    MINUTE: "mm:ss"
}

export const STUDENT_CONSTANTS = {
    RECENT_RECORDS_LIMIT: 2,
    RECORDS_TYPE: {
        ALL: "ALL",
        RECENT: "RECENT"
    }
}

export const SINGLE_RECORD = 1;

export const CHECK_INTERNET_INTERVAL = 5000;

export const IMAGE_FILE_TYPES = ['png', 'jpg', 'jpeg'];

export const DOCUMENT_FILE_TYPES = ['doc'];

export const PASSWORD_HASH_SALT = 12;

export const API_HEADER_TOKEN = {
    ACCESS_TOKEN: "ACCESS_TOKEN",
    REFRESH_TOKEN: "REFRESH_TOKEN",
    NO_TOKEN: "NO_TOKEN"
}

export const TOKEN_STRING_MULTIPLY_COUNT = 6;

export const TOKEN_STATUS_CONSTANTS = {
    ALIVE: "ALIVE",
    EXPIRED: "EXPIRED",
    USING_REFRESH_TOKEN: "USING_REFRESH_TOKEN"
}

export const CHECK_TOKEN_STATUS_INTERVAL = 1000;

export const ACCOUNT_API_TYPES = {
    VERIFY_USER: "VERIFY_USER",
    SIGN_UP: "SIGN_UP",
    VERIFY_LOGIN: "VERIFY_LOGIN",
    LOGIN: "LOGIN",
    FORGOT_PASSWORD: "FORGOT_PASSWORD",
    CHANGE_PASSWORD: "CHANGE_PASSWORD"
}

export const FILE_BUCKET_TYPES = {
    PROFILE_IMAGES: "user-account-profile-images",
    KYC_DOCUMENTS: "user-account-kyc-documents"
}

export const HEADER_NULL = "null";

export const UNICODE_STRING = {
    TINY_QUOTE: "&tquo",
    SINGLE_QUOTE: "&squo",
    DOUBLE_QUOTE: "&dquo"
};

export const SYMBOL_STRING = {
    TINY_QUOTE: "`",
    SINGLE_QUOTE: "'",
    DOUBLE_QUOTE: '"'
};