import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import styles from "./appointments.module.scss";
import { Button, FormControl, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [newAppointment, setNewAppointment] = useState({ patientName: "", doctorName: "", date: new Date().toISOString().split("T")[0] });
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const getAllPatients = async () => {
            try {
                const response = await axios.get("/patients");
                const data = response.data;
                setPatients(data);
            } catch (error) {
                toast(error.response.data);
            }
        };
        getAllPatients();
    }, []);
    useEffect(() => { console.log(patients, "patients"); }, [patients]);

    useEffect(() => {
        const getAllPatients = async () => {
            try {
                const response = await axios.get("/doctors");
                const data = response.data;
                setDoctors(data);
            } catch (error) {
                toast(error.response.data);
            }
        };
        getAllPatients();
    }, []);
    useEffect(() => { console.log(doctors, "doctors"); }, [doctors]);

    // get all appointments
    useEffect(() => {
        const getAppointments = async () => {
            try {
                const response = await axios.get("/appointments");
                setAppointments(response.data);
            } catch (error) {
                toast(error.message);
            }
        };
        getAppointments();
    }, []);

    // add new appointment
    const handleAddAppointment = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post("/appointments/add", newAppointment);
            const data = response.data;
            console.log(data, "data add appointment");
            setAppointments([...appointments, data]);
            setNewAppointment({ patientName: "", doctorName: "", date: new Date().toISOString().split("T")[0] });
        } catch (error) {
            console.log(error);
            toast(error.response.data);
        }
    };

    // edit click appointment
    const handleEditAppointment = (appointment) => {
        console.log(appointment, "Appointment selected");
        const selected = { ...appointment, date: appointment.date.split("T")[0] };
        setSelectedAppointment(selected);
        setIsEditMode(true);
    };

    // update appointment
    const handleUpdateAppointment = async (id, event) => {
        event.preventDefault();

        try {
            const response = await axios.post(`/appointments/update/${id}`, selectedAppointment);
            const data = response.data;
            console.log(data, "update appointment data");
            const updateApp = { ...selectedAppointment, _id: id };
            setAppointments(appointments.map(appointment => (appointment._id === id ? updateApp : appointment)));
            setNewAppointment({ patientName: "", doctorName: "", date: new Date().toISOString().split("T")[0] });
            setSelectedAppointment(null);
            setIsEditMode(false);
        } catch (error) {
            console.log(error);
            toast(error.response.data);
        }
    };

    // handle delete clicked
    const handleDeleteAppointment = async (id) => {
        Swal.fire({
            title: "Do you want to delete?",
            showDenyButton: true,
            confirmButtonText: "Delete",
            denyButtonText: `Cancel`
        }).then((result) => {
            if (result.isConfirmed) {
                deleteAppointment(id);
            } else if (result.isDenied) {
            }
        });
    };

    // delete appointment
    const deleteAppointment = async (id) => {
        try {
            const response = await axios.delete(`/appointments/delete/${id}`);
            const data = response.data;
            console.log(data, "delete appointment data");
            setAppointments(appointments.filter(appointment => appointment._id !== id));
        } catch (error) {
            console.log(error);
            toast(error.response.data);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.addNewAppointmentContainer}>
                <h4 className={styles.heading}>{isEditMode ? "Edit Appointment" : "Add New Appointment"}</h4>
                <form className={styles.addNewAppointmentForm}
                    onSubmit={
                        isEditMode
                            ? (event) => handleUpdateAppointment(selectedAppointment._id, event)
                            : handleAddAppointment
                    }>

                    <FormControl fullWidth size="small">
                        <InputLabel id="patient-name-select-label" size="small">Patient name</InputLabel>
                        <Select
                            labelId="patient-name-select-label"
                            id="patient-name-select"
                            label="Patient name"
                            value={isEditMode ? selectedAppointment.patientName : newAppointment.patientName}
                            onChange={(event) => isEditMode
                                ? setSelectedAppointment({ ...selectedAppointment, patientName: event.target.value })
                                : setNewAppointment({ ...newAppointment, patientName: event.target.value })}
                        >
                            {patients && patients.map(data => (
                                <MenuItem key={data._id} value={data.name}>{data.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth size="small">
                        <InputLabel id="doctor-name-select-label" size="small">Doctor name</InputLabel>
                        <Select
                            labelId="doctor-name-select-label"
                            id="doctor-name-select"
                            label="Doctor name"
                            value={isEditMode ? selectedAppointment.doctorName : newAppointment.doctorName}
                            onChange={(event) => isEditMode
                                ? setSelectedAppointment({ ...selectedAppointment, doctorName: event.target.value })
                                : setNewAppointment({ ...newAppointment, doctorName: event.target.value })}
                        >
                            {doctors && doctors.map(data => (
                                <MenuItem key={data._id} value={data.name}>{data.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField type="date" size="small" label="Date" fullWidth
                        inputProps={{ min: new Date().toISOString().split("T")[0], }}
                        value={isEditMode ? selectedAppointment.date : newAppointment.date}
                        onChange={(event) => isEditMode
                            ? setSelectedAppointment({ ...selectedAppointment, date: event.target.value })
                            : setNewAppointment({ ...newAppointment, date: event.target.value })}
                    />

                    <Button type="submit" variant="contained" size="small" fullWidth>{isEditMode ? "Update" : "Add"}</Button>
                    {isEditMode
                        ? <Button variant="contained" color="error" size="small" fullWidth
                            onClick={() => { setIsEditMode(false); }}
                        >Cancel</Button>
                        : ""}
                </form>
            </div>

            <div className={styles.appointmentsList}>
                <h3 className={styles.heading}>Appointments({appointments.length})</h3>
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead sx={{ backgroundColor: "#000" }}>
                            <TableRow>
                                <TableCell sx={{ color: "#fff" }}>Patient name</TableCell>
                                <TableCell sx={{ color: "#fff" }}>Doctor name</TableCell>
                                <TableCell sx={{ color: "#fff" }}>Date</TableCell>
                                <TableCell sx={{ color: "#fff" }}>Created at</TableCell>
                                <TableCell sx={{ color: "#fff" }}>Updated at</TableCell>
                                <TableCell sx={{ color: "#fff" }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {appointments.map((data) => (
                                <TableRow key={data._id}>
                                    <TableCell>{data.patientName}</TableCell>
                                    <TableCell>{data.doctorName}</TableCell>
                                    <TableCell>{data.date}</TableCell>
                                    <TableCell>{data.createdAt}</TableCell>
                                    <TableCell>{data.updatedAt}</TableCell>
                                    <TableCell>
                                        <div className={styles.actionButtonsContainer}>
                                            <Button size="small" variant="contained"
                                                onClick={() => handleEditAppointment(data)}>Edit</Button>
                                            <Button size="small" variant="contained" color="error"
                                                onClick={() => handleDeleteAppointment(data._id)}>Delete</Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
};

export default Appointments;

