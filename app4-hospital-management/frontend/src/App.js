import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, NavLink, Navigate } from "react-router-dom";
import Appointments from "./pages/Appointments";
import Doctors from "./pages/Doctors";
import Patients from "./pages/Patients";
import styles from "./App.style.module.scss"
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
    axios.defaults.baseURL = "http://localhost:1198";
    const isLinkActive = (path) => window.location.pathname === path;

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>a2rp - Hospital Managment App</h1>
            <nav className={styles.nav}>
                <NavLink
                    to="/appointments"
                    className={({ isActive }) => (isActive ? styles.activeLink : styles.inactiveLink)}
                >Appointments</NavLink>
                <NavLink
                    to="/doctors"
                    className={({ isActive }) => (isActive ? styles.activeLink : styles.inactiveLink)}
                >Doctors</NavLink>
                <NavLink
                    to="/patients"
                    className={({ isActive }) => (isActive ? styles.activeLink : styles.inactiveLink)}
                >Patients</NavLink>
            </nav>

            <div className={styles.main}>
                <div className={styles.routesContainer}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/appointments" />} />
                        <Route path="/appointments" element={<Appointments />} />
                        <Route path="/doctors" element={<Doctors />} />
                        <Route path="/patients" element={<Patients />} />
                    </Routes>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default App;

