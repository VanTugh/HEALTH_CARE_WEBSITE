import React, { useState } from 'react'
import HeaderAdmin from '../components/Admin/HeaderAdmin'
import SideBar from '../components/Admin/SideBar'
import { Outlet } from 'react-router-dom'

const AdminPage = () => {
    const danhMuc = [
        "Thống kê",
        "Quản lý cơ sở y tế",
        "Quản lý chuyên khoa",
        "Quản lý bác sĩ",
        "Quản lý người dùng",
        "Quản lý lịch khám",
        "Quản lý trình độ",
        "Quản lý lịch nghỉ",
        "Quản lý lịch sử khám",
    ]

    const [index, setIndex] = useState(0)
    const [sidebarOpen, setSidebarOpen] = useState(true)

    return (
        <div>

            <HeaderAdmin
                danhMuc={danhMuc}
                index={index}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />


            <SideBar
                danhMuc={danhMuc}
                index={index}
                setIndex={setIndex}
                sidebarOpen={sidebarOpen}
            />


            <div className={`mt-[100px] p-5 transition-all duration-300 ${sidebarOpen ? 'ml-[280px]' : 'ml-0'}`}>
                <Outlet />
            </div>
        </div>
    )
}

export default AdminPage
