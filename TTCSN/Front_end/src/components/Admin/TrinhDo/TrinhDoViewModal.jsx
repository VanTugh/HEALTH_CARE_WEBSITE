import React from "react";

export default function TrinhDoViewModal({ item, onClose, onEdit }) {
    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/40 z-50">
            <div className="bg-white p-8 rounded-2xl w-[450px] shadow-xl">
                <h2 className="text-2xl font-semibold mb-6 text-center">Chi tiết trình độ</h2>

                <p><b>TrinhDoID:</b> {item.trinhDoID}</p>
                <p><b>Tên trình độ:</b> {item.tenTrinhDo}</p>
                <p><b>Mô tả:</b> {item.moTa}</p>
                <p><b>Thứ tự ưu tiên:</b> {item.thuTuUuTien}</p>
                <div className="flex justify-end mt-6 gap-3">
                    <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-300">
                        Đóng
                    </button>
                    <button
                        onClick={() => { onClose(); onEdit(item); }}
                        className="px-4 py-2 bg-[#ad7555] text-white rounded-lg cursor-pointer hover:bg-[#945f46]"
                    >
                        Sửa
                    </button>
                </div>
            </div>
        </div>
    );
}

