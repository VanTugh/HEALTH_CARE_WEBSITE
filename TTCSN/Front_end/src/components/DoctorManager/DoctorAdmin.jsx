import React, { useState, useContext } from 'react'
import { FiMenu, FiX } from "react-icons/fi";
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUserDoctor } from "react-icons/fa6";

const DoctorAdmin = ({ danhMuc, index, sidebarOpen, setSidebarOpen }) => {
    const navigate = useNavigate();
    const { isLogin, setIsLogin, setUser } = useContext(AuthContext);
    const [mount, setMount] = useState(false)

    const userLocal = JSON.parse(localStorage.getItem("user"));

    function handleLogout() {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        localStorage.removeItem("vaiTro");
        localStorage.removeItem("email");
        localStorage.removeItem("hoTen");
        setIsLogin(false);
        setUser(null);
        navigate("/loginpage");
    }

    return (
        <div className='w-full fixed top-0 left-0 h-[72px] sm:h-[88px] md:h-[100px] bg-[#81c9f9] text-white flex items-center z-10'>
            <div className='flex justify-between items-center w-full px-3 sm:px-4 md:px-6'>


                <div className='flex items-center gap-2 sm:gap-3 min-w-0'>
                    {sidebarOpen ? (
                        <FiMenu
                            className="cursor-pointer text-xl sm:text-2xl"
                            onClick={() => setSidebarOpen(false)}
                        />
                    ) : (
                        <FiX
                            className="cursor-pointer text-xl sm:text-2xl"
                            onClick={() => setSidebarOpen(true)}
                        />
                    )}

                    <p className='font-bold text-base sm:text-xl md:text-2xl truncate max-w-[160px] sm:max-w-[260px]'>
                        {danhMuc[index]}
                    </p>
                </div>


                <div
                    className='flex items-center gap-2 cursor-pointer relative'
                    onMouseEnter={() => setMount(true)}
                    onMouseLeave={() => setMount(false)}
                >
                    <FaUserDoctor className='text-lg sm:text-xl md:text-2xl' />

                    <p className="font-semibold text-sm sm:text-base md:text-lg max-w-[120px] sm:max-w-[180px] truncate">
                        {isLogin && userLocal ? userLocal.hoTen : "Tài khoản"}
                    </p>


                    <div
                        onClick={handleLogout}
                        className={`${mount ? "block" : "hidden"}
                            absolute right-0 top-[40px] sm:top-[48px] 
                            bg-white text-red-500 px-4 py-2 rounded-lg 
                            shadow-md text-sm sm:text-base cursor-pointer`}
                    >
                        <div className='flex items-center gap-2'>
                            <i className="fa-solid fa-right-from-bracket"></i>
                            <span>Đăng xuất</span>
                        </div>
                    </div>

                    <div onMouseEnter={() => setMount(true)}
                        className='absolute w-[150px] h-[30px] top-[20px] right-[5px]'>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default DoctorAdmin;
