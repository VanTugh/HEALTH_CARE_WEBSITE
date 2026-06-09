import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import HeaderSub from "../HeaderSub";
import Footer from "../Footer";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const EmailVerification = () => {

    const navigate = useNavigate();

    const location = useLocation();
    const { email } = location.state || {};

    const notifySuccess = (msg) => {
        toast.success(msg || "Xác nhận thành công!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
        });
    };

    const notifyError = (msg) => {
        toast.error(msg || "Xác nhận thất bại", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
        });
    };

    function hanldeBackToRegister() {
        navigate("/loginpage", { state: { isLogin: false } });
    }

    const formik = useFormik({
        initialValues: {
            code: "",
        },
        validationSchema: Yup.object({
            code: Yup.string()
                .required("Vui lòng nhập mã xác nhận")
                .min(4, "Mã tối thiểu 4 ký tự")
                .max(8, "Mã tối đa 8 ký tự"),
        }),
        onSubmit: async (values) => {
            if (!email) {
                notifyError("Không có email để xác thực");
                return;
            }

            try {
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
                const response = await fetch(
                    `${API_BASE_URL}/api/auth/verify-email?email=${encodeURIComponent(email)}&code=${encodeURIComponent(values.code)}`,
                    {
                        method: "POST",
                        headers: {
                            "Accept": "application/json",
                            "ngrok-skip-browser-warning": "true",
                        }
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    notifyError(errorData.message || "Xác thực thất bại");
                } else {
                    const data = await response.json();
                    notifySuccess(data.message);
                    setTimeout(() => {
                        navigate("/loginpage");
                    }, 2000)
                }
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
                notifyError("Có lỗi xảy ra, vui lòng thử lại!");
            }
        },
    });

    return (
        <>
            <HeaderSub />
            <div className="w-full max-w-[450px] sm:max-w-[550px] md:max-w-[650px] mx-auto pt-5 pb-10 mt-5 border border-gray-200 shadow-2xl rounded-lg">
                <h2 className="text-center font-bold text-[24px] mb-5">
                    Xác thực email
                </h2>
                <div className="w-[90%] mb-2 p-3 bg-yellow-200 text-yellow-800 rounded mx-auto ">
                    Đã gửi mã code đến email của bạn. Vui lòng kiểm tra hộp thư
                </div>
                <form
                    onSubmit={formik.handleSubmit}
                    className="w-full mx-auto flex flex-col items-center"
                >

                    <input
                        type="email"
                        value={email || ""}
                        disabled
                        className="border border-gray-300 py-2 px-4 w-[90%] mx-auto focus:outline-amber-800 mb-3"
                    />


                    <input
                        name="code"
                        type="text"
                        placeholder="Nhập mã code xác nhận"
                        value={formik.values.code}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="border border-gray-300 py-2 px-4 w-[90%] mx-auto focus:outline-amber-800 mb-3"
                    />
                    {formik.touched.code && formik.errors.code && (
                        <p className="text-red-500 text-sm w-[90%] pb-2">{formik.errors.code}</p>
                    )}


                    <div className="flex w-[90%] justify-between items-center mx-auto mt-4">
                        <p
                            onClick={() => hanldeBackToRegister()}
                            className="text-[14px] text-blue-400 cursor-pointer"
                        >
                            Quay lại đăng ký
                        </p>

                        <button
                            type="submit"
                            className="bg-amber-700 text-white font-bold rounded-lg px-4 py-2 cursor-pointer"
                        >
                            Xác nhận
                        </button>
                    </div>
                </form>
            </div>
            <ToastContainer />
            <Footer />
        </>
    );
};

export default EmailVerification;
