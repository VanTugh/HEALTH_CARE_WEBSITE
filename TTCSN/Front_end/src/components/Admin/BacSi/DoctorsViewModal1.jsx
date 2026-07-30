import React from "react";

export default function DoctorsViewModal({ item, onClose, onEdit, specialties = [], degrees = [] }) {
    const specialty = specialties.find((s) => Number(s.chuyenKhoaID) === Number(item.chuyenKhoaID));
    const degree = degrees.find((d) => Number(d.trinhDoID) === Number(item.trinhDoID));

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-[500px] animate-[fadeIn_0.25s_ease]">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
                    Chi tiết bác sĩ
                </h2>

                <div className="space-y-3 text-gray-700 mb-6">
                    <p><b>Mã bác sĩ:</b> {item.bacSiID}</p>
                    <p><b>Họ tên:</b> {item.hoTen}</p>
                    <p><b>Mô tả:</b> {item.gioiThieu || "Chưa có mô tả"}</p>
                    <p><b>Trình độ:</b> {degree?.tenTrinhDo || "Không xác định"}</p>
                    <p><b>Số năm kinh nghiệm:</b> {item.soNamKinhNghiem || 0}</p>
                    <p><b>Số điện thoại:</b> {item.soDienThoai || "Chưa có"}</p>
                    <p>
                        <b>Trạng thái:</b>{" "}
                        <span className={`${item.trangThaiCongViec ? "text-green-600" : "text-red-600"} font-medium`}>
                            {item.trangThaiCongViec ? "Hoạt động" : "Ngưng"}
                        </span>
                    </p>
                    <p><b>Chuyên khoa:</b> {specialty?.tenChuyenKhoa || "Không xác định"}</p>
                    <p><b>Giá khám:</b> {item.giaKham ? item.giaKham.toLocaleString("vi-VN") + " VNĐ" : "Chưa có"}</p>
                    <p><b>Số bệnh nhân tối đa / ngày:</b> {item.soBenhNhanToiDaMotNgay || 0}</p>
                    <p><b>Thời gian khám / ca:</b> {item.thoiGianKhamMotCa || 0} phút</p>
                </div>

                <div className="flex justify-end mt-6 space-x-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-100 transition shadow-sm cursor-pointer"
                    >
                        Đóng
                    </button>
                    <button
                        onClick={() => { onClose(); onEdit(item); }}
                        className="px-5 py-2.5 bg-[#ad7555] hover:bg-[#945f46] text-white rounded-xl transition shadow-sm cursor-pointer"
                    >
                        Sửa thông tin
                    </button>
                </div>
            </div>
        </div>
    );
}
