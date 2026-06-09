import React, { useState, useEffect } from "react";
import DoctorToolbar from "./DoctorToolbar.jsx";
import DoctorsTable from "./DoctorTable.jsx";
import DoctorFormModal from "./DoctorFormModal.jsx";
import DoctorCreateForm from "./DoctorCreateForm.jsx";
import DoctorsViewModal from "./DoctorsViewModal1.jsx";
import DeleteDoctorModal from "./DeleteDoctorModal.jsx";
import {
    fetchDoctors,
    deleteDoctor,
    updateDoctor,
    restoreDoctor,
    fetchSpecialties,
    fetchDegrees,
    fetchDoctorById
} from "./adminBacSiAPI.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PAGE_SIZE = 7;

const DoctorsPage = () => {

    const [allDoctors, setAllDoctors] = useState([]);


    const [specialties, setSpecialties] = useState([]);
    const [degrees, setDegrees] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSpecialty, setSelectedSpecialty] = useState("");
    const [page, setPage] = useState(0);

    const [selectedItem, setSelectedItem] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);


    const loadDoctors = async () => {
        try {
            const res = await fetchDoctors({
                page: 0,
                size: 1000,
                sortBy: "nguoiDung.hoTen",
                direction: "asc"
            });
            setAllDoctors(res.content);
        } catch (error) {
            console.error(error.message);
            toast.error("Lấy danh sách bác sĩ thất bại!");
        }
    };

    const loadSpecialtiesAndDegrees = async () => {
        try {
            const [specs, degs] = await Promise.all([
                fetchSpecialties(),
                fetchDegrees()
            ]);
            setSpecialties(specs);
            setDegrees(degs);
        } catch (error) {
            console.error(error.message);
            toast.error("Lấy dữ liệu chuyên khoa/trình độ thất bại!");
        }
    };

    useEffect(() => {
        loadDoctors();
        loadSpecialtiesAndDegrees();
    }, []);

    const filteredDoctors = allDoctors.filter(
        (d) =>
            d.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (!selectedSpecialty || d.chuyenKhoaID === Number(selectedSpecialty))
    );


    useEffect(() => {
        setPage(0);
    }, [searchTerm, selectedSpecialty]);


    const totalPages = Math.ceil(filteredDoctors.length / PAGE_SIZE);

    const pagedDoctors = filteredDoctors.slice(
        page * PAGE_SIZE,
        (page + 1) * PAGE_SIZE
    );


    const handleView = (doctor) => {
        setSelectedItem(doctor);
        setOpenView(true);
    };

    const handleEdit = async (doctor) => {
        try {
            const details = await fetchDoctorById(doctor.bacSiID);
            setSelectedItem(details);
            setOpenForm(true);
        } catch (error) {
            console.log(error)
            toast.error("Lấy chi tiết bác sĩ thất bại!");
        }
    };

    const handleDelete = (doctor) => {
        setSelectedItem(doctor);
        setOpenDelete(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteDoctor(selectedItem.bacSiID);
            setAllDoctors(prev =>
                prev.map(d =>
                    d.bacSiID === selectedItem.bacSiID
                        ? { ...d, deleted: true }
                        : d
                )
            );
            toast.success("Xóa bác sĩ thành công!");
        } catch {
            toast.error("Xóa bác sĩ thất bại!");
        } finally {
            setOpenDelete(false);
            setSelectedItem(null);
        }
    };

    const handleRestore = async (doctor) => {
        try {
            const restored = await restoreDoctor(doctor.bacSiID);
            setAllDoctors(prev =>
                prev.map(d => d.bacSiID === doctor.bacSiID ? restored : d)
            );
            toast.success("Khôi phục bác sĩ thành công!");
        } catch {
            toast.error("Khôi phục bác sĩ thất bại!");
        }
    };

    const handleSave = async (updatedValues) => {
        try {
            const fullData = {
                nguoiDungID: selectedItem.bacSiID,
                chuyenKhoaID: updatedValues.chuyenKhoaID,
                trinhDoID: updatedValues.trinhDoID,
                trangThaiCongViec: updatedValues.trangThaiCongViec,
                soNamKinhNghiem: selectedItem.soNamKinhNghiem,
                gioiThieu: selectedItem.gioiThieu,
                quaTrinhDaoTao: selectedItem.quaTrinhDaoTao,
                kinhNghiemLamViec: selectedItem.kinhNghiemLamViec,
                thanhTich: selectedItem.thanhTich,
                chungChi: selectedItem.chungChi,
                soBenhNhanToiDaMotNgay: selectedItem.soBenhNhanToiDaMotNgay,
                thoiGianKhamMotCa: selectedItem.thoiGianKhamMotCa
            };

            const updated = await updateDoctor(selectedItem.bacSiID, fullData);

            setAllDoctors(prev =>
                prev.map(d => d.bacSiID === selectedItem.bacSiID ? updated : d)
            );

            toast.success("Cập nhật bác sĩ thành công!");
        } catch {
            toast.error("Cập nhật bác sĩ thất bại!");
        } finally {
            setOpenForm(false);
            setSelectedItem(null);
        }
    };

    const handleAddDoctor = () => {
        setSelectedItem(null);
        setOpenCreate(true);
    };

    return (
        <div>
            <ToastContainer position="top-right" autoClose={2000} />

            <DoctorToolbar
                onSearch={setSearchTerm}
                onAdd={handleAddDoctor}
                content="bác sĩ"
                specialties={specialties}
                selectedSpecialty={selectedSpecialty}
                onSelectSpecialty={setSelectedSpecialty}
            />

            <DoctorsTable
                items={pagedDoctors.map(d => ({
                    ...d,
                    tenChuyenKhoa:
                        specialties.find(s => Number(s.chuyenKhoaID) === Number(d.chuyenKhoaID))
                            ?.tenChuyenKhoa || "Không xác định",
                    tenTrinhDo:
                        degrees.find(t => Number(t.trinhDoID) === Number(d.trinhDoID))
                            ?.tenTrinhDo || "Không xác định",
                    status: d.trangThaiCongViec ? "Hoạt động" : "Ngưng hoạt động"
                }))}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRestore={handleRestore}
                page={page}
                setPage={setPage}
                totalPages={totalPages}
            />

            {openView && selectedItem && (
                <DoctorsViewModal
                    item={selectedItem}
                    specialties={specialties}
                    degrees={degrees}
                    onClose={() => { setOpenView(false); setSelectedItem(null); }}
                    onEdit={(item) => { setOpenView(false); setSelectedItem(item); setOpenForm(true); }}
                />
            )}

            {openForm && selectedItem && (
                <DoctorFormModal
                    editingDoctor={selectedItem}
                    specialties={specialties}
                    trinhDoList={degrees}
                    onSave={handleSave}
                    onClose={() => { setOpenForm(false); setSelectedItem(null); }}
                />
            )}

            {openCreate && (
                <DoctorCreateForm
                    onClose={() => setOpenCreate(false)}
                    onCreated={() => { setOpenCreate(false); loadDoctors(); }}
                    specialties={specialties}
                    trinhDoList={degrees}
                />
            )}

            {openDelete && selectedItem && (
                <DeleteDoctorModal
                    item={selectedItem}
                    onCancel={() => { setOpenDelete(false); setSelectedItem(null); }}
                    onConfirm={confirmDelete}
                />
            )}
        </div>
    );
};

export default DoctorsPage;
