import React from "react";

export default function PatientViewModal({ patient, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 w-[500px] shadow-2xl">
                <h2 className="text-2xl font-semibold mb-6 text-center">
                    Thông tin bệnh nhân
                </h2>

                <div className="space-y-3 text-gray-700">
                    <p><b>ID:</b> {patient.nguoiDungID}</p>
                    <p><b>Họ tên:</b> {patient.hoTen}</p>
                    <p><b>Email:</b> {patient.email}</p>
                    <p><b>Số điện thoại:</b> {patient.soDienThoai}</p>
                    <p><b>Địa chỉ:</b> {patient.diaChi || "Chưa cập nhật"}</p>
                    <p><b>Ngày sinh:</b> {patient.ngaySinh}</p>
                    <p>
                        <b>Giới tính:</b>{" "}
                        {patient.gioiTinh === 1 ? "Nam" : "Nữ"}
                    </p>
                    <p>
                        <b>Trạng thái:</b>{" "}
                        {patient.trangThai ? "Hoạt động" : "Đã khóa"}
                    </p>
                    <p><b>Vai trò:</b> {patient.vaiTro}</p>
                    <p><b>Ngày tạo:</b> {patient.createdAt}</p>
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-100 cursor-pointer"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}
