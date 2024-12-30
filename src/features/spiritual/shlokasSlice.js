import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { deleteData, fetchData, postData, updateData } from "../../rest-apis";
import { get_url } from "../../utils/util";
import { SHLOKA_API, SHLOKAS_API } from "../../utils/constants/api";
import { logoutUser } from "../authSlice";

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

export const shlokas = createSlice({
    name: "shlokas",
    initialState : {
        trackedShlokasList: [],
        renderedList: false,
        isLoading: false,
        error: null,
        successMessage: null, // For handling POST success messages
        loadedInitially: false,
    },
    reducers :{
        updateDailyProgress(state, action){
            const { id, updated_daily_progress, queryParams } = action.payload;
            // Optimistically update the local state
            const shloka = state.trackedShlokasList.find(s => s.id === id);
            if (shloka) {
                const previousProgress = shloka.daily_progress;
                shloka.daily_progress = updated_daily_progress;

                // Trigger the API call after updating the state
                const apiCall = async () => {
                    try {
                        const response = await updateData(get_url(SHLOKA_API), id, queryParams, {daily_progress: shloka.daily_progress});
                        console.log("response:", response);
                        if (response.status != 200) {
                            throw new Error('API update failed');
                        }
                    } catch (error) {
                        console.log('error:', error);
                        // Rollback to previous progress if API fails
                        // shloka.daily_progress = previousProgress;
                        //TODO: manage network failures
                        alert(`Network error, please reload the page!!!, error: ${error.message}`)
                        console.error('API call failed, rollback to previous state', error);
                    }
                }
                apiCall();
            };
                
        },
        // rollbackDailyProgress(state, action) {
        //     const { id, previous_progress } = action.payload;
        //     const shloka = state.trackedShlokasList.find(s => s.id === id);
        //     if (shloka) {
        //       shloka.daily_progress = previous_progress;
        //     }
        // },
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
        });
        builder.addCase(deleteShloka.rejected, (state, action) => {
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

export const {updateDailyProgress} = shlokas.actions;

export default shlokas.reducer;