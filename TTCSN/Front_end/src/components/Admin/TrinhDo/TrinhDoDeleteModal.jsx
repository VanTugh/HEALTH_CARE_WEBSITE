import React from "react";

export default function TrinhDoDeleteModal({ item, onCancel, onConfirm }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
            <div className="bg-white p-6 rounded-2xl w-[380px] shadow-xl">
                <h2 className="text-lg font-semibold mb-4">
                    Xác nhận xóa trình độ
                </h2>

                <p className="mb-6 text-gray-600">
                    Bạn có chắc muốn xóa <b>{item.tenTrinhDo}</b> không?
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-300"
                    >
                        Hủy
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg cursor-pointer hover:bg-red-600"
                    >
                        Xóa
                    </button>
                </div>
            </div>
        </div>
    );
}
