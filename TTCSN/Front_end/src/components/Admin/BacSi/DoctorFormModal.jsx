import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const DoctorSchema = Yup.object().shape({
    chuyenKhoaID: Yup.number().required("Chọn chuyên khoa"),
    trinhDoID: Yup.number().required("Chọn trình độ"),
    trangThaiCongViec: Yup.boolean().required("Chọn trạng thái công việc"),
});

export default function DoctorFormModal({ editingDoctor, specialties, trinhDoList, onSave, onClose }) {
    const formik = useFormik({
        initialValues: {
            chuyenKhoaID: editingDoctor?.chuyenKhoaID ?? "",
            trinhDoID: editingDoctor?.trinhDoID ?? "",
            trangThaiCongViec: editingDoctor?.trangThaiCongViec ?? true,
        },
        validationSchema: DoctorSchema,
        enableReinitialize: true,
        onSubmit: (values) => {

            onSave({
                chuyenKhoaID: Number(values.chuyenKhoaID),
                trinhDoID: Number(values.trinhDoID),
                trangThaiCongViec: Boolean(values.trangThaiCongViec),
            });
        },
    });

    const { values, handleSubmit, errors, touched, setFieldValue } = formik;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 px-4">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto animate-[fadeIn_0.25s_ease]">
                <h2 className="text-xl font-semibold mb-4 text-center">Sửa thông tin bác sĩ</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    <div>
                        <label className="block mb-1 text-gray-700">Chọn chuyên khoa</label>
                        <select
                            name="chuyenKhoaID"
                            value={values.chuyenKhoaID}
                            onChange={e => setFieldValue("chuyenKhoaID", Number(e.target.value))}
                            className="border border-gray-300 p-2 w-full rounded-lg"
                        >
                            <option value="">-- Chọn chuyên khoa --</option>
                            {specialties.map(s => (
                                <option key={s.chuyenKhoaID} value={s.chuyenKhoaID}>{s.tenChuyenKhoa}</option>
                            ))}
                        </select>
                        {touched.chuyenKhoaID && errors.chuyenKhoaID && (
                            <p className="text-red-500 text-sm">{errors.chuyenKhoaID}</p>
                        )}
                    </div>


                    <div>
                        <label className="block mb-1 text-gray-700">Chọn trình độ</label>
                        <select
                            name="trinhDoID"
                            value={values.trinhDoID}
                            onChange={e => setFieldValue("trinhDoID", Number(e.target.value))}
                            className="border border-gray-300 p-2 w-full rounded-lg"
                        >
                            <option value="">-- Chọn trình độ --</option>
                            {trinhDoList.map(t => (
                                <option key={t.trinhDoID} value={t.trinhDoID}>{t.tenTrinhDo}</option>
                            ))}
                        </select>
                        {touched.trinhDoID && errors.trinhDoID && (
                            <p className="text-red-500 text-sm">{errors.trinhDoID}</p>
                        )}
                    </div>


                    <div>
                        <label className="block mb-1 text-gray-700">Trạng thái công việc</label>
                        <select
                            name="trangThaiCongViec"
                            value={values.trangThaiCongViec ? "true" : "false"}
                            onChange={e => setFieldValue("trangThaiCongViec", e.target.value === "true")}
                            className="border border-gray-300 p-2 w-full rounded-lg"
                        >
                            <option value="true">Hoạt động</option>
                            <option value="false">Ngưng hoạt động</option>
                        </select>
                    </div>


                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 cursor-pointer"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#ad7555] text-white rounded-lg hover:bg-[#945f46] cursor-pointer"
                        >
                            Lưu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
