import React, { useState, useEffect } from "react";
import { Edit, Trash, Eye } from "lucide-react";
import ReactPaginate from "react-paginate";

export default function TrinhDoTable({ items, onView, onEdit, onDelete }) {
    const [page, setPage] = useState(0);
    const perPage = 7;


    // const totalPage = Math.max(1, Math.ceil(items.length / perPage));
    const current = items.slice(page * perPage, page * perPage + perPage);


    useEffect(() => {
        const lastValidPage = Math.max(0, Math.ceil(items.length / perPage) - 1);
        if (page > lastValidPage) {
            setPage(lastValidPage);
        }

        if (items.length === 0 && page !== 0) {
            setPage(0);
        }
    }, [items, page, perPage]);

    return (
        <>
            <div className="overflow-x-auto border border-gray-300 rounded-2xl shadow-sm">
                <table className="w-full bg-white text-left">
                    <thead className="bg-gray-100 text-sm font-semibold text-gray-700">
                        <tr>
                            <th className="p-4">TÊN TRÌNH ĐỘ</th>
                            <th className="p-4">MÔ TẢ</th>
                            <th className="p-4">GIÁ KHÁM</th>
                            <th className="p-4">ƯU TIÊN THỨ TỰ</th>
                            <th className="p-4 text-center">THAO TÁC</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        {current.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-6 text-gray-500">
                                    Không tìm thấy dữ liệu
                                </td>
                            </tr>
                        ) : (
                            current.map((item, i) => (

                                <tr key={item.trinhDoID ?? page * perPage + i} className="hover:bg-[#fdf8f5] transition">
                                    <td className="p-4 font-medium text-gray-800">
                                        {item.tenTrinhDo}
                                    </td>

                                    <td className="p-4 text-gray-600">
                                        {item.moTa}
                                    </td>

                                    <td className="p-4 text-gray-600">
                                        {item.giaKham?.toLocaleString()} vnđ
                                    </td>

                                    <td className="p-4 text-gray-600">
                                        {item.thuTuUuTien}
                                    </td>

                                    <td className="p-4 text-center">
                                        <div className="flex justify-center gap-3">
                                            <button
                                                onClick={() => onView(page * perPage + i)}
                                                className="text-blue-500 hover:text-blue-700 transition cursor-pointer"
                                            >
                                                <Eye size={18} />
                                            </button>

                                            <button
                                                onClick={() => onEdit(page * perPage + i)}
                                                className="text-[#ad7555] hover:text-[#945f46] transition cursor-pointer"
                                            >
                                                <Edit size={18} />
                                            </button>

                                            <button
                                                onClick={() => onDelete(page * perPage + i)}
                                                className="text-red-500 hover:text-red-700 transition cursor-pointer"
                                            >
                                                <Trash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {Math.ceil(items.length / perPage) > 1 && (
                <div className="flex justify-end">
                    <ReactPaginate
                        previousLabel={"<"}
                        nextLabel={">"}
                        pageCount={Math.ceil(items.length / perPage)}
                        forcePage={page}
                        onPageChange={(e) => setPage(e.selected)}
                        containerClassName="flex gap-2 mt-6"
                        pageClassName="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                        activeClassName="bg-[#a35a37] text-white border-[#a35a37]"
                        previousClassName="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                        nextClassName="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                        disabledClassName="opacity-40 cursor-not-allowed"
                    />
                </div>
            )}
        </>
    );
}
