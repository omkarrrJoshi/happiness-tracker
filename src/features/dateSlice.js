import { createSlice } from "@reduxjs/toolkit";

// Function to format the date as dd-mm-yyyy
const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const dateSlice = createSlice({
    name: "date",
    initialState: {
        todaysDate: formatDate(new Date()),
        currentDate: formatDate(new Date())
    },
    reducers: {
        setDate(state, action){
            state.currentDate = action.payload
        },
        resetDate(state, action){
            state.currentDate = new Date();
        }
    }
})



export const { setDate, resetDate} = dateSlice.actions;

export default dateSlice.reducer;