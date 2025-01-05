import './App.css';
import Spiritual from './pages/spiritual';
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./components/auth";
import { useSelector } from "react-redux";
import { monitorAuthState } from './utils/authListener';
import { Shloka } from './pages/spiritual/shloka';

function App() {
    const user = useSelector((state) => state.auth.user); // From Redux
    const loading = useSelector((state) => state.auth.loading); // Manage loading state globally

    useEffect(() => {
        monitorAuthState(); // Start monitoring auth state
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Show a loading spinner or message while checking auth status
    }

    return (
        <BrowserRouter>
            <Routes>
                {/* If user is logged in, redirect to Spiritual. Otherwise, show Auth */}
                <Route
                    path="/"
                    element={user ? <Navigate to="/spiritual" /> : <Auth />}
                />
                <Route
                    path="/spiritual"
                    element={user ? <Spiritual /> : <Navigate to="/" />}
                />
                <Route 
                    path="/spiritual/shloka/:shloka_id" 
                    element={<Shloka />} 
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
