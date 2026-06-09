import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";


const schema = Yup.object({
    tenTrinhDo: Yup.string().required("Tên trình độ không được để trống"),
    moTa: Yup.string().required("Mô tả không được để trống"),
    giaKham: Yup.number()
        .typeError("Giá khám phải là số")
        .required("Giá khám không được để trống")
        .min(100000, "Giá khám phải từ 100.000 VND trở lên"),
    thuTuUuTien: Yup.number()
        .typeError("Thứ tự ưu tiên phải là số")
        .required("Vui lòng nhập thứ tự ưu tiên")
        .min(1, "Thứ tự ưu tiên nhỏ nhất là 1"),
});

export default function TrinhDoForm({ editingItem, onSave, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
                <h2 className="text-xl font-semibold mb-4 text-center">
                    {editingItem ? "Sửa trình độ" : "Thêm trình độ"}
                </h2>

                <Formik
                    initialValues={{
                        tenTrinhDo: editingItem?.tenTrinhDo || "",
                        moTa: editingItem?.moTa || "",
                        giaKham: editingItem?.giaKham ?? 100000,
                        thuTuUuTien: editingItem?.thuTuUuTien || 1,
                    }}
                    validationSchema={schema}
                    onSubmit={onSave}
                    enableReinitialize
                >
                    <Form className="space-y-4">

                        <div>
                            <label className="font-medium">Tên trình độ</label>
                            <Field
                                className="border border-gray-300 p-3 w-full rounded-lg"
                                name="tenTrinhDo"
                            />
                            <ErrorMessage
                                className="text-sm text-red-500"
                                name="tenTrinhDo"
                                component="div"
                            />
                        </div>


                        <div>
                            <label className="font-medium">Mô tả</label>
                            <Field
                                className="border border-gray-300 p-3 w-full rounded-lg"
                                name="moTa"
                                as="textarea"
                                rows={3}
                            />
                            <ErrorMessage
                                className="text-sm text-red-500"
                                name="moTa"
                                component="div"
                            />
                        </div>


                        <div>
                            <label className="font-medium">Giá khám</label>
                            <Field
                                type="number"
                                className="border border-gray-300 p-3 w-full rounded-lg"
                                name="giaKham"
                                min={100000}
                            />
                            <ErrorMessage
                                className="text-sm text-red-500"
                                name="giaKham"
                                component="div"
                            />
                        </div>


                        <div>
                            <label className="font-medium">Thứ tự ưu tiên</label>
                            <Field
                                type="number"
                                className="border border-gray-300 p-3 w-full rounded-lg"
                                name="thuTuUuTien"
                                min={1}
                            />
                            <ErrorMessage
                                className="text-sm text-red-500"
                                name="thuTuUuTien"
                                component="div"
                            />
                        </div>


                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-300 cursor-pointer"
                            >
                                Hủy
                            </button>

                            <button
                                type="submit"
                                className="px-4 py-2 bg-[#ad7555] text-white rounded-lg cursor-pointer hover:bg-[#945f46]"
                            >
                                {editingItem ? "Cập nhật" : "Thêm mới"}
                            </button>
                        </div>
                    </Form>
                </Formik>
            </div>
        </div>
    );
}
