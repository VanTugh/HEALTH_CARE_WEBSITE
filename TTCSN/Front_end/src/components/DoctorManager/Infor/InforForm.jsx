import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const formatDateToInput = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
};

const InforForm = ({ user, setUser, setIsEditing, specialties = [], degrees = [] }) => {
    const [showPassword, setShowPassword] = useState(false);

    const notifySuccess = () => toast.success("Cập nhật thông tin thành công!");
    const notifyError = (msg = "Cập nhật thông tin thất bại!") => toast.error(msg);

    const convertToDDMMYYYY = (input) => {
        const [yyyy, mm, dd] = input.split("-");
        return `${dd}/${mm}/${yyyy}`;
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            hoTen: user?.hoTen || "",
            soDienThoai: user?.soDienThoai || "",
            diaChi: user?.diaChi || "",
            ngaySinh: formatDateToInput(user?.ngaySinh),
            gioiTinh: user?.gioiTinh ?? 0,
            chuyenKhoaID: user?.chuyenKhoaID ? String(user.chuyenKhoaID) : "",
            trinhDoID: user?.trinhDoID ? String(user.trinhDoID) : "",
            kinhNghiem: user?.kinhNghiem || "",
            moTa: user?.moTa || "",
            trangThai: user?.trangThai ?? true,
            currentPassword: "",
        },
        validationSchema: Yup.object({
            hoTen: Yup.string().required("Vui lòng nhập họ và tên"),
            soDienThoai: Yup.string()
                .matches(/^(?:\+84|0)[0-9]{9,10}$/, "Số điện thoại không hợp lệ")
                .required("Vui lòng nhập số điện thoại"),
            diaChi: Yup.string().required("Vui lòng nhập địa chỉ"),
            ngaySinh: Yup.string().required("Vui lòng chọn ngày sinh"),
            gioiTinh: Yup.number().required("Vui lòng chọn giới tính"),
            chuyenKhoaID: Yup.string().required("Vui lòng chọn chuyên khoa"),
            trinhDoID: Yup.string().required("Vui lòng chọn trình độ"),
            kinhNghiem: Yup.string().required("Vui lòng nhập kinh nghiệm"),
            moTa: Yup.string().required("Vui lòng nhập mô tả"),
            trangThai: Yup.boolean().required(),
            currentPassword: Yup.string().required("Vui lòng nhập mật khẩu hiện tại"),
        }),
        onSubmit: async (values) => {
            try {
                const token = localStorage.getItem("accessToken");

                if (!token) {
                    notifyError("Không tìm thấy token, vui lòng đăng nhập lại.");
                    return;
                }

                const body = {
                    currentPassword: values.currentPassword,
                    hoTen: values.hoTen,
                    soDienThoai: values.soDienThoai,
                    diaChi: values.diaChi,
                    ngaySinh: convertToDDMMYYYY(values.ngaySinh),
                    gioiTinh: Number(values.gioiTinh),
                    chuyenKhoaID: Number(values.chuyenKhoaID),
                    trinhDoID: Number(values.trinhDoID),
                    kinhNghiem: values.kinhNghiem,
                    moTa: values.moTa,
                    trangThai: Boolean(values.trangThai),
                    avatar: user.avatarUrl,
                };
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
                const response = await fetch(`${API_BASE_URL}/api/doctor/update`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "ngrok-skip-browser-warning": "true",
                    },
                    body: JSON.stringify(body),
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.message || "Cập nhật thất bại!");
                }

                if (user?.email) {
                    const res = await fetch(`http://localhost:8080/api/doctor/email?email=${user.email}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const updatedUser = await res.json();
                    setUser(updatedUser);
                }

                notifySuccess();
                setTimeout(() => setIsEditing(false), 1500);

            } catch (err) {
                notifyError(err.message);
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="rounded-[12px] p-6 w-full bg-white">
            <ToastContainer />

            <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded">
                Vui lòng nhập mật khẩu hiện tại để xác nhận thay đổi
            </div>


            <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">Họ và tên *</label>
                <input
                    type="text"
                    name="hoTen"
                    value={formik.values.hoTen}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full border border-gray-300 rounded-[4px] bg-gray-100 p-2"
                />
                {formik.touched.hoTen && formik.errors.hoTen && (
                    <p className="text-red-500 text-sm">{formik.errors.hoTen}</p>
                )}
            </div>


            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-semibold mb-1">Số điện thoại *</label>
                    <input
                        type="text"
                        name="soDienThoai"
                        value={formik.values.soDienThoai}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full border border-gray-300 rounded-[4px] bg-gray-100 p-2"
                    />
                    {formik.touched.soDienThoai && formik.errors.soDienThoai && (
                        <p className="text-red-500 text-sm">{formik.errors.soDienThoai}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-1">Địa chỉ *</label>
                    <input
                        type="text"
                        name="diaChi"
                        value={formik.values.diaChi}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full border border-gray-300 rounded-[4px] bg-gray-100 p-2"
                    />
                    {formik.touched.diaChi && formik.errors.diaChi && (
                        <p className="text-red-500 text-sm">{formik.errors.diaChi}</p>
                    )}
                </div>
            </div>


            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-semibold mb-1">Ngày sinh *</label>
                    <input
                        type="date"
                        name="ngaySinh"
                        value={formik.values.ngaySinh}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full border border-gray-300 rounded-[4px] bg-gray-100 p-2"
                    />
                    {formik.touched.ngaySinh && formik.errors.ngaySinh && (
                        <p className="text-red-500 text-sm">{formik.errors.ngaySinh}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-1">Giới tính *</label>
                    <select
                        name="gioiTinh"
                        value={formik.values.gioiTinh}
                        onChange={(e) => formik.setFieldValue("gioiTinh", Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-[4px] bg-gray-100 p-2"
                    >
                        <option value={0}>Nam</option>
                        <option value={1}>Nữ</option>
                    </select>
                </div>
            </div>


            <div className="border border-gray-300 p-4 rounded-[8px] mb-6">
                <h3 className="text-sky-600 font-bold text-[18px] mb-3">Thông tin chuyên môn</h3>

                <label className="block text-sm font-semibold mb-1">Chuyên khoa *</label>
                <select
                    name="chuyenKhoaID"
                    value={formik.values.chuyenKhoaID}
                    onChange={formik.handleChange}
                    className="w-full border border-gray-300 rounded-[4px] bg-gray-100 p-2 mb-3"
                >
                    <option value="">-- Chọn chuyên khoa --</option>
                    {specialties.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>
                {formik.touched.chuyenKhoaID && formik.errors.chuyenKhoaID && (
                    <p className="text-red-500 text-sm">{formik.errors.chuyenKhoaID}</p>
                )}

                <label className="block text-sm font-semibold mb-1">Trình độ *</label>
                <select
                    name="trinhDoID"
                    value={formik.values.trinhDoID}
                    onChange={formik.handleChange}
                    className="w-full border border-gray-300 rounded-[4px] bg-gray-100 p-2 mb-3"
                >
                    <option value="">-- Chọn trình độ --</option>
                    {degrees.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                </select>
                {formik.touched.trinhDoID && formik.errors.trinhDoID && (
                    <p className="text-red-500 text-sm">{formik.errors.trinhDoID}</p>
                )}

                <label className="block text-sm font-semibold mb-1">Kinh nghiệm *</label>
                <textarea
                    name="kinhNghiem"
                    value={formik.values.kinhNghiem}
                    onChange={formik.handleChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded-[4px] bg-gray-100 p-2 mb-3"
                />

                <label className="block text-sm font-semibold mb-1">Mô tả *</label>
                <textarea
                    name="moTa"
                    value={formik.values.moTa}
                    onChange={formik.handleChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded-[4px] bg-gray-100 p-2 mb-3"
                />

                <label className="block text-sm font-semibold mb-1">Trạng thái *</label>
                <select
                    name="trangThai"
                    value={formik.values.trangThai}
                    onChange={formik.handleChange}
                    className="w-full border border-gray-300 rounded-[4px] bg-gray-100 p-2"
                >
                    <option value={true}>Đang hoạt động</option>
                    <option value={false}>Tạm ngưng</option>
                </select>
            </div>


            <div className="mb-6 relative">
                <label className="block text-sm font-semibold mb-1">Mật khẩu hiện tại *</label>
                <input
                    type={showPassword ? "text" : "password"}
                    name="currentPassword"
                    value={formik.values.currentPassword}
                    onChange={formik.handleChange}
                    placeholder="Nhập mật khẩu để xác nhận"
                    className="w-full border border-gray-300 rounded-[4px] bg-gray-100 p-2 pr-10"
                />
                <span
                    className="absolute right-3 top-[36px] cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </span>
            </div>


            <div className="flex gap-x-3 justify-end">
                <button
                    type="submit"
                    className="px-4 py-2 bg-sky-500 hover:bg-sky-600 rounded-[8px] text-white font-medium"
                >
                    Cập nhật thông tin
                </button>
                <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-[#6e7180] rounded-[8px] text-white font-medium"
                >
                    Hủy
                </button>
            </div>
        </form>
    );
};

export default InforForm;
