// DoctorLeaveTable.jsx
import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";

export default function DoctorLeaveTable({ items, onView, onConfirm, onReject }) {
    const [page, setPage] = useState(0);
    const perPage = 7;
    const totalPage = Math.max(1, Math.ceil(items.length / perPage));
    const current = items.slice(page * perPage, page * perPage + perPage);

    useEffect(() => {
        const lastValidPage = Math.max(0, Math.ceil(items.length / perPage) - 1);
        if (page > lastValidPage) setPage(lastValidPage);
        if (items.length === 0 && page !== 0) setPage(0);
    }, [items, page]);

    return (
        <>
            <div className="overflow-x-auto border border-gray-300 rounded-2xl shadow-sm">
                <table className="w-full bg-white text-left min-w-[600px]">
                    <thead className="bg-gray-100 text-sm font-semibold text-gray-700">
                        <tr>
                            <th className="p-4 border-r border-gray-300 text-center">Tên bác sĩ</th>
                            <th className="p-4 border-r border-gray-300 text-center">Chuyên khoa</th>
                            <th className="p-4 border-r border-gray-300 text-center">Thời gian nghỉ</th>
                            <th className="p-4 border-r border-gray-300 text-center">Lý do</th>
                            <th className="p-4 text-center ">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {current.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-6 text-gray-500">
                                    Chưa có đơn xin nghỉ nào
                                </td>
                            </tr>
                        ) : (
                            current.map((item, i) => (
                                <tr
                                    key={item.nghiID ?? page * perPage + i}
                                    className="hover:bg-[#fdf8f5] transition"
                                >
                                    <td className="p-4 font-medium border-r border-gray-300 text-center">{item.tenBacSi}</td>
                                    <td className="p-4 border-r border-gray-300 text-center">{item.tenChuyenKhoa}</td>
                                    <td className="p-4 border-r border-gray-300 text-center">{item.thoiGianNghi}</td>
                                    <td className="p-4 border-r border-gray-300 text-center">{item.lyDo}</td>
                                    <td className="p-4 text-center">
                                        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center sm:items-center">
                                            <button
                                                onClick={() => onView(page * perPage + i)}
                                                className="w-full sm:w-auto px-2 py-1 bg-blue-500 text-white rounded-lg text-xs sm:text-sm hover:bg-blue-700 cursor-pointer"
                                            >
                                                Xem
                                            </button>
                                            <button
                                                onClick={() => onConfirm(page * perPage + i)}
                                                className="w-full sm:w-auto px-2 py-1 bg-green-600 text-white rounded-lg text-xs sm:text-sm hover:bg-green-700 cursor-pointer"
                                            >
                                                Duyệt
                                            </button>
                                            <button
                                                onClick={() => onReject(page * perPage + i)}
                                                className="w-full sm:w-auto px-2 py-1 bg-red-600 text-white rounded-lg text-xs sm:text-sm hover:bg-red-700 cursor-pointer"
                                            >
                                                Từ chối
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {totalPage > 1 && (
                <div className="flex justify-end mt-4">
                    <ReactPaginate
                        previousLabel={"<"}
                        nextLabel={">"}
                        pageCount={totalPage}
                        forcePage={page}
                        onPageChange={(e) => setPage(e.selected)}
                        containerClassName="flex gap-2 flex-wrap"
                        pageClassName="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer"
                        activeClassName="bg-[#a35a37] text-white border-[#a35a37]"
                        previousClassName="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer"
                        nextClassName="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer"
                        disabledClassName="opacity-40 cursor-not-allowed"
                    />
                </div>
            )}
        </>
    );
}
