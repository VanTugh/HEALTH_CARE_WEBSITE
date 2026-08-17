import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import HeaderSub from '../components/HeaderSub';
import Footer from '../components/Footer';
import DoctorDetail from '../components/Doctor/DoctorDetail';
import api from '../utils/api';

const SpecialtyDetailPage = () => {
    const { id } = useParams();
    const [specialty, setSpecialty] = useState(null);
    const [doctorList, setDoctorList] = useState([]);
    const [cosoyteList, setCoSoYTeList] = useState([]);


    useEffect(() => {
        api.get(`/api/specialties/${id}`)
            .then(({ data }) => setSpecialty(data))
            .catch(err => console.error("Lỗi lấy chuyên khoa:", err));
    }, [id]);


    useEffect(() => {
        api.get(`/api/doctors/specialty/${id}`)
            .then(({ data }) => {
                const sortedDoctors = [...data].sort(
                    (a, b) => b.trinhDoID - a.trinhDoID
                );
                setDoctorList(sortedDoctors);
            })
            .catch(err => console.error("Lỗi lấy bác sĩ:", err));
    }, [id]);


    useEffect(() => {
        api.get("/api/facilities")
            .then(({ data }) => setCoSoYTeList(data))
            .catch(err => console.error("Lỗi lấy cơ sở y tế:", err));
    }, []);

    console.log(cosoyteList)

    if (!specialty) return <p className='p-10'>Đang tải...</p>;

    return (
        <div>
            <HeaderSub />

            <div className='max-w-[1300px] lg:mx-auto mx-5'>

                <p className='pt-5'>
                    <Link to="/" className='text-blue-400'>
                        <i className="fa-solid fa-house"></i>
                    </Link>
                    <span className='mx-1.5 text-blue-400'>/</span>
                    <Link to="/specialtypage" className='text-blue-400'>
                        Khám chuyên khoa
                    </Link>
                    <span className='mx-1.5 text-blue-400'>/</span>
                    <span className='font-medium'>{specialty.tenChuyenKhoa}</span>
                </p>


                <h2 className='font-bold text-[22px] mt-4'>
                    {specialty.tenChuyenKhoa}
                </h2>


                <p className='mt-2 text-gray-700'>{specialty.moTa}</p>


                <h3 className='text-[20px] font-semibold mt-8'>Bác sĩ thuộc chuyên khoa</h3>

                <div className='mt-5 space-y-5'>
                    {doctorList.length > 0 && cosoyteList.length > 0 ? (
                        doctorList.map((item) => (
                            <DoctorDetail
                                key={item.bacSiID}
                                doctor={item}
                                cosoyte={cosoyteList[0]}
                            />
                        ))
                    ) : (
                        <p className="text-gray-500 italic">Chưa có bác sĩ cho chuyên khoa này hoặc cơ sở y tế chưa load.</p>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default SpecialtyDetailPage;
