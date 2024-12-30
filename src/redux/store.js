import {configureStore} from '@reduxjs/toolkit'
import ShlokasReducer from '../features/spiritual/shlokasSlice'
import authReducer from '../features/authSlice'
export const store = configureStore({
    reducer: {
        shlokas: ShlokasReducer,
        auth: authReducer
    },
});