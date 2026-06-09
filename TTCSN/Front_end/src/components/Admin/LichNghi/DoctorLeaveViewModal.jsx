// DoctorLeaveViewModal.jsx
import React from "react";

export default function DoctorLeaveViewModal({ item, onClose, onConfirm, onReject }) {
    if (!item) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/40 z-50">
            <div className="bg-white p-6 rounded-2xl w-[500px] max-h-[90vh] overflow-y-auto shadow-xl">
                <h2 className="text-2xl font-semibold mb-4 text-center">Chi tiết lịch nghỉ</h2>

                <div className="flex flex-col gap-2">
                    <p><b>Tên bác sĩ:</b> {item.tenBacSi}</p>
                    <p><b>Avatar:</b> <img src={item.avatarBacSi} alt="avatar" className="w-12 h-12 rounded-full" /></p>
                    <p><b>Chuyên khoa:</b> {item.tenChuyenKhoa}</p>
                    <p><b>Trình độ:</b> {item.trinhDo}</p>
                    <p><b>Loại nghỉ:</b> {item.moTaLoaiNghi}</p>
                    <p><b>Thời gian nghỉ:</b> {item.thoiGianNghi}</p>
                    <p><b>Lý do:</b> {item.lyDo}</p>
                    <p><b>Loại phép:</b> {item.moTaLoaiPhep}</p>
                    <p><b>Số ngày phép còn lại:</b> {item.soNgayPhepConLai}</p>
                    {item.hasAttachment && (
                        <p>
                            <b>File đính kèm:</b>{" "}
                            <a href={item.fileDinhKem} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                                Xem file
                            </a>
                        </p>
                    )}
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 cursor-pointer">
                        Đóng
                    </button>
                    <button onClick={() => onConfirm(item)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer">
                        Xác nhận
                    </button>
                    <button onClick={() => onReject(item)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer">
                        Từ chối
                    </button>
                </div>
            </div>
        </div>
    );
}
