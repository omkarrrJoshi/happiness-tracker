import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { PARAYANA_CHAPTER_TRACKER, PARAYANA_CHAPTERS, PARAYANAS } from "../../../../utils/constants/collections.js";
import { createEntityInDb } from "../../../db/db.js";
import { attachTimestamp } from "../../../helper/helper.js";
import { CREATED_AT, DELETED_AT, MONTH, PARAYANA_ID, PROGRESS_ID, USER_ID } from "../../../../utils/constants/schema/shlokas.js";
import { db } from "../../../../src/config/firebase.js";
import { getMonthFromDate } from "../../../utils/utils.js";

export async function getParayanasService(user_id, date){
  try{
    const customeQuery = query(
      collection(db, PARAYANAS),
      where(USER_ID, "==", user_id),
      where(DELETED_AT, "==", null),
      // orderBy(CREATED_AT, "asc")
    );
    const response = await getDocs(customeQuery);
  
    const parayanas = [];
    const month = getMonthFromDate(date);
    for (const doc of response.docs) {
      const parayana = {
        id: doc.id,
        ...doc.data(),
        progress: 0
      };
    
      // Query for parayana chapters
      const parayanaChaptersTrackerQuery = query(
        collection(db, PARAYANA_CHAPTER_TRACKER),
        // where(USER_ID, '==', user_id),
        where(PARAYANA_ID, '==', doc.id),
        where(MONTH, '==', month),
        where(DELETED_AT, '==', null),
        // orderBy(PROGRESS_ID, "asc")
      );
      const parayanaChaptersTrackerSnapshot = await getDocs(parayanaChaptersTrackerQuery);
      const parayanaChaptersTracker = parayanaChaptersTrackerSnapshot.docs.map(chapterTrackerDoc => ({
        id: chapterTrackerDoc.id,
        ...chapterTrackerDoc.data(),
      }))
      parayana.tracked_parayana_chapters = parayanaChaptersTracker;
      parayanas.push(parayana);
    };
    //sort as per req.
    sortParayanasAndChapters(parayanas);

    return {
      success: true,
      message: "parayanas fetched successfully!",
      data: parayanas, 
      size: parayanas.length
    }
  }catch(error){
    // Handle errors
    console.error("Error occured in getParayanasService :", error.message);
    // Return standardized error response
    return {
        success: false,
        message: error.message || "An error occured in getParayanasService.",
    };
  }
}

export async function createParayanaService(body){
  try{
    const { name, user_id, monthly_target, date } = body;
    const parayana = {
      name: name,
      user_id: user_id, 
      monthly_target: monthly_target,
    }
    attachTimestamp(parayana);

    const parayanaResponse = await createEntityInDb(parayana, PARAYANAS, "parayanas")
    if(!parayanaResponse.success){
      return response
    }
    return {
      success: true,
      message: 'Parayana added successfully',
      data: {
        id: parayanaResponse.docId,
        ...parayana,
        progress: 0,
        month: getMonthFromDate(date),
      }
    }
  }catch (error) {
    console.error("Error occured in createParayanaService :", error.message);
    return {
        success: false,
        message: error.message || "An error occured in createParayanaService.",
    };
  }
}

function sortParayanasAndChapters(parayanas) {
  // Sort parayanas by created_at (ascending)
  parayanas.sort((a, b) => {
    return a.created_at.seconds - b.created_at.seconds;
  });

  // Sort chapters_tracker within each parayana by progress_id (ascending), 
  // and if progress_id is the same, by created_at (ascending)
  parayanas.forEach(parayana => {
    parayana.tracked_parayana_chapters.sort((a, b) => {
      // First sort by progress_id
      if (a.progress_id !== b.progress_id) {
        return a.progress_id - b.progress_id;
      }

      // If progress_id is the same, sort by created_at (ascending)
      return a.created_at.seconds - b.created_at.seconds;
    });
  });

  return parayanas;
}
