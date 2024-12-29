import { addDoc, collection } from "firebase/firestore";
import { db } from "../../src/config/firebase.js";

export async function createEntityInDb(body, firestore_collection, entity) {
    try{
        const shlokaDocRef = await addDoc(collection(db, firestore_collection), body);
        return {
            success: true,
            message: entity + " added successfully.",
            docId: shlokaDocRef.id,
        };

    }catch(error){
        console.error("Error occured while querying db for adding", entity, ":", error.message);
        // Return standardized error response
        return {
            success: false,
            message: error.message || "An error occurred while adding the" + entity + ".",
        };
    }
}
