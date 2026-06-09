import React from 'react'
import { MdDashboard, MdMiscellaneousServices } from "react-icons/md";
import { FaHospitalAlt, FaStethoscope, FaUserMd, FaRegCalendarAlt, FaGraduationCap } from "react-icons/fa";
import { FaBusinessTime } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { AiOutlineHistory } from "react-icons/ai";

const SideBar = ({ danhMuc, index, setIndex, sidebarOpen }) => {
    const icon = [
        <MdDashboard />,
        <FaHospitalAlt />,
        <FaStethoscope />,
        <FaUserMd />,
        <MdMiscellaneousServices />,
        <FaRegCalendarAlt />,
        <FaGraduationCap />,
        <FaBusinessTime />,
        <AiOutlineHistory />,
    ]

    const path = [
        "/admin",
        "/admin/medical",
        "/admin/specialties",
        "/admin/doctors",
        "/admin/services",
        "/admin/appointments",
        "/admin/degree",
        "/admin/leave",
        "/admin/history",
    ];

    return (
        <div className={`h-screen pt-[100px] fixed top-0 left-0 bg-[#a35a37] text-white font-bold 
            transition-all duration-300 ${sidebarOpen ? 'w-[280px]' : 'w-0 overflow-hidden'}`}>
            <ul className='pl-4 py-2'>
                {danhMuc.map((item, i) => (
                    <Link
                        key={i}
                        to={path[i]}
                        className={`mb-4 cursor-pointer flex items-center py-3 px-4 rounded-lg
                            w-[245px] text-left transition-all duration-200 font-medium border border-[#ad7555]
                            hover:text-[#ad7555] hover:bg-white shadow-md transform hover:scale-105 hover:shadow-lg
                            ${i === index ? 'text-[#ad7555] bg-white transform scale-105' : 'text-white'}`}
                        onClick={() => setIndex(i)}
                    >
                        <span className="size-[21px]">{icon[i]}</span>
                        <p className="ml-1 text-[16px]">{item}</p>
                    </Link>
                ))}
            </ul>
        </div>
    )
}

export default SideBar
