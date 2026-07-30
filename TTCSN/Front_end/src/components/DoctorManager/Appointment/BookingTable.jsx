import React, { useState } from "react";

const BookingTable = ({ bookings, onConfirm, onReject }) => {
    const [processingIds, setProcessingIds] = useState(new Set());
    console.log(bookings)
    const trangThaiMap = {
        CHO_XAC_NHAN_BAC_SI: {
            label: "Chờ bác sĩ xác nhận",
            color: "bg-yellow-500",
            canHandle: true,
        },
        CHO_THANH_TOAN: {
            label: "Chờ thanh toán",
            color: "bg-blue-500",
            canHandle: true,
        },
        DA_XAC_NHAN: {
            label: "Đã xác nhận",
            color: "bg-green-600",
            canHandle: false,
        },
        DANG_KHAM: {
            label: "Đang khám",
            color: "bg-yellow-500",
            canHandle: false,
        },
        HOAN_THANH: {
            label: "Hoàn thành",
            color: "bg-green-600",
            canHandle: false,
        },
        TU_CHOI: {
            label: "Đã từ chối",
            color: "bg-red-600",
            canHandle: false,
        },
        DA_XAC_NHAN_CHO_THANH_TOAN: {
            label: "Đã xác nhận chờ thanh toán",
            color: "bg-green-800",
            canHandle: false,
        },
    };

    const handleConfirm = async (id) => {
        setProcessingIds(prev => new Set(prev).add(id));
        try {
            await onConfirm(id);
        } finally {
            setProcessingIds(prev => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        }
    };

    const handleReject = async (id) => {
        setProcessingIds(prev => new Set(prev).add(id));
        try {
            await onReject(id);
        } finally {
            setProcessingIds(prev => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        }
    };

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-300 shadow-md">
            <table className="w-full min-w-[600px] border-collapse text-center">
                <thead>
                    <tr className="bg-gray-100 text-xs sm:text-sm">
                        <th className="p-2 sm:p-3 border border-gray-300">
                            Tên khách hàng
                        </th>
                        <th className="p-2 sm:p-3 border border-gray-300">
                            Ngày khám
                        </th>
                        <th className="p-2 sm:p-3 border border-gray-300">
                            Giờ bắt đầu
                        </th>
                        <th className="p-2 sm:p-3 border border-gray-300">
                            Trạng thái
                        </th>
                        <th className="p-2 sm:p-3 border border-gray-300">
                            Thao tác
                        </th>
                    </tr>
                </thead>

                <tbody className="text-xs sm:text-sm">
                    {bookings.length === 0 ? (
                        <tr>
                            <td
                                colSpan="5"
                                className="text-center p-4 text-gray-500 border border-gray-300"
                            >
                                Lịch chờ đang
                            </td>
                        </tr>
                    ) : (
                        bookings.map((item) => {
                            const trangThai =
                                trangThaiMap[item.trangThai] || {
                                    label: item.trangThai,
                                    color: "bg-gray-400",
                                    canHandle: false,
                                };

                            const isProcessing = processingIds.has(item.id);
                            const disableAction =
                                !trangThai.canHandle || isProcessing;

                            return (
                                <tr
                                    key={item.id}
                                    className="hover:bg-gray-50 transition"
                                >
                                    <td className="p-2 sm:p-3 border border-gray-300 whitespace-nowrap">
                                        {item.tenKhachHang}
                                    </td>

                                    <td className="p-2 sm:p-3 border border-gray-300 whitespace-nowrap">
                                        {item.ngayKham}
                                    </td>

                                    <td className="p-2 sm:p-3 border border-gray-300">
                                        {item.gioBatDau.slice(0, 5)}
                                    </td>

                                    <td className="p-2 sm:p-3 border border-gray-300">
                                        <span
                                            className={`px-2 py-1 rounded-md font-medium text-white text-[10px] sm:text-xs whitespace-nowrap ${trangThai.color}`}
                                        >
                                            {trangThai.label}
                                        </span>
                                    </td>

                                    <td className="p-2 sm:p-3 border border-gray-300">
                                        <div className="flex flex-col sm:flex-row justify-center gap-2">
                                            <button
                                                onClick={() =>
                                                    handleConfirm(item.id)
                                                }
                                                disabled={disableAction}
                                                className={`px-2 py-1 rounded-md text-white text-[10px] sm:text-xs shadow
                                                    ${disableAction
                                                        ? "bg-gray-400 cursor-not-allowed"
                                                        : "bg-green-600 hover:bg-green-700 cursor-pointer"
                                                    }`}
                                            >
                                                {isProcessing
                                                    ? "Đang xử lý..."
                                                    : "Xác nhận"}
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleReject(item.id)
                                                }
                                                disabled={disableAction}
                                                className={`px-2 py-1 rounded-md text-white text-[10px] sm:text-xs shadow
                                                    ${disableAction
                                                        ? "bg-gray-400 cursor-not-allowed"
                                                        : "bg-red-600 hover:bg-red-700 cursor-pointer"
                                                    }`}
                                            >
                                                {isProcessing
                                                    ? "Đang xử lý..."
                                                    : "Từ chối"}
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

export default BookingTable;
