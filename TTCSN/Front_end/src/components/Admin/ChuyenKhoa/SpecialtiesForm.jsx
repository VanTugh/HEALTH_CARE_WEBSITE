import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const SpecialtySchema = Yup.object().shape({
    name: Yup.string().required("Tên chuyên khoa không được để trống"),
    desc: Yup.string()
        .max(1000, "Mô tả không được vượt quá 1000 ký tự")
        .required("Mô tả không được để trống"),
    image: Yup.string()
        .url("Ảnh đại diện phải là URL hợp lệ")
        .required("Ảnh đại diện không được để trống"),
    order: Yup.number()
        .typeError("Thứ tự hiển thị phải là số")
        .min(1, "Thứ tự hiển thị phải lớn hơn hoặc bằng 1")
        .max(7, "Thứ tự hiển thị không được lớn hơn 7")
        .required("Thứ tự hiển thị không được để trống"),
});

export default function SpecialtiesForm({ editingSpecialty, onSave, onClose }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 px-4 py-6">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-[fadeIn_0.25s_ease]">
                <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-800 text-center">
                    {editingSpecialty ? "Sửa chuyên khoa" : "Thêm chuyên khoa"}
                </h2>

                <Formik
                    initialValues={
                        editingSpecialty
                            ? {
                                name: editingSpecialty.tenChuyenKhoa || "",
                                desc: editingSpecialty.moTa || "",
                                image: editingSpecialty.anhDaiDien || "",
                                order: editingSpecialty.thuTuHienThi || 1,
                            }
                            : { name: "", desc: "", image: "", order: 1 }
                    }
                    validationSchema={SpecialtySchema}
                    onSubmit={(values) => {

                        onSave({
                            tenChuyenKhoa: values.name,
                            moTa: values.desc,
                            anhDaiDien: values.image,
                            thuTuHienThi: Number(values.order),
                        });
                    }}
                    enableReinitialize
                >
                    {({ values, setFieldValue }) => (
                        <Form className="flex flex-col gap-5">

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">
                                    Tên chuyên khoa
                                </label>
                                <Field
                                    name="name"
                                    placeholder="Nhập tên chuyên khoa"
                                    className="border border-gray-200 p-3 w-full rounded-xl focus:ring-1 focus:ring-gray-300 focus:border-gray-400 outline-none shadow-sm transition"
                                />
                                <ErrorMessage
                                    name="name"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>


                            <div>
                                <label className="block text-gray-700 font-medium mb-1">
                                    Ảnh đại diện (URL)
                                </label>
                                <Field
                                    name="image"
                                    placeholder="Nhập URL ảnh đại diện"
                                    className="border border-gray-200 p-3 w-full rounded-xl focus:ring-1 focus:ring-gray-300 focus:border-gray-400 outline-none shadow-sm transition"
                                />
                                <ErrorMessage
                                    name="image"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />

                                {values.image && (
                                    <img
                                        src={values.image}
                                        alt="Preview"
                                        className="w-full h-40 object-contain mt-3 rounded-md border"
                                    />
                                )}
                            </div>


                            <div>
                                <label className="block text-gray-700 font-medium mb-1">
                                    Mô tả
                                </label>
                                <Field
                                    as="textarea"
                                    name="desc"
                                    placeholder="Nhập mô tả chuyên khoa (tối đa 1000 ký tự)"
                                    rows="5"
                                    className="border border-gray-200 p-3 w-full rounded-xl resize-none focus:ring-1 focus:ring-gray-300 focus:border-gray-400 outline-none shadow-sm transition"
                                    maxLength={1000}
                                    onChange={(e) => setFieldValue("desc", e.target.value)}
                                />
                                <div className="flex justify-between text-sm text-gray-500 mt-1">
                                    <ErrorMessage
                                        name="desc"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                    <span className="ml-auto">{values.desc.length}/1000</span>
                                </div>
                            </div>


                            <div>
                                <label className="block text-gray-700 font-medium mb-1">
                                    Thứ tự hiển thị
                                </label>
                                <Field
                                    name="order"
                                    type="number"
                                    min={1}
                                    max={7}
                                    placeholder="Nhập thứ tự hiển thị"
                                    className="border border-gray-200 p-3 w-full rounded-xl focus:ring-1 focus:ring-gray-300 focus:border-gray-400 outline-none shadow-sm transition"
                                />
                                <ErrorMessage
                                    name="order"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>


                            <div className="flex justify-end gap-3 mt-4">
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
                                    {editingSpecialty ? "Cập nhật" : "Thêm mới"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
