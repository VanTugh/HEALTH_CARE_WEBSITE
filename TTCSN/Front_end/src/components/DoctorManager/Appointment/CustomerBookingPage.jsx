import React, { useEffect, useState } from "react";
import BookingTable from "./BookingTable";
import RejectModal from "./RejectModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DoctorBookingPage = () => {
    const getNext6Days = () => {
        const today = new Date();
        const days = [];
        for (let i = 0; i < 6; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            const dd = String(d.getDate()).padStart(2, "0");
            days.push(`${yyyy}-${mm}-${dd}`);
        }
        return days;
    };

    const [selectedDate, setSelectedDate] = useState(getNext6Days()[0]);
    const [bookings, setBookings] = useState([]);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [currentRejectId, setCurrentRejectId] = useState(null);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem("accessToken");

    const fetchBookings = async () => {
        if (!token || !selectedDate) return;

        try {
            const res = await fetch(
                `${API_BASE_URL}/api/bookings/doctor/appointments?ngayKham=${selectedDate}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                        "ngrok-skip-browser-warning": "true",
                    },
                }
            );

            const data = await res.json();

            if (data.success) {
                const mapped = data.data
                    .filter(item =>
                        ![
                            "HUY_BOI_BENH_NHAN",
                            "HOAN_THANH",
                            "DANG_KHAM",
                            "DA_XAC_NHAN",
                            "DA_XAC_NHAN_CHO_THANH_TOAN",
                        ].includes(item.trangThai)
                    )
                    .map(item => ({
                        id: item.datLichID,
                        tenKhachHang: item.tenBenhNhan,
                        ngayKham: item.ngayKham,
                        gioBatDau: item.gioKham,
                        trangThai: item.trangThai,
                    }));

                setBookings(mapped);
            } else {
                setBookings([]);
            }
        } catch (err) {
            console.error("Lỗi lấy lịch:", err);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [selectedDate]);

    const handleAction = async (id, action, reason = "") => {
        if (!token) return;

        const body =
            action === "confirm"
                ? {
                    datLichID: id,
                    duyet: true,
                    approve: true,
                    reject: false,
                    lyDoTuChoi: "",
                }
                : {
                    datLichID: id,
                    duyet: false,
                    approve: false,
                    reject: true,
                    lyDoTuChoi: reason,
                };

        try {
            const res = await fetch(
                `${API_BASE_URL}/api/bookings/${id}/confirm`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        "ngrok-skip-browser-warning": "true",
                    },
                    body: JSON.stringify(body),
                }
            );

            if (!res.ok) throw new Error("Thao tác thất bại");

            toast.success(
                action === "confirm"
                    ? "Xác nhận lịch hẹn thành công!"
                    : "Đã từ chối lịch hẹn!"
            );

            await fetchBookings();
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Có lỗi xảy ra!");
        }
    };

    const openRejectModal = (id) => {
        setCurrentRejectId(id);
        setRejectModalOpen(true);
    };

    const closeRejectModal = () => {
        setRejectModalOpen(false);
        setCurrentRejectId(null);
    };

    const submitReject = async (reason) => {
        if (!currentRejectId) return;
        await handleAction(currentRejectId, "reject", reason);
        closeRejectModal();
    };

    return (
        <div className="p-4 md:p-6 min-h-[300px] border border-gray-300 rounded-2xl shadow-sm bg-white">
            <div className="mb-5">
                <select
                    className="border border-gray-400 p-2 rounded-lg text-gray-700"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                >
                    {getNext6Days().map(day => (
                        <option key={day} value={day}>
                            {day}
                        </option>
                    ))}
                </select>
            </div>

            <BookingTable
                bookings={bookings}
                onConfirm={(id) => handleAction(id, "confirm")}
                onReject={(id) => openRejectModal(id)}
            />

            <RejectModal
                isOpen={rejectModalOpen}
                onClose={closeRejectModal}
                onSubmit={submitReject}
            />

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default DoctorBookingPage;
