// import { auth } from "../config/firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect } from "firebase/auth";
import React, { useState } from 'react';
import { auth, googleProvider } from "../config/firebase.js";
import { useNavigate } from 'react-router-dom'; // or any router you use

import './auth.css';

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle sign-up
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/spiritual'); // Redirect after sign-up
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle sign-in
  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/spiritual'); // Redirect after sign-in
    } catch (err) {
      handleError(err.message);
    }
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      await signInWithRedirect(auth, googleProvider);
      navigate("/spiritual") // Redirect after Google sign-in
    } catch (err) {
      handleError(err.message);
    }
  };

  const handleError = (errorMessage) => {
    alert(errorMessage); // Display alert for errors
    setError(null); // Clear error after alert
  };

  return (
    <div className="auth-container">
      {/* <h2>{error ? `Error: ${error}` : 'Sign In / Sign Up'}</h2> */}

      <form>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <div className="buttons">
          <button type="submit" onClick={handleSignUp}>
            Sign Up
          </button>
          <button type="submit" onClick={handleSignIn}>
            Sign In
          </button>
        </div>
      </form>

      {/* <div>
        <button onClick={handleGoogleSignIn} className="google-signin">
          Sign in with Google
        </button>
      </div> */}
    </div>
  );
}

export default Auth;
