import React, { useEffect, useState } from "react";
import DoctorHistoryList from "./DoctorHistoryList";
import DoctorHistoryDetail from "./DoctorHistoryDetail";
import axios from "axios";

const DoctorHistoryPage = () => {
    const today = new Date().toISOString().split("T")[0];
    const [histories, setHistories] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(6);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedDate, setSelectedDate] = useState(today);
    const [selectedHistory, setSelectedHistory] = useState(null);

    const fetchHistories = async (pageNumber = 0) => {
        try {
            const token = localStorage.getItem("accessToken");
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const res = await axios.get(
                `${API_BASE_URL}/api/bookings/doctor/history`,
                {
                    params: {
                        page: pageNumber,
                        size,
                        sortBy: "ngayKham",
                        direction: "DESC",
                        fromDate: selectedDate,
                        toDate: selectedDate,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "ngrok-skip-browser-warning": "true",
                    },
                }
            );
            if (res.data.success) {
                setHistories(res.data.data.content);
                setTotalPages(res.data.data.totalPages);
                setPage(res.data.data.number);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchHistories(0);
    }, [selectedDate]);

    const handleDateChange = (e) => setSelectedDate(e.target.value);
    const handlePageChange = (newPage) => fetchHistories(newPage);

    return (
        <div className="p-4 md:p-6 border border-gray-300 rounded-2xl shadow bg-white">
            <h1 className="text-xl font-bold mb-4">Lịch sử khám</h1>
            <input
                type="date"
                max={today}
                value={selectedDate}
                onChange={handleDateChange}
                className="border p-2 mb-4 border-gray-300 rounded-[6px]"
            />
            <DoctorHistoryList
                histories={histories}
                onViewDetail={(history) => setSelectedHistory(history)}
            />
            <div className="mt-4 flex justify-end gap-2">
                {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => handlePageChange(idx)}
                        className={`px-3 py-1 border bordr-gray-300 cursor-pointer ${idx === page ? "bg-blue-500 text-white" : ""}`}
                    >
                        {idx + 1}
                    </button>
                ))}
            </div>

            {selectedHistory && (
                <DoctorHistoryDetail
                    history={selectedHistory}
                    onClose={() => setSelectedHistory(null)}
                />
            )}
        </div>
    );
};

export default DoctorHistoryPage;
