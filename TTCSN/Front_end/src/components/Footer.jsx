import React from 'react'
import { FiMapPin, FiShield, FiPhoneCall, FiMail } from "react-icons/fi";
import { Link } from 'react-router-dom';
import dt1 from "../assets/images/footer/dt1.png"
import dt2 from "../assets/images/footer/dt2.png"
import dt3 from "../assets/images/footer/dt3.png"

const Footer = () => {
    return (
        <div className='bg-[#efefef] mt-10 py-8 px-5'>
            <div className='max-w-[1300px] mx-auto flex flex-col md:flex-row md:gap-10 gap-8'>


                <div className='flex-1 max-w-[500px]'>
                    <h3 className='font-bold mb-3 text-[18px] md:text-[20px]'>
                        Công ty Cổ phần Công nghệ HealthCare
                    </h3>

                    <div className='flex mb-3 items-start'>
                        <FiMapPin className="size-6 md:size-7 shrink-0 mt-1" />
                        <p className='ml-3 text-[14px]'>Thôn Nguyên Xá, Phường Minh Khai, Quận Bắc Từ Liêm, Hà Nội</p>
                    </div>

                    <div className='flex mb-3 items-start'>
                        <FiShield className="size-6 shrink-0 mt-1" />
                        <p className='ml-3 text-[14px]'>
                            ĐKKD số. 0123456789 — Sở KHĐT Hà Nội cấp ngày 15/8/2025
                        </p>
                    </div>

                    <div className='flex mb-3 items-center'>
                        <FiPhoneCall className="size-6 shrink-0" />
                        <p className='ml-3 text-[14px]'>
                            <span className='underline'>098-1234-567</span> (7h - 18h)
                        </p>
                    </div>

                    <div className='flex mb-4 items-center'>
                        <FiMail className="size-6 shrink-0" />
                        <p className='ml-3 text-[14px]'>support@healthcare.vn (7h - 18h)</p>
                    </div>

                    <h3 className='font-bold mb-2 text-[18px] md:text-[20px]'>Văn phòng tại Hà Nội</h3>
                    <div className='flex items-start'>
                        <FiMapPin className="size-6 shrink-0 mt-1" />
                        <p className='ml-3 text-[14px]'>B4/D21, Nguyên Xá, Minh Khai, Bắc Từ Liêm, Hà Nội</p>
                    </div>
                </div>


                <div className='flex-1 max-w-[250px]'>
                    <ul className='flex flex-col'>
                        <Link to="/" className="flex items-center gap-1 mb-3">
                            <i className="fa-solid fa-notes-medical text-[22px] text-[#f6c310]"></i>
                            <p className="text-[20px] font-bold text-[#f6c310]">HealthCare</p>
                        </Link>

                        <Link className='mb-2 text-[#0fdaf5] font-medium'>Liên hệ hợp tác</Link>
                        <Link className='mb-2 text-[#0fdaf5] font-medium'>Chuyển đổi số</Link>
                        <Link className='mb-2 text-[#0fdaf5] font-medium'>Chính sách bảo mật</Link>
                        <Link className='mb-2 text-[#0fdaf5] font-medium'>Quy chế hoạt động</Link>
                        <Link className='mb-2 text-[#0fdaf5] font-medium'>Tuyển dụng</Link>
                        <Link className='mb-2 text-[#0fdaf5] font-medium'>Điều khoản sử dụng</Link>
                        <Link className='mb-2 text-[#0fdaf5] font-medium'>Câu hỏi thường gặp</Link>
                    </ul>
                </div>


                <div className='flex-1'>
                    <h3 className='font-bold mb-4 text-[18px] md:text-[20px]'>Đối tác bảo trợ nội dung</h3>


                    <div className='flex gap-3 mb-4'>
                        <img src={dt1} alt="anh" className='w-[70px] h-[56px] md:w-[80px] md:h-[64px] object-cover rounded' />
                        <div>
                            <h3 className='font-semibold'>Hello Doctor</h3>
                            <p className='text-[14px] md:text-[15px] mt-1'>
                                Bảo trợ chuyên mục "sức khỏe tinh thần"
                            </p>
                        </div>
                    </div>

                    <div className='flex gap-3 mb-4'>
                        <img src={dt2} alt="anh" className='w-[70px] h-[56px] md:w-[80px] md:h-[64px] object-cover rounded' />
                        <div>
                            <h3 className='font-semibold'>Hệ thống y khoa quốc tế Bernard</h3>
                            <p className='text-[14px] md:text-[15px] mt-1'>
                                Bảo trợ chuyên mục "y khoa chuyên sâu"
                            </p>
                        </div>
                    </div>

                    <div className='flex gap-3 mb-4'>
                        <img src={dt3} alt="anh" className='w-[70px] h-[56px] md:w-[80px] md:h-[64px] object-cover rounded' />
                        <div>
                            <h3 className='font-semibold'>Doctor Check</h3>
                            <p className='text-[14px] md:text-[15px] mt-1'>
                                Bảo trợ chuyên mục "sức khỏe tổng quát"
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Footer
