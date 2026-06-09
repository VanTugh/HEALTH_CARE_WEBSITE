import React, { useState, useEffect } from "react";
import Toolbar from "../ChuyenKhoa/Toolbar.jsx";
import TrinhDoTable from "./TrinhDoTable.jsx";
import TrinhDoForm from "./TrinhDoForm.jsx";
import TrinhDoViewModal from "./TrinhDoViewModal.jsx";
import TrinhDoDeleteModal from "./TrinhDoDeleteModal.jsx";

import {
    getAllDegrees,
    createDegree,
    updateDegree,
    deleteDegree,
} from "./TrinhDoAPI.js";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TrinhDoPage() {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        loadDegrees();
    }, []);

    const loadDegrees = async () => {
        try {
            const res = await getAllDegrees();
            setData(res);
        } catch (err) {
            console.error("Lỗi lấy danh sách trình độ:", err);
            toast.error("Lấy danh sách trình độ thất bại!");
        }
    };

    const filtered = data.filter(
        (item) =>
            item.tenTrinhDo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.moTa.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAdd = () => {
        setSelectedItem(null);
        setOpenForm(true);
    };

    const handleView = (index) => {
        setSelectedItem(filtered[index]);
        setOpenView(true);
    };

    const handleEdit = (index) => {
        setSelectedItem(filtered[index]);
        setOpenForm(true);
    };

    const handleDelete = (index) => {
        setSelectedItem(filtered[index]);
        setOpenDelete(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteDegree(selectedItem.trinhDoID, token);
            setData((prev) => prev.filter((x) => x.trinhDoID !== selectedItem.trinhDoID));
            toast.success("Xóa trình độ thành công!");
        } catch (err) {
            console.error("Lỗi xoá trình độ:", err);
            toast.error("Xóa trình độ thất bại!");
        }
        setSelectedItem(null);
        setOpenDelete(false);
    };

    const handleSave = async (item) => {
        try {
            if (selectedItem) {
                const updated = await updateDegree(selectedItem.trinhDoID, item, token);
                setData((prev) =>
                    prev.map((x) =>
                        x.trinhDoID === selectedItem.trinhDoID ? updated : x
                    )
                );
                toast.success("Cập nhật trình độ thành công!");
            } else {
                const created = await createDegree(item, token);
                setData((prev) => [...prev, created]);
                toast.success("Thêm trình độ thành công!");
            }
        } catch (err) {
            console.error("Lỗi lưu trình độ:", err);
            toast.error("Lưu trình độ thất bại!");
        }
        setSelectedItem(null);
        setOpenForm(false);
    };

    return (
        <div>
            <Toolbar content={"trình độ"} onAdd={handleAdd} onSearch={setSearchTerm} />

            <TrinhDoTable
                items={filtered}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {openView && selectedItem && (
                <TrinhDoViewModal
                    item={selectedItem}
                    onClose={() => { setOpenView(false); setSelectedItem(null); }}
                    onEdit={(it) => {
                        setOpenView(false);
                        setSelectedItem(it);
                        setOpenForm(true);
                    }}
                />
            )}

            {openForm && (
                <TrinhDoForm
                    editingItem={selectedItem}
                    onSave={handleSave}
                    onClose={() => setOpenForm(false)}
                />
            )}

            {openDelete && selectedItem && (
                <TrinhDoDeleteModal
                    item={selectedItem}
                    onCancel={() => setOpenDelete(false)}
                    onConfirm={confirmDelete}
                />
            )}

            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </div>
    );
}
