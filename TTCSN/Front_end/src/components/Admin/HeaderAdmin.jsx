import React, { useState, useContext } from 'react'
import { FiMenu, FiX } from "react-icons/fi";
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUserGear } from "react-icons/fa6";

const HeaderAdmin = ({ danhMuc, index, sidebarOpen, setSidebarOpen }) => {
    const navigate = useNavigate();
    const { isLogin, setIsLogin, user, setUser } = useContext(AuthContext);
    const [mount, setMount] = useState(false);

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
        <div
            className='w-screen fixed top-0 left-0 right-0
            h-[70px] md:h-[90px] lg:h-[100px]
            bg-[#a35a37] text-white flex items-center justify-between
            z-10 px-2 md:px-4 lg:px-6'
        >
            <div className='flex justify-between w-full'>


                <div className='flex items-center gap-2'>

                    {sidebarOpen ? (
                        <FiX className="text-2xl cursor-pointer" onClick={() => setSidebarOpen(false)} />
                    ) : (
                        <FiMenu className="text-2xl cursor-pointer" onClick={() => setSidebarOpen(true)} />
                    )}

                    <p
                        className='font-bold ml-1 
                        text-lg md:text-2xl lg:text-[28px]
                        max-w-[120px] md:max-w-[200px] lg:max-w-[320px]
                        truncate'
                    >
                        {danhMuc[index]}
                    </p>
                </div>


                <div
                    className='flex items-center justify-center 
                    text-[16px] md:text-[20px] lg:text-[23px] 
                    pr-4 md:pr-8 cursor-pointer'
                >
                    <li
                        onMouseEnter={() => setMount(true)}
                        onMouseLeave={() => setMount(false)}
                        className="flex items-center gap-1 md:gap-2"
                    >
                        <FaUserGear className='mr-1' />

                        <p
                            className="font-semibold 
                            max-w-[120px] md:max-w-[180px] lg:max-w-[300px]
                            truncate"
                        >
                            {isLogin ? user.hoTen : "Tài khoản"}
                        </p>
                    </li>
                </div>


                <div
                    onMouseEnter={() => setMount(true)}
                    onMouseLeave={() => setMount(false)}
                    onClick={handleLogout}
                    className={`${mount ? "block" : "hidden"}
                        absolute text-red-500 bg-white px-4 py-2 rounded-lg font-medium shadow-md
                        top-[65px] md:top-[80px] lg:top-[85px]
                        right-[20px] md:right-[40px] lg:right-[60px]
                        cursor-pointer`}
                >
                    <div className='flex justify-center items-center'>
                        <i className="fa-solid fa-right-from-bracket mr-1"></i>
                        <p>Đăng xuất</p>
                    </div>
                </div>


                <div
                    onMouseEnter={() => setMount(true)}
                    className='absolute w-[150px] h-[30px] 
                    top-[50px] md:top-[60px] lg:top-[70px]
                    right-[20px] md:right-[40px] lg:right-[60px]'
                />
            </div>
        </div>
    )
}

export default HeaderAdmin
