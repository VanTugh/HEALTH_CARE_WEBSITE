import React, { useState, useEffect } from 'react'
import HeaderSub from '../components/HeaderSub'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

const DoctorPage = () => {

    const [doctors, setDoctors] = useState([])

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        fetch(`${API_BASE_URL}/api/doctors?page=0&size=50&sortBy=nguoiDung.hoTen&direction=asc`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "ngrok-skip-browser-warning": "true"
            },
        })
            .then(response => {
                if (!response.ok) throw new Error("Lỗi lấy dữ liệu");
                return response.json();
            })
            .then(data => {
                setDoctors(data.content);
            })
            .catch(error => {
                console.error("Lỗi khi gọi API:", error);
                alert("Có lỗi xảy ra, vui lòng thử lại!");
            });
    }, []);



    return (
        <div>
            <HeaderSub />
            <div className=' max-w-[1300px] xl:mx-auto mx-5'>

                <p className='pt-5'>
                    <Link to="/" className='text-blue-400'><i class="fa-solid fa-house"></i></Link>
                    <span className='mx-1.5 text-blue-400'>/</span>
                    <span className='font-medium'>Danh sách bác sĩ</span>
                </p>
                <h2 className='font-semibold text-[18px] pt-3'>Danh sách bác sĩ</h2>
                <div className='mt-5'>
                    {doctors.map((item) => (
                        <Link className='flex gap-x-3 items-center mb-5 border-b-1 pb-5 border-gray-300'
                            key={item.bacSiID}
                            to={`/doctor/${item.bacSiID}`}
                        >
                            <img className='size-[110px] rounded-[50%]'
                                src={item.avatarUrl} alt="" />
                            <div className=''>
                                <h3 className='font-medium'>{item.hoTen}</h3>
                                <p>{item.chuyenKhoa}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default DoctorPage
