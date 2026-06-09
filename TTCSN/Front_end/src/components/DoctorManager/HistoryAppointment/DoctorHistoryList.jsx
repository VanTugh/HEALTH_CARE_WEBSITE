import React from "react";

const DoctorHistoryList = ({ histories, onViewDetail }) => {
    if (!histories || histories.length === 0) {
        return (
            <div className="text-center p-4 border border-gray-300 rounded-xl font-semibold">
                Hôm đó không có lịch khám
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {histories.map((h) => (
                <div
                    key={h.datLichID}
                    className="border p-3 flex justify-between items-end border-gray-300 rounded-xl"
                >
                    <div>
                        <p><strong>Bệnh nhân:</strong> {h.tenBenhNhan}</p>
                        <p><strong>SĐT:</strong> {h.sdtBenhNhan}</p>
                        <p><strong>Ngày khám:</strong> {h.ngayKham}</p>
                        <p><strong>Giờ khám:</strong> {h.gioKham}</p>
                        <p><strong>Lý do:</strong> {h.lyDoKham}</p>
                    </div>
                    <button
                        onClick={() => onViewDetail(h)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-[8px] cursor-pointer"
                    >
                        Xem chi tiết
                    </button>
                </div>
            ))}
        </div>
    );
};

export default DoctorHistoryList;
