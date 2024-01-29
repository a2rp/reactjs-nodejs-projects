import React, { useState, useEffect } from "react";
import axios from "axios";
import PatientCard from "../components/PatientCard";
import { toast } from "react-toastify";
import styles from "./patients.module.scss";
import { Button, FormControl, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import Swal from "sweetalert2";

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [newPatient, setNewPatient] = useState({ name: "", age: "", gender: "" });
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    // get all patients
    useEffect(() => {
        const getAllPatients = async () => {
            try {
                const response = await axios.get("/patients");
                const data = response.data;
                console.log(data, "Patients");
                setPatients(data);
            } catch (error) {
                console.log(error, "error");
                toast(error.response.data);
            }
        };
        getAllPatients();
    }, []);

    // add patient
    const handleAddPatient = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post("/patients/add", newPatient)
            const data = response.data;
            setPatients([...patients, data]);
            setNewPatient({ name: "", age: "", gender: "" });
        } catch (error) {
            console.log(error);
            toast(error.response.data);
        }
    };

    // update patient
    const handleUpdatePatient = (id, event) => {
        event.preventDefault();

        try {
            axios.post(`/patients/update/${id}`, selectedPatient).then(response => {
                const updatePat = { ...selectedPatient, _id: id };
                console.log("update patient", updatePat);
                setPatients(patients.map(patient => (patient._id === id ? updatePat : patient)));
                setSelectedPatient(null);
                setIsEditMode(false); // Switch back to Add mode
            }).catch(error => console.error("Error updating patient:", error));
        } catch (error) {
            console.log(error, "Error updating patient");
            toast(error.response.data);
        }
    };

    // handle delete patient cliecked
    const handleDeletePatient = (id) => {
        Swal.fire({
            title: "Do you want to delete?",
            showDenyButton: true,
            confirmButtonText: "Delete",
            denyButtonText: `Cancel`
        }).then((result) => {
            if (result.isConfirmed) {
                deletePatient(id);
            } else if (result.isDenied) {
            }
        });
    };

    // handle delete
    const deletePatient = async (id) => {
        try {
            axios.delete(`/patients/delete/${id}`).then(response => {
                console.log(response.data);
                setSelectedPatient(null);
                setPatients(patients.filter(patient => patient._id !== id));
            }).catch(error => console.error("Error deleting patient:", error));
        } catch (error) {
            console.log(error, "error deleting patient");
            toast(error.response.data);
        }
    };

    // edit patient
    const handleEditPatient = (patient) => {
        setSelectedPatient(patient);
        setIsEditMode(true);
    };

    const handleAgeChange = (event) => {
        const regex = /[^0-9]/ig;
        let value = event.target.value.replace(regex, "").slice(0, 3);
        if (value > 150) { value = 150; }
        isEditMode
            ? setSelectedPatient({ ...selectedPatient, age: value })
            : setNewPatient({ ...newPatient, age: value })
    };

    return (
        <div className={styles.container}>
            <div className={styles.addPatientContainer}>
                <h4 className={styles.heading}>{isEditMode ? "Edit Patient" : "Add New Patient"}</h4>
                <form className={styles.addPatientForm} onSubmit={isEditMode
                    ? (e) => handleUpdatePatient(selectedPatient._id, e)
                    : handleAddPatient}
                >
                    <TextField size="small" label="Name" fullWidth
                        value={isEditMode ? selectedPatient.name : newPatient.name}
                        onChange={(event) =>
                            isEditMode
                                ? setSelectedPatient({ ...selectedPatient, name: event.target.value })
                                : setNewPatient({ ...newPatient, name: event.target.value }
                                )}
                    />

                    <TextField size="small" label="Age [max - 150]" fullWidth
                        value={isEditMode ? selectedPatient.age : newPatient.age}
                        onChange={handleAgeChange}
                    />

                    <FormControl fullWidth size="small">
                        <InputLabel id="gender-select-label" size="small">Gender</InputLabel>
                        <Select
                            fullWidth
                            size="small"
                            labelId="gender-select-label"
                            id="gender-select"
                            label="Gender"
                            value={isEditMode ? selectedPatient.gender : newPatient.gender}
                            onChange={(event) => isEditMode
                                ? setSelectedPatient({ ...selectedPatient, gender: event.target.value })
                                : setNewPatient({ ...newPatient, gender: event.target.value })}
                        >
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Others">Others</MenuItem>
                        </Select>
                    </FormControl>

                    <Button type="submit" variant="contained" size="small" fullWidth>{isEditMode ? "Update" : "Add"}</Button>
                    {isEditMode
                        ? <Button variant="contained" color="error" size="small" fullWidth
                            onClick={() => { setIsEditMode(false); }}
                        >Cancel</Button>
                        : ""}
                </form>
            </div>

            <div className={styles.patientsList}>
                <h3 className={styles.heading}>Patients ({patients.length})</h3>
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead sx={{ backgroundColor: "#000" }}>
                            <TableRow>
                                <TableCell sx={{ color: "#fff" }}>Name</TableCell>
                                <TableCell sx={{ color: "#fff" }}>Age</TableCell>
                                <TableCell sx={{ color: "#fff" }}>Gender</TableCell>
                                <TableCell sx={{ color: "#fff" }}>Created at</TableCell>
                                <TableCell sx={{ color: "#fff" }}>Updated at</TableCell>
                                <TableCell sx={{ color: "#fff" }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {patients.map((data) => (
                                <TableRow key={data._id}>
                                    <TableCell>{data.name}</TableCell>
                                    <TableCell>{data.age}</TableCell>
                                    <TableCell>{data.gender}</TableCell>
                                    <TableCell>{data.createdAt}</TableCell>
                                    <TableCell>{data.updatedAt}</TableCell>
                                    <TableCell>
                                        <div className={styles.actionButtonsContainer}>
                                            <Button size="small" variant="contained"
                                                onClick={() => handleEditPatient(data)}>Edit</Button>
                                            <Button size="small" variant="contained" color="error"
                                                onClick={() => handleDeletePatient(data._id)}>Delete</Button>
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

export default Patients;