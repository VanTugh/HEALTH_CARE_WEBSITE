import React, { useEffect, useState } from 'react';
import HeaderSub from '../../components/HeaderSub';
import Footer from '../../components/Footer';
import DoctorInfo from './DoctorInfor';
import DoctorSchedule from './DoctorSchedule';
import DoctorClinicInfo from './DoctorClinicInfo';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
const Doctor = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [cosoyteList, setCoSoYTeList] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        fetch(`${API_BASE_URL}/api/doctors/${id}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                "ngrok-skip-browser-warning": "true",
            },
        })
            .then(response => {
                if (!response.ok) throw new Error("Lỗi lấy dữ liệu");
                return response.json();
            })
            .then(data => {
                console.log(data)
                setDoctor(data)
            })
            .catch(error => {
                console.error("Lỗi khi gọi API:", error);
                alert("Có lỗi xảy ra, vui lòng thử lại!");
            });
    }, [id]);

    useEffect(() => {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const token = localStorage.getItem("accessToken");

        fetch(`${API_BASE_URL}/api/facilities`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Không thể lấy cơ sở y tế");
                }
                return res.json();
            })
            .then(data => setCoSoYTeList(data))
            .catch(err => console.error("Lỗi lấy cơ sở y tế:", err));
    }, []);

    if (!doctor) {
        return (
            <>
                <HeaderSub />
                <div className="max-w-[1300px] mx-auto mt-10 text-center">
                    <p className="text-red-600">Không tìm thấy thông tin bác sĩ.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 px-4 py-2 bg-sky-500 text-white rounded"
                    >
                        Quay lại
                    </button>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <div>
            <HeaderSub />
            <div className='max-w-[1300px] mx-auto mt-5'>
                <p className='pt-5 pl-4'>
                    <Link to="/" className='text-blue-400'>
                        <i className="fa-solid fa-house"></i>
                    </Link>
                    <span className='mx-1.5 text-blue-400'>/</span>
                    <Link to="/specialtypage" className='text-blue-400'>
                        Khám chuyên khoa
                    </Link>
                    <span className='mx-1.5 text-blue-400'>/</span>
                    <span className='font-medium'>{doctor.tenChuyenKhoa}</span>
                    <span className='mx-1.5 text-blue-400'>/</span>
                    <span className='font-medium'>{doctor.hoTen}</span>
                </p>

                <DoctorInfo doctor={doctor} />

                <div className='flex gap-x-5 mt-5'>

                    <div className='flex-1 border-gray-300 pr-5 w-3/5 ml-5'>
                        <DoctorSchedule doctor={doctor} />
                    </div>

                    <div className='w-2/5 flex items-center'>
                        <DoctorClinicInfo
                            doctor={doctor}
                            cosoyte={cosoyteList[0]}
                        />
                    </div>

                </div>


                <div className='mt-5 mx-5 p-5 border border-gray-200 rounded-lg shadow-sm bg-white'>
                    <h3 className='font-bold text-xl mb-4 text-sky-600'>Giới thiệu về bác sĩ</h3>
                    <ul className='list-disc pl-5 space-y-2 text-gray-700 text-[15px]'>
                        {doctor.quaTrinhDaoTao && (
                            <li>
                                <span className='font-semibold'>Quá trình đào tạo:</span> {doctor.quaTrinhDaoTao}
                            </li>
                        )}
                        {doctor.kinhNghiemLamViec && (
                            <li>
                                <span className='font-semibold'>Kinh nghiệm làm việc:</span> {doctor.kinhNghiemLamViec}
                            </li>
                        )}
                        {doctor.thanhTich && (
                            <li>
                                <span className='font-semibold'>Thành tích:</span> {doctor.thanhTich}
                            </li>
                        )}
                        {doctor.chungChi && (
                            <li>
                                <span className='font-semibold'>Chứng chỉ:</span> {doctor.chungChi}
                            </li>
                        )}
                        {doctor.moTaChuyenKhoa && (
                            <li>
                                <span className='font-semibold'>Chuyên khoa:</span> {doctor.moTaChuyenKhoa}
                            </li>
                        )}
                        {doctor.moTaTrinhDo && (
                            <li>
                                <span className='font-semibold'>Trình độ:</span> {doctor.moTaTrinhDo}
                            </li>
                        )}
                        {doctor.gioiThieu && (
                            <li>
                                <span className='font-semibold'>Giới thiệu:</span> {doctor.gioiThieu}
                            </li>
                        )}
                    </ul>
                </div>

            </div>
            <Footer />
        </div>
    );
};

export default Doctor;
