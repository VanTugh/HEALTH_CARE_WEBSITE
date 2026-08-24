import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from './AuthContext';

const HeaderMain = ({ check }) => {
    const navigate = useNavigate();
    const { isLogin, setIsLogin, user, setUser } = useContext(AuthContext);
    const text = ["Tìm chuyên khoa", "Tìm bệnh viện", "Tìm phòng khám", "Tìm bác sĩ", "Tìm gói khám tổng quát"];
    const [indexFind, setIndexFind] = useState(0);
    const [select, setSelected] = useState(`${check}`);
    const [elementSearch, setElementSearch] = useState(true);
    const [mount, setMount] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            if (!isLogin) return;
            const token = localStorage.getItem("accessToken");
            if (!token) return;

            try {
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
                const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                        "ngrok-skip-browser-warning": "true",
                    }
                });
                if (!res.ok) throw new Error("Lấy thông tin người dùng thất bại");
                const data = await res.json();
                setUser(data);
            } catch (error) {
                console.error(error);
            }
        }

        fetchUser();
    }, [isLogin, setUser]);

    useEffect(() => {
        if (select === "tatca") {
            setElementSearch(false);
        } else {
            setElementSearch(true);
        }
    }, [select]);

    function handleSelect(selectButton) {
        setSelected(selectButton);
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setIndexFind((prev) => (prev + 1) % text.length);
        }, 2000);

        return () => clearInterval(interval);
    }, [text.length]);

    const handleLogout = () => {
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
        <>
            <div className="w-screen bg-[#ecfffb] fixed top-0 right-0 left-0 z-50 lg:pb-0 pb-10">
                <div className="w-full max-w-[1300px] h-[100px] bg-[#ecfffb] mx-auto flex items-center relative px-5 lg:px-0 flex-wrap">


                    <Link to="/" className="flex items-center gap-1 mr-3 flex-shrink-0">
                        <i className="fa-solid fa-notes-medical text-[24px] sm:text-[30px] text-[#f6c310]"></i>
                        <p className="text-[24px] sm:text-[32px] font-bold text-[#f6c310]">HealthCare</p>
                    </Link>


                    <ul className={`${elementSearch ? "mr-4" : "mr-60"} flex gap-2 justify-between font-medium absolute lg:left-60 lg:top-7.5 top-22 w-full lg:w-auto pr-5 lg:pr-0 flex-wrap`}>
                        <Link to="/" onClick={() => { handleSelect("tatca") }}
                            className={`${select === "tatca" ? "text-white font-semibold  bg-[#eec965]" : "text-black font-normal"} 
                            text-[14px] sm:text-[18px] cursor-pointer px-3 py-2 rounded-3xl transition-colors duration-200 ease-in-out`}
                        >Tất cả</Link>
                        <Link to="/athousepage" onClick={() => { handleSelect("tainha") }}
                            className={`${select === "tainha" ? "text-white font-semibold  bg-[#eec965]" : "text-black font-normal"} 
                            text-[14px] sm:text-[18px] cursor-pointer px-3 py-2 rounded-3xl transition-colors duration-200 ease-in-out`}
                        >Tại nhà</Link>
                        <Link to="/athopitalpage" onClick={() => { handleSelect("taivien") }}
                            className={`${select === "taivien" ? "text-white font-semibold  bg-[#eec965]" : "text-black font-normal"} 
                            text-[14px] sm:text-[18px] cursor-pointer px-3 py-2 rounded-3xl transition-colors duration-200 ease-in-out`}
                        >Tại viện</Link>
                        <Link to="/athealthlife" onClick={() => { handleSelect("songkhoe") }}
                            className={`${select === "songkhoe" ? "text-white font-semibold  bg-[#eec965]" : "text-black font-normal"} mr-4 lg:mr-0
                            text-[14px] sm:text-[18px] cursor-pointer px-3 py-2 rounded-3xl transition-colors duration-200 ease-in-out`}
                        >Sống khỏe</Link>
                    </ul>


                    {elementSearch && (

                        <div className=''>
                            <Link to="/search" className='w-auto relative transition-colors duration-200 ease-in-out lg:ml-108 ml-1 max-[1280px]:hidden'>
                                <i className="fa-solid fa-magnifying-glass absolute top-1/2 -translate-y-1/2 left-3 text-[16px]"></i>
                                <input className='bg-white rounded-4xl w-[300px] pl-10 pr-8 py-3 border border-gray-200 outline-none text-[16px] cursor-pointerZ'
                                    type="text" placeholder={text[indexFind]} />
                            </Link>
                        </div>
                    )}


                    <ul className="flex gap-3 sm:gap-5 items-center justify-self-end ml-auto mr-0 xl:mr-5 flex-shrink-0">
                        <Link to="/userpage"
                            state={{ indexPage: 1 }}
                            className="flex items-center gap-1 text-[14px] sm:text-[18px]">
                            <i className="fa-solid fa-clock-rotate-left text-[#45c3d1] text-[16px] sm:text-[20px]"></i>
                            <span className='font-semibold text-[#45c3d1] cursor-pointer'>Lịch hẹn</span>
                        </Link>
                        <li onMouseEnter={() => setMount(true)}
                            onMouseLeave={() => setMount(false)}
                            className="flex items-center gap-1 text-[14px] sm:text-[18px] mr-2 md:mr-0">
                            <i className="fa-solid fa-circle-user text-[#45c3d1] text-[16px] sm:text-[20px]"></i>
                            <p className="font-semibold text-[#45c3d1] cursor-pointer max-w-[120px] truncate overflow-hidden whitespace-nowrap">
                                {isLogin ? user.hoTen : "Tài khoản"}
                            </p>
                        </li>
                    </ul>


                    {isLogin ?
                        <div
                            onMouseLeave={() => setMount(false)}
                            className={`${mount ? "block" : "hidden"} absolute bg-white rounded-lg top-18 lg:right-[-12px] right-0 transform translate-x-[-10px] max-[500px]:right-2 flex flex-col z-50`}
                        >
                            <Link to="/userpage"
                                state={{ isLogin: true }}
                                className="text-[16px] sm:text-[18px] font-medium text-[#45c3d1] cursor-pointer px-5 py-2 hover:bg-gray-200 rounded-tr-lg rounded-tl-lg border-b border-gray-200">
                                Xem thông tin
                            </Link>
                            <button onClick={handleLogout}
                                className="text-[16px] sm:text-[18px] font-medium text-[#45c3d1] text-start cursor-pointer px-5 py-2 hover:bg-gray-200 rounded-br-lg rounded-bl-lg">
                                Đăng xuất
                            </button>
                        </div> :
                        <div
                            onMouseLeave={() => setMount(false)}
                            className={`${mount ? "block" : "hidden"} absolute bg-white rounded-lg top-18 lg:right-[-12px] right-0 transform translate-x-[-10px] max-[500px]:right-2 flex flex-col z-50`}
                        >
                            <Link to="/loginpage" state={{ isLogin: true }}
                                className="text-[16px] sm:text-[18px] font-medium text-[#45c3d1] cursor-pointer px-5 py-2 hover:bg-gray-200 rounded-tr-lg rounded-tl-lg border-b border-gray-200">
                                Đăng nhập
                            </Link>
                            <Link to="/loginpage" state={{ isLogin: false }}
                                className="text-[16px] sm:text-[18px] font-medium text-[#45c3d1] cursor-pointer px-5 py-2 hover:bg-gray-200 rounded-br-lg rounded-bl-lg">
                                Đăng ký
                            </Link>
                        </div>}

                    <div onMouseEnter={() => setMount(true)}
                        className='absolute w-[150px] h-[30px] top-[55px] right-[45px]'>
                    </div>
                </div>
            </div >
        </>
    )
}

export default HeaderMain;
