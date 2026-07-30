import React, { useState, useEffect } from 'react'
import pc1 from "../assets/images/search/sea1.png"
import pc2 from "../assets/images/search/sea2.png"
import pc3 from "../assets/images/search/sea3.png"
import pc4 from "../assets/images/search/sea4.png"
import pc5 from "../assets/images/search/sea5.png"
import { Link } from 'react-router-dom'
const Search = () => {
    const text = [
        "Tìm chuyên khoa", "Tìm bác sĩ",
    ];

    const [indexFind, setIndexFind] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndexFind(prev => (prev + 1) % text.length);
        }, 2000);
        return () => clearInterval(interval);
    }, [text.length]);

    return (
        <div className='bg-[#93d7ee] py-10 mt-[100px]'>
            <div className='max-w-[1300px] mx-auto text-center px-5'>


                <h1 className='text-[22px] sm:text-[26px] lg:text-[30px] font-bold leading-snug pt-5'>
                    Nền tảng đặt lịch khám bệnh, chăm sóc răng miệng và làm đẹp
                </h1>


                <div className=' mt-4'>
                    <Link to="/search" className='w-full relative'>
                        <i className="fa-solid fa-magnifying-glass absolute top-1/2 -translate-y-1/2 right-4 text-[18px]"></i>
                        <input
                            className='bg-white rounded-4xl w-full pl-10 pr-10 py-3 sm:py-4
                                   border border-gray-200 outline-none text-[14px] sm:text-[16px]
                                   text-gray-600 cursor-pointer'
                            type="text"
                            placeholder={text[indexFind]}
                        />
                    </Link>
                </div>


                <div className='py-5 text-left'>
                    <h2 className='text-[20px] sm:text-[22px] font-bold'>
                        Các sản phẩm hỗ trợ
                    </h2>
                </div>


                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>


                    <div className='bg-white rounded-2xl flex items-center px-3 py-4'>
                        <img src={pc1} alt="" className='w-[56px] h-[56px]' />
                        <div className='text-start pl-4'>
                            <h3 className='text-[18px] font-semibold'>Tư vấn đặt lịch</h3>
                            <p className='text-[15px] text-gray-600'>
                                Giúp đặt lịch nhanh chóng và dễ dàng trên hệ thống của HealthCare
                            </p>
                        </div>
                    </div>


                    <div className='bg-white rounded-2xl flex items-center px-3 py-4'>
                        <img src={pc3} alt="" className='w-[56px] h-[56px]' />
                        <div className='text-start pl-4'>
                            <h3 className='text-[18px] font-semibold'>Trợ lý niềng răng</h3>
                            <p className='text-[15px] text-gray-600'>
                                Tìm kiếm địa chỉ, bác sĩ niềng răng giàu kinh nghiệm.
                            </p>
                        </div>
                    </div>


                    <div className='bg-white rounded-2xl flex items-center px-3 py-4'>
                        <img src={pc2} alt="" className='w-[56px] h-[56px]' />
                        <div className='text-start pl-4'>
                            <h3 className='text-[18px] font-semibold'>Trợ lý da liễu</h3>
                            <p className='text-[15px] text-gray-600'>
                                Tìm bác sĩ, dịch vụ, cơ sở chuyên về điều trị mụn.
                            </p>
                        </div>
                    </div>


                    <div className='bg-white rounded-2xl flex items-center px-3 py-4'>
                        <img src={pc4} alt="" className='w-[56px] h-[56px]' />
                        <div className='text-start pl-4'>
                            <h3 className='text-[18px] font-semibold'>Trợ lý trị mụn</h3>
                            <p className='text-[15px] text-gray-600'>
                                Tìm bác sĩ, dịch vụ điều trị da liễu hiệu quả.
                            </p>
                        </div>
                    </div>


                    <div className='bg-white rounded-2xl flex items-center px-3 py-4'>
                        <img src={pc5} alt="" className='w-[56px] h-[56px]' />
                        <div className='text-start pl-4'>
                            <h3 className='text-[18px] font-semibold'>Tư vấn sức khỏe</h3>
                            <p className='text-[15px] text-gray-600'>
                                Hỗ trợ giải đáp các thắc mắc và nhu cầu khám bệnh.
                            </p>
                        </div>
                    </div>


                    <div className='bg-white rounded-2xl flex items-center px-3 py-4'>
                        <img src={pc2} alt="" className='w-[56px] h-[56px]' />
                        <div className='text-start pl-4'>
                            <h3 className='text-[18px] font-semibold'>Tư vấn lựa chọn bác sĩ</h3>
                            <p className='text-[15px] text-gray-600'>
                                Gợi ý bác sĩ phù hợp theo nhu cầu và tình trạng sức khỏe.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Search

