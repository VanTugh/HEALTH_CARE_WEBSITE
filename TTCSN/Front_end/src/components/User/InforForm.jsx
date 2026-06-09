import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { ToastContainer, toast } from 'react-toastify';

const InforForm = ({ user, setUser, setIsEditing }) => {

    const notifySuccess = () => {
        toast.success("Cập nhật thông tin thành công!", {
            position: "top-right",
            autoClose: 3000,
        });
    };

    const notifyError = () => {
        toast.error("Cập nhật thông tin thất bại!", {
            position: "top-right",
            autoClose: 3000,
        });
    };

    const formik = useFormik({
        initialValues: {
            hoTen: user?.hoTen || "",
            email: user?.email || "",
            soDienThoai: user?.soDienThoai || "",
            diaChi: user?.diaChi || "",
            ngaySinh: user?.ngaySinh || "",
            gioiTinh: user?.gioiTinh?.toString() || "",
            avatarUrl: user?.avatarUrl || "",
        },

        validationSchema: Yup.object({
            hoTen: Yup.string().required("Vui lòng nhập họ và tên"),
            email: Yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
            soDienThoai: Yup.string()
                .matches(/^(?:\+84|0)[0-9]{9,10}$/, "Số điện thoại không hợp lệ")
                .required("Vui lòng nhập số điện thoại"),
            diaChi: Yup.string().required("Vui lòng nhập địa chỉ"),
            ngaySinh: Yup.date().required("Vui lòng chọn ngày sinh"),
            gioiTinh: Yup.string().required("Vui lòng chọn giới tính"),
            avatarUrl: Yup.string().url("Link ảnh không hợp lệ"),
        }),

        onSubmit: async (values) => {
            try {
                const token = localStorage.getItem("accessToken");

                const updatedUser = {
                    hoTen: values.hoTen,
                    email: values.email,
                    soDienThoai: values.soDienThoai,
                    diaChi: values.diaChi,
                    ngaySinh: values.ngaySinh,
                    gioiTinh: Number(values.gioiTinh),
                    avatarUrl: values.avatarUrl
                };
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
                const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                        "ngrok-skip-browser-warning": "true",
                    },
                    body: JSON.stringify(updatedUser),
                });

                const data = await response.json();

                if (!response.ok) {
                    notifyError();
                    throw new Error(data?.message || "Cập nhật thất bại!");
                }

                setUser(data);
                notifySuccess();
                setTimeout(() => setIsEditing(false), 1500);

            } catch (error) {
                console.error("Lỗi khi cập nhật thông tin:", error);
            }
        }
    });

    return (
        <form onSubmit={formik.handleSubmit} className="rounded-[12px] p-6 w-full bg-white">

            <ToastContainer />


            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-semibold mb-1">Họ và tên *</label>
                    <input
                        type="text"
                        name="hoTen"
                        value={formik.values.hoTen}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full border border-gray-300 rounded bg-gray-100 p-2"
                    />
                    {formik.touched.hoTen && formik.errors.hoTen && (
                        <p className="text-red-500 text-sm">{formik.errors.hoTen}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-1">Email *</label>
                    <input
                        type="email"
                        name="email"
                        disabled
                        value={formik.values.email}
                        className="w-full border border-gray-300 rounded bg-gray-100 p-2"
                    />
                </div>
            </div>


            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-semibold mb-1">Số điện thoại *</label>
                    <input
                        type="text"
                        name="soDienThoai"
                        value={formik.values.soDienThoai}
                        onChange={formik.handleChange}
                        className="w-full border border-gray-300 rounded bg-gray-100 p-2"
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
                        className="w-full border border-gray-300 rounded bg-gray-100 p-2"
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
                        className="w-full border border-gray-300 rounded bg-gray-100 p-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-1">Giới tính *</label>
                    <select
                        name="gioiTinh"
                        value={formik.values.gioiTinh}
                        onChange={formik.handleChange}
                        className="w-full border border-gray-300 rounded bg-gray-100 p-2"
                    >
                        <option value="">Chọn giới tính</option>
                        <option value="1">Nam</option>
                        <option value="0">Nữ</option>
                    </select>
                </div>
            </div>


            <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">Avatar URL</label>
                <input
                    type="text"
                    name="avatarUrl"
                    placeholder="Nhập URL ảnh mới"
                    value={formik.values.avatarUrl}
                    onChange={formik.handleChange}
                    className="w-full border border-gray-300 rounded bg-gray-100 p-2"
                />
                {formik.touched.avatarUrl && formik.errors.avatarUrl && (
                    <p className="text-red-500 text-sm">{formik.errors.avatarUrl}</p>
                )}

                {formik.values.avatarUrl && (
                    <img
                        src={formik.values.avatarUrl}
                        alt="preview"
                        className="w-24 h-24 rounded-full mt-2 object-cover border"
                    />
                )}
            </div>


            <div className="flex gap-x-3">
                <button type="submit" className="px-4 py-2 bg-sky-500 text-white rounded-[4px] hover:bg-sky-600 cursor-pointer">
                    Cập nhật thông tin
                </button>
                <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-[4px] hover:bg-gray-700 cursor-pointer"
                >
                    Hủy
                </button>
            </div>
        </form>
    )
}

export default InforForm
