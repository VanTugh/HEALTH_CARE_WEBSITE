import React from "react";
import { specialties } from "../ChuyenKhoa/SpecialtiesData";

export default function ServicesViewModal({ item, onClose, onEdit }) {
    const specialty = specialties.find((s) => s.id === item.specialtyId);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-[500px] animate-[fadeIn_0.25s_ease]">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
                    Chi tiết dịch vụ khám
                </h2>


                <div className="space-y-3 text-gray-700 mb-6">
                    <p>
                        <b>Mã dịch vụ:</b> {item.id}
                    </p>
                    <p>
                        <b>Tên dịch vụ:</b> {item.name}
                    </p>
                    <p>
                        <b>Giá:</b> {item.price.toLocaleString()} VND
                    </p>
                    <p>
                        <b>Thời gian khám:</b> {item.duration} phút
                    </p>
                    {specialty && (
                        <p>
                            <b>Chuyên khoa liên quan:</b> {specialty.name}
                        </p>
                    )}
                </div>


                <div className="flex justify-end mt-6 space-x-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-100 transition shadow-sm"
                    >
                        Đóng
                    </button>
                    <button
                        onClick={() => {
                            onClose();
                            onEdit(item);
                        }}
                        className="px-5 py-2.5 bg-[#ad7555] hover:bg-[#945f46] text-white rounded-xl transition shadow-sm"
                    >
                        Sửa thông tin
                    </button>
                </div>
            </div>
        </div>
    );
}
