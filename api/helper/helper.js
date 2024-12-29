import { Timestamp } from "firebase/firestore";

export function formatDate() {
  const now = new Date();
  const options = { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit', 
    timeZoneName: 'short',
    timeZone: 'Asia/Kolkata' // Set timezone to UTC+5:30
  };
  // return now.toLocaleString('en-US', options).replace(', ', ' at ');
  return Timestamp.fromDate(now);
}

export function attachTimestamp(body){
  const timestamp = formatDate();
  body.created_at = timestamp;
  body.updated_at = timestamp;
}