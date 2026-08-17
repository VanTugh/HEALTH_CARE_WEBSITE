import React from 'react'
import { Link, useNavigate } from "react-router-dom"

const HeaderSub = () => {
    const navigate = useNavigate()

    return (
        <>
            {/* Adding flex justify-center to absolutely center the header container */}
            <div className="w-full bg-[#ecfffb] flex justify-center">
                <div className="
                    w-full max-w-[1200px] px-4 md:px-8
                    h-auto min-h-[80px]
                    bg-[#ecfffb] flex flex-col lg:flex-row 
                    items-start lg:items-center justify-between gap-3 lg:gap-6
                    py-4
                ">

                    <div className="flex items-center gap-4">
                        <Link to="/" className="flex items-center gap-1 mr-3 md:mr-8">
                            <i className="fa-solid fa-notes-medical text-[26px] lg:text-[34px] text-[#f6c310]"></i>
                            <p className="text-[26px] lg:text-[32px] font-bold text-[#f6c310]">
                                HealthCare
                            </p>
                        </Link>

                        {/* Nút Quay lại */}
                        <button
                            onClick={() => navigate(-1)}
                            className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#beece3] bg-white hover:bg-[#ebf8f5] hover:text-[#0b9c7b] transition-all text-gray-600 text-sm font-semibold shadow-sm"
                            title="Quay lại trang trước"
                        >
                            <i className="fa-solid fa-arrow-left text-xs"></i>
                            Quay lại
                        </button>
                    </div>


                    <div className="flex flex-col lg:flex-row items-start lg:items-center lg:gap-8 w-full lg:w-auto">
                        <ul className="
                            flex flex-wrap lg:flex-nowrap gap-4 lg:gap-8 
                            w-full lg:w-auto
                        ">
                            <Link to="/specialtypage" className="flex flex-col justify-center text-[13px] min-w-[120px] hover:text-[#0b9c7b] transition-colors group">
                                <h3 className="font-bold text-gray-800 group-hover:text-[#0b9c7b]">Chuyên khoa</h3>
                                <p className="text-gray-500 text-xs mt-0.5">Tìm chuyên khoa</p>
                            </Link>

                            <Link to="/medicalpage" className="flex flex-col justify-center text-[13px] min-w-[120px] hover:text-[#0b9c7b] transition-colors group">
                                <h3 className="font-bold text-gray-800 group-hover:text-[#0b9c7b]">Cơ sở y tế</h3>
                                <p className="text-gray-500 text-xs mt-0.5">Bệnh viện, phòng khám</p>
                            </Link>

                            <Link to="/doctorpage" className="flex flex-col justify-center text-[13px] min-w-[120px] hover:text-[#0b9c7b] transition-colors group">
                                <h3 className="font-bold text-gray-800 group-hover:text-[#0b9c7b]">Bác sĩ</h3>
                                <p className="text-gray-500 text-xs mt-0.5">Chọn bác sĩ giỏi</p>
                            </Link>
                        </ul>
                    </div>

                </div>
            </div>
        </>
    )
}

export default HeaderSub
