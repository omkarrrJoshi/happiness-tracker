import { doc, updateDoc } from "firebase/firestore";
import { PARAYANA_CHAPTER_TRACKER } from "../../../../utils/constants/collections.js";
import { formatDate } from "../../../helper/helper.js";
import { db } from "../../../../src/config/firebase.js";

export async function updateParayanaChapterTrackerService(id, parayana_id, user_id, body){
  try{
    const trackedChapterRef = doc(db, PARAYANA_CHAPTER_TRACKER, id);
    const updatedData = {
      completed: body.completed,
      updated_at: formatDate(),
    }

    await updateDoc(trackedChapterRef, updatedData);

    return {
      success: true,
      id: id,
      message: 'parayana chapter tracker updated successfully',
      data: updatedData,
    }
  }catch(error){
        console.error("Error updating parayana chapter tracker:", error);
        return {
            success: false,
            message: error.message,
        }
    }
}