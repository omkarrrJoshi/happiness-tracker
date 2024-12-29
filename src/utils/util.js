const API_HOST = process.env.REACT_APP_API_HOST || "http://192.168.1.4:3000";
export function get_url(api){
    console.log("url:", API_HOST + api);
    return API_HOST + api;
}

export const CURRENT_USER_ID = "003";
export const CURRENT_DATE = "25-12-2024";