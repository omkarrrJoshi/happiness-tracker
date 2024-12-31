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