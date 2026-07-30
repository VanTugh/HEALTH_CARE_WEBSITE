import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createDoctor } from "./adminBacSiAPI.js";

const DoctorCreateForm = ({ onClose, onCreated, specialties = [], trinhDoList = [] }) => {
    const notifySuccess = (msg) => toast.success(msg);
    const notifyError = (msg) => toast.error(msg);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            hoTen: "",
            email: "",
            password: "123456",
            soDienThoai: "",
            diaChi: "",
            ngaySinh: "",
            gioiTinh: 1,
            chuyenKhoaID: specialties[0]?.chuyenKhoaID || "",
            trinhDoID: trinhDoList[0]?.trinhDoID || "",
            soNamKinhNghiem: 0,
            gioiThieu: "",
            quaTrinhDaoTao: "",
            kinhNghiemLamViec: "",
            thanhTich: "",
            chungChi: "",
            soBenhNhanToiDaMotNgay: 20,
            thoiGianKhamMotCa: 30,
            trangThaiCongViec: true,
        },
        validationSchema: Yup.object({
            hoTen: Yup.string().required("Nhập tên bác sĩ"),
            email: Yup.string().email("Email không hợp lệ").required("Nhập email"),
            soDienThoai: Yup.string().required("Nhập số điện thoại"),
            ngaySinh: Yup.date().required("Chọn ngày sinh"),
            chuyenKhoaID: Yup.number().required("Chọn chuyên khoa"),
            trinhDoID: Yup.number().required("Chọn trình độ"),
        }),
        onSubmit: async (values) => {
            try {
                await createDoctor(values);
                notifySuccess("Tạo bác sĩ thành công!");
                onCreated?.();
                onClose?.();
            } catch (err) {
                console.error(err);
                notifyError("Tạo bác sĩ thất bại!");
            }
        },
    });

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 px-4">
            <ToastContainer position="top-right" autoClose={2000} />
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-[fadeIn_0.25s_ease]">
                <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-800 text-center">
                    Thêm bác sĩ mới
                </h2>

                <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">

                    <div>
                        <label className="block mb-1 text-gray-700">Họ tên</label>
                        <input
                            type="text"
                            name="hoTen"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.hoTen}
                            className="border border-gray-300 p-2 w-full rounded-lg"
                        />
                        {formik.touched.hoTen && formik.errors.hoTen && (
                            <p className="text-red-500 text-sm">{formik.errors.hoTen}</p>
                        )}
                    </div>


                    <div>
                        <label className="block mb-1 text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                            className="border border-gray-300 p-2 w-full rounded-lg"
                        />
                        {formik.touched.email && formik.errors.email && (
                            <p className="text-red-500 text-sm">{formik.errors.email}</p>
                        )}
                    </div>


                    <div>
                        <label className="block mb-1 text-gray-700">Số điện thoại</label>
                        <input
                            type="text"
                            name="soDienThoai"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.soDienThoai}
                            className="border border-gray-300 p-2 w-full rounded-lg"
                        />
                    </div>


                    <div>
                        <label className="block mb-1 text-gray-700">Ngày sinh</label>
                        <input
                            type="date"
                            name="ngaySinh"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.ngaySinh}
                            className="border border-gray-300 p-2 w-full rounded-lg"
                        />
                    </div>


                    <div>
                        <label className="block mb-1 text-gray-700">Giới tính</label>
                        <select
                            name="gioiTinh"
                            value={formik.values.gioiTinh}
                            onChange={formik.handleChange}
                            className="border border-gray-300 p-2 w-full rounded-lg"
                        >
                            <option value={1}>Nam</option>
                            <option value={0}>Nữ</option>
                        </select>
                    </div>


                    <div>
                        <label className="block mb-1 text-gray-700">Chuyên khoa</label>
                        <select
                            name="chuyenKhoaID"
                            value={formik.values.chuyenKhoaID}
                            onChange={formik.handleChange}
                            className="border border-gray-300 p-2 w-full rounded-lg"
                        >
                            <option value="">-- Chọn chuyên khoa --</option>
                            {specialties.map(s => (
                                <option key={s.chuyenKhoaID} value={s.chuyenKhoaID}>
                                    {s.tenChuyenKhoa}
                                </option>
                            ))}
                        </select>

                    </div>


                    <div>
                        <label className="block mb-1 text-gray-700">Trình độ</label>
                        <select
                            name="trinhDoID"
                            value={formik.values.trinhDoID}
                            onChange={formik.handleChange}
                            className="border border-gray-300 p-2 w-full rounded-lg"
                        >
                            <option value="">-- Chọn trình độ --</option>
                            {trinhDoList.map((t) => (
                                <option key={t.trinhDoID} value={t.trinhDoID}>
                                    {t.tenTrinhDo}
                                </option>
                            ))}
                        </select>

                    </div>


                    <div>
                        <label className="block mb-1 text-gray-700">Số năm kinh nghiệm</label>
                        <input
                            type="number"
                            name="soNamKinhNghiem"
                            value={formik.values.soNamKinhNghiem}
                            onChange={formik.handleChange}
                            className="border border-gray-300 p-2 w-full rounded-lg"
                        />
                    </div>


                    <div>
                        <label className="block mb-1 text-gray-700">Giới thiệu</label>
                        <textarea
                            name="gioiThieu"
                            value={formik.values.gioiThieu}
                            onChange={formik.handleChange}
                            className="border border-gray-300 p-2 w-full rounded-lg"
                        />
                    </div>


                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#ad7555] text-white rounded-lg hover:bg-[#945f46]"
                        >
                            Tạo tài khoản
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DoctorCreateForm;
