import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

const ListSpecialty = () => {

    const [listSpecialty, setListSpecialty] = useState([])

    useEffect(() => {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        fetch(`${API_BASE_URL}/api/specialties`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true"
            },
        })
            .then(response => {
                if (!response.ok) throw new Error("Lỗi lấy dữ liệu");
                return response.json();
            })
            .then(data => {
                setListSpecialty(data)
            })
            .catch(error => {
                console.error("Lỗi khi gọi API:", error);
                alert("Có lỗi xảy ra, vui lòng thử lại!");
            });
    }, [])


    const [indexStart, setIndexStart] = useState(0)
    const itemsPerPage = 3
    const listCurrent = listSpecialty.slice(indexStart, indexStart + itemsPerPage)

    const handleNext = () => {
        if (indexStart + itemsPerPage < listSpecialty.length) {
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
            <h2 className='text-[24px] md:text-[28px] font-semibold mb-10'>Chuyên khoa</h2>
            <ul className='flex gap-4 md:gap-12 relative'>
                {listCurrent.map((item) => (
                    <Link key={item.id} to={`/chuyenkhoa/${item.chuyenKhoaID}`} className='flex-1 text-center rounded-2xl border border-gray-200 py-3 md:py-5'>
                        <img
                            className='w-full h-[160px] md:h-[216px] object-cover mx-auto rounded-2xl'
                            src={item.anhDaiDien} alt={item.tenChuyenKhoa}
                        />
                        <h3 className='font-semibold text-[14px] md:text-[18px] mt-2 md:mt-3'>{item.tenChuyenKhoa}</h3>
                    </Link>
                ))}


                {indexStart + itemsPerPage < listSpecialty.length && (
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

export default ListSpecialty
