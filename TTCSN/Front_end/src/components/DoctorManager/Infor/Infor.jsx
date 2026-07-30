import React from "react";
import { FaUserMd } from "react-icons/fa";
import { BsHospital } from "react-icons/bs";
import { GiSkills } from "react-icons/gi";

const Infor = ({ user, setIsEditing }) => {
    const formatCurrency = (amount) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

    const formatGender = (g) => (g === 1 ? "Nam" : g === 0 ? "Nữ" : "Nữ");

    const Line = ({ label, value }) => (
        <p className="flex justify-between py-2 border-b border-gray-300 last:border-none text-sm md:text-base">
            <span className="text-gray-600 font-medium">{label}</span>
            <span className="text-gray-900 font-semibold max-w-[60%] text-right break-words">
                {value}
            </span>
        </p>
    );

    return (
        <div className="w-full flex flex-col gap-y-6 p-1">

            <div className="bg-white rounded-xl border shadow-sm p-4 md:p-6 border-gray-300">
                <h3 className="font-bold text-[18px] md:text-[20px] text-sky-600 mb-4 flex items-center gap-2">
                    <FaUserMd className="text-sky-600" /> Thông tin cá nhân
                </h3>

                <Line label="Họ tên" value={user.hoTen} />
                <Line label="Email" value={user.email} />
                <Line label="Số điện thoại" value={user.soDienThoai} />
                <Line label="Giới tính" value={formatGender(user.gioiTinh)} />
                <Line label="Ngày sinh" value={user.ngaySinh} />
                <Line label="Địa chỉ" value={user.diaChi || "Chưa cập nhật"} />
            </div>


            <div className="bg-white rounded-xl border shadow-sm p-4 md:p-6 border-gray-300">
                <h3 className="font-bold text-[18px] md:text-[20px] text-sky-600 mb-4 flex items-center gap-2">
                    <BsHospital className="text-sky-600" /> Thông tin chuyên môn
                </h3>

                <Line label="Chuyên khoa" value={user.tenChuyenKhoa} />
                <Line label="Mô tả chuyên khoa" value={user.moTaChuyenKhoa} />
                <Line label="Trình độ" value={user.tenTrinhDo} />
                <Line label="Mô tả trình độ" value={user.moTaTrinhDo} />
                <Line label="Số năm kinh nghiệm" value={`${user.soNamKinhNghiem} năm`} />
                <Line
                    label="Giá khám"
                    value={<span className="text-red-600">{formatCurrency(user.giaKham)}</span>}
                />
                <Line label="Số bệnh nhân tối đa/ngày" value={user.soBenhNhanToiDaMotNgay} />
                <Line label="Thời gian khám mỗi ca" value={`${user.thoiGianKhamMotCa} phút`} />
            </div>


            <div className="bg-white rounded-xl border shadow-sm p-4 md:p-6 border-gray-300">
                <h3 className="font-bold text-[18px] md:text-[20px] text-sky-600 mb-4 flex items-center gap-2">
                    <GiSkills className="text-sky-600" /> Giới thiệu - Kinh nghiệm
                </h3>

                <div className="mb-4">
                    <p className="text-gray-600 font-medium mb-1 text-sm md:text-base">Giới thiệu: {user.gioiThieu}</p>
                </div>

                <div className="mb-4">
                    <p className="text-gray-600 font-medium mb-1 text-sm md:text-base">Quá trình đào tạo: {user.quaTrinhDaoTao}</p>
                </div>

                <div className="mb-4">
                    <p className="text-gray-600 font-medium mb-1 text-sm md:text-base">Kinh nghiệm làm việc: {user.kinhNghiemLamViec}</p>
                </div>

                <div className="mb-4">
                    <p className="text-gray-600 font-medium mb-1 text-sm md:text-base">Thành tích: {user.thanhTich}</p>
                </div>

                <div>
                    <p className="text-gray-600 font-medium mb-1 text-sm md:text-base">Chứng chỉ: {user.chungChi}</p>
                </div>
            </div>


            <div className="bg-white rounded-xl border shadow-sm p-4 md:p-6 border-gray-300">
                <h3 className="font-bold text-[18px] md:text-[20px] text-sky-600 mb-4 flex items-center gap-2">
                    <FaUserMd className="text-sky-600" /> Trạng thái làm việc
                </h3>

                <Line
                    label="Trạng thái"
                    value={
                        user.trangThaiCongViec ? (
                            <span className="text-green-600 font-semibold">Đang hoạt động</span>
                        ) : (
                            <span className="text-red-600 font-semibold">Tạm ngưng</span>
                        )
                    }
                />

                <Line label="Tổng lịch khám" value={user.tongLichKham ?? "Chưa có"} />
                <Line label="Lịch đã hoàn thành" value={user.lichDaHoanThanh ?? "Chưa có"} />
                <Line
                    label="Đánh giá trung bình"
                    value={user.danhGiaTrungBinh ?? "Chưa có đánh giá"}
                />
            </div>

            <button
                onClick={() => setIsEditing(true)}
                className="mt-2 ml-auto px-4 md:px-6 py-2 md:py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-semibold w-full sm:w-[220px] shadow transition"
            >
                Chỉnh sửa thông tin
            </button>
        </div>
    );
};

export default Infor;
