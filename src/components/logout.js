import React from "react";
import { useDispatch } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase"; // Ensure you import your Firebase auth instance
import { logoutUser } from "../features/authSlice";

const LogoutButton = () => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out from Firebase
      dispatch(logoutUser()); // Reset user in Redux
      alert("You have successfully logged out."); // Feedback to user
    } catch (err) {
      console.error("Error during logout:", err.message);
      alert("An error occurred while logging out. Please try again.");
    }
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button>
  );
};

export default LogoutButton;
