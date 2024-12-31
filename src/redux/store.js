import {configureStore} from '@reduxjs/toolkit'
import ShlokasReducer from '../features/spiritual/shlokasSlice'
import authReducer from '../features/authSlice'
import dateReducer from '../features/dateSlice'

export const store = configureStore({
    reducer: {
        shlokas: ShlokasReducer,
        auth: authReducer,
        dateReducer: dateReducer 
    },
});