import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { deleteData, fetchData, postData, updateData } from "../../rest-apis";
import { get_url, showNotification } from "../../utils/util";
import { DAILY_SHLOKA_API, SHLOKA_API, SHLOKAS_API } from "../../utils/constants/api";
import { logoutUser } from "../authSlice";

function sortShlokas(trackedShlokasList) {
    return trackedShlokasList.sort((a, b) => {
        // Step 1: Sort based on daily_progress >= daily_target
        const aProgressComplete = a.daily_progress >= a.daily_target;
        const bProgressComplete = b.daily_progress >= b.daily_target;

        if (aProgressComplete !== bProgressComplete) {
            // Move items with completed progress (true) to the end
            return aProgressComplete ? 1 : -1;
        }

        // Step 2: If both are either complete or not, sort by created_at (ascending)
        const aCreatedAt = a.created_at.seconds;
        const bCreatedAt = b.created_at.seconds;
        return aCreatedAt - bCreatedAt;
    });
}

const showUpdateNotificaion = (shloka, previousProgress) => {
    if(shloka.daily_progress >= shloka.daily_target && shloka.daily_progress > previousProgress){
        showNotification(`Congratulations!!! \n You have completed todays target for ${shloka.name}`, 3000, "center", "custom-toast-popup")
    }
    else{
        showNotification(`Daily progress for ${shloka.name} updated to ${shloka.daily_progress} from ${previousProgress}`, 2500);
    }
}

//GET API Action
export const fetchTrackedShlokas = createAsyncThunk('fetchTrackedShlokas', async(args) => {
    const response = await fetchData(get_url(SHLOKAS_API), args);
    return response.json();
})

// POST API Action
export const createShloka = createAsyncThunk('shlokas/createShloka', async (newShloka) => {
    const response = await postData(get_url(SHLOKAS_API), newShloka);
    return response.json();
});

// DELETE API Action
export const deleteShloka = createAsyncThunk('deleteShloka', async (args) => {
    const response = await deleteData(get_url(SHLOKA_API), args.id, args.queryParams);
    return response.json();
});

// UPDATE API Action
export const updateShloka = createAsyncThunk('updateShloka', async (args) => {
    const response = await updateData(get_url(SHLOKA_API), args.shloka_id, args.queryParams, args.updatedBody);
    return response.json();
});


export const shlokas = createSlice({
    name: "shlokas",
    initialState : {
        trackedShlokasList: [],
        renderedList: false,
        isLoading: false,
        error: null,
        successMessage: null, // For handling POST success messages
        loadedInitially: false,
        date: null
    },
    reducers :{
        updateShlokasDailyProgress(state, action){
            const { id, updated_daily_progress, queryParams } = action.payload;
            // Optimistically update the local state
            const shloka = state.trackedShlokasList.find(s => s.id === id);
            if (shloka) {
                const previousProgress = shloka.daily_progress;
                shloka.daily_progress = updated_daily_progress;
                showUpdateNotificaion(shloka, previousProgress)
                // Trigger the API call after updating the state
                const apiCall = async () => {
                    try {
                        const response = await updateData(get_url(DAILY_SHLOKA_API), id, queryParams, {daily_progress: shloka.daily_progress});
                        if (response.status !== 200) {
                            throw new Error('API update failed');
                        }
                    } catch (error) {
                        console.log('error:', error);
                        alert(`Error occured, please contact developer!!!, error: ${error.message}`)
                        console.error('API call failed, rollback to previous state', error);
                    }
                }
                apiCall();
            }
            state.trackedShlokasList = sortShlokas(state.trackedShlokasList);    
        },
    },
    extraReducers: (builder) => {
        // GET API Reducers
        builder.addCase(fetchTrackedShlokas.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(fetchTrackedShlokas.fulfilled, (state, action) => {
            state.isLoading = false;
            state.trackedShlokasList = action.payload.data;
            state.renderedList = true;
            state.loadedInitially = true
            //sorted list
            state.trackedShlokasList = sortShlokas(state.trackedShlokasList);
            state.date = action.payload.date;
        });
        builder.addCase(fetchTrackedShlokas.rejected, (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        })

        // POST API Reducers
        builder.addCase(createShloka.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(createShloka.fulfilled, (state, action) => {
            state.isLoading = false;
            state.successMessage = "Shloka created successfully!";
            state.trackedShlokasList = [...(state.trackedShlokasList || []), action.payload.data]; // Add new shloka to the list
            //sorted list
            state.trackedShlokasList = sortShlokas(state.trackedShlokasList);
        });
        builder.addCase(createShloka.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });

        // DELETE API Reducers
        builder.addCase(deleteShloka.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(deleteShloka.fulfilled, (state, action) => {
            state.isLoading = false;
            state.successMessage = "Shloka deleted successfully!";
            // remove shloka with id as given id from the list list
            const deletedShlokaId = action.payload.id;
            state.trackedShlokasList = state.trackedShlokasList.filter(shloka => shloka.id !== deletedShlokaId);
            //sorted list
            state.trackedShlokasList = sortShlokas(state.trackedShlokasList);
        });
        builder.addCase(deleteShloka.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });

        // UPDATE API Reducers
        builder.addCase(updateShloka.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(updateShloka.fulfilled, (state, action) => {
            state.isLoading = false;
            state.successMessage = "Shloka Updated successfully!";
            // remove shloka with id as given id from the list list
            const updatedShlokaId = action.payload.shloka_id;
            const shloka = state.trackedShlokasList.find(shloka => shloka.shloka_id === updatedShlokaId);
            const updatedData = action.payload.data;
            shloka.name = updatedData.name;
            shloka.daily_target = updatedData.daily_target;
            shloka.description = updatedData.description;
            shloka.link = updatedData.link;
            //sorted list
            state.trackedShlokasList = sortShlokas(state.trackedShlokasList);
        });
        builder.addCase(updateShloka.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });

        // Reset shlokas state on logout
        builder.addCase(logoutUser, () => {
            return {
                trackedShlokasList: [],
                renderedList: false,
                isLoading: false,
                error: null,
                successMessage: null, // For handling POST success messages
                loadedInitially: false,
            };
         });
    },
});

export const {updateShlokasDailyProgress} = shlokas.actions;

export default shlokas.reducer;