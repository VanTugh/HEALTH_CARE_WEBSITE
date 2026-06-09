import React from 'react'
import { Link } from 'react-router-dom'

const Ask = () => {
    return (
        <div className='max-w-[1300px] mx-auto mt-15 relative px-5 lg:px-0'>
            <h2 className='text-[24px] font-semibold mb-10'>Hỏi đáp bác sĩ</h2>

            <ul className='flex flex-wrap gap-6 md:gap-12 w-full justify-center md:justify-start'>
                <Link
                    className='w-full sm:w-[48%] md:w-[400px] text-center rounded-2xl border border-gray-200 p-4 md:py-5'
                >
                    <img
                        className='w-full h-[160px] sm:h-[180px] md:h-[216px] object-cover mx-auto rounded-lg'
                        src="https://cdn.bookingcare.vn/fo/w640/2023/11/01/141028-hoidapcongdong.jpeg"
                        alt="anh"
                    />
                    <h3 className='font-semibold text-[14px] md:text-[18px] mt-3'>
                        Hỏi bác sĩ miễn phí
                    </h3>
                </Link>

                <Link
                    className='w-full sm:w-[48%] md:w-[400px] text-center rounded-2xl border border-gray-200 p-4 md:py-5'
                >
                    <img
                        className='w-full h-[160px] sm:h-[180px] md:h-[216px] object-cover mx-auto rounded-lg'
                        src="https://cdn.bookingcare.vn/fo/w640/2024/04/23/150322-z5375466237591689132201a679526eaab9274b8cd39a9.jpg"
                        alt="anh"
                    />
                    <h3 className='font-semibold text-[14px] md:text-[18px] mt-3'>
                        Cẩm nang hỏi đáp
                    </h3>
                </Link>
            </ul>
        </div>
    )
}

export default Ask
