import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Eye, EyeOff } from 'lucide-react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChangePassword = () => {
    const [showOld, setShowOld] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const notifySuccess = () => {
        toast.success("Đổi mật khẩu thành công!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
        });
    };
    const notifyError = () => {
        toast.error(`Sai mật khẩu cũ đổi mật khẩu thất bại`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
        });
    };

    const formik = useFormik({
        initialValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: ""
        },
        validationSchema: Yup.object({
            oldPassword: Yup.string()
                .required("Vui lòng nhập mật khẩu cũ"),
            newPassword: Yup.string()
                .min(6, "Mật khẩu mới phải ít nhất 6 ký tự")
                .required("Vui lòng nhập mật khẩu mới"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("newPassword"), null], "Mật khẩu xác nhận không khớp")
                .required("Vui lòng nhập lại mật khẩu mới")
        }),
        onSubmit: async (values) => {
            const token = localStorage.getItem("accessToken");

            if (!token) {
                alert("Bạn chưa đăng nhập!");
                return;
            }

            try {
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
                const response = await fetch(
                    `${API_BASE_URL}/api/auth/change-password?oldPassword=${encodeURIComponent(values.oldPassword)}&newPassword=${encodeURIComponent(values.newPassword)}`,
                    {
                        method: "PUT",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Accept": "*/*",
                            "ngrok-skip-browser-warning": "true",
                        }
                    }
                );

                if (!response.ok) {
                    const err = await response.text();
                    throw new Error(err || "Đổi mật khẩu thất bại");
                }

                const data = await response.json();
                console.log(data)
                notifySuccess();
                formik.resetForm();

            } catch (error) {
                notifyError();
                console.error("Lỗi đổi mật khẩu:", error);

            }
        }
    });

    return (
        <div className='max-w-xl border rounded-[12px] border-gray-300 shadow-md'>
            <h2 className='bg-[#70b8e8] text-white rounded-t-[12px] px-5 py-2 font-bold text-[24px]'>
                Đổi mật khẩu
            </h2>
            <ToastContainer />
            <form onSubmit={formik.handleSubmit} className='p-6 bg-white rounded-b-[12px]'>


                <div className='mb-5 relative'>
                    <label className='block font-semibold mb-1'>Mật khẩu cũ *</label>
                    <input
                        type={showOld ? 'text' : 'password'}
                        name='oldPassword'
                        value={formik.values.oldPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder='Nhập mật khẩu cũ'
                        className='w-full border border-gray-300 bg-gray-100 rounded-[6px] p-2 pr-10 focus:outline-none focus:border-[#bb4d00]'
                    />
                    <span
                        className='absolute right-3 top-[38px] cursor-pointer text-gray-600'
                        onClick={() => setShowOld(!showOld)}
                    >
                        {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
                    </span>
                    {formik.touched.oldPassword && formik.errors.oldPassword && (
                        <p className='text-red-500 text-sm mt-1'>{formik.errors.oldPassword}</p>
                    )}
                </div>


                <div className='mb-5 relative'>
                    <label className='block font-semibold mb-1'>Mật khẩu mới *</label>
                    <input
                        type={showNew ? 'text' : 'password'}
                        name='newPassword'
                        value={formik.values.newPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder='Nhập mật khẩu mới'
                        className='w-full border border-gray-300 bg-gray-100 rounded-[6px] p-2 pr-10 focus:outline-none focus:border-[#bb4d00]'
                    />
                    <span
                        className='absolute right-3 top-[38px] cursor-pointer text-gray-600'
                        onClick={() => setShowNew(!showNew)}
                    >
                        {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                    </span>
                    {formik.touched.newPassword && formik.errors.newPassword && (
                        <p className='text-red-500 text-sm mt-1'>{formik.errors.newPassword}</p>
                    )}
                </div>


                <div className='mb-6 relative'>
                    <label className='block font-semibold mb-1'>Xác nhận lại mật khẩu *</label>
                    <input
                        type={showConfirm ? 'text' : 'password'}
                        name='confirmPassword'
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder='Nhập lại mật khẩu mới'
                        className='w-full border border-gray-300 bg-gray-100 rounded-[6px] p-2 pr-10 focus:outline-none focus:border-[#bb4d00]'
                    />
                    <span
                        className='absolute right-3 top-[38px] cursor-pointer text-gray-600'
                        onClick={() => setShowConfirm(!showConfirm)}
                    >
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </span>
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                        <p className='text-red-500 text-sm mt-1'>{formik.errors.confirmPassword}</p>
                    )}
                </div>


                <div className='flex gap-x-3 justify-start'>
                    <button
                        type='submit'
                        className='px-4 py-2 cursor-pointer bg-sky-500 hover:bg-sky-600 rounded-[8px] text-white font-medium'
                    >
                        Xác nhận
                    </button>
                    <button
                        type='button'
                        onClick={() => formik.resetForm()}
                        className='px-4 py-2 cursor-pointer bg-[#6e7180] rounded-[8px] text-white font-medium'
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ChangePassword
