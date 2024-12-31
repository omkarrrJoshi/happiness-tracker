import React, { useEffect, useState } from "react";
import "./date-selector.css";
import { useDispatch, useSelector } from "react-redux";
import { store } from "../redux/store";
import { setDate } from "../features/dateSlice";
import { fetchTrackedShlokas } from "../features/spiritual/shlokasSlice";

const DateSelector = () => {
//   const [selectedDate, setSelectedDate] = useState(new Date());
  const user = useSelector((state) => state.auth.user);
  const selectedDate = useSelector((state) => state.dateReducer.currentDate);
  const todaysDate = useSelector((state) => state.dateReducer.todaysDate);
  const dispatch = useDispatch();
  
  useEffect(() =>{
    const queryParams = {
      user_id: user.uid,
      date: selectedDate
    };
    dispatch(fetchTrackedShlokas(queryParams));
  }, [selectedDate]);

  const reverseDate = (date) => {
    //changes yyyy-mm-dd to dd-mm-yyyy and vice versa
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  }

  const changeDate = (days) => {
    // Parse the input date in dd-mm-yyyy format
    const [day, month, year] = selectedDate.split("-").map(Number);
    // Create a Date object
    const date = new Date(year, month - 1, day); // Month is 0-indexed
  
    // Add the specified number of days
    date.setDate(date.getDate() + days);
  
    // Format the resulting date back to dd-mm-yyyy
    const newDay = String(date.getDate()).padStart(2, "0");
    const newMonth = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const newYear = date.getFullYear();
    store.dispatch(setDate(`${newDay}-${newMonth}-${newYear}`));
  }

  const handleDateChange = (date) => {
    // setSelectedDate(new Date(event.target.value));
    // const [year, month, day] = event.target.value.split("-");
    store.dispatch(setDate(date));
  };

  return (
    <div>
      <div className="date-selector">
        <button className="date-button" onClick={() => changeDate(-1)}>
          ←
        </button>
        <div className="date-display">
          {selectedDate}
        </div>
        <button className="date-button" onClick={() => changeDate(+1)} disabled={todaysDate === selectedDate}>
          →
        </button>
        
      </div>
      <div className="date-selector">
        <input
            type="date"
            className="date-input"
            value={selectedDate}
            onChange={(e) => handleDateChange(reverseDate(e.target.value))}
            max={reverseDate(todaysDate)}
          />
          
          <button className="date-button" onClick={(e) => handleDateChange(todaysDate)} disabled={todaysDate === selectedDate}>
            Today
          </button>
      </div>
    </div>
  );
};

export default DateSelector;
