import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function AddLeaveForm({ bacSiID, token, setLeaves, onClose, onSuccess }) {
    const today = new Date().toISOString().split("T")[0];

    const validationSchema = Yup.object({
        ngayNghiCuThe: Yup.date()
            .required("Vui lòng chọn ngày nghỉ")
            .min(new Date(), "Ngày nghỉ không được trước hôm nay"),
        lyDo: Yup.string()
            .required("Vui lòng nhập lý do")
            .min(1, "Lý do không được để trống"),
        loaiNghiPhep: Yup.string().required("Vui lòng chọn loại phép"),
        fileDinhKem: Yup.string()
            .url("URL không hợp lệ")
            .required("Vui lòng nhập link file"),
        moTaThoiGianNghi: Yup.string()
            .required("Vui lòng nhập mô tả thời gian nghỉ")
            .min(10, "Mô tả tối thiểu 10 ký tự"),
        nghiCaNgay: Yup.boolean(),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const body = {
                loaiNghi: "NGAY_CU_THE",
                ngayNghiCuThe: values.ngayNghiCuThe,
                thuTrongTuan: 5,
                ca: null,
                lyDo: values.lyDo,
                loaiNghiPhep: values.loaiNghiPhep,
                fileDinhKem: values.fileDinhKem,
                moTaThoiGianNghi: values.moTaThoiGianNghi,
                nghiCaNgay: values.nghiCaNgay,
            };
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const res = await fetch(
                `${API_BASE_URL}/api/leave-requests?bacSiID=${bacSiID}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "ngrok-skip-browser-warning": "true",
                    },
                    body: JSON.stringify(body),
                }
            );

            if (!res.ok) throw new Error("Lỗi khi tạo yêu cầu nghỉ");

            const result = await res.json();


            const formattedLeave = {
                ...result,
                thoiGianNghi: result.ngayNghiCuThe,
                moTaLoaiPhep:
                    result.loaiNghiPhep === "PHEP_NAM"
                        ? "Nghỉ phép năm"
                        : result.loaiNghiPhep === "OM"
                            ? "Ốm"
                            : result.loaiNghiPhep === "CONG_TAC"
                                ? "Công tác"
                                : "Khác",
                canEdit: true,
                canCancel: true,
                mauSacTrangThai: "#FFCC00",
                moTaTrangThai: "Đang chờ",
            };

            setLeaves((prev) => [...prev, formattedLeave]);

            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            alert("Tạo yêu cầu nghỉ thất bại.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-[400px] max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4 text-center">Tạo yêu cầu nghỉ</h2>

                <Formik
                    initialValues={{
                        ngayNghiCuThe: "",
                        lyDo: "",
                        loaiNghiPhep: "PHEP_NAM",
                        fileDinhKem: "",
                        moTaThoiGianNghi: "",
                        nghiCaNgay: true,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="flex flex-col gap-3">
                            <label className="text-sm font-medium">
                                Ngày nghỉ:
                                <Field
                                    type="date"
                                    name="ngayNghiCuThe"
                                    min={today}
                                    className="border border-gray-300 p-2 rounded w-full mt-1"
                                />
                                <ErrorMessage
                                    name="ngayNghiCuThe"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </label>

                            <label className="text-sm font-medium">
                                Lý do:
                                <Field
                                    as="textarea"
                                    name="lyDo"
                                    rows={3}
                                    className="border border-gray-300 p-2 rounded w-full mt-1"
                                />
                                <ErrorMessage
                                    name="lyDo"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </label>

                            <label className="text-sm font-medium">
                                Loại phép:
                                <Field
                                    as="select"
                                    name="loaiNghiPhep"
                                    className="border border-gray-300 p-2 rounded w-full mt-1"
                                >
                                    <option value="PHEP_NAM">Nghỉ phép năm</option>
                                    <option value="OM">Ốm</option>
                                    <option value="CONG_TAC">Công tác</option>
                                    <option value="KHAC">Khác</option>
                                </Field>
                                <ErrorMessage
                                    name="loaiNghiPhep"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </label>

                            <label className="text-sm font-medium">
                                File đính kèm (URL):
                                <Field
                                    type="text"
                                    name="fileDinhKem"
                                    className="border border-gray-300 p-2 rounded w-full mt-1"
                                />
                                <ErrorMessage
                                    name="fileDinhKem"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </label>

                            <label className="text-sm font-medium">
                                Mô tả thời gian nghỉ:
                                <Field
                                    type="text"
                                    name="moTaThoiGianNghi"
                                    className="border border-gray-300 p-2 rounded w-full mt-1"
                                />
                                <ErrorMessage
                                    name="moTaThoiGianNghi"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </label>

                            <label className="flex items-center gap-2">
                                <Field type="checkbox" name="nghiCaNgay" />
                                Nghỉ cả ngày
                            </label>

                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 cursor-pointer"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
                                >
                                    Tạo
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
