import React from "react";

export default function DeleteScheduleModal({ slot, onCancel, onConfirm }) {
    if (!slot) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-[400px]">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                    Xác nhận xóa ca khám
                </h2>

                <p className="text-gray-600 mb-5">
                    Bạn có chắc chắn muốn xóa ca khám lúc{" "}
                    <b>{slot.time}</b> – <b>{slot.dayLabel}</b> không?
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                        Xóa
                    </button>
                </div>
            </div>
        </div>
    );
}
