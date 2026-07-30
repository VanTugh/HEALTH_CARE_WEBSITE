import React from "react";

const STATUS_CONFIG = {
    CHO_XAC_NHAN_BAC_SI: { label: "Chờ bác sĩ xác nhận", color: "bg-orange-500" },
    TU_CHOI: { label: "Bác sĩ từ chối", color: "bg-red-600" },
    CHO_THANH_TOAN: { label: "Chờ thanh toán", color: "bg-cyan-500" },
    DA_XAC_NHAN: { label: "Đã xác nhận", color: "bg-green-600" },
    DA_XAC_NHAN_CHO_THANH_TOAN: { label: "Đã xác nhận chờ thanh toán", color: "bg-green-800" },
    DANG_KHAM: { label: "Đang khám", color: "bg-yellow-600" },
    HOAN_THANH: { label: "Hoàn thành", color: "bg-green-700" },
    HUY_BOI_BENH_NHAN: { label: "Hủy bởi bệnh nhân", color: "bg-yellow-500" },
    HUY_BOI_BAC_SI: { label: "Hủy bởi bác sĩ", color: "bg-orange-600" },
    HUY_BOI_ADMIN: { label: "Hủy bởi admin", color: "bg-gray-400" },
    KHONG_DEN: { label: "Không đến", color: "bg-pink-600" },
    QUA_HAN: { label: "Quá hạn", color: "bg-amber-800" },
};

const ConfirmedTable = ({ bookings, onCheckIn, onCompleteClick }) => {
    console.log(bookings)
    return (
        <div className="overflow-x-auto border rounded-xl shadow border-gray-300">
            <table className="w-full min-w-[600px] border-collapse text-center">
                <thead>
                    <tr className="bg-gray-100 text-xs sm:text-sm">
                        <th className="p-2 sm:p-3 border border-gray-300">Tên khách hàng</th>
                        <th className="p-2 sm:p-3 border border-gray-300">Ngày khám</th>
                        <th className="p-2 sm:p-3 border border-gray-300">Giờ</th>
                        <th className="p-2 sm:p-3 border border-gray-300">Trạng thái</th>
                        <th className="p-2 sm:p-3 border border-gray-300">Thao tác</th>
                    </tr>
                </thead>

                <tbody className="text-xs sm:text-sm">
                    {bookings.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="p-4 text-gray-500 border border-gray-300">
                                Lịch hẹn đang trống
                            </td>
                        </tr>
                    ) : (
                        bookings.map((item) => {
                            const status = STATUS_CONFIG[item.trangThai];
                            const canCheckIn =
                                item.trangThai === "DA_XAC_NHAN" ||
                                item.trangThai === "DA_XAC_NHAN_CHO_THANH_TOAN";
                            const canComplete = item.trangThai === "DANG_KHAM";

                            return (
                                <tr key={item.id} className="hover:bg-gray-50 transition">
                                    <td className="p-2 sm:p-3 border border-gray-300 whitespace-nowrap">
                                        {item.tenKhachHang}
                                    </td>

                                    <td className="p-2 sm:p-3 border border-gray-300 whitespace-nowrap">
                                        {item.ngayKham}
                                    </td>

                                    <td className="p-2 sm:p-3 border border-gray-300">
                                        {item.gioBatDau?.slice(0, 5)}
                                    </td>

                                    <td className="p-2 sm:p-3 border border-gray-300">
                                        {status ? (
                                            <span
                                                className={`${status.color} text-white px-2 py-1 rounded-md
                                                text-[10px] sm:text-xs whitespace-nowrap`}
                                            >
                                                {status.label}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 text-xs">Không xác định</span>
                                        )}
                                    </td>

                                    <td className="p-2 sm:p-3 border border-gray-300">
                                        <div className="flex flex-col sm:flex-row justify-center gap-2">
                                            <button
                                                disabled={!canCheckIn}
                                                onClick={() => canCheckIn && onCheckIn(item.id)}
                                                className={`px-2 py-1 rounded-md text-[10px] sm:text-xs
                                                    ${canCheckIn
                                                        ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                    }`}
                                            >
                                                Check-in
                                            </button>

                                            <button
                                                disabled={!canComplete}
                                                onClick={() => canComplete && onCompleteClick(item)}
                                                className={`px-2 py-1 rounded-md text-[10px] sm:text-xs
                                                    ${canComplete
                                                        ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                    }`}
                                            >
                                                Hoàn thành
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ConfirmedTable;
