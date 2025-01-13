import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../src/config/firebase.js";
import { SHLOKAS, DAILY_SHLOKAS_TRACKER } from "../../../../utils/constants/collections.js";
import { DAILY_PROGRESS } from "../../../../utils/constants/schema/shlokas.js";
import { formatDate } from "../../../helper/helper.js";

export async function updateShloka(id, userId, body){
// 2 possibilities
    try{
        // Reference the document in DAILY_SHLOKAS_TRACKER
        const ShlokaRef = doc(db, SHLOKAS, id);

        // Update the daily_progress field
        const updatedData = {
            ...body,
            updated_at: formatDate(), // Add a timestamp for tracking updates
        };

        // Perform the update
        await updateDoc(ShlokaRef, updatedData);
        console.log(`Shloka with the id ${id} updated successfully!`);

        // Return a success response
        return {
            success: true,
            id: id,
            message: "Shloka updated successfully",
            updatedData
        };
    }
    catch(error){
        console.error("Error updating shloka:", error);
        return {
            success: false,
            message: error.message,
        }
    }
}

export async function deleteShloka(id, userId, date, shlokaId){
    try{
        //delete the entry from daily tracker shloka for the date
        const trackedShlokaRef = doc(db, DAILY_SHLOKAS_TRACKER, id);
        await deleteDoc(trackedShlokaRef);
        console.log(`tracked shloka with id ${id} deleted succesfully`);

        //soft delete shloka
        const updatedData = {deleted_at: formatDate()}
        const shlokaRef = doc(db, SHLOKAS, shlokaId);
        await updateDoc(shlokaRef, updatedData);
        console.log(`soft delete of shloka with shloka id ${shlokaId} succesfull`);
        return{
            success: true,
            id: id,
            message: "shloka deleted successfully!"
        }

    }catch(error){
        console.error('Error deleting tracked shloka:', error);
        return {
            success: false,
            message: error.message,
        }
    }
}