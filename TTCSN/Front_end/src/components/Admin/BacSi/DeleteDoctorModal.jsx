import React from "react";

export default function DeleteDoctorModal({ item, onCancel, onConfirm }) {
    if (!item) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-[420px] animate-[fadeIn_0.2s_ease]">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Xác nhận xóa bác sĩ
                </h2>

                <p className="text-gray-600 mb-6">
                    Bạn có chắc chắn muốn xóa bác sĩ{" "}
                    <b>{item.hoTen}</b> (Mã: {item.bacSiID}) này không?
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-md transition cursor-pointer"
                    >
                        Xóa
                    </button>
                </div>
            </div>
        </div>
    );
}
