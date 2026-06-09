import React, { useState, useEffect } from 'react'
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import nen from "../assets/images/doctor/nen.png";
import axios from "axios";

const ListDoctor = () => {

    const [listDoctor, setListDoctor] = useState([]);
    const [indexStart, setIndexStart] = useState(0);
    const itemsPerPage = 4;


    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const token = localStorage.getItem("token");
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
                const res = await axios.get(
                    `${API_BASE_URL}/api/doctors/top-experienced`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "ngrok-skip-browser-warning": "true"
                        }
                    }
                );
                console.log(res.data)
                setListDoctor(res.data);
            } catch (error) {
                console.error("Lỗi tải danh sách bác sĩ:", error);
            }
        };

        fetchDoctors();
    }, []);

    const listCurrent = listDoctor.slice(indexStart, indexStart + itemsPerPage);

    const handleNext = () => {
        if (indexStart + itemsPerPage < listDoctor.length) {
            setIndexStart(indexStart + itemsPerPage);
        }
    };

    const handlePrev = () => {
        if (indexStart - itemsPerPage >= 0) {
            setIndexStart(indexStart - itemsPerPage);
        }
    };

    return (
        <div className='mt-8 py-5 px-5 lg:px-0' style={{ backgroundImage: `url(${nen})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="relative max-w-[1300px] mx-auto">
                <h2 className='text-[24px] md:text-[28px] font-semibold mb-10'>Bác sĩ nổi bật</h2>

                <div className="relative">
                    <ul className='flex gap-4 md:gap-10 flex-wrap justify-between'>
                        {listCurrent.map((item) => (
                            <Link to={`/doctor/${item.bacSiID}`} key={item.bacSiID} className='text-center flex-1 min-w-[140px] max-w-[220px]'>
                                <div className='w-[120px] sm:w-[140px] md:w-[160px] lg:w-[180px] aspect-square mx-auto rounded-full overflow-hidden'>
                                    <img
                                        src={item.avatarUrl}
                                        alt={item.hoTen}
                                        className='w-full h-full object-cover'
                                    />
                                </div>
                                <h3 className='my-2 text-[14px] sm:text-[16px] md:text-[18px] font-bold'>{item.hoTen}</h3>
                                <p className='text-[12px] sm:text-[14px] md:text-[16px] text-gray-500'>{item.tenChuyenKhoa}</p>
                                <p className='text-[12px] sm:text-[16px] md:text-[17px] text-gray-600'>{item.tenTrinhDo}</p>
                            </Link>
                        ))}
                    </ul>

                    {indexStart + itemsPerPage < listDoctor.length && (
                        <div onClick={handleNext}
                            className='w-10 h-10 border border-blue-300 rounded-lg 
                                flex justify-center items-center bg-white cursor-pointer
                                absolute right-[-14px] md:right-0  z-10 bottom-40'>
                            <IoIosArrowForward className='text-blue-600 text-xl md:text-2xl' />
                        </div>
                    )}
                    {indexStart > 0 && (
                        <div onClick={handlePrev}
                            className='w-10 h-10 border border-blue-300 rounded-lg 
                                flex justify-center items-center bg-white cursor-pointer
                                absolute left-[-14px] md:left-0 bottom-40 z-10'>
                            <IoIosArrowBack className='text-blue-600 text-xl md:text-2xl' />
                        </div>
                    )}
                </div>

                <Link to="/doctorpage" className='rounded-2xl bg-[#daf3f7] text-blue-500 py-2 px-3 md:py-3 md:px-4 inline-block absolute top-0 right-0 cursor-pointer mr-5 md:mr-0'>
                    <p className='font-semibold text-[16px] md:text-[20px]'>Xem thêm</p>
                </Link>
            </div>
        </div>
    )
}

export default ListDoctor
