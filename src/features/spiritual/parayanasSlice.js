import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData, postData, updateData } from "../../rest-apis";
import { get_url } from "../../utils/util";
import { PARAYANA_CHAPTER_TRACKER_API, PARAYANA_CHAPTERS_API, PARAYANAS_API } from "../../utils/constants/api";

export const createParayana = createAsyncThunk('createParayanas', async(args) => {
  const response = await postData(get_url(PARAYANAS_API), args);
  return response.json();
})

export const fetchParayanasTracker = createAsyncThunk('fetchParayanasTracker', async(args) => {
  const response = await fetchData(get_url(PARAYANAS_API), args);
  return response.json();
})

export const createParayanaChapter = createAsyncThunk('createParayanaChapter', async(args) => {
  const response = await postData(get_url(PARAYANA_CHAPTERS_API), args);
  return response.json();
})

export const parayanas = createSlice({
  name: 'parayanas',
  initialState: {
    parayanas_tracker: {
      loading: false,
      error: null,
      message: null,
      data: [],
      rendered: false,
    },
    parayana_chapter: {
      loading: false,
      error: null,
      message: null,
    }
  },
  reducers: {
    updateChapterCompletion(state, action){
      const {parayanaId, chapterId, userId, completed} = action.payload;
      const parayana = state.parayanas_tracker.data.find((p) => p.id === parayanaId);
      if(parayana){
        parayana.tracked_parayana_chapters = parayana.tracked_parayana_chapters.map((chapter) => {
          if (chapter.id === chapterId) {
            return { ...chapter, completed: completed };
          }
          return chapter;
        });
        const apiCall = async () => {
          try {
              const queryParams = {parayana_id: parayanaId, user_id: userId};
              const response = await updateData(get_url(PARAYANA_CHAPTER_TRACKER_API), chapterId, queryParams, {completed: completed});
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
    }
  },
  extraReducers: (builder) => {
    // fetchParayanasTracker
    builder.addCase(fetchParayanasTracker.pending, (state, action) => {
      state.parayanas_tracker.loading = true;
    });
    builder.addCase(fetchParayanasTracker.fulfilled, (state, action) => {
      state.parayanas_tracker.loading = false;
      state.parayanas_tracker.data = action.payload.data;
      state.parayanas_tracker.message = action.payload.message;
      state.parayanas_tracker.rendered = true;
    });
    builder.addCase(fetchParayanasTracker.rejected, (state, action) => {
      state.parayanas_tracker.loading = false;
      state.parayanas_tracker.error = action.payload.error;
      state.parayanas_tracker.message = action.payload.message;
    });

    // createParayanas
    builder.addCase(createParayana.pending, (state, action) => {
      state.parayanas_tracker.loading = true;
    });
    builder.addCase(createParayana.fulfilled, (state, action) => {
      state.parayanas_tracker.loading = false;
      action.payload.data.tracked_parayana_chapters = [];
      state.parayanas_tracker.data.push(action.payload.data)
      state.parayanas_tracker.message = action.payload.message;
    });
    builder.addCase(createParayana.rejected, (state, action) => {
      state.parayanas_tracker.loading = false;
      state.parayanas_tracker.error = action.payload.error;
      state.parayanas_tracker.message = action.payload.message;
    });

    // createParayanaChapter
    builder.addCase(createParayanaChapter.pending, (state, action) => {
      state.parayana_chapter.loading = true;
    });
    builder.addCase(createParayanaChapter.fulfilled, (state, action) => {
      state.parayana_chapter.loading = false;
      const response = action.payload.data;
      const parayana_id = response.parayana_id
      const parayana = state.parayanas_tracker.data.find((parayana) => parayana.id === parayana_id);
      parayana.tracked_parayana_chapters = parayana.tracked_parayana_chapters.concat(response.tracked_parayana_chapters)
      state.parayana_chapter.message = action.payload.message;
    });
    builder.addCase(createParayanaChapter.rejected, (state, action) => {
      state.parayana_chapter.loading = false;
      state.parayana_chapter.error = action.payload.error;
      state.parayana_chapter.message = action.payload.message;
    });
  }
})

export const { updateChapterCompletion } = parayanas.actions;

export default parayanas.reducer;