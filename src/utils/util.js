import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "./util.css"

const API_HOST = "http://192.168.1.5:3000";
export function get_url(api){
    console.log("env host:", process.env.REACT_APP_API_HOST)
    return API_HOST + api;
}

export const showNotification = (message, timer=3000, position="top-end", customClass="") => {
    Swal.fire({
        text: message,
        position: position,
        toast: true,
        timer: timer,
        timerProgressBar: true,
        icon: "success",
        showConfirmButton: true,
        customClass: {
            popup: customClass, // Add custom class for the popup
        },
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

export const excludeFields = (obj, fieldsToExclude) => {
    const { [fieldsToExclude[0]]: _, [fieldsToExclude[1]]: __, ...rest } = obj;
    return rest;
};
