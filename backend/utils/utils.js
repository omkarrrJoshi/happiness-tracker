import { IST_OFFSET } from "./constants/constants.js";
import { Timestamp } from "firebase/firestore";

export function convertToIstTimestamp(dateStr) {
     // Split the date string (dd-mm-yyyy)
  const [day, month, year] = dateStr.split('-').map(Number);

  // Create a new Date object (Note: months are 0-indexed in JavaScript)
  // Set to midnight in UTC first
  const dateUTC = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));

  // Manually adjust for Asia/Kolkata timezone (UTC +5:30)
//   const timezoneOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
  const dateInKolkata = new Date(dateUTC.getTime() + IST_OFFSET);

  // Convert to Firestore Timestamp
  const firestoreTimestamp = Timestamp.fromDate(dateInKolkata);

  return firestoreTimestamp;
}

export function getMonthFromDate(dateString) {
  // Split the date string by the '-' delimiter
  const parts = dateString.split('-');
  
  // Extract the month part (second element in the array)
  const month = parts[1];
  return parseInt(month, 10); // Converts to number
}

export async function handleServiceCallAndWriteResponse(serviceFunction, res, errorMessage) {
  try {
      const response = await serviceFunction();
      if (response.success) {
          res.status(200).json({
              message: response.message,
              data: response.data,
          });
      } else {
          const error_code = response.error_code || 500;
          res.status(error_code).json({
              message: errorMessage,
              error: response.message,
          });
      }
  } catch (error) {
      res.status(500).json({
          message: errorMessage,
          error: error.message,
      });
  }
}