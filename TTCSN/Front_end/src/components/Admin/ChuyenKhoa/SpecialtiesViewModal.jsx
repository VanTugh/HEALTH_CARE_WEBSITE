import React from "react";

export default function SpecialtiesViewModal({ item, onClose, onEdit }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-[500px] animate-[fadeIn_0.25s_ease]">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
                    Chi tiết chuyên khoa
                </h2>


                <div className="space-y-3 text-gray-700 mb-6">
                    <p>
                        <b>Mã chuyên khoa:</b> {item.chuyenKhoaID}
                    </p>
                    <p>
                        <b>Tên chuyên khoa:</b> {item.tenChuyenKhoa}
                    </p>
                    <p>
                        <b>Mô tả:</b> {item.moTa}
                    </p>
                    {item.anhDaiDien && (
                        <div className="mt-3">
                            <img
                                src={item.anhDaiDien}
                                alt={item.tenChuyenKhoa}
                                className="w-full h-40 object-contain rounded-md border"
                            />
                        </div>
                    )}
                </div>


                <div className="flex justify-end mt-6 space-x-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-100 transition shadow-sm cursor-pointer"
                    >
                        Đóng
                    </button>
                    <button
                        onClick={() => {
                            onClose();
                            onEdit(item);
                        }}
                        className="px-5 py-2.5 bg-[#ad7555] hover:bg-[#945f46] text-white rounded-xl transition shadow-sm cursor-pointer"
                    >
                        Sửa thông tin
                    </button>
                </div>
            </div>
        </div>
    );
}
