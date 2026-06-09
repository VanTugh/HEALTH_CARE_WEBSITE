import React, { useState } from 'react'
import HeaderSub from '../HeaderSub'
import Footer from '../Footer'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const formik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Email không hợp lệ')
                .required('Vui lòng nhập email'),
        }),
        validateOnChange: true,
        onSubmit: async (values) => {
            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem("accessToken");
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
                const res = await axios.post(
                    `${API_BASE_URL}/api/auth/forgot-password?email=${encodeURIComponent(values.email)}`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "*/*",
                            "ngrok-skip-browser-warning": "true",
                        },
                    }
                );

                console.log("Kết quả API:", res.data);
                navigate("/authotp", { state: { email: values.email } });

            } catch (err) {
                console.error("Lỗi khi gửi email:", err);
                setError(err.response?.data?.message || "Có lỗi xảy ra, thử lại sau!");
            } finally {
                setLoading(false);
            }
        },
    })

    return (
        <>
            <HeaderSub />
            <div className='w-full max-w-[450px] sm:max-w-[550px] md:max-w-[650px] mx-auto py-5 mt-10 border border-gray-200 shadow-2xl rounded-lg'>
                <h2 className='text-center font-bold text-[24px] mb-3'>Quên mật khẩu</h2>
                <div className="w-[90%] mb-2 p-3 bg-green-200 text-green-800 rounded mx-auto ">
                    Vui lòng nhập email để cập nhật lại mật khẩu
                </div>
                {error && <div className="w-[90%] mb-2 p-3 bg-red-200 text-red-800 rounded mx-auto">{error}</div>}
                <form onSubmit={formik.handleSubmit} className='w-full mx-auto flex flex-col items-center gap-y-6'>
                    <div className='w-[90%]'>
                        <input
                            id='email'
                            name='email'
                            type='email'
                            placeholder='Nhập email'
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className='border border-gray-300 py-2 px-4 w-full focus:outline-amber-800 rounded'
                        />
                        {formik.touched.email && formik.errors.email && (
                            <p className='text-red-500 text-sm mt-3'>{formik.errors.email}</p>
                        )}
                    </div>
                    <div className='flex w-[90%] justify-between items-center mx-auto'>
                        <button
                            type='submit'
                            disabled={loading}
                            className='bg-amber-700 text-white font-bold rounded-lg px-4 py-2 cursor-pointer w-full hover:bg-amber-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {loading ? "Đang gửi..." : "Gửi để nhận mã OTP"}
                        </button>
                    </div>
                </form>
            </div>
            <Footer />
        </>
    )
}

export default ForgotPassword
