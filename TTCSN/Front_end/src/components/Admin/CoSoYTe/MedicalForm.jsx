import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const MedicalSchema = Yup.object().shape({
    tenCoSo: Yup.string().required("Tên cơ sở không được để trống"),
    diaChi: Yup.string().required("Địa chỉ không được để trống"),
    soDienThoai: Yup.string()
        .matches(/^[0-9]+$/, "Chỉ được nhập số")
        .test(
            "is-valid-phone",
            "Số điện thoại chỉ được chứa chữ số",
            (value) => /^[0-9]+$/.test(value?.replace(/\s+/g, "")) // loại bỏ khoảng trắng trước khi kiểm tra
        )
        .min(9, "Số điện thoại phải từ 9–11 số")
        .max(11, "Số điện thoại phải từ 9–11 số")
        .required("Không được để trống"),
    email: Yup.string().email("Email không hợp lệ").required("Email không được để trống"),
    moTa: Yup.string().max(1000, "Mô tả tối đa 1000 ký tự").required("Mô tả không được để trống"),
    anhDaiDien: Yup.string(),
});

export default function MedicalForm({ editingMedical, onSave, onClose }) {
    const formik = useFormik({
        initialValues: editingMedical || {},
        validationSchema: MedicalSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
                const token = localStorage.getItem("accessToken");
                const response = await fetch(
                    `${API_BASE_URL}/api/facilities/${editingMedical.coSoID}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                            "ngrok-skip-browser-warning": "true",
                        },
                        body: JSON.stringify(values),
                    }
                );

                if (!response.ok) throw new Error(`Lỗi: ${response.status}`);
                const data = await response.json();

                onSave(data, null);

            } catch (error) {
                console.error("Lỗi khi cập nhật:", error);
                onSave(null, error);
            }
        },
    });

    const { values, handleChange, handleSubmit, setFieldValue, errors, touched, handleBlur } = formik;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 px-4">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-[fadeIn_0.25s_ease]">
                <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-800 text-center">
                    Cập nhật thông tin
                </h2>

                <form onSubmit={handleSubmit}>

                    <div className="mb-5">
                        <label className="block text-gray-700 font-medium mb-1">Tên cơ sở</label>
                        <input
                            name="tenCoSo"
                            value={values.tenCoSo}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Nhập tên cơ sở"
                            className="border border-gray-200 p-3 w-full rounded-xl focus:ring-1 focus:ring-gray-300 focus:border-gray-400 outline-none shadow-sm transition"
                        />
                        {touched.tenCoSo && errors.tenCoSo && (
                            <div className="text-red-500 text-sm mt-1">{errors.tenCoSo}</div>
                        )}
                    </div>


                    <div className="mb-5">
                        <label className="block text-gray-700 font-medium mb-1">Địa chỉ</label>
                        <input
                            name="diaChi"
                            value={values.diaChi}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Nhập địa chỉ"
                            className="border border-gray-200 p-3 w-full rounded-xl focus:ring-1 focus:ring-gray-300 focus:border-gray-400 outline-none shadow-sm transition"
                        />
                        {touched.diaChi && errors.diaChi && (
                            <div className="text-red-500 text-sm mt-1">{errors.diaChi}</div>
                        )}
                    </div>


                    <div className="mb-5">
                        <label className="block text-gray-700 font-medium mb-1">Số điện thoại</label>
                        <input
                            name="soDienThoai"
                            value={values.soDienThoai}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="VD: 0987654321"
                            className="border border-gray-200 p-3 w-full rounded-xl focus:ring-1 focus:ring-gray-300 focus:border-gray-400 outline-none shadow-sm transition"
                        />
                        {touched.soDienThoai && errors.soDienThoai && (
                            <div className="text-red-500 text-sm mt-1">{errors.soDienThoai}</div>
                        )}
                    </div>


                    <div className="mb-5">
                        <label className="block text-gray-700 font-medium mb-1">Email cơ sở</label>
                        <input
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="example@domain.com"
                            className="border border-gray-200 p-3 w-full rounded-xl focus:ring-1 focus:ring-gray-300 focus:border-gray-400 outline-none shadow-sm transition"
                        />
                        {touched.email && errors.email && (
                            <div className="text-red-500 text-sm mt-1">{errors.email}</div>
                        )}
                    </div>


                    <div className="mb-5">
                        <label className="block text-gray-700 font-medium mb-1">Mô tả về cơ sở</label>
                        <textarea
                            name="moTa"
                            value={values.moTa}
                            onChange={(e) => setFieldValue("moTa", e.target.value)}
                            onBlur={handleBlur}
                            rows={5}
                            placeholder="Nhập mô tả"
                            className="border border-gray-200 p-3 w-full rounded-xl resize-none focus:ring-1 focus:ring-gray-300 focus:border-gray-400 outline-none shadow-sm transition"
                            maxLength={1000}
                        />
                        <div className="flex justify-between text-sm text-gray-500 mt-1">
                            {touched.moTa && errors.moTa && <div className="text-red-500">{errors.moTa}</div>}
                            <span>{values.moTa.length}/1000</span>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-400 rounded-xl hover:bg-gray-100 transition cursor-pointer"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#ad7555] text-white rounded-xl shadow-md hover:bg-[#945f46] hover:scale-105 transition cursor-pointer"
                        >
                            Lưu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
