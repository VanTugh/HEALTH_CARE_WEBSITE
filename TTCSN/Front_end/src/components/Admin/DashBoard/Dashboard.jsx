import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement
);


const formatCurrency = (value) => {
    if (!value) return "0";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export default function BookingStatisticsDashboard() {
    const [stats, setStats] = useState(null);

    const [topRevenueDoctors, setTopRevenueDoctors] = useState([]);
    const [topCompletedDoctors, setTopCompletedDoctors] = useState([]);
    const [departmentRevenue, setDepartmentRevenue] = useState([]);
    const [doctorMode, setDoctorMode] = useState("revenue");

    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("accessToken");

    const loadMainStats = async () => {
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const res = await axios.get(`${API_BASE_URL}/api/bookings/statistics`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "true",
                },

            });
            setStats(res.data.data);
        } catch (err) {
            console.error("Lỗi tải thống kê chính:", err);
        }
    };

    const loadTopDoctorsRevenue = async () => {
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const res = await axios.get(
                `${API_BASE_URL}/api/bookings/statistics/top-doctors/revenue?size=10`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "ngrok-skip-browser-warning": "true",
                    },
                }
            );
            setTopRevenueDoctors(res.data.data || []);
        } catch (err) {
            console.error("Lỗi tải top doanh thu bác sĩ", err);
        }
    };

    const loadTopCompletedDoctors = async () => {
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const res = await axios.get(
                `${API_BASE_URL}/api/bookings/statistics/top-doctors/completed?size=10`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "ngrok-skip-browser-warning": "true",
                    }
                }
            );
            setTopCompletedDoctors(res.data.data || []);
        } catch (err) {
            console.error("Lỗi tải top ca hoàn thành", err);
        }
    };

    const loadDepartmentRevenue = async () => {
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const res = await axios.get(
                `${API_BASE_URL}/api/bookings/statistics/revenue/specialties`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "ngrok-skip-browser-warning": "true",
                    }
                }
            );
            setDepartmentRevenue(res.data.data || []);
        } catch (err) {
            console.error("Lỗi tải doanh thu theo chuyên khoa", err);
        }
    };

    useEffect(() => {
        const loadAll = async () => {
            await Promise.all([
                loadMainStats(),
                loadTopDoctorsRevenue(),
                loadTopCompletedDoctors(),
                loadDepartmentRevenue(),
            ]);

            setLoading(false);
        };

        loadAll();
    }, []);

    if (loading) return <div className="p-6">Đang tải...</div>;
    if (!stats) return <div className="p-6 text-red-500">Lỗi dữ liệu</div>;

    const bookingStatusData = {
        labels: [
            "Chờ duyệt",
            "Chờ thanh toán",
            "Đã xác nhận",
            "Đang khám",
            "Hoàn thành",
            "Hủy",
            "Không đến",
            "Từ chối",
        ],
        datasets: [
            {
                data: [
                    stats.pendingApproval,
                    stats.pendingPayment,
                    stats.confirmed,
                    stats.inProgress,
                    stats.completed,
                    stats.cancelled,
                    stats.noShow,
                    stats.rejected,
                ],
                backgroundColor: [
                    "#fbbf24",
                    "#60a5fa",
                    "#34d399",
                    "#a78bfa",
                    "#22c55e",
                    "#ef4444",
                    "#f97316",
                    "#9ca3af",
                ],
            },
        ],
    };

    const ratingData = {
        labels: ["5 ★", "4 ★", "3 ★", "2 ★", "1 ★"],
        datasets: [
            {
                label: "Số lượt đánh giá",
                data: [
                    stats.fiveStars,
                    stats.fourStars,
                    stats.threeStars,
                    stats.twoStars,
                    stats.oneStar,
                ],
                backgroundColor: "#ad7555",
                borderRadius: 6,
            },
        ],
    };

    const deptRevenueChart = {
        labels: departmentRevenue.map((d) => d.tenChuyenKhoa),
        datasets: [
            {
                data: departmentRevenue.map((d) => d.doanhThu),
                backgroundColor: [
                    "#60a5fa",
                    "#34d399",
                    "#f87171",
                    "#fbbf24",
                    "#a78bfa",
                    "#4ade80",
                    "#c084fc",
                    "#fb923c",
                ],
            },
        ],
    };


    return (
        <div className="p-6 space-y-6">


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatCard title="Tổng booking" value={stats.totalBookings} />
                <StatCard title="Booking hôm nay" value={stats.todayBookings} />
                <StatCard title="Doanh thu hôm nay" value={stats.todayRevenue.toLocaleString() + " VNĐ"} />
                <StatCard title="Doanh thu tháng" value={stats.thisMonthRevenue.toLocaleString() + " VNĐ"} />
                <StatCard title="Doanh thu năm" value={stats.totalRevenue.toLocaleString() + " VNĐ"} />
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">


                <div className="lg:col-span-6 bg-white p-6 rounded-2xl shadow">
                    <h3 className="font-semibold mb-4 text-gray-700">
                        Booking theo trạng thái
                    </h3>
                    <div className="h-[260px] flex justify-center">
                        <Pie
                            data={bookingStatusData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { position: "bottom" },
                                },
                            }}
                        />
                    </div>
                </div>

                <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow">


                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => setDoctorMode("revenue")}
                            className={`px-3 py-2 rounded-lg text-sm font-medium 
                                ${doctorMode === "revenue" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                        >
                            Doanh thu
                        </button>

                        <button
                            onClick={() => setDoctorMode("completed")}
                            className={`px-3 py-2 rounded-lg text-sm font-medium 
                                ${doctorMode === "completed" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                        >
                            Số ca
                        </button>
                    </div>


                    {doctorMode === "revenue" &&
                        topRevenueDoctors.map((doc, i) => (
                            <DoctorItem key={i} doc={doc} value={doc.doanhThu + " VNĐ"} />
                        ))}

                    {doctorMode === "completed" &&
                        topCompletedDoctors.map((doc, i) => (
                            <DoctorItem key={i} doc={doc} value={doc.soCaHoanThanh + " ca"} />
                        ))}
                </div>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <div className="bg-white p-6 rounded-2xl shadow">
                    <h3 className="font-semibold mb-4 text-gray-700">Doanh thu theo chuyên khoa</h3>
                    <div className="h-[260px] flex justify-center">
                        <Pie data={deptRevenueChart} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow">
                    <h3 className="font-semibold mb-4 text-gray-700">Đánh giá dịch vụ</h3>
                    <div className="h-[260px]">
                        <Bar data={ratingData} />
                    </div>
                </div>
            </div>

        </div>
    );
}


const DoctorItem = ({ doc, value }) => (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-2">
        <div className="flex-1">
            <p className="font-semibold text-gray-800">{doc.tenBacSi}</p>
            <p className="text-gray-500 text-sm">{doc.tenChuyenKhoa}</p>
        </div>
        <div className="text-right text-blue-600 font-semibold">{formatCurrency(value)}</div>
    </div>
);

const StatCard = ({ title, value }) => (
    <div className="bg-white p-6 rounded-2xl shadow">
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-semibold mt-2 text-gray-800">{value}</p>
    </div>
);
