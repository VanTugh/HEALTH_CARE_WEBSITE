import React from 'react';
import { FaUserMd } from "react-icons/fa";
import { AiFillCalendar } from "react-icons/ai";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { GrSchedules } from "react-icons/gr";
import { Link } from "react-router-dom";
import { AiOutlineHistory } from "react-icons/ai";
const SidebarDoctor = ({ index, setIndex, sidebarOpen }) => {
    return (
        <div className={`h-screen pt-[100px] text-white font-bold bg-[#81c9f9] fixed top-0 bottom-0 left-0 
            transition-all duration-300 
            ${sidebarOpen ? 'w-[280px]' : 'w-[0px] overflow-hidden'}`}>

            <ul className='pl-4 py-2'>

                <Link
                    to="/bacsi/infor"
                    className={`mb-4 cursor-pointer flex items-center py-3 px-4 rounded-lg w-[245px] text-left transition-all duration-200 font-medium
                        border border-[#5fa8d3] 
                        hover:bg-white hover:text-[#1d4e89] hover:border-[#1d4e89]
                        shadow-sm hover:shadow-md transform hover:scale-105
                        ${index === 0 ? 'bg-white text-[#1d4e89] border-[#1d4e89] shadow-md scale-105' : 'text-white'}`}
                    onClick={() => setIndex(0)}
                >
                    <FaUserMd className="text-[21px]" />
                    <p className="ml-1 text-[16px]">Thông tin bác sĩ</p>
                </Link>

                <Link
                    to="/bacsi/schedule"
                    className={`mb-4 cursor-pointer flex items-center py-3 px-4 rounded-lg w-[245px] text-left transition-all duration-200 font-medium
                        border border-[#5fa8d3] 
                        hover:bg-white hover:text-[#1d4e89] hover:border-[#1d4e89]
                        shadow-sm hover:shadow-md transform hover:scale-105
                        ${index === 1 ? 'bg-white text-[#1d4e89] border-[#1d4e89] shadow-md scale-105' : 'text-white'}`}
                    onClick={() => setIndex(1)}
                >
                    <AiFillCalendar className="text-[21px]" />
                    <p className="ml-1 text-[16px]">Đăng ký lịch nghỉ</p>
                </Link>

                <Link
                    to="/bacsi/appointment"
                    className={`mb-4 cursor-pointer flex items-center py-3 px-4 rounded-lg w-[245px] text-left transition-all duration-200 font-medium
                        border border-[#5fa8d3] 
                        hover:bg-white hover:text-[#1d4e89] hover:border-[#1d4e89]
                        shadow-sm hover:shadow-md transform hover:scale-105
                        ${index === 2 ? 'bg-white text-[#1d4e89] border-[#1d4e89] shadow-md scale-105' : 'text-white'}`}
                    onClick={() => setIndex(2)}
                >
                    <RiCalendarScheduleFill className="text-[21px]" />
                    <p className="ml-1 text-[16px]">Danh sách lịch chờ</p>
                </Link>

                <Link
                    to="/bacsi/meetings"
                    className={`mb-4 cursor-pointer flex items-center py-3 px-4 rounded-lg w-[245px] text-left transition-all duration-200 font-medium
                        border border-[#5fa8d3] 
                        hover:bg-white hover:text-[#1d4e89] hover:border-[#1d4e89]
                        shadow-sm hover:shadow-md transform hover:scale-105
                        ${index === 3 ? 'bg-white text-[#1d4e89] border-[#1d4e89] shadow-md scale-105' : 'text-white'}`}
                    onClick={() => setIndex(3)}
                >
                    <GrSchedules className="text-[21px]" />
                    <p className="ml-1 text-[16px]">Danh sách lịch hẹn</p>
                </Link>
                <Link
                    to="/bacsi/history"
                    className={`mb-4 cursor-pointer flex items-center py-3 px-4 rounded-lg w-[245px] text-left transition-all duration-200 font-medium
                        border border-[#5fa8d3] 
                        hover:bg-white hover:text-[#1d4e89] hover:border-[#1d4e89]
                        shadow-sm hover:shadow-md transform hover:scale-105
                        ${index === 4 ? 'bg-white text-[#1d4e89] border-[#1d4e89] shadow-md scale-105' : 'text-white'}`}
                    onClick={() => setIndex(4)}
                >
                    <AiOutlineHistory className="text-[21px]" />
                    <p className="ml-1 text-[16px]">Lịch sử khám</p>
                </Link>
            </ul>
        </div>
    )
}

export default SidebarDoctor;
