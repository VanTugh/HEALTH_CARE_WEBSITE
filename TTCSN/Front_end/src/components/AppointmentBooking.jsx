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

    const [relatives, setRelatives] = useState([]);
    const [bookingType, setBookingType] = useState('self');
    const [voucherCode, setVoucherCode] = useState("");
    const [appliedVoucher, setAppliedVoucher] = useState(null);
    const [voucherMsg, setVoucherMsg] = useState({ text: "", type: "" });

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

            // Lấy danh sách người thân
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            fetch(`${API_BASE_URL}/api/v1/relatives`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setRelatives(data.data);
                    }
                })
                .catch(err => console.log(err));
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

    const handleApplyVoucher = async (e) => {
        e.preventDefault();
        if (!voucherCode.trim()) return;
        setVoucherMsg({ text: "Đang kiểm tra...", type: "info" });
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${API_BASE_URL}/api/v1/vouchers/validate?code=${voucherCode.trim()}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.success) {
                setAppliedVoucher(data.data);
                setVoucherMsg({ text: data.message, type: "success" });
            } else {
                setAppliedVoucher(null);
                setVoucherMsg({ text: data.message, type: "error" });
            }
        } catch (err) {
            setAppliedVoucher(null);
            setVoucherMsg({ text: "Lỗi hệ thống khi kiểm tra mã khuyến mãi", type: "error" });
        }
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
                nguoiThanID: bookingType === 'self' ? null : Number(bookingType),
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
                maKhuyenMai: appliedVoucher ? appliedVoucher.maVoucher : null
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

    const basePrice = GIA_KHAM_THEO_TRINH_DO[doctor?.trinhDoID] || doctor?.giaKham || 500000;
    let discountAmount = 0;
    if (appliedVoucher) {
        discountAmount = basePrice * (appliedVoucher.phanTramGiam / 100);
        if (discountAmount > appliedVoucher.giamToiDa) discountAmount = appliedVoucher.giamToiDa;
    }
    const finalTotal = basePrice - discountAmount;

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
                        <p className="font-semibold flex justify-between">
                            <span>Giá khám:</span>
                            <span>{formatCurrency(basePrice)} vnđ</span>
                        </p>
                        {appliedVoucher && (
                            <p className="font-semibold flex justify-between text-green-600 mt-1">
                                <span>Giảm giá ({appliedVoucher.phanTramGiam}%):</span>
                                <span>-{formatCurrency(discountAmount)} vnđ</span>
                            </p>
                        )}
                        <p className="text-sm text-gray-600 mt-1">Phí đặt lịch: Miễn phí</p>
                        <hr className="my-2 border-sky-200" />
                        <p className="font-bold mt-2 text-xl flex justify-between text-sky-800">
                            <span>Tổng cộng:</span>
                            <span>{formatCurrency(finalTotal)} vnđ</span>
                        </p>
                    </div>
                </div>

                <form onSubmit={formik.handleSubmit} className="space-y-4 text-sm">

                    <h3 className="font-semibold text-lg text-sky-700 mb-2">
                        Thông tin người khám
                    </h3>

                    <div className="mb-4">
                        <label className="block font-medium mb-1">Đặt lịch cho ai?</label>
                        <select
                            className="w-full border border-gray-300 p-2 rounded-lg text-gray-700 bg-gray-50 focus:ring-1 focus:ring-sky-500"
                            value={bookingType}
                            onChange={(e) => {
                                const val = e.target.value;
                                setBookingType(val);

                                if (val === 'self') {
                                    formik.setValues({
                                        ...formik.values,
                                        name: localUser.hoTen || "",
                                        gender: localUser.gioiTinh === 1 ? "Nam" : "Nữ",
                                        phone: localUser.soDienThoai || "",
                                        birthYear: localUser.ngaySinh?.slice(0, 4) || "",
                                        address: localUser.diaChi || ""
                                    });
                                } else {
                                    const rel = relatives.find(r => r.nguoiThanID.toString() === val);
                                    if (rel) {
                                        formik.setValues({
                                            ...formik.values,
                                            name: rel.hoTen,
                                            gender: rel.gioiTinh === 1 ? "Nam" : "Nữ",
                                            phone: rel.soDienThoai || localUser.soDienThoai,
                                            birthYear: rel.ngaySinh ? rel.ngaySinh.slice(0, 4) : "",
                                            address: rel.diaChi || ""
                                        });
                                    }
                                }
                            }}
                            disabled={!isLoggedIn}
                        >
                            <option value="self">Cho bản thân tôi ({localUser.hoTen})</option>
                            {relatives.map(r => (
                                <option key={r.nguoiThanID} value={r.nguoiThanID}>
                                    Cho {r.moiQuanHe}: {r.hoTen}
                                </option>
                            ))}
                        </select>
                    </div>

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

                    <div className="mt-4 p-4 border border-teal-200 bg-teal-50 rounded-lg">
                        <p className="font-medium text-teal-800 mb-2">🎁 Mã giảm giá</p>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                className="flex-1 border border-gray-300 p-2 rounded-lg"
                                placeholder="Nhập mã (Ví dụ: CHAO_BAN_MOI)"
                                value={voucherCode}
                                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                                disabled={!isLoggedIn}
                            />
                            <button
                                type="button"
                                onClick={handleApplyVoucher}
                                disabled={!isLoggedIn || !voucherCode.trim()}
                                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition"
                            >
                                Áp dụng
                            </button>
                        </div>
                        {voucherMsg.text && (
                            <p className={`mt-2 text-sm ${voucherMsg.type === 'success' ? 'text-green-600' : voucherMsg.type === 'error' ? 'text-red-500' : 'text-blue-500'}`}>
                                {voucherMsg.text}
                            </p>
                        )}
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
