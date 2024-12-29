import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { formatDate } from "../../helper/helper.js";
import { db } from "../../../src/config/firebase.js";

export async function dailyShloks(user_id, date, shlokas){
    try {
        const dailyShloks = await checkIfDailyShlokaPresent(user_id, date);
        if (dailyShloks.exist) {
            return dailyShloks.data;
        } else {
            return await createDailyShlokas(user_id, date, shlokas);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function checkIfDailyShlokaPresent(user_id, date){
    try{
        const shlokasTrackerQuery = query(
            collection(db, 'daily_shlokas_tracker'),
            where('user_id', '==', user_id),
            where('date', '==', date)
        );
        const dailyShlokasTrackerSnapshot = await getDocs(shlokasTrackerQuery);
        // Check if there are any documents in the snapshot
        if (!dailyShlokasTrackerSnapshot.empty) {
            console.log(`Shloka exists for the given user: ${user_id} and date: ${date}`);
            const data = dailyShlokasTrackerSnapshot.docs.map(doc => doc.data());
            return {exist: true, data}; // A document exists for the given user and date
        }
        console.log(`Shloka does not exists for the given user: ${user_id} and date: ${date}`);
        return {exist: false, snapshot: null};
    } catch (error) {
        console.error('Error checking daily shloka presence:', error);
        throw error; // Rethrow the error for the calling code to handle
    }
}

async function createDailyShlokas(user_id, date, shlokas){
    try{
        console.log(`creating Shlokas for the given user: ${user_id} and date: ${date}`);
        const dailyShlokaTracker = [];
        shlokas.map(shloka => {
            const timestamp = formatDate();
            const dailyShloka = {
                shloka_id: shloka.id, 
                user_id: user_id, 
                daily_progress: 0, 
                date: date,
                created_at: timestamp,
                updated_at: timestamp
            }
            dailyShlokaTracker.push(dailyShloka)
            
        });
        for(let i = 0; i < dailyShlokaTracker.length; i++){
            const docRef = await addDoc(collection(db, 'daily_shlokas_tracker'), dailyShlokaTracker[i]);
        }
        console.log(`Shlokas creation for the given user: ${user_id} and date: ${date} completed`);  
        return dailyShlokaTracker;
    }catch(error){
        console.error('Error while adding daily shloka tracker:', error);
        throw error;
    }
}

export function mergeShlokasAndTrackedShlokas(shloks, trackked_shlokas) {
    // Iterate over tracked_shlokas to create the merged result
    const mergedData = trackked_shlokas.map(tracked => {
      // Find the corresponding shloka from shloks
      const shloka = shloks.find(shloka => shloka.id === tracked.shloka_id);
  
      if (shloka) {
        return {
          id: shloka.id,
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
  