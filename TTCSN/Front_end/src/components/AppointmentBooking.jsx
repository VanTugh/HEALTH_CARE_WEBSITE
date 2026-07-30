import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import HeaderSub from "./HeaderSub";
import Footer from "./Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AppointmentBooking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const { doctor, date, time, ca } = location.state || {};
    const localUser = JSON.parse(localStorage.getItem("user")) || {};

    const GIA_KHAM_THEO_TRINH_DO = {
        1: 150000,
        2: 250000,
        3: 300000,
        4: 400000,
        5: 500000,
        6: 700000,
        7: 800000,
    };
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            toast.error("Bạn cần đăng nhập để đặt lịch!");
            setTimeout(() => navigate("/loginpage"), 1500);
        } else {
            setIsLoggedIn(true);
        }
    }, [navigate]);

    const validationSchema = Yup.object({
        name: Yup.string().required("Vui lòng nhập họ và tên"),
        phone: Yup.string()
            .matches(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ")
            .required("Vui lòng nhập số điện thoại"),
        email: Yup.string()
            .email("Email không hợp lệ")
            .required("Vui lòng nhập email"),
        birthYear: Yup.number()
            .typeError("Năm sinh phải là số")
            .required("Vui lòng nhập năm sinh"),
        address: Yup.string().required("Vui lòng nhập địa chỉ"),
        reason: Yup.string()
            .required("Vui lòng nhập lý do khám")
            .min(10, "Lý do khám phải từ 10 ký tự trở lên"),
    });

    const notifySuccess = () => {
        toast.success("Đặt lịch thành công!", {
            position: "top-right",
            autoClose: 3000,
            onClose: () => navigate("/"),
        });
    };

    const notifyError = () => {
        toast.error("Đặt lịch thất bại!", {
            position: "top-right",
            autoClose: 3000,
        });
    };

    const formatCurrency = (value) => {
        if (!value) return "0";
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const formik = useFormik({
        initialValues: {
            name: localUser.hoTen || "",
            gender: localUser.gioiTinh === 1 ? "Nam" : "Nữ",
            phone: localUser.soDienThoai || "",
            email: localUser.email || "",
            birthYear: localUser.ngaySinh?.slice(0, 4) || "",
            address: localUser.diaChi || "",
            reason: "",
            payment: "TIEN_MAT",
        },
        validationSchema,
        onSubmit: async (values) => {
            if (!isLoggedIn) {
                toast.error("Bạn cần đăng nhập để đặt lịch!");
                return;
            }

            setLoading(true);
            const token = localStorage.getItem("accessToken");

            const body = {
                bacSiID: doctor?.bacSiID,
                ngayKham: date?.slice(0, 10),
                ca,
                gioKham: time,
                lyDoKham: values.reason.trim(),
                ghiChu: null,
                tienSuBenh: null,
                thuocDangDung: null,
                diUng: null,
                phuongThucThanhToan: values.payment,
                onlinePayment: values.payment !== "TIEN_MAT",
            };

            try {
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
                const res = await fetch(`${API_BASE_URL}/api/bookings`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "ngrok-skip-browser-warning": "true",
                    },
                    body: JSON.stringify(body),
                });

                if (!res.ok) throw new Error();
                console.log(body)
                await res.json();

                notifySuccess();
                await new Promise((resolve) => setTimeout(resolve, 3000));
                navigate("/");
            } catch (err) {
                console.log(err);
                notifyError();
            } finally {
                setLoading(false);
            }
        },
    });

    const giaKham =
        GIA_KHAM_THEO_TRINH_DO[doctor?.trinhDoID] || doctor?.giaKham || 0;

    return (
        <div className="bg-gray-50 min-h-screen relative">
            <HeaderSub />

            <div className="max-w-5xl lg:mx-auto mx-5 bg-white mt-6 p-6 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">

                <div className=" border-gray-300 pr-6">
                    <div className="flex items-center gap-4">
                        <img
                            src={doctor?.avatarUrl}
                            className="w-24 h-24 rounded-full object-cover border border-gray-300"
                        />
                        <div>
                            <h2 className="text-lg font-semibold text-sky-700">{doctor?.hoTen}</h2>
                            <p className="text-gray-600 text-sm font-medium">{doctor?.moTaTrinhDo}</p>
                            <p className="text-gray-600 text-sm font-medium">{doctor?.tenChuyenKhoa}</p>
                        </div>
                    </div>

                    <div className="mt-4 text-sm text-gray-600">
                        <p><strong>Thời gian:</strong> <span className="font-semibold ml-0.5">{time}, {date}</span></p>
                        <p><strong>Ca:</strong> <span className="font-semibold ml-0.5">{ca}</span></p>
                        <p><strong>Địa điểm:</strong> <span className="font-semibold">78 Giải Phóng, Đống Đa, Hà Nội</span></p>
                    </div>

                    <div className="mt-6 p-4 bg-sky-50 rounded-lg text-sky-700 border border-gray-300">
                        <p className="font-semibold">
                            Giá khám: {formatCurrency(giaKham || 500000)} vnđ
                        </p>
                        <p className="text-sm text-gray-600">Phí đặt lịch: Miễn phí</p>
                        <p className="font-bold mt-2 text-lg text-right">
                            Tổng cộng: {formatCurrency(giaKham || 500000)} vnđ
                        </p>
                    </div>
                </div>

                <form onSubmit={formik.handleSubmit} className="space-y-4 text-sm">

                    <h3 className="font-semibold text-lg text-sky-700 mb-2">
                        Thông tin người đặt lịch
                    </h3>

                    <input
                        type="text"
                        name="name"
                        className="w-full border border-gray-300 p-2 rounded-lg"
                        placeholder="Họ và tên"
                        {...formik.getFieldProps("name")}
                        disabled={!isLoggedIn}
                    />
                    {formik.touched.name && formik.errors.name && (
                        <p className="text-red-500 text-xs">{formik.errors.name}</p>
                    )}

                    <div className="flex gap-4">
                        <label className="flex items-center gap-1">
                            <input type="radio" name="gender" value="Nam"
                                checked={formik.values.gender === "Nam"}
                                onChange={formik.handleChange}
                                disabled={!isLoggedIn}
                            /> Nam
                        </label>
                        <label className="flex items-center gap-1">
                            <input type="radio" name="gender" value="Nữ"
                                checked={formik.values.gender === "Nữ"}
                                onChange={formik.handleChange}
                                disabled={!isLoggedIn}
                            /> Nữ
                        </label>
                    </div>

                    <input
                        type="text"
                        name="phone"
                        className="w-full border border-gray-300 p-2 rounded-lg"
                        placeholder="Số điện thoại"
                        {...formik.getFieldProps("phone")}
                        disabled={!isLoggedIn}
                    />
                    {formik.touched.phone && formik.errors.phone && (
                        <p className="text-red-500 text-xs">{formik.errors.phone}</p>
                    )}

                    <input
                        type="email"
                        name="email"
                        className="w-full border border-gray-300 p-2 rounded-lg"
                        placeholder="Email"
                        {...formik.getFieldProps("email")}
                        disabled={!isLoggedIn}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <p className="text-red-500 text-xs">{formik.errors.email}</p>
                    )}

                    <input
                        type="number"
                        name="birthYear"
                        className="w-full border border-gray-300 p-2 rounded-lg"
                        placeholder="Năm sinh"
                        {...formik.getFieldProps("birthYear")}
                        disabled={!isLoggedIn}
                    />
                    {formik.touched.birthYear && formik.errors.birthYear && (
                        <p className="text-red-500 text-xs">{formik.errors.birthYear}</p>
                    )}

                    <input
                        type="text"
                        name="address"
                        className="w-full border border-gray-300 p-2 rounded-lg"
                        placeholder="Địa chỉ"
                        {...formik.getFieldProps("address")}
                        disabled={!isLoggedIn}
                    />
                    {formik.touched.address && formik.errors.address && (
                        <p className="text-red-500 text-xs">{formik.errors.address}</p>
                    )}

                    <textarea
                        name="reason"
                        className="w-full border border-gray-300 p-2 rounded-lg"
                        placeholder="Lý do khám"
                        {...formik.getFieldProps("reason")}
                        disabled={!isLoggedIn}
                    />
                    {formik.touched.reason && formik.errors.reason && (
                        <p className="text-red-500 text-xs">{formik.errors.reason}</p>
                    )}

                    <div className="mt-2">
                        <p className="font-medium mb-1">Phương thức thanh toán:</p>

                        <label className="block">
                            <input
                                type="radio"
                                name="payment"
                                value="TIEN_MAT"
                                checked={formik.values.payment === "TIEN_MAT"}
                                onChange={formik.handleChange}
                                disabled={!isLoggedIn}
                            />{" "}
                            Tiền mặt
                        </label>

                        <label className="block">
                            <input
                                type="radio"
                                name="payment"
                                value="VNPAY"
                                checked={formik.values.payment === "VNPAY"}
                                onChange={formik.handleChange}
                                disabled={!isLoggedIn}
                            />{" "}
                            VNPay
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !isLoggedIn}
                        className={`w-full cursor-pointer ${loading || !isLoggedIn ? 'bg-gray-400 cursor-not-allowed' : 'bg-sky-500 hover:bg-sky-600'} text-white py-2 rounded-lg font-semibold mt-4 flex justify-center items-center`}
                    >
                        {loading && <div style={{
                            border: "3px solid #f3f3f3",
                            borderTop: "3px solid #fff",
                            borderRadius: "50%",
                            width: "18px",
                            height: "18px",
                            marginRight: "8px",
                            animation: "spin 1s linear infinite"
                        }}></div>}
                        {loading ? "Đang đặt lịch..." : "Xác nhận đặt khám"}
                    </button>

                    <style>
                        {`
                            @keyframes spin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                        `}
                    </style>
                </form>
            </div>

            {loading && (
                <div style={{
                    position: "fixed",
                    inset: 0,
                    backgroundColor: "rgba(255,255,255,0.7)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 50
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div style={{
                            border: "4px solid #f3f3f3",
                            borderTop: "4px solid #3b82f6",
                            borderRadius: "50%",
                            width: "24px",
                            height: "24px",
                            animation: "spin 1s linear infinite"
                        }}></div>
                        <span style={{ color: "#3b82f6", fontWeight: 500 }}>Đang đặt lịch...</span>
                    </div>
                </div>
            )}

            <Footer />
            <ToastContainer />
        </div>
    );
};

export default AppointmentBooking;
