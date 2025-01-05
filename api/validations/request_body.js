import { DAILY_PROGRESS, DAILY_TARGET, DATE, DESCRIPTION, LINK, NAME, USER_ID } from "../../utils/constants/schema/shlokas.js";
import { CREATE_SHLOKA, OPTIONAL_FIELDS, REQUIRED_FIELDS, UPDATE_DAILY_SHLOKA, UPDATE_SHLOKA } from "../utils/constants/api_actions.js";

const requestBodyValidationMap = new Map([
    [
        CREATE_SHLOKA, 
        new Map([
          [REQUIRED_FIELDS, [USER_ID, DAILY_TARGET, NAME, DATE]],
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
    ]
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