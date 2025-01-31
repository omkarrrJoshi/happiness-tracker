import { doc, getDoc } from "firebase/firestore";
import { PARAYANA_CHAPTER_TRACKER, PARAYANA_CHAPTERS, PARAYANAS } from "../../../../utils/constants/collections.js";
import { createEntityInDb } from "../../../db/db.js";
import { attachTimestamp } from "../../../helper/helper.js";
import { db } from "../../../../src/config/firebase.js";
import { ERROR_404_NOT_FOUND } from "../../../utils/constants/error_code.js";
import { getMonthFromDate } from "../../../utils/utils.js";
import { TOTAL_SHLOKAS } from "../../../../utils/constants/schema/shlokas.js";

export async function createParayanaChapterService(body){
  try{
    const parayanaId = body.parayana_id
    const readParayana = await getParayanaById(parayanaId);
    if(!readParayana.success){
      return readParayana;
    }
    const parayana = readParayana.parayana;

    const { date,  ...chapter} = body;
    
    attachTimestamp(chapter);
    //create chapter
    const chapterResponse = await createEntityInDb(chapter, PARAYANA_CHAPTERS, "parayana chapter")

    if(!chapterResponse.success){
      return response
    }
    chapter.id = chapterResponse.docId;
    //create chapter tracker
    const monthlyTarget = parayana.monthly_target;
    const trackedParayanaChapters = await createParyanaChapterTracker(monthlyTarget, chapter, parayanaId, getMonthFromDate(date));

    return {
      success: true,
      message: 'Parayana chapter added successfully',
      data: {
        id: chapterResponse.docId,
        ...chapter,
        tracked_parayana_chapters: trackedParayanaChapters
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

async function getParayanaById(id){
  try{
    const parayanaRef = doc(db, PARAYANAS, id)
    const parayana = await getDoc(parayanaRef);
    if(!parayana.exists()){
      return {
        success: false,
        error_code: ERROR_404_NOT_FOUND,
        message: 'parayan with ID not found'
      }
    }
    return {
      success: true,
      parayana: parayana.data()
    }
  }catch{
    return {
      success: false,
      message: error.message || "An error occured in createParayanaService.",
    };
  }
}

export async function createParyanaChapterTracker(monthlyTarget, chapter, parayanaId, month){
  const trackedParayanaChapters = [];
  for(let i = 0; i < monthlyTarget; i++){
    const parayanaChapterTracker = {
      name: chapter.name,
      progress_id: i + 1,
      month: month,
      parayana_chapter_id: chapter.id,
      parayana_id: parayanaId,
      completed: false,
      user_id: chapter.user_id,
      total_shlokas: chapter.total_shlokas,
    }
    attachTimestamp(parayanaChapterTracker);
    if(chapter.created_at){
      parayanaChapterTracker.created_at = chapter.created_at;
    }
    const response = await createEntityInDb(parayanaChapterTracker, PARAYANA_CHAPTER_TRACKER, "parayana chapter tracker");
    if(!response.success){
      return response
    }
    trackedParayanaChapters.push(
      {
        id: response.docId,
        name: chapter.name,
        ...parayanaChapterTracker
      }
    )
  }
  return trackedParayanaChapters;
}