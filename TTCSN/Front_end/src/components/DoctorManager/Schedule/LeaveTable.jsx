import React, { useState, useEffect } from "react";

export default function LeaveTable({ leaves, onEdit, onView, onDelete }) {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const totalPages = Math.ceil(leaves.length / pageSize);

    useEffect(() => {
        const newTotalPages = Math.ceil(leaves.length / pageSize) || 1;

        if (currentPage > newTotalPages) {
            setCurrentPage(newTotalPages);
        }
    }, [leaves, currentPage]);

    const pagedLeaves = leaves.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const formatNgayNghi = (value) => {
        if (!value) return "";
        if (value.startsWith("Ngày")) return value;
        const date = new Date(value);
        return `Ngày ${date.toLocaleDateString("vi-VN")}`;
    };

    return (
        <>
            <div className="overflow-x-auto bg-white shadow rounded-xl border border-gray-300">
                <table className="w-full border-collapse min-w-[800px] sm:min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-center border-r border-gray-300">
                                Ngày xin nghỉ
                            </th>
                            <th className="p-3 text-center border-r border-gray-300">
                                Lý do
                            </th>
                            <th className="p-3 text-center border-r border-gray-300">
                                Loại phép
                            </th>
                            <th className="p-3 text-center border-r border-gray-300">
                                Trạng thái
                            </th>
                            <th className="p-3 text-center">
                                Thao tác
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {pagedLeaves.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center p-4 text-gray-500">
                                    Không có yêu cầu nghỉ nào
                                </td>
                            </tr>
                        ) : (
                            pagedLeaves.map((l) => {
                                const isPending = l.moTaTrangThai === "Chờ duyệt";

                                return (
                                    <tr
                                        key={l.nghiID}
                                        className="border-t border-gray-300 hover:bg-gray-50"
                                    >
                                        <td className="p-3 text-center border-r border-gray-300 font-medium whitespace-nowrap">
                                            {formatNgayNghi(l.thoiGianNghi)}
                                        </td>

                                        <td className="p-3 text-center border-r border-gray-300 font-medium">
                                            {l.lyDo}
                                        </td>

                                        <td className="p-3 text-center border-r border-gray-300 font-medium whitespace-nowrap">
                                            {l.moTaLoaiPhep}
                                        </td>

                                        <td className="p-3 text-center border-r border-gray-300">
                                            <span
                                                className={`px-3 py-1.5 rounded-lg font-semibold text-xs sm:text-sm inline-flex min-w-[90px] justify-center
                                                            ${isPending ? "text-gray-500" : "text-white"}
                                                                                                            `}
                                                style={{ backgroundColor: l.mauSacTrangThai }}
                                            >
                                                {l.moTaTrangThai || "Chờ duyệt"}
                                            </span>
                                        </td>

                                        <td className="p-2 sm:p-3">
                                            <div className="flex flex-col gap-2 md:flex-row md:justify-center md:items-center">


                                                <button
                                                    onClick={() => onView?.(l)}
                                                    className="w-full md:w-auto px-2 py-1 bg-green-700 text-white rounded-md text-xs sm:text-sm hover:bg-green-700 cursor-pointer"
                                                >
                                                    Xem
                                                </button>


                                                {isPending && l.canEdit && (
                                                    <button
                                                        onClick={() => onEdit?.(l)}
                                                        className="w-full md:w-auto px-2 py-1 bg-blue-500 text-white rounded-md text-xs sm:text-sm hover:bg-blue-700 cursor-pointer"
                                                    >
                                                        Sửa
                                                    </button>
                                                )}


                                                {isPending && l.canCancel && (
                                                    <button
                                                        onClick={() => onDelete?.(l)}
                                                        className="w-full md:w-auto px-2 py-1 bg-red-600 text-white rounded-md text-xs sm:text-sm hover:bg-red-700 cursor-pointer"
                                                    >
                                                        Xóa
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center sm:justify-end mt-4">
                    <div className="flex flex-wrap gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
                            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                        >
                            {"<"}
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-3 py-1 border rounded border-gray-300 hover:bg-gray-100 ${currentPage === i + 1 ? "bg-blue-200" : ""
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((p) => p + 1)}
                            className="px-3 py-1 border rounded border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                        >
                            {">"}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
