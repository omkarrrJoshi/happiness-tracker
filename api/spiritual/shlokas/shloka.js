import { db } from '../../../src/config/firebase.js'; // Adjust the path if needed
import { collection, addDoc,  getDocs, query, where } from 'firebase/firestore';
import { validateRequestBody } from '../../helper/validations.js';
import { formatDate } from '../../helper/helper.js';
import { dailyShloks, mergeShlokasAndTrackedShlokas } from './daily-shloka-tracker.js';
import { DAILY_SHLOKAS_TRACKER, SHLOKAS } from '../../../utils/constants/collections.js';
import { DAILY_TARGET, DATE, DESCRIPTION, LINK, NAME, USER_ID } from '../../../utils/constants/schema/shlokas.js';
import { GET, POST } from '../../../utils/constants/rest_methods.js';

export default async function handler(req, res) {
  if (req.method === POST) {
    try {
      // Get data from the request body
      const data = req.body;
      const requiredFields = [USER_ID, DAILY_TARGET, NAME, DATE];
      const allowedFields = [USER_ID, DAILY_TARGET, NAME, DATE, LINK, DESCRIPTION];
      const isValid = validateRequestBody(data, requiredFields, allowedFields);
      if (!isValid.valid) {
        return res.status(400).json({ error: 'Invalid request body', details: isValid.message });
      }

      const timestamp = formatDate();
      data.created_at = timestamp;
      data.updated_at = timestamp;
      // Reference your Firestore collection

      const {date, ...shlokaData}  = data;
      const shlokaDocRef = await addDoc(collection(db, SHLOKAS), shlokaData);

      const dailyShlokaTrackerData = {
        user_id: data.user_id,
        shloka_id: shlokaDocRef.id,
        daily_progress: 0,
        date: date,
        created_at: timestamp,
        updated_at: timestamp
      }
      const dailyTrackedShlokaRef = await addDoc(collection(db, DAILY_SHLOKAS_TRACKER), dailyShlokaTrackerData)
    //   // Respond with success
      res.status(200).json(
        { message: 'Documents added successfully!', 
          data: {...data, 
            shloka_id: shlokaDocRef.id, 
            id: dailyTrackedShlokaRef.id,
            daily_progress: 0,
          } 
        });
    } catch (error) {
      // Handle errors
      res.status(500).json({ error: 'Failed to add document', details: error.message });
    }
  } else if (req.method === GET) {
    try {
      // Get all documents from the "shlokas" Firestore collection for specific user
      const { user_id, date } = req.query;
      if (!user_id || !date) {
        return res.status(400).json({ error: 'User ID and date is required' });
      }
      // Create a query to get shlokas filtered by user_id
      const shlokasQuery = query(
        collection(db, SHLOKAS),
        where(USER_ID, '==', user_id)
      );
      const shlokasList = await getDocs(shlokasQuery);

      // const dailyShlokaTrackerList = await getDocs(collection(db, 'daily_shlokas_tarcker'))
      // Create an array of all shlokas
      const shlokas = [];
      shlokasList.forEach(doc => {
        shlokas.push({ id: doc.id, ...doc.data() });
      });

      if(shlokas.length == 0){
        return res.status(200).json({ message: 'No shlokas present', data: {}, size: shlokas.length})
      }

      const trackedShlokas = await dailyShloks(user_id, date, shlokas);
      const mergedShlokas = mergeShlokasAndTrackedShlokas(shlokas, trackedShlokas);
      return res.status(200).json({ data: mergedShlokas, size: mergedShlokas.length})
    } catch (error) {
      console.error('Error fetching shlokas:', error);
      res.status(500).json({ error: 'Failed to fetch shlokas', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed. Use GET or POST.' });
  }
}
