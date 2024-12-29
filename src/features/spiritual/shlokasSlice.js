import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { fetchData, postData } from "../../rest-apis";
import { CURRENT_DATE, CURRENT_USER_ID, get_url } from "../../utils/util";
import { SHLOKAS_API } from "../../utils/constants/api";

//GET API Action
export const fetchTrackedShlokas = createAsyncThunk('fetchTrackedShlokas', async() => {
    const queryParams = {
        user_id: CURRENT_USER_ID,
        date: CURRENT_DATE
    };
    const response = await fetchData(get_url(SHLOKAS_API), queryParams);
    return response.json();
})

// POST API Action
export const createShloka = createAsyncThunk('shlokas/createShloka', async (newShloka) => {
    const response = await postData(get_url(SHLOKAS_API), newShloka);
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
        });
        builder.addCase(fetchTrackedShlokas.rejected, (state, action) => {
            state.error = action.payload;
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
    },
});

export default shlokas.reducer;