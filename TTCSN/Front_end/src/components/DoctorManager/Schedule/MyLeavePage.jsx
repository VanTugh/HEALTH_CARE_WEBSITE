import React, { useEffect, useState } from "react";
import LeaveTable from "./LeaveTable.jsx";
import AddLeaveForm from "./AddLeaveForm.jsx";
import EditLeaveForm from "./EditLeaveForm.jsx";
import ViewLeaveModal from "./ViewLeaveModal.jsx";
import ConfirmDeleteModal from "./ConfirmDeleteModal.jsx";
import { Search, Plus } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Toolbar = ({ onSearch, onAdd }) => (
    <div
        className="
            flex flex-col gap-3
            sm:flex-row sm:items-center sm:justify-between
            mb-4 p-4
            border border-gray-300 rounded-2xl
            bg-white
        "
    >

        <div className="relative w-full sm:w-1/2">
            <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
            />
            <input
                type="text"
                placeholder="Tìm kiếm lịch nghỉ..."
                onChange={(e) => onSearch(e.target.value)}
                className="
                    pl-9 pr-3 py-2
                    rounded-xl w-full
                    border border-gray-300 outline-none
                "
            />
        </div>


        <button
            onClick={onAdd}
            className="
                bg-sky-500 text-white
                px-4 py-2
                rounded-lg
                flex items-center justify-center gap-2
                cursor-pointer
                hover:bg-sky-700
                w-full sm:w-auto
                text-sm sm:text-base
            "
        >
            <Plus size={18} />
            <span className="whitespace-nowrap">
                Tạo yêu cầu nghỉ
            </span>
        </button>
    </div>
);

export default function MyLeavePage() {
    const bacSiID = JSON.parse(localStorage.getItem("user"))?.nguoiDungID;
    const token = localStorage.getItem("accessToken");

    const [leaves, setLeaves] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredLeaves, setFilteredLeaves] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingLeave, setEditingLeave] = useState(null);
    const [viewLeave, setViewLeave] = useState(null);
    const [deleteLeave, setDeleteLeave] = useState(null);

    const parseThoiGianNghi = (str) => {
        if (!str) return new Date(0);

        const clean = str.replace("Ngày", "").trim();
        const [day, month, year] = clean.split("/").map(Number);

        return new Date(year, month - 1, day);
    };

    useEffect(() => {
        if (!bacSiID || !token) return;
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        fetch(`${API_BASE_URL}/api/leave-requests/my-requests/${bacSiID}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "ngrok-skip-browser-warning": "true",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                const sorted = (data || []).sort(
                    (a, b) =>
                        parseThoiGianNghi(a.thoiGianNghi) -
                        parseThoiGianNghi(b.thoiGianNghi)
                );

                setLeaves(sorted);
                setFilteredLeaves(sorted);
            });
    }, [bacSiID, token]);

    useEffect(() => {
        const term = searchTerm.toLowerCase();

        setFilteredLeaves(
            leaves.filter((l) => {
                const lyDo = l.lyDo || "";
                const time = l.thoiGianNghi || "";
                return (
                    lyDo.toLowerCase().includes(term) ||
                    String(time).toLowerCase().includes(term)
                );
            })
        );
    }, [searchTerm, leaves]);

    const handleDelete = async () => {
        try {
            await fetch(
                `http://localhost:8080/api/leave-requests/${deleteLeave.nghiID}`,
                { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
            );
            setLeaves((prev) =>
                prev.filter((l) => l.nghiID !== deleteLeave.nghiID)
            );
            setDeleteLeave(null);
            toast.success("Xóa yêu cầu nghỉ thành công!");
        } catch {
            toast.error("Xóa không thành công.");
        }
    };

    return (
        <div className="p-6 border border-gray-300 rounded-2xl bg-white shadow-md">
            <Toolbar
                onSearch={setSearchTerm}
                onAdd={() => setShowAddForm(true)}
            />

            <LeaveTable
                leaves={filteredLeaves}
                onEdit={setEditingLeave}
                onView={setViewLeave}
                onDelete={setDeleteLeave}
            />

            {showAddForm && (
                <AddLeaveForm
                    bacSiID={bacSiID}
                    token={token}
                    setLeaves={setLeaves}
                    onClose={() => setShowAddForm(false)}
                    onSuccess={() =>
                        toast.success("Tạo yêu cầu nghỉ thành công!")
                    }
                />
            )}

            {editingLeave && (
                <EditLeaveForm
                    leave={editingLeave}
                    token={token}
                    setLeaves={setLeaves}
                    onClose={() => setEditingLeave(null)}
                    onSuccess={() =>
                        toast.success("Cập nhật yêu cầu nghỉ thành công!")
                    }
                />
            )}

            {viewLeave && (
                <ViewLeaveModal
                    leave={viewLeave}
                    onClose={() => setViewLeave(null)}
                />
            )}

            {deleteLeave && (
                <ConfirmDeleteModal
                    leave={deleteLeave}
                    onCancel={() => setDeleteLeave(null)}
                    onConfirm={handleDelete}
                />
            )}

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}
