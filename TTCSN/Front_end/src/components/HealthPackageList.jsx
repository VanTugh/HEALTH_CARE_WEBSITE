import React, { useState } from 'react'
import { Link } from "react-router-dom";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import h1 from "../assets/images/healthpackage/h1.png"
import h2 from "../assets/images/healthpackage/h2.png"
const HealthPackageList = () => {
    const list = [
        {
            id: 1,
            name: "Gói khám sức khỏe tổng quát cơ bản cho Nam",
            image: h1,
        },
        {
            id: 2,
            name: "Gói khám sức khỏe tổng quát cơ bản cho Nữ",
            image: h1,
        },
        {
            id: 3,
            name: "Gói khám sức khỏe tiền hôn nhân cho Nam",
            image: h2,
        },
        {
            id: 4,
            name: "Gói khám sức khỏe tiền hôn nhân cho Nữ",
            image: h2,
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
            <h2 className='text-[24px] font-semibold mb-10'>Gói khám</h2>
            <ul className='flex gap-12 relative'>
                {listCurrent.map((item, index) => (
                    <Link key={index} className='w-1/3 text-center rounded-2xl border border-gray-200 py-5'>
                        <img className='w-[350px] h-[216px] mx-auto rounded-2xl'
                            src={item.image} alt="anh" />
                        <h3 className='font-semibold text-[18px] mt-3 px-5'>{item.name}</h3>
                    </Link>
                ))}
                {indexStart + itemsPerPage < list.length && (
                    <div onClick={handleNext}
                        className='size-10 border border-blue-300 rounded-[8px] 
                flex justify-center items-center bg-white cursor-pointer
                absolute -right-5 top-1/2 -translate-y-1/2 z-9'>
                        <IoIosArrowForward className='size-[24px] text-blue-600' />
                    </div>
                )}
                {indexStart > 0 && (
                    <div onClick={handlePrev}
                        className='size-10 border border-blue-300 rounded-[8px] 
                flex justify-center items-center bg-white cursor-pointer
                absolute -left-5 top-1/2 -translate-y-1/2 z-9'>
                        <IoIosArrowBack className='size-[24px] text-blue-600' />
                    </div>
                )}
            </ul>
            <Link to="/specialtypage"
                className='rounded-2xl bg-[#daf3f7] text-blue-500 py-3 px-4 inline-block
            absolute top-0 right-0 cursor-pointer
            '>
                <p className='font-semibold text-[20px]'>Xem thêm</p>
            </Link>

        </div>
    )
}

export default HealthPackageList
