import {
  VALIDATION_FIELD_TYPES,
  REPLACE_FIELDS,
  DATE_FORMAT,
  REG_EXP_CONSTANTS,
  IMAGE_FILE_TYPES,
  DOCUMENT_FILE_TYPES,
} from "./GenericConstants";
import moment from "moment";
import { GetExtension } from "./Functions";
type ValueOf<T> = T[keyof T];

/**
 * Validate text field
 * @param fieldValue
 * @param minLength
 * @param maxLength
 * @param isRequired
 * @returns validation status
 */
export const ValidateTextField = (
  fieldValue: string,
  minLength: number,
  maxLength: number,
  isRequired: boolean
): boolean => {
  if (
    fieldValue &&
    fieldValue.trim() != "" &&
    minLength >= 0 &&
    maxLength > 0
  ) {
    return fieldValue.length >= minLength && fieldValue.length <= maxLength;
  } else if (isRequired === false) {
    return true;
  }
  return false;
};

/**
 * Validate number field
 * @param fieldValue
 * @param minLength
 * @param maxLength
 * @param isRequired
 * @returns validation status
 */
export const ValidateNumberField = (
  fieldValue: number,
  minLength: number,
  maxLength: number,
  isRequired: boolean
): boolean => {
  if (fieldValue) {
    if (fieldValue.toString().match(REG_EXP_CONSTANTS.NUMERIC)) {
      return fieldValue >= minLength && fieldValue <= maxLength;
    }
  } else if (isRequired === false) {
    return true;
  }
  return false;
};

/**
 * Validate single text field
 * @param fieldValue field value
 * @param fieldResource resource of the field
 * @returns validation status
 */
export const ValidateDateField = (
  fieldValue: string,
  minLength: number,
  maxLength: number,
  isRequired: boolean
): boolean => {
  if (fieldValue && new Date(fieldValue)) {
    let minDate = AddDaysToDate(minLength);
    let maxDate = AddDaysToDate(maxLength);
    return CompareDates(new Date(fieldValue), minDate, maxDate);
  } else if (isRequired === false) {
    return true;
  }
  return false;
};

const getNameById = (id: number): Promise<string> => {
  return new Promise(function (resolve, reject) {
    if (id > 0) {
      resolve("Stuff worked!");
    } else {
      reject(Error("It broke"));
    }
  });
};

const callFuntion = async () => {
  let response: string = await getNameById(3);
  console.log(response);
};
/**
 * add days to the current date and returns it
 * @param date
 * @param days
 * @returns date
 */
export const AddDaysToDate = (days: number): Date => {
  var result = new Date();
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * checks if the given date comes in between the provided dates
 * @param date
 * @param minDate
 * @param maxDate
 * @returns status
 */
export const CompareDates = (
  date: Date,
  minDate: Date,
  maxDate: Date
): boolean => {
  return (
    date.getTime() >= minDate.getTime() && date.getTime() <= maxDate.getTime()
  );
};

/**
 * Date difference
 * @param {*} date
 * @returns age
 */
export const GetDateDifferenceInDays = (
  dateOneStr: string,
  dateTwoStr: string
): number => {
  let dateOne = new Date(dateOneStr);
  let dateTwo = new Date(dateTwoStr);
  return Math.ceil(
    Math.abs(dateTwo.getTime() - dateOne.getTime()) / (1000 * 60 * 60 * 24)
  );
};

/**
 * Common message for field limit validation error
 * @param fieldType
 * @param minLength
 * @param maxLength
 * @param message
 * @returns message
 */
export const GetFieldLimitMessage = (
  fieldType: ValueOf<typeof VALIDATION_FIELD_TYPES>,
  minLength: number,
  maxLength: number,
  message: string
) => {
  let minReplace: string = minLength.toString();
  let maxReplace: string = maxLength.toString();
  if (
    fieldType == VALIDATION_FIELD_TYPES.NUMERIC ||
    fieldType == VALIDATION_FIELD_TYPES.INTEGER
  ) {
    minReplace = minReplace.length.toString();
    maxReplace = maxReplace.length.toString();
  } else if (fieldType == VALIDATION_FIELD_TYPES.DATE) {
    minReplace = moment(AddDaysToDate(minLength))
      .format(DATE_FORMAT.DEFAULT)
      .toString();
    maxReplace = moment(AddDaysToDate(maxLength))
      .format(DATE_FORMAT.DEFAULT)
      .toString();
  }
  message = message.replace(REPLACE_FIELDS.MIN_LENGTH, minReplace.toString());
  message = message.replace(REPLACE_FIELDS.MAX_LENGTH, maxReplace.toString());
  return message;
};

/**
 * Validate phone number
 * @param phoneNumber
 * @param regex
 * @returns validation status
 */
export const ValidatePhoneNumber = (phoneNumber: string, regex: string) => {
  if (phoneNumber) {
    return phoneNumber.match(new RegExp(regex));
  }
  return false;
};

/**
 * Validate email
 * @param email
 * @param regex
 * @returns validation status
 */
export const ValidateEmail = (email: string, regex: string) => {
  if (email) {
    return email.match(new RegExp(regex));
  }
  return false;
};

/**
 * validate password
 * @param password
 * @returns validate status
 */
export const ValidatePassword = (password: string, regex: string) => {
  if (password) {
    return password.match(new RegExp(regex));
  }
  return false;
};

/**
 * Validate file field
 * @param file
 * @param fileTypes
 * @param minLength
 * @param maxLength
 * @param isRequired
 * @returns validation status
 */
export const ValidateFile = (
  file: any,
  fileTypes: string,
  minLength: number,
  maxLength: number,
  isRequired: boolean
): boolean => {
  if (file) {
    let extension: string | undefined = GetExtension(file.name);
    let fileTypeArray: Array<string> = fileTypes ? fileTypes.split(",") : [];
    if (extension && fileTypeArray) {
      if (fileTypeArray.includes(extension.toLowerCase())) {
        if (file.size >= minLength && file.size <= maxLength) {
          return true;
        }
      }
    }
  } else if (isRequired == false) {
    return true;
  }
  return false;
};

/**
 * Convert string case to camel case
 *
 * @param str
 * @returns camelcase string
 */
export const camelize = (str: string) => {
  

  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
};

/**
 * Convert string to title case
 *
 * @param str
 * @returns title case string
 */
export const titleCase = (str: string) => {
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word.replace(word[0], word[0].toUpperCase());
    })
    .join(" ");
};

const formatDate = (date: Date) => {
  function pad(s: number) {
    return s < 10 ? "0" + s : s;
  }
  var d = new Date(date);
  return [pad(d.getMonth() + 1), pad(d.getDate()), d.getFullYear()].join("/");
};
