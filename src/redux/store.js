import {configureStore} from '@reduxjs/toolkit'
import ShlokasReducer from '../features/spiritual/shlokasSlice'
import authReducer from '../features/authSlice'
import dateReducer from '../features/dateSlice'
import parayanaReducer from '../features/spiritual/parayanasSlice'
import namsmaranReducer from '../features/spiritual/namsmaranSlice'

export const store = configureStore({
    reducer: {
        shlokas: ShlokasReducer,
        auth: authReducer,
        dateReducer: dateReducer ,
        parayanas: parayanaReducer,
        namsmaran: namsmaranReducer,
    },
});