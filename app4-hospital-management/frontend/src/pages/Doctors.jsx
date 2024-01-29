import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import styles from "./doctors.module.scss";
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [newDoctor, setNewDoctor] = useState({ name: "", speciality: "" });
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    // geta all doctors
    useEffect(() => {
        const getDoctors = async () => {
            try {
                const response = await axios.get("/doctors");
                const data = response.data;
                console.log(data, "all doctors");
                setDoctors(data);
            } catch (error) {
                toast(error.response.data);
            }
        };
        getDoctors();
    }, []);

    // add doctor
    const handleAddDoctor = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post("/doctors/add", newDoctor);
            const data = response.data;
            console.log(data, "add doctor data");
            setDoctors([...doctors, data]);
            setNewDoctor({ name: "", speciality: "" });
        } catch (error) {
            console.log(error, "error");
            toast(error.response.data);
        }
    };

    // update doctor
    const handleUpdateDoctor = async (id, event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`/doctors/update/${id}`, selectedDoctor);
            const data = response.data;
            const updateDoc = { ...selectedDoctor, _id: id };
            console.log("update doc", updateDoc);
            setDoctors(doctors.map(doctor => (doctor._id === id ? updateDoc : doctor)));
            setSelectedDoctor(null);
            setIsEditMode(false);
        } catch (error) {
            console.log(error, "error");
            toast(error.response.data);
        }
    };

    // handled delete clicked
    const handleDeleteDoctor = async (id) => {
        Swal.fire({
            title: "Do you want to delete?",
            showDenyButton: true,
            confirmButtonText: "Delete",
            denyButtonText: `Cancel`
        }).then((result) => {
            if (result.isConfirmed) {
                deleteDoctor(id);
            } else if (result.isDenied) {
            }
        });
    };

    // delete doctor
    const deleteDoctor = async (id) => {
        try {
            const response = await axios.delete(`/doctors/delete/${id}`);
            const data = response.data;
            console.log(response.data);
            setDoctors(doctors.filter(doctor => doctor._id !== id));
        } catch (error) {
            console.log(error, "error");
            toast(error.response.data);
        }
    };

    // handle edit clicked
    const handleEditDoctor = (doctor) => {
        setSelectedDoctor(doctor);
        setIsEditMode(true);
    };

    return (
        <div className={styles.container}>
            <div className={styles.addDoctorContainer}>
                <h4 className={styles.heading}>{isEditMode ? "Edit Doctor" : "Add New Doctor"}</h4>

                <form className={styles.addDoctorForm} onSubmit={isEditMode ? (event) => handleUpdateDoctor(selectedDoctor._id, event) : handleAddDoctor}>
                    <TextField size="small" label="Name" fullWidth
                        value={isEditMode ? selectedDoctor.name : newDoctor.name}
                        onChange={(event) => isEditMode
                            ? setSelectedDoctor({ ...selectedDoctor, name: event.target.value })
                            : setNewDoctor({ ...newDoctor, name: event.target.value })}
                    />

                    <TextField label="Speciality" size="small" fullWidth
                        value={isEditMode ? selectedDoctor.speciality : newDoctor.speciality}
                        onChange={(event) => isEditMode
                            ? setSelectedDoctor({ ...selectedDoctor, speciality: event.target.value })
                            : setNewDoctor({ ...newDoctor, speciality: event.target.value })}
                    />

                    <Button type="submit" variant="contained" size="small" fullWidth>{isEditMode ? "Update" : "Add"}</Button>
                    {isEditMode
                        ? <Button variant="contained" color="error" size="small" fullWidth
                            onClick={() => { setIsEditMode(false); }}
                        >Cancel</Button>
                        : ""}
                </form>
            </div>

            <div className={styles.doctorsList}>
                <h3 className={styles.heading}>Doctors ({doctors.length})</h3>
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead sx={{ backgroundColor: "#000" }}>
                            <TableRow>
                                <TableCell sx={{ color: "#fff" }}>Doctor name</TableCell>
                                <TableCell sx={{ color: "#fff" }}>Speciality</TableCell>
                                <TableCell sx={{ color: "#fff" }}>Created at</TableCell>
                                <TableCell sx={{ color: "#fff" }}>Updated at</TableCell>
                                <TableCell sx={{ color: "#fff" }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {doctors.map((data) => (
                                <TableRow key={data._id}>
                                    <TableCell>{data.name}</TableCell>
                                    <TableCell>{data.speciality}</TableCell>
                                    <TableCell>{data.createdAt}</TableCell>
                                    <TableCell>{data.updatedAt}</TableCell>
                                    <TableCell>
                                        <div className={styles.actionButtonsContainer}>
                                            <Button size="small" variant="contained"
                                                onClick={() => handleEditDoctor(data)}>Edit</Button>
                                            <Button size="small" variant="contained" color="error"
                                                onClick={() => handleDeleteDoctor(data._id)}>Delete</Button>
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

export default Doctors;