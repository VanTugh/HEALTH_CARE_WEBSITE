import React, { useEffect, useState } from "react";
import ConfirmedTable from "./ConfirmedTable";
import CompleteForm from "./CompleteForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DoctorBookingPageConfirmed = () => {

    const getNext6Days = () => {
        const today = new Date();
        const days = [];
        for (let i = 0; i < 6; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            days.push(d.toISOString().slice(0, 10));
        }
        return days;
    };

    const [selectedDate, setSelectedDate] = useState(getNext6Days()[0]);
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const mapTrangThai = (status) => {
        if (status === "DA_XAC_NHAN") return "DA_XAC_NHAN";
        if (status === "DANG_KHAM") return "DANG_KHAM";
        return status;
    };


    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return d.toLocaleDateString("vi-VN");
    };

    useEffect(() => {
        if (!selectedDate) return;

        const token = localStorage.getItem("accessToken");
        if (!token) return;
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        fetch(
            `${API_BASE_URL}/api/bookings/doctor/appointments?ngayKham=${selectedDate}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
            }
        )
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    const mapped = data.data
                        .filter(item => item.tenTrangThai !== "Hủy bởi bệnh nhân")
                        .filter(item => item.trangThai !== "HOAN_THANH")
                        .filter(item => item.trangThai !== "CHO_XAC_NHAN_BAC_SI")
                        .map((item) => ({
                            id: item.datLichID,
                            tenKhachHang: item.tenBenhNhan,
                            ngayKham: formatDate(item.ngayKham),
                            gioBatDau: item.gioKham,
                            trangThai: mapTrangThai(item.trangThai),
                        }));

                    setBookings(mapped);
                } else {
                    setBookings([]);
                }
            })
            .catch((err) => console.error("Lỗi lấy lịch:", err));
    }, [selectedDate]);

    const handleCheckIn = async (id) => {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        try {
            const res = await fetch(
                `${API_BASE_URL}/api/bookings/${id}/checkin`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "ngrok-skip-browser-warning": "true",
                    }
                }
            );

            if (!res.ok) {
                toast.error("Check-in thất bại. Phải đến đúng ngày mới được check-in.");
                throw new Error("Check-in thất bại");
            }

            setBookings((prev) =>
                prev.map((b) =>
                    b.id === id ? { ...b, trangThai: "DANG_KHAM" } : b
                )
            );

            toast.success("Check-in thành công");
        } catch (err) {
            console.error(err);
        }
    };

    const handleComplete = async (id, formData) => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const res = await fetch(
                `${API_BASE_URL}/api/bookings/${id}/complete`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        "ngrok-skip-browser-warning": "true",
                    },
                    body: JSON.stringify({ datLichID: id, ...formData }),
                }
            );

            if (!res.ok) throw new Error("Hoàn thành thất bại");

            setBookings((prev) => prev.filter((b) => b.id !== id));
            setSelectedBooking(null);

            toast.success("Đã hoàn thành ca khám");
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="p-4 md:p-6 border border-gray-300 rounded-2xl shadow bg-white">
            <div className="mb-5">
                <select
                    className="border p-2 rounded-lg border-gray-300"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                >
                    {getNext6Days().map((day) => (
                        <option key={day} value={day}>{day}</option>
                    ))}
                </select>
            </div>

            <ConfirmedTable
                bookings={bookings}
                onCheckIn={handleCheckIn}
                onCompleteClick={setSelectedBooking}
            />

            <CompleteForm
                booking={selectedBooking}
                onClose={() => setSelectedBooking(null)}
                onSubmit={handleComplete}
            />

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default DoctorBookingPageConfirmed;
