import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";


const API_HOST = "http://192.168.1.4:3000";
export function get_url(api){
    console.log("env host:", process.env.REACT_APP_API_HOST)
    return API_HOST + api;
}

export const showNotification = (message, timer=3000) => {
    Swal.fire({
        text: message,
        position: "top-end",
        toast: true,
        timer: timer,
        timerProgressBar: true,
        icon: "success",
        showConfirmButton: false,
    });
};

export const getISTDate = () => {
    const options = { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        timeZone: 'Asia/Kolkata', // IST timezone
    };
    
    const date = new Date().toLocaleString('en-IN', options);
    
    // Reformat the date to dd-mm-yyyy
    const [day, month, year] = date.split('/');
    return `${day}-${month}-${year}`;
}

export const CURRENT_USER_ID = "001";
export const CURRENT_DATE = "25-12-2024";