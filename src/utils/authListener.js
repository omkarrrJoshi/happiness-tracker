// authListener.js
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase"; // Your Firebase configuration
import { setUser, logoutUser } from "../features/authSlice";
import { store } from "../redux/store";

export const monitorAuthState = () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userData = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
            };
            store.dispatch(setUser(userData)); // Update Redux state with user info
        } else {
            store.dispatch(logoutUser()); // Clear Redux state
        }
    });
};
