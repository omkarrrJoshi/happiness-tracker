import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../src/config/firebase.js";
import { SHLOKAS, DAILY_SHLOKAS_TRACKER } from "../../../../utils/constants/collections.js";
import { DAILY_PROGRESS } from "../../../../utils/constants/schema/shlokas.js";
import { formatDate } from "../../../helper/helper.js";

export async function updateDailyShloka(id, userId, date, shlokaId, body){
// 2 possibilities
    try{
        // 1st: body with only daily_progress
        if(DAILY_PROGRESS in body){
            // Reference the document in DAILY_SHLOKAS_TRACKER
            const trackedShlokaRef = doc(db, DAILY_SHLOKAS_TRACKER, id);

            // Update the daily_progress field
            const updatedData = {
                daily_progress: body.daily_progress,
                updated_at: formatDate(), // Add a timestamp for tracking updates
            };

            // Perform the update
            await updateDoc(trackedShlokaRef, updatedData);
            console.log(`Daily progress updated successfully for tracked shloka with ID ${id}`);

            // Return a success response
            return {
                success: true,
                id: id,
                message: "Daily progress updated successfully!",
                updatedData
            };
        }
        // 2nd: body with name or link or description or daily_traget
        else{
            throw new Error("Missing 'daily_progress' field in the request body.");
        }
    }
    catch(error){
        console.error("Error updating tracked shloka:", error);
        return {
            success: false,
            message: error.message,
        }
    }
}
