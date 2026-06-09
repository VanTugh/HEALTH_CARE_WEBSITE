// CompleteForm.jsx
import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const CompleteForm = ({ booking, onClose, onSubmit }) => {
    useEffect(() => {
        document.body.style.overflow = booking ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [booking]);

    if (!booking) return null;


    const validationSchema = Yup.object().shape({
        chanDoan: Yup.string().required("Chẩn đoán không được để trống"),
        ketQuaKham: Yup.string().required("Kết quả khám không được để trống"),
        donThuoc: Yup.string().required("Đơn thuốc không được để trống"),
        loiDanBacSi: Yup.string().required("Lời dặn bác sĩ không được để trống"),
        ngayTaiKham: Yup.string().required("Ngày tái khám không được để trống"),
    });

    const initialValues = {
        chanDoan: "",
        ketQuaKham: "",
        donThuoc: "",
        loiDanBacSi: "",
        ngayTaiKham: "",
    };

    const handleSubmit = (values) => {
        onSubmit(booking.id, values);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-[400px] max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-2 text-center">
                    Hoàn thành ca khám
                </h2>
                <p className="text-gray-500 mb-4 text-center">{booking.tenKhachHang}</p>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched }) => (
                        <Form className="flex flex-col gap-3">

                            <label className="text-sm font-medium">
                                Chẩn đoán:
                                <Field
                                    type="text"
                                    name="chanDoan"
                                    className={`border rounded-lg p-2 w-full mt-1 ${errors.chanDoan && touched.chanDoan ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                <ErrorMessage
                                    name="chanDoan"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </label>


                            <label className="text-sm font-medium">
                                Kết quả khám:
                                <Field
                                    as="textarea"
                                    name="ketQuaKham"
                                    rows="3"
                                    className={`border rounded-lg p-2 w-full mt-1 ${errors.ketQuaKham && touched.ketQuaKham ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                <ErrorMessage
                                    name="ketQuaKham"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </label>


                            <label className="text-sm font-medium">
                                Đơn thuốc:
                                <Field
                                    as="textarea"
                                    name="donThuoc"
                                    rows="3"
                                    className={`border rounded-lg p-2 w-full mt-1 ${errors.donThuoc && touched.donThuoc ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                <ErrorMessage
                                    name="donThuoc"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </label>


                            <label className="text-sm font-medium">
                                Lời dặn bác sĩ:
                                <Field
                                    as="textarea"
                                    name="loiDanBacSi"
                                    rows="2"
                                    className={`border rounded-lg p-2 w-full mt-1 ${errors.loiDanBacSi && touched.loiDanBacSi ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                <ErrorMessage
                                    name="loiDanBacSi"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </label>


                            <label className="text-sm font-medium">
                                Ngày tái khám:
                                <Field
                                    type="date"
                                    name="ngayTaiKham"
                                    className={`border rounded-lg p-2 w-full mt-1 ${errors.ngayTaiKham && touched.ngayTaiKham ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                <ErrorMessage
                                    name="ngayTaiKham"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </label>


                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 cursor-pointer"
                                    onClick={onClose}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                                >
                                    Hoàn thành
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default CompleteForm;
