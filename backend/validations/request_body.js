import { COMPLETED, DAILY_PROGRESS, DAILY_TARGET, DATE, DESCRIPTION, LINK, MONTHLY_TARGET, NAME, PARAYANA_ID, TOTAL_SHLOKAS, TYPE, USER_ID } from "../../utils/constants/schema/shlokas.js";
import { CREATE_PARAYANA, CREATE_PARAYANA_CHAPTER, CREATE_SHLOKA, OPTIONAL_FIELDS, REQUIRED_FIELDS, UPDATE_DAILY_SHLOKA, UPDATE_PARAYANA_CHAPTER_TRACKER, UPDATE_SHLOKA } from "../utils/constants/api_actions.js";

const requestBodyValidationMap = new Map([
    [
        CREATE_SHLOKA, 
        new Map([
          [REQUIRED_FIELDS, [USER_ID, DAILY_TARGET, NAME, DATE, TYPE]],
          [OPTIONAL_FIELDS, [LINK, DESCRIPTION]],
        ])
    ],
    [
      UPDATE_SHLOKA,
      new Map([
        [REQUIRED_FIELDS, []],
        [OPTIONAL_FIELDS, [DAILY_TARGET, NAME, LINK, DESCRIPTION]],
      ])
    ],
    [
      UPDATE_DAILY_SHLOKA,
      new Map([
        [REQUIRED_FIELDS, [DAILY_PROGRESS]],
        [OPTIONAL_FIELDS, []],
      ])
    ],

    //parayanas
    [
      CREATE_PARAYANA,
      new Map([
        [REQUIRED_FIELDS, [USER_ID, MONTHLY_TARGET, NAME, DATE]],
        [OPTIONAL_FIELDS, []],
      ])
    ],
    [
      CREATE_PARAYANA_CHAPTER,
      new Map([
        [REQUIRED_FIELDS, [PARAYANA_ID, USER_ID, NAME, DATE]],
        [OPTIONAL_FIELDS, [LINK, DESCRIPTION, TOTAL_SHLOKAS]],
      ])
    ],
    [
      UPDATE_PARAYANA_CHAPTER_TRACKER,
      new Map([
        [REQUIRED_FIELDS, [COMPLETED]],
        [OPTIONAL_FIELDS, []],
      ])
    ],
])

export function validate(apiAction, body) {
    const requiredFields = requestBodyValidationMap.get(apiAction).get(REQUIRED_FIELDS);
    const optionalFields = requestBodyValidationMap.get(apiAction).get(OPTIONAL_FIELDS);
    const allowedFields = [...requiredFields, ...optionalFields];

    // Check for missing fields
    for (const field of requiredFields) {
      if (!body.hasOwnProperty(field) || body[field] === null || body[field] === '') {
        return { valid: false, message: `Missing required field: ${field}` };
      }
    }
  
    // Check for unexpected fields
    for (const field in body) {
      if (!allowedFields.includes(field)) {
        return { valid: false, message: `Unexpected field: ${field}` };
      }
    }
  
    // All validations passed
    return { valid: true };
}