import React, { useEffect, useState } from "react";
import Toolbar from "../ChuyenKhoa/Toolbar.jsx";
import PatientTableWithPagination from "./PatientTableWithPagination.jsx";
import PatientViewModal from "./PatientViewModal.jsx";
import { getAllPatients } from "./benhNhanAPI.js";

const PatientPage = () => {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPatient, setSelectedPatient] = useState(null);

    useEffect(() => {
        loadPatients();
    }, []);

    const loadPatients = async () => {
        try {
            const res = await getAllPatients({
                keyword: "",
                active: true,
                deleted: false,
                page: 0,
                size: 100,
            });
            console.log(res.data.content)
            setPatients(res.data.content);
        } catch (err) {
            console.error(err);
        }
    };


    const filteredPatients = patients.filter(
        (p) =>
            p.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.soDienThoai.includes(searchTerm)
    );

    return (
        <div>
            <Toolbar onSearch={setSearchTerm} content="bệnh nhân" />

            <PatientTableWithPagination
                items={filteredPatients}
                onView={(item) => setSelectedPatient(item)}
            />

            {selectedPatient && (
                <PatientViewModal
                    patient={selectedPatient}
                    onClose={() => setSelectedPatient(null)}
                />
            )}
        </div>
    );
};

export default PatientPage;
