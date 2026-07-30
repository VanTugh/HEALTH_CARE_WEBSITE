import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { Eye, EyeOff } from 'lucide-react'
const LoginForm = ({ setShowLoginForm }) => {
    const navigate = useNavigate();
    const { setIsLogin, setUser } = React.useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(true)
    const notifySuccess = () => {
        toast.success("Đăng nhập thành công!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
        });
    };
    const notifyError = () => {
        toast.error(`Đăng nhập thất bại`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
        });
    };

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Email không hợp lệ')
                .required('Vui lòng nhập email'),
            password: Yup.string()
                .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
                .required('Vui lòng nhập mật khẩu'),
        }),
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: async (values) => {
            const dataToSend = {
                email: values.email,
                password: values.password,
            }

            try {
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
                const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "ngrok-skip-browser-warning": "true",
                    },
                    body: JSON.stringify(dataToSend)

                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Đăng nhập thất bại:", errorData.message);
                    notifyError();
                    return;
                } else {
                    const data = await response.json();
                    notifySuccess();
                    console.log("Server trả về:", data);


                    localStorage.setItem("accessToken", data.accessToken);
                    localStorage.setItem("expiresIn", data.expiresIn);


                    const user = data.userInfo;
                    localStorage.setItem("user", JSON.stringify(user));
                    localStorage.setItem("email", user.email);
                    localStorage.setItem("hoTen", user.hoTen);
                    localStorage.setItem("vaiTro", user.vaiTro);


                    setUser(user);
                    setIsLogin(true);

                    setShowLoginForm(true);
                    setTimeout(() => {
                        if (data.userInfo.vaiTro === "Admin") {
                            navigate("/admin");
                        }
                        else if (data.userInfo.vaiTro === "BacSi") {
                            navigate("/bacsi");
                        }
                        else {
                            navigate("/");
                        }
                    }, 2000);
                }
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
                alert("Có lỗi xảy ra, vui lòng thử lại!");
            }
        },
    })

    return (
        <div className='w-full max-w-[450px] sm:max-w-[550px] md:max-w-[650px] mx-auto py-5 mt-5 border border-gray-200 shadow-2xl rounded-lg px-4 sm:px-6'>
            <h2 className='text-center font-bold text-[24px] mb-3'>Đăng nhập</h2>
            <ToastContainer />
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


                <div className='w-[90%] relative'>
                    <input
                        id='password'
                        name='password'
                        type={showPassword ? "password" : "text"}
                        placeholder='Nhập mật khẩu'
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className='border border-gray-300 py-2 px-4 w-full focus:outline-amber-800 rounded'
                    />
                    {formik.touched.password && formik.errors.password && (
                        <p className='text-red-500 text-sm mt-3'>{formik.errors.password}</p>
                    )}
                    <span
                        className='absolute right-3 top-3 cursor-pointer text-gray-600'
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </span>
                </div>


                <div className='flex w-[90%] justify-between items-center mx-auto'>
                    <button
                        type='submit'
                        className='bg-amber-700 text-white font-bold rounded-lg px-4 py-2 cursor-pointer w-full hover:bg-amber-800 transition-all'
                    >
                        Đăng nhập
                    </button>
                </div>


                <div className='flex flex-col w-[90%] justify-between items-center mx-auto gap-y-3'>
                    <p className='text-[14px]'>
                        Bạn chưa có tài khoản? <span onClick={() => setShowLoginForm(false)}
                            className='text-blue-400  cursor-pointer'>Đăng ký ngay</span>
                    </p>
                    <p>
                        <Link to="/" className='text-[14px] cursor-pointer text-blue-400'>Quay lại trang chủ</Link>
                        <span className='mx-1 text-gray-300'>/</span>
                        <Link to="/forgotpassword" className='text-[14px] cursor-pointer text-blue-400'>Quên mật khẩu?</Link>
                    </p>
                </div>

                {/* <div className='flex w-[90%] justify-between items-center mx-auto gap-3'>
                    <span className='bg-blue-700 text-white font-medium rounded-lg px-4 py-2 cursor-pointer w-[50%] flex gap-2 items-center justify-center'>
                        <i className='fa-brands fa-square-facebook'></i>
                        Đăng nhập bằng Facebook
                    </span>
                    <span className='font-medium rounded-lg px-4 py-2 cursor-pointer w-[50%] flex gap-2 items-center border border-gray-300 justify-center'>
                        <img src={logo} alt='' className='size-5' />
                        Đăng nhập bằng Google
                    </span>
                </div> */}
            </form>
        </div>
    )
}

export default LoginForm
