import React, { useState } from "react";
import { Eye } from "lucide-react";
import ReactPaginate from "react-paginate";

export default function PatientTableWithPagination({ items = [], onView }) {
    const [pageNumber, setPageNumber] = useState(0);

    const itemsPerPage = 7;
    const pagesVisited = pageNumber * itemsPerPage;
    const currentItems = items.slice(pagesVisited, pagesVisited + itemsPerPage);
    const pageCount = Math.ceil(items.length / itemsPerPage);

    return (
        <>
            <div className="border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] bg-white">
                        <thead className="bg-gray-100 text-gray-700 border-b border-gray-300">
                            <tr className="text-xs sm:text-sm">
                                <th className="p-3 sm:p-4 text-left whitespace-nowrap">
                                    Họ tên
                                </th>
                                <th className="p-3 sm:p-4 text-left whitespace-nowrap">
                                    Email
                                </th>
                                <th className="p-3 sm:p-4 text-left whitespace-nowrap">
                                    SĐT
                                </th>
                                <th className="p-3 sm:p-4 text-left whitespace-nowrap hidden md:table-cell">
                                    Địa chỉ
                                </th>
                                <th className="p-3 sm:p-4 text-center whitespace-nowrap">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {currentItems.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="py-6 text-center text-gray-500 text-sm"
                                    >
                                        Không có bệnh nhân
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((p) => (
                                    <tr
                                        key={p.nguoiDungID}
                                        className="hover:bg-[#fdf8f5] transition text-xs sm:text-sm"
                                    >
                                        <td className="p-3 sm:p-4 font-medium text-gray-800 whitespace-nowrap">
                                            {p.hoTen}
                                        </td>

                                        <td
                                            className="p-3 sm:p-4 text-gray-600 
                                            max-w-[220px] truncate"
                                            title={p.email}
                                        >
                                            {p.email}
                                        </td>

                                        <td className="p-3 sm:p-4 text-gray-600 whitespace-nowrap">
                                            {p.soDienThoai}
                                        </td>

                                        <td
                                            className="p-3 sm:p-4 text-gray-600 
                                            hidden md:table-cell 
                                            max-w-[260px] truncate"
                                            title={p.diaChi}
                                        >
                                            {p.diaChi || "—"}
                                        </td>

                                        <td className="p-3 sm:p-4 text-center">
                                            <button
                                                onClick={() => onView(p)}
                                                className="inline-flex items-center justify-center
                                                w-8 h-8 sm:w-9 sm:h-9
                                                rounded-full text-blue-600
                                                hover:bg-blue-100 transition cursor-pointer"
                                            >
                                                <Eye size={16} className="sm:size-[18px]" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {pageCount > 1 && (
                <div className="flex justify-center sm:justify-end mt-4 text-sm">
                    <ReactPaginate
                        previousLabel={"<"}
                        nextLabel={">"}
                        pageCount={pageCount}
                        onPageChange={({ selected }) =>
                            setPageNumber(selected)
                        }
                        containerClassName="flex items-center gap-1"
                        pageClassName="px-2 sm:px-3 py-1 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100"
                        activeClassName="bg-[#a35a37] text-white border-[#a35a37]"
                        previousClassName="px-2 sm:px-3 py-1 border border-gray-300 rounded-lg cursor-pointer"
                        nextClassName="px-2 sm:px-3 py-1 border border-gray-300 rounded-lg cursor-pointer"
                        disabledClassName="opacity-40 cursor-not-allowed"
                    />
                </div>
            )}
        </>
    );
}
