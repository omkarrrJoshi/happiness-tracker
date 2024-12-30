// authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null, // Stores user info like uid, email, etc.
        isLoggedIn: false, // Tracks if the user is logged in
        loading: true, 
    },
    reducers: {
        setUser(state, action) {
            state.user = action.payload;
            state.isLoggedIn = !!action.payload; // True if user info is provided
            state.loading = false;
        },
        logoutUser(state) {
            state.user = null;
            state.isLoggedIn = false;
            state.loading = false;
        },
    },
});

export const { setUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;
