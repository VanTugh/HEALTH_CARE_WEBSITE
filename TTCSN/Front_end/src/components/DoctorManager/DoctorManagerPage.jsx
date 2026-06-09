import React, { useState } from 'react'
import SidebarDoctor from './SidebarDoctor'
import DoctorAdmin from './DoctorAdmin'
import { Outlet } from 'react-router-dom'

const DoctorManagerPage = () => {
    const danhMuc = [
        "Thông tin bác sĩ",
        "Đăng ký lịch nghỉ",
        "Danh sách lịch chờ",
        "Danh sách lịch hẹn",
        "Lịch sử khám"
    ]

    const [index, setIndex] = useState(0)
    const [sidebarOpen, setSidebarOpen] = useState(true)

    return (
        <div>

            <DoctorAdmin
                danhMuc={danhMuc}
                index={index}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />


            <SidebarDoctor
                danhMuc={danhMuc}
                index={index}
                setIndex={setIndex}
                sidebarOpen={sidebarOpen}
            />


            <div className={`mt-[100px] ${sidebarOpen ? 'ml-[280px]' : 'ml-[0px]'} transition-all duration-300 h-[630px] p-5 mb-5 z-10`}>
                <Outlet />
            </div>
        </div>
    )
}

export default DoctorManagerPage
