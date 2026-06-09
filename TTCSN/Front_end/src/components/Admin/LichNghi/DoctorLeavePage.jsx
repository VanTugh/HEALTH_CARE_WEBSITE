import React, { useState, useEffect } from "react";
import DoctorLeaveTable from "./DoctorLeaveTable.jsx";
import DoctorLeaveViewModal from "./DoctorLeaveViewModal.jsx";
import {
    getPendingLeaveRequests,
    approveOrRejectLeaveRequests,
} from "./lichNghiAPI.js";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Toolbar = ({ onSearch }) => (
    <div className="flex justify-start mb-4 p-4 border border-gray-200 rounded-2xl shadow-sm bg-white">
        <div className="relative w-full md:w-1/3">
            <input
                type="text"
                placeholder="Tìm kiếm lịch nghỉ..."
                onChange={(e) => onSearch(e.target.value)}
                className="pl-3 pr-3 py-2 rounded-xl w-full border border-gray-200
                           focus:ring-1 focus:ring-gray-300 focus:border-gray-400
                           outline-none shadow-sm text-gray-700"
            />
        </div>
    </div>
);


export default function DoctorLeavePage() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [openView, setOpenView] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");


    useEffect(() => {
        loadLeaves();
    }, []);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredData(data);
        } else {
            const term = searchTerm.toLowerCase();
            setFilteredData(
                data.filter(
                    (x) =>
                        x.tenBacSi?.toLowerCase().includes(term) ||
                        x.tenChuyenKhoa?.toLowerCase().includes(term)
                )
            );
        }
    }, [searchTerm, data]);

    const loadLeaves = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await getPendingLeaveRequests(token);
            setData(res);
            setFilteredData(res);
        } catch (err) {
            toast.error("Không tải được danh sách lịch nghỉ");
            console.error(err);
        }
    };

    const handleView = (index) => {
        setSelectedItem(filteredData[index]);
        setOpenView(true);
    };

    const handleConfirm = async (indexOrItem) => {
        const item =
            typeof indexOrItem === "number"
                ? filteredData[indexOrItem]
                : indexOrItem;

        try {
            const token = localStorage.getItem("accessToken");

            await approveOrRejectLeaveRequests(
                {
                    nghiIDs: [item.nghiID],
                    action: "APPROVE",
                    approve: true,
                    reject: false,
                    lyDoTuChoi: "Khong tu choi",
                    ghiChu: "Đã xác nhận với trưởng khoa",
                    summary: "abcxyz",
                    actionDisplay: "APPROVE",
                    totalRequests: 1
                },
                token
            );

            setData(prev =>
                prev.filter(x => x.nghiID !== item.nghiID)
            );

            toast.success("Đã duyệt yêu cầu nghỉ thành công");
            setOpenView(false);
            setSelectedItem(null);

        } catch (err) {
            toast.error("Duyệt lịch nghỉ thất bại");
            console.error(err.response?.data || err);
        }
    };

    const handleReject = async (indexOrItem) => {
        const item =
            typeof indexOrItem === "number"
                ? filteredData[indexOrItem]
                : indexOrItem;

        try {
            const token = localStorage.getItem("accessToken");

            await approveOrRejectLeaveRequests(
                {
                    nghiIDs: [item.nghiID],
                    action: "REJECT",
                    approve: false,
                    reject: true,
                    lyDoTuChoi: "Ly do khong chinh dang",
                    ghiChu: "Đã xác nhận với trưởng khoa",
                    summary: "abcxyz",
                    actionDisplay: "REJECT",
                    totalRequests: 1
                },
                token
            );

            setData(prev =>
                prev.filter(x => x.nghiID !== item.nghiID)
            );

            toast.success("Đã từ chối yêu cầu nghỉ");
            setOpenView(false);
            setSelectedItem(null);

        } catch (err) {
            toast.error("Từ chối lịch nghỉ thất bại");
            console.error(err.response?.data || err);
        }
    };


    return (
        <div>
            <Toolbar onSearch={setSearchTerm} />

            <DoctorLeaveTable
                items={filteredData}
                onView={handleView}
                onConfirm={handleConfirm}
                onReject={handleReject}
            />

            {openView && selectedItem && (
                <DoctorLeaveViewModal
                    item={selectedItem}
                    onClose={() => {
                        setOpenView(false);
                        setSelectedItem(null);
                    }}
                    onConfirm={handleConfirm}
                    onReject={handleReject}
                />
            )}


            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                draggable
            />
        </div>
    );
}
