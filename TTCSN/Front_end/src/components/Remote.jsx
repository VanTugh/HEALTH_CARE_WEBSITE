import React, { useState } from 'react'
import { Link } from "react-router-dom";
import pc1 from "../assets/images/remote_/r1.png"
import pc2 from "../assets/images/remote_/r2.png"
import pc3 from "../assets/images/remote_/r3.png"
import pc4 from "../assets/images/remote_/r4.png"
import pc5 from "../assets/images/remote_/r5.png"
import pc6 from "../assets/images/remote_/r6.png"
import pc7 from "../assets/images/remote_/r7.png"
import pc8 from "../assets/images/remote_/r8.png"
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

const Remote = () => {
    const list = [
        {
            id: 1,
            name: "Tư vấn, trị liệu Tâm lý từ xa",
            image: pc1,
        },
        {
            id: 2,
            name: "Sức khỏe tâm thần từ xa",
            image: pc2,
        },
        {
            id: 3,
            name: "Bác sĩ Da Liễu từ xa",
            image: pc3,
        },
        {
            id: 4,
            name: "Bác sĩ Cơ-Xương-Khớp từ xa",
            image: pc4,
        },
        {
            id: 5,
            name: "Bác sĩ Tim Mạch từ xa",
            image: pc5,
        },
        {
            id: 6,
            name: "Bác sĩ Tiêu Hóa từ xa",
            image: pc6,
        },
        {
            id: 7,
            name: "Bác sĩ Tai-Mũi-Họng từ xa",
            image: pc7,
        },
        {
            id: 8,
            name: "Bác sĩ Thần Kinh từ xa",
            image: pc8,
        },
    ]
    const [indexStart, setIndexStart] = useState(0)
    const itemsPerPage = 3
    const listCurrent = list.slice(indexStart, indexStart + itemsPerPage)

    const handleNext = () => {
        if (indexStart + itemsPerPage < list.length) {
            setIndexStart(indexStart + itemsPerPage);
        }
    };
    const handlePrev = () => {
        if (indexStart - itemsPerPage >= 0) {
            setIndexStart(indexStart - itemsPerPage);
        }
    };

    return (
        <div className='max-w-[1300px] mx-auto mt-15 relative px-5 lg:px-0'>
            <h2 className='text-[24px] md:text-[28px] font-semibold mb-10'>Khám từ xa</h2>
            <ul className='flex gap-4 md:gap-12 relative'>
                {listCurrent.map((item) => (
                    <Link key={item.id} className='flex-1 text-center rounded-2xl border border-gray-200 py-3 md:py-5'>
                        <img
                            className='w-full h-[160px] md:h-[216px] object-cover mx-auto rounded-2xl'
                            src={item.image} alt={item.name}
                        />
                        <h3 className='font-semibold text-[14px] md:text-[18px] mt-2 md:mt-3'>{item.name}</h3>
                    </Link>
                ))}


                {indexStart + itemsPerPage < list.length && (
                    <div
                        onClick={handleNext}
                        className='w-10 h-10 border border-blue-300 rounded-lg flex justify-center items-center bg-white cursor-pointer absolute -right-5 top-1/2 -translate-y-1/2 z-10'
                    >
                        <IoIosArrowForward className='text-blue-600 text-xl md:text-2xl' />
                    </div>
                )}

                {indexStart > 0 && (
                    <div
                        onClick={handlePrev}
                        className='w-10 h-10 border border-blue-300 rounded-lg flex justify-center items-center bg-white cursor-pointer absolute -left-5 top-1/2 -translate-y-1/2 z-10'
                    >
                        <IoIosArrowBack className='text-blue-600 text-xl md:text-2xl' />
                    </div>
                )}
            </ul>

            <Link
                to="/specialtypage"
                className='rounded-2xl bg-[#daf3f7] text-blue-500 py-2 px-3 md:py-3 md:px-4 inline-block absolute top-0 right-0 cursor-pointer mr-5 md:mr-0'
            >
                <p className='font-semibold text-[16px] md:text-[20px]'>Xem thêm</p>
            </Link>
        </div>
    )
}

export default Remote
