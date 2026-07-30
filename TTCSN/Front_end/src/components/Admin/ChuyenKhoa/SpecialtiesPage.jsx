import React, { useState, useEffect } from "react";
import Toolbar from "../ChuyenKhoa/Toolbar.jsx";
import SpecialtiesTableWithPagination from "../ChuyenKhoa/SpecialtiesTableWithPagination.jsx";
import SpecialtiesForm from "../ChuyenKhoa/SpecialtiesForm.jsx";
import SpecialtiesViewModal from "../ChuyenKhoa/SpecialtiesViewModal.jsx";
import DeleteSpecialtyModal from "../ChuyenKhoa/DeleteSpecialtyModal.jsx";
import {
    getAllSpecialties,
    createSpecialty,
    updateSpecialty,
    deleteSpecialty,
} from "./chuyenkhoaAPI.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const SpecialtiesPage = () => {
    const [specialtiesData, setSpecialtiesData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");


    const [selectedItem, setSelectedItem] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllSpecialties();
                setSpecialtiesData(data);
            } catch (err) {
                console.error("Lỗi tải danh sách chuyên khoa:", err);
            }
        };
        fetchData();
    }, []);


    const filteredData = specialtiesData.filter((item) => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            item.tenChuyenKhoa.toLowerCase().includes(term) ||
            item.moTa.toLowerCase().includes(term)
        );
    });


    const handleAdd = () => {
        setSelectedItem(null);
        setOpenForm(true);
    };


    const handleView = (index) => {
        setSelectedItem(filteredData[index]);
        setOpenView(true);
    };


    const handleEdit = (index) => {
        setSelectedItem(filteredData[index]);
        setOpenForm(true);
    };


    const handleDelete = (index) => {
        setSelectedItem(filteredData[index]);
        setOpenDelete(true);
    };

    const confirmDelete = async () => {
        try {

            await deleteSpecialty(selectedItem.chuyenKhoaID, token);
            setSpecialtiesData((prev) =>
                prev.filter((s) => s.chuyenKhoaID !== selectedItem.chuyenKhoaID)
            );
            toast.success("Xóa chuyên khoa thành công");
        } catch (err) {
            console.error("Lỗi xóa chuyên khoa:", err);
            toast.error("Xóa chuyên khoa thất bại");
        } finally {
            setOpenDelete(false);
            setSelectedItem(null);
        }
    };


    const handleSave = async (newItem) => {
        try {

            if (selectedItem) {

                const updated = await updateSpecialty(
                    selectedItem.chuyenKhoaID,
                    newItem,
                    token,
                );
                setSpecialtiesData((prev) =>
                    prev.map((s) =>
                        s.chuyenKhoaID === selectedItem.chuyenKhoaID ? updated : s
                    )
                );
                toast.success("Cập nhật chuyên khoa thành công");
            } else {

                const created = await createSpecialty(newItem, token);
                setSpecialtiesData((prev) => [...prev, created]);
                toast.success("Thêm chuyên khoa thành công");
            }
        } catch (err) {
            console.error("Lỗi lưu chuyên khoa:", err);
            toast.error("Có lỗi xảy ra khi lưu chuyên khoa");
        } finally {
            setOpenForm(false);
            setSelectedItem(null);
        }
    };

    return (
        <div>
            <Toolbar onSearch={setSearchTerm} onAdd={handleAdd} content={"chuyên khoa"} />

            <SpecialtiesTableWithPagination
                items={filteredData}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />


            {openView && selectedItem && (
                <SpecialtiesViewModal
                    item={selectedItem}
                    onClose={() => {
                        setOpenView(false);
                        setSelectedItem(null);
                    }}
                    onEdit={(item) => {
                        setOpenView(false);
                        setSelectedItem(item);
                        setOpenForm(true);
                    }}
                />
            )}


            {openForm && (
                <SpecialtiesForm
                    editingSpecialty={selectedItem}
                    onSave={handleSave}
                    onClose={() => {
                        setOpenForm(false);
                        setSelectedItem(null);
                    }}
                />
            )}


            {openDelete && selectedItem && (
                <DeleteSpecialtyModal
                    item={selectedItem}
                    onCancel={() => {
                        setOpenDelete(false);
                        setSelectedItem(null);
                    }}
                    onConfirm={confirmDelete}
                />
            )}

            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
            />
        </div>
    );
};

export default SpecialtiesPage;
