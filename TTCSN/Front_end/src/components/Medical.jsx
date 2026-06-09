import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

const Medical = () => {
    const [list, setList] = useState([]);
    const [indexStart, setIndexStart] = useState(0);
    const itemsPerPage = 3;
    const [hopital, setHopital] = useState([]);
    useEffect(() => {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const token = localStorage.getItem("accessToken");
        fetch(`${API_BASE_URL}/api/facilities`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "ngrok-skip-browser-warning": "true",
            },
        })
            .then((res) => res.json())
            .then((data) => {

                const mapped = data.map(item => ({
                    id: item.coSoID,
                    name: item.tenCoSo,
                    image: item.anhDaiDien || item.logo || "",
                }));
                setList(mapped);
                setHopital(data);
            })
            .catch((err) => console.error(err));
    }, []);

    const listCurrent = list.slice(indexStart, indexStart + itemsPerPage);

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
            <h2 className='text-[24px] font-semibold mb-10'>Cơ sở y tế</h2>
            <ul className='flex gap-12 relative'>
                {listCurrent.map((item, index) => (
                    <Link to={"/hopital"}
                        state={hopital.find(h => h.coSoID === item.id)}
                        key={index}
                        className='w-1/3 text-center rounded-2xl border border-gray-200 p-5'>
                        <img className='w-[280px] h-[170px] mx-auto rounded-2xl object-cover'
                            src={item.image} alt={item.name} />
                        <h3 className='font-semibold text-[14px] md:text-[18px] mt-2 md:mt-3'>{item.name}</h3>
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

            <Link
                to="/medicalpage"
                className='rounded-2xl bg-[#daf3f7] text-blue-500 py-2 px-3 md:py-3 md:px-4 inline-block absolute top-0 right-0 cursor-pointer mr-5 md:mr-0'
            >
                <p className='font-semibold text-[16px] md:text-[20px]'>Xem thêm</p>
            </Link>
        </div>
    );
};

export default Medical;
