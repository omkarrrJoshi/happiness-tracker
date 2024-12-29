import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../src/config/firebase.js";
import { SHLOKAS, DAILY_SHLOKAS_TRACKER } from "../../../../utils/constants/collections.js";
import { formatDate } from "../../../helper/helper.js";

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