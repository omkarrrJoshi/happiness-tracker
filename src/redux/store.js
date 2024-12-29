import {configureStore} from '@reduxjs/toolkit'
import ShlokasReducer from '../features/spiritual/shlokasSlice'
export const store = configureStore({
    reducer: {
        shlokas: ShlokasReducer,
    },
});