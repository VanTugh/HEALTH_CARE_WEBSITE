import React from 'react'
import { Link, useNavigate } from "react-router-dom"

const HeaderSub = () => {
    const navigate = useNavigate()

    return (
        <>
            <div className="w-full bg-[#ecfffb]">
                <div className="
                    w-full max-w-screen-xl mx-auto
                    h-auto min-h-[80px]
                    bg-[#ecfffb] flex flex-col lg:flex-row 
                    items-start lg:items-center gap-3 lg:gap-0
                    px-5 py-3
                ">


                    <Link to="/" className="flex items-center gap-1 mr-3">
                        <i className="fa-solid fa-notes-medical text-[26px] lg:text-[30px] text-[#f6c310]"></i>
                        <p className="text-[26px] lg:text-[32px] font-bold text-[#f6c310]">
                            HealthCare
                        </p>
                    </Link>

                    {/* Nút Quay lại */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1.5 ml-2 px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition text-gray-600 text-sm font-medium shadow-sm"
                        title="Quay lại trang trước"
                    >
                        <i className="fa-solid fa-arrow-left text-xs"></i>
                        Quay lại
                    </button>


                    <ul className="
                        flex flex-wrap gap-4 lg:gap-8 
                        ml-0 lg:ml-5
                    ">
                        <Link to="/specialtypage" className="text-[12px] min-w-[120px]">
                            <h3 className="font-semibold">Chuyên khoa</h3>
                            <p>Tìm chuyên khoa</p>
                        </Link>

                        <Link to="/medicalpage" className="text-[12px] min-w-[120px]">
                            <h3 className="font-semibold">Cơ sở y tế</h3>
                            <p>Chọn bệnh viện phòng khám</p>
                        </Link>

                        <Link to="/doctorpage" className="text-[12px] min-w-[120px]">
                            <h3 className="font-semibold">Bác sĩ</h3>
                            <p>Chọn bác sĩ giỏi</p>
                        </Link>
                    </ul>

                </div>
            </div>
        </>
    )
}

export default HeaderSub
