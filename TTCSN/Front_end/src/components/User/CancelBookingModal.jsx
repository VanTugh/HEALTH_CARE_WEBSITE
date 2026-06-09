import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const CancelBookingModal = ({ open, onClose, datLichID, onSuccess }) => {
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const validationSchema = Yup.object({
        lyDoHuy: Yup.string()
            .trim()
            .required("Vui lòng nhập lý do huỷ")
            .min(5, "Lý do huỷ phải ít nhất 5 ký tự"),
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        const token = localStorage.getItem("accessToken");
        setLoading(true);

        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const res = await fetch(
                `${API_BASE_URL}/api/bookings/${datLichID}/cancel`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "ngrok-skip-browser-warning": "true",
                    },
                    body: JSON.stringify({
                        datLichID,
                        lyDoHuy: values.lyDoHuy,
                        detailedReason: true,
                    }),
                }
            );

            if (!res.ok) throw new Error();

            toast.success("Huỷ lịch khám thành công");
            onSuccess?.(datLichID);
            onClose();
            resetForm();
        } catch {
            toast.error(
                <div>
                    Huỷ lịch thất bại.<br />
                    Phải hủy trước 24 giờ so với giờ khám.
                </div>
            );
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white w-[90%] max-w-md rounded-2xl shadow-xl p-6 relative">


                {loading && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            backgroundColor: "rgba(255, 255, 255, 0.7)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 50,
                            borderRadius: "1rem",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <div
                                style={{
                                    border: "4px solid #f3f3f3",
                                    borderTop: "4px solid #ef4444",
                                    borderRadius: "50%",
                                    width: "24px",
                                    height: "24px",
                                    animation: "spin 1s linear infinite",
                                }}
                            />
                            <span style={{ color: "#ef4444", fontWeight: 500 }}>Đang huỷ...</span>
                        </div>

                        <style>
                            {`
                                @keyframes spin {
                                    0% { transform: rotate(0deg); }
                                    100% { transform: rotate(360deg); }
                                }
                            `}
                        </style>
                    </div>
                )}


                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <MdClose size={22} />
                </button>

                <h3 className="text-lg font-semibold text-red-600 mb-1">
                    Huỷ lịch khám
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                    Vui lòng nhập lý do huỷ lịch khám rõ ràng
                </p>

                <Formik
                    initialValues={{ lyDoHuy: "" }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form>

                            <Field
                                as="textarea"
                                name="lyDoHuy"
                                rows={4}
                                placeholder="Nhập lý do huỷ lịch..."
                                className="
                                    w-full
                                    border border-gray-300
                                    rounded-xl
                                    p-3
                                    text-sm
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-red-400
                                    focus:border-red-400
                                    resize-none
                                "
                            />


                            <ErrorMessage
                                name="lyDoHuy"
                                component="p"
                                className="mt-1 text-sm text-red-500"
                            />


                            <div className="flex justify-end gap-3 mt-5">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="
                                        px-4 py-2
                                        text-sm
                                        rounded-lg
                                        border border-gray-300
                                        text-gray-700
                                        hover:bg-gray-100
                                    "
                                >
                                    Đóng
                                </button>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || loading}
                                    className="
                                        px-4 py-2
                                        text-sm
                                        rounded-lg
                                        bg-red-500 text-white
                                        hover:bg-red-600
                                        disabled:opacity-50
                                    "
                                >
                                    {isSubmitting || loading ? "Đang huỷ..." : "Xác nhận huỷ"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default CancelBookingModal;
