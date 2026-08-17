import React, { useEffect, useState } from 'react';
import HeaderSub from '../../components/HeaderSub';
import Footer from '../../components/Footer';
import DoctorInfo from './DoctorInfor';
import DoctorSchedule from './DoctorSchedule';
import DoctorClinicInfo from './DoctorClinicInfo';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';

const Doctor = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [doctor, setDoctor] = useState(null);
    const [cosoyteList, setCoSoYTeList] = useState([]);
    const [loadingDoctor, setLoadingDoctor] = useState(true);
    const [loadingCoSoYTe, setLoadingCoSoYTe] = useState(true);

    // =========================
    // LẤY THÔNG TIN BÁC SĨ
    // =========================
    useEffect(() => {
        api.get(`/api/doctors/${id}`)
            .then(({ data }) => {
                console.log("Thông tin bác sĩ:", data);
                setDoctor(data);
            })
            .catch(error => {
                console.error("Lỗi khi gọi API bác sĩ:", error);
            })
            .finally(() => {
                setLoadingDoctor(false);
            });
    }, [id]);

    // =========================
    // LẤY DANH SÁCH CƠ SỞ Y TẾ
    // =========================
    useEffect(() => {
        api.get("/api/facilities")
            .then(({ data }) => {
                console.log("Danh sách cơ sở y tế:", data);

                if (Array.isArray(data)) {
                    setCoSoYTeList(data);
                } else if (Array.isArray(data.content)) {
                    setCoSoYTeList(data.content);
                } else {
                    console.warn(
                        "API cơ sở y tế trả về dữ liệu không đúng định dạng:",
                        data
                    );
                    setCoSoYTeList([]);
                }
            })
            .catch(error => {
                console.error("Lỗi lấy cơ sở y tế:", error);
                setCoSoYTeList([]);
            })
            .finally(() => {
                setLoadingCoSoYTe(false);
            });
    }, []);

    // =========================
    // LOADING BÁC SĨ
    // =========================
    if (loadingDoctor) {
        return (
            <>
                <HeaderSub />

                <div className="max-w-[1300px] mx-auto mt-10 text-center">
                    <p className="text-gray-500">
                        Đang tải thông tin bác sĩ...
                    </p>
                </div>

                <Footer />
            </>
        );
    }

    // =========================
    // KHÔNG TÌM THẤY BÁC SĨ
    // =========================
    if (!doctor) {
        return (
            <>
                <HeaderSub />

                <div className="max-w-[1300px] mx-auto mt-10 text-center">
                    <p className="text-red-600">
                        Không tìm thấy thông tin bác sĩ.
                    </p>

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

    // Cơ sở y tế đầu tiên
    const cosoyte = cosoyteList.length > 0
        ? cosoyteList[0]
        : null;

    return (
        <div>
            <HeaderSub />

            <div className="max-w-[1300px] mx-auto mt-5">

                {/* =========================
                    BREADCRUMB
                ========================= */}
                <p className="pt-5 pl-4">

                    <Link to="/" className="text-blue-400">
                        <i className="fa-solid fa-house"></i>
                    </Link>

                    <span className="mx-1.5 text-blue-400">
                        /
                    </span>

                    <Link
                        to="/specialtypage"
                        className="text-blue-400"
                    >
                        Khám chuyên khoa
                    </Link>

                    <span className="mx-1.5 text-blue-400">
                        /
                    </span>

                    <span className="font-medium">
                        {doctor.tenChuyenKhoa}
                    </span>

                    <span className="mx-1.5 text-blue-400">
                        /
                    </span>

                    <span className="font-medium">
                        {doctor.hoTen}
                    </span>

                </p>

                {/* =========================
                    THÔNG TIN BÁC SĨ
                ========================= */}
                <DoctorInfo doctor={doctor} />

                {/* =========================
                    LỊCH KHÁM + CƠ SỞ Y TẾ
                ========================= */}
                <div className="flex gap-x-5 mt-5">

                    <div className="flex-1 border-gray-300 pr-5 w-3/5 ml-5">
                        <DoctorSchedule doctor={doctor} />
                    </div>

                    <div className="w-2/5 flex items-center">

                        {loadingCoSoYTe ? (
                            <div className="w-full text-center text-gray-500">
                                Đang tải thông tin cơ sở y tế...
                            </div>
                        ) : cosoyte ? (
                            <DoctorClinicInfo
                                doctor={doctor}
                                cosoyte={cosoyte}
                            />
                        ) : (
                            <div className="w-full p-5 border border-gray-200 rounded-lg text-gray-500">
                                Chưa có thông tin cơ sở y tế.
                            </div>
                        )}

                    </div>

                </div>

                {/* =========================
                    GIỚI THIỆU BÁC SĨ
                ========================= */}
                <div className="mt-5 mx-5 p-5 border border-gray-200 rounded-lg shadow-sm bg-white">

                    <h3 className="font-bold text-xl mb-4 text-sky-600">
                        Giới thiệu về bác sĩ
                    </h3>

                    <ul className="list-disc pl-5 space-y-2 text-gray-700 text-[15px]">

                        {doctor.quaTrinhDaoTao && (
                            <li>
                                <span className="font-semibold">
                                    Quá trình đào tạo:
                                </span>{" "}
                                {doctor.quaTrinhDaoTao}
                            </li>
                        )}

                        {doctor.kinhNghiemLamViec && (
                            <li>
                                <span className="font-semibold">
                                    Kinh nghiệm làm việc:
                                </span>{" "}
                                {doctor.kinhNghiemLamViec}
                            </li>
                        )}

                        {doctor.thanhTich && (
                            <li>
                                <span className="font-semibold">
                                    Thành tích:
                                </span>{" "}
                                {doctor.thanhTich}
                            </li>
                        )}

                        {doctor.chungChi && (
                            <li>
                                <span className="font-semibold">
                                    Chứng chỉ:
                                </span>{" "}
                                {doctor.chungChi}
                            </li>
                        )}

                        {doctor.moTaChuyenKhoa && (
                            <li>
                                <span className="font-semibold">
                                    Chuyên khoa:
                                </span>{" "}
                                {doctor.moTaChuyenKhoa}
                            </li>
                        )}

                        {doctor.moTaTrinhDo && (
                            <li>
                                <span className="font-semibold">
                                    Trình độ:
                                </span>{" "}
                                {doctor.moTaTrinhDo}
                            </li>
                        )}

                        {doctor.gioiThieu && (
                            <li>
                                <span className="font-semibold">
                                    Giới thiệu:
                                </span>{" "}
                                {doctor.gioiThieu}
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