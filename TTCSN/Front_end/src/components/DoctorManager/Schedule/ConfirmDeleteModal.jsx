import React from "react";

export default function ConfirmDeleteModal({ leave, onCancel, onConfirm }) {
    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 shadow-lg">
            <div className="bg-white rounded-xl shadow-lg p-6 w-[350px]">
                <h2 className="text-lg font-semibold mb-4 text-center">
                    Xác nhận xóa
                </h2>
                <p className="mb-4 text-center">
                    Bạn có chắc muốn xóa yêu cầu nghỉ: <strong>{leave.thoiGianNghi}</strong>?
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 cursor-pointer"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
                    >
                        Xóa
                    </button>
                </div>
            </div>
        </div>
    );
}
