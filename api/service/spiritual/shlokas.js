import { collection, getDocs, query, where } from "firebase/firestore";
import { DAILY_SHLOKAS_TRACKER, SHLOKAS } from "../../../utils/constants/collections.js";
import { createEntityInDb } from "../../db/db.js";
import { attachTimestamp, formatDate } from "../../helper/helper.js";
import { DATE, DELETED_AT, USER_ID } from "../../../utils/constants/schema/shlokas.js";
import { db } from "../../../src/config/firebase.js";
import { convertToIstTimestamp } from "../../utils/utils.js";

export async function createShloka(body){
    try{
        attachTimestamp(body);
        const {date, ...shlokaData}  = body;
        const shlokaResponse = await createEntityInDb(shlokaData, SHLOKAS, "shloka");
        if(!shlokaResponse.success){
            return shlokaResponse;
        }
        console.log("date:", date);
        console.log("formated date:", convertToIstTimestamp(date))
        const dailyShlokaTrackerData = {
            user_id: body.user_id,
            shloka_id: shlokaResponse.docId,
            daily_progress: 0,
            date: convertToIstTimestamp(date),
        }
        attachTimestamp(dailyShlokaTrackerData);
        const dailyTrackedShlokaResponse = await createEntityInDb(
            dailyShlokaTrackerData, DAILY_SHLOKAS_TRACKER, "tracked shloka");
        
        if(!dailyTrackedShlokaResponse.success){
            return dailyTrackedShlokaResponse;
        }
        return {
            success: true,
            message: "shloka added successfully!",
            data: {...body, 
                shloka_id: shlokaResponse.docId, 
                id: dailyTrackedShlokaResponse.docId,
                daily_progress: 0,
            },
        };
    } catch (error) {
        // Handle errors
        console.error("Error occured in service while adding shloka :", error.message);
        // Return standardized error response
        return {
            success: false,
            message: error.message || "An error occured in service while adding shloka.",
        };
    }
}

export async function getTrackedShlokas(user_id, date){
    try{
        date = convertToIstTimestamp(date);
        const shlokasQuery = query(
            collection(db, SHLOKAS),
            where(USER_ID, '==', user_id),
            where(DELETED_AT, '==', null) //TODO: make this as deleted_at <= current_date, delted_at > created_at, think on this if this is necessary?
        );
        const shlokasList = await getDocs(shlokasQuery);
        // Create an array of all shlokas
        const shlokas = [];
        shlokasList.forEach(doc => {
            shlokas.push({ id: doc.id, ...doc.data() });
        });

        if(shlokas.length == 0){
            return {
                success: true,
                message: "No shlokas present",
                data: [],
                size: 0
            }
        }
        const trackedShlokasResp = await dailyShloks(user_id, date, shlokas);
        if(!trackedShlokasResp.success){
            return trackedShlokasResp;
        }
        const trackedShlokas = trackedShlokasResp.data;
        const mergedShlokas = mergeShlokasAndTrackedShlokas(shlokas, trackedShlokas);
        return {
            success: true,
            message: "tracked shlokas fetched successfully!",
            data: mergedShlokas, 
            size: mergedShlokas.length
        }
    }
    catch(error){
        // Handle errors
        console.error("Error occured in service while fetching shlokas :", error.message);
        // Return standardized error response
        return {
            success: false,
            message: error.message || "An error occured in service while fetching shlokas",
        };
    }
}

async function dailyShloks(user_id, date, shlokas){
    try {
        const dailyShloks = await checkIfDailyShlokaPresent(user_id, date);
        if(!dailyShloks.success){
            return dailyShloks;
        }
        if (dailyShloks.exist) {
            return {
                success: true,
                message: "Shlokas fetched succesfully.",
                data: dailyShloks.data,
            };
        } else {
            const dailyShlokaRef = await createDailyShlokas(user_id, date, shlokas);
            if(!dailyShlokaRef.success){
                return dailyShlokaRef;
            }
            return {
                success: true,
                message: "Shlokas created succesfully.",
                data: dailyShlokaRef.data,
            }
        }
    } catch(error){
        // Handle errors
        console.error("Error occured in dailyShloks while fetching tracked shlokas :", error.message);
        // Return standardized error response
        return {
            success: false,
            message: error.message || "An error occured in dailyShloks while fetching tracked shlokas",
        };
    }
}

async function checkIfDailyShlokaPresent(user_id, date){
    try{
        const shlokasTrackerQuery = query(
            collection(db, DAILY_SHLOKAS_TRACKER),
            where(USER_ID, '==', user_id),
            where(DATE, '==', date)
        );
        const dailyShlokasTrackerSnapshot = await getDocs(shlokasTrackerQuery);
        // Check if there are any documents in the snapshot
        if (!dailyShlokasTrackerSnapshot.empty) {
            console.log(`Shloka exists for the given user: ${user_id} and date: ${date}`);
            const data = dailyShlokasTrackerSnapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
            // A document exists for the given user and date
            return {
                success: true, 
                exist: true, 
                data: data
            }; 
        }
        console.log(`Shloka does not exists for the given user: ${user_id} and date: ${date}`);
        return {success: true, exist: false, data: null};
    }catch(error){
        // Handle errors
        console.error("Error occured in checkIfDailyShlokaPresent while fetching tracked shlokas :", error.message);
        // Return standardized error response
        return {
            success: false,
            message: error.message || "An error occured in checkIfDailyShlokaPresent while fetching tracked shlokas",
        };
    }
}

async function createDailyShlokas(user_id, date, shlokas){
    try{
        console.log(`creating Shlokas for the given user: ${user_id} and date: ${date}`);
        const dailyShlokaTracker = [];
        shlokas.map(shloka => {
            const dailyShloka = {
                shloka_id: shloka.id, 
                user_id: user_id, 
                daily_progress: 0, 
                date: date,
            }
            attachTimestamp(dailyShloka);
            dailyShlokaTracker.push(dailyShloka)
            
        });
        for(let i = 0; i < dailyShlokaTracker.length; i++){
            const docRef = await createEntityInDb(dailyShlokaTracker[i], DAILY_SHLOKAS_TRACKER, "daily shloka tracker");
            if(!docRef.success){
                return docRef;
            }
            dailyShlokaTracker[i].id = docRef.docId;
        }
        console.log(`Shlokas creation for the given user: ${user_id} and date: ${date} completed`);  
        return {success: true, data: dailyShlokaTracker};
    }catch(error){
        // Handle errors
        console.error("Error occured in createDailyShlokas while fetching tracked shlokas :", error.message);
        // Return standardized error response
        return {
            success: false,
            message: error.message || "An error occured in createDailyShlokas while fetching tracked shlokas",
        };
    }
}

function mergeShlokasAndTrackedShlokas(shloks, trackked_shlokas) {
    // Iterate over tracked_shlokas to create the merged result
    const mergedData = trackked_shlokas.map(tracked => {
      // Find the corresponding shloka from shloks
      const shloka = shloks.find(shloka => shloka.id === tracked.shloka_id);
  
      if (shloka) {
        return {
          id: tracked.id,
          shloka_id: tracked.shloka_id,
          user_id: shloka.user_id,
          name: shloka.name,
          daily_target: shloka.daily_target,
          link: shloka.link || null,
          created_at: shloka.created_at || null,
          updated_at: shloka.updated_at || null,
          daily_progress: tracked.daily_progress
        };
      }
  
      // If no matching shloka is found, return null or skip this tracked_shloka
      return null;
    });
  
    // Filter out any null entries in the result
    return mergedData.filter(item => item !== null);
  }