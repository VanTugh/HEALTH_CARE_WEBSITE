import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderSub from "../components/HeaderSub";
import Footer from "../components/Footer";
const HealthcareCenterCard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state;

    if (!data) {
        return (
            <div className="text-center mt-10">
                <p className="text-red-500">Không có dữ liệu cơ sở y tế!</p>
                <button
                    className="mt-4 px-4 py-2 bg-sky-500 text-white rounded-lg"
                    onClick={() => navigate(-1)}
                >
                    Quay lại
                </button>
            </div>
        );
    }

    return (
        <div>
            <HeaderSub />
            <div className="max-w-4xl lg:mx-auto mx-5 bg-white shadow-lg rounded-2xl overflow-hidden mt-8">
                <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 flex justify-center items-center p-4 bg-gray-50">
                        <img
                            src={data.anhDaiDien || "https://via.placeholder.com/150"}
                            alt={data.tenCoSo}
                            className="w-32 h-32 md:w-40 md:h-40 object-contain rounded-full border border-gray-200"
                        />
                    </div>

                    <div className="md:w-2/3 p-6 flex flex-col justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-sky-700 mb-2">{data.tenCoSo}</h2>
                            <p className="text-gray-700 mb-4">{data.moTa}</p>

                            <div className="text-gray-600 text-sm space-y-2">
                                <p><strong>Địa chỉ:</strong> {data.diaChi}</p>
                                <p><strong>Số điện thoại:</strong> {data.soDienThoai}</p>
                                <p><strong>Email:</strong> {data.email}</p>
                                <p>
                                    <strong>Website:</strong>{" "}
                                    <a href={data.website} target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:underline">
                                        {data.website}
                                    </a>
                                </p>
                                <p><strong>Giờ làm việc:</strong> {data.gioLamViec}</p>
                                <p><strong>Ngày làm việc:</strong> {data.ngayLamViec}</p>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-4">
                            <a
                                href={`tel:${data.soDienThoai}`}
                                className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg transition"
                            >
                                Gọi ngay
                            </a>
                            <a
                                href={data.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition"
                            >
                                Truy cập website
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default HealthcareCenterCard;
