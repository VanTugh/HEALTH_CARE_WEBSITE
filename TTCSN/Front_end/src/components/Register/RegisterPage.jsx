import React, { useState } from 'react'
import RegisterForm from './RegisterForm'
import RegisterDoctorForm from './RegisterDoctorForm'
const RegisterPage = ({ setShowLoginForm }) => {
    const [isRegister, setIsRegister] = useState(0)

    return (
        <div>
            <div className={`max-w-[600px] mx-auto pt-5 pb-10  mt-5 border border-gray-200 shadow-2xl rounded-lg ${isRegister == 0 ? "mb-32" : ""}`}>
                {isRegister == 0 && (
                    <h2 className='text-center font-bold text-[24px] mb-3'>Đăng ký với vai trò</h2>
                )}
                {isRegister == 0 && (
                    <div className={` flex gap-6 justify-center mt-4`}>
                        <button
                            onClick={() => setIsRegister(1)}
                            className="flex items-center justify-center gap-2 w-44 h-12 rounded-lg border border-gray-300 
               bg-white text-gray-800 font-medium hover:bg-blue-50 hover:border-blue-400 
               hover:text-blue-600 transition-all duration-200 hover:border-2"
                        >
                            <i className="fa-solid fa-user text-lg"></i>
                            <span>Người dùng</span>
                        </button>

                        <button
                            onClick={() => setIsRegister(2)}
                            className="flex items-center justify-center gap-2 w-44 h-12 rounded-lg border border-gray-300 
               bg-white text-gray-800 font-medium hover:bg-emerald-50 hover:border-emerald-400 
               hover:text-emerald-600 transition-all duration-200 hover:border-2"
                        >
                            <i className="fa-solid fa-user-nurse text-lg"></i>
                            <span>Bác sĩ</span>
                        </button>
                    </div>



                )}
                {isRegister == 1 && <RegisterForm setShowLoginForm={setShowLoginForm} />}
                {isRegister == 2 && <RegisterDoctorForm setShowLoginForm={setShowLoginForm} />}
            </div>
        </div>
    )
}

export default RegisterPage
