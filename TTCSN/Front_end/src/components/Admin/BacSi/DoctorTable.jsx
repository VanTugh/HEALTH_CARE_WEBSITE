import React from "react";
import { Eye, Edit, Trash, RotateCw } from "lucide-react";
import ReactPaginate from "react-paginate";

export default function DoctorsTable({
    items,
    onView,
    onEdit,
    onDelete,
    onRestore,
    page,
    setPage,
    totalPages,
}) {
    const handlePageChange = ({ selected }) => {
        setPage(selected);
    };

    return (
        <>
            <div className="overflow-x-auto border border-gray-200 rounded-2xl shadow-sm">
                <table className="w-full bg-white text-sm md:text-base">
                    <thead className="bg-gray-100 text-gray-700 font-semibold">
                        <tr>
                            <th className="p-3 md:p-4 text-left">Tên bác sĩ</th>
                            <th className="p-3 md:p-4 text-left">Chuyên khoa</th>
                            <th className="p-3 md:p-4 text-left">Số điện thoại</th>
                            <th className="p-3 md:p-4 text-center">Trạng thái</th>
                            <th className="p-3 md:p-4 text-center">Thao tác</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="py-6 text-center text-gray-500 text-sm">
                                    Không tìm thấy bác sĩ
                                </td>
                            </tr>
                        ) : (
                            items.map((item) => (
                                <tr key={item.bacSiID} className="hover:bg-[#fdf8f5] transition">
                                    <td className="p-2 md:p-4 font-medium text-gray-800">
                                        {item.hoTen}
                                    </td>

                                    <td className="p-2 md:p-4 text-gray-600">
                                        {item.tenChuyenKhoa}
                                    </td>

                                    <td className="p-2 md:p-4 text-gray-600">
                                        {item.soDienThoai}
                                    </td>

                                    <td className="p-2 md:p-4 text-center">
                                        <span
                                            className={`inline-flex items-center justify-center
                                            whitespace-nowrap
                                            px-2 py-1
                                            text-xs md:text-sm
                                            rounded-lg font-medium text-white
                                            ${item.trangThaiCongViec
                                                    ? "bg-green-600"
                                                    : "bg-red-600"
                                                }`}
                                        >
                                            {item.trangThaiCongViec
                                                ? "Hoạt động"
                                                : "Ngưng hoạt động"}
                                        </span>
                                    </td>

                                    <td className="p-2 md:p-4 text-center">
                                        <div className="flex justify-center gap-2 md:gap-3">
                                            <button
                                                onClick={() => onView(item)}
                                                className="text-blue-500 hover:text-sky-700 transition cursor-pointer"
                                            >
                                                <Eye size={16} />
                                            </button>

                                            <button
                                                onClick={() => onEdit(item)}
                                                className="text-[#ad7555] hover:text-[#945f46] transition cursor-pointer"
                                            >
                                                <Edit size={16} />
                                            </button>

                                            {item.deleted ? (
                                                <button
                                                    onClick={() => onRestore(item)}
                                                    className="text-green-500 hover:text-green-700 transition cursor-pointer"
                                                >
                                                    <RotateCw size={16} />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => onDelete(item)}
                                                    className="text-red-500 hover:text-red-700 transition"
                                                >
                                                    <Trash size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-end mt-4 md:mt-6 text-sm">
                    <ReactPaginate
                        previousLabel={"<"}
                        nextLabel={">"}
                        pageCount={totalPages}
                        onPageChange={handlePageChange}
                        containerClassName="flex gap-1 md:gap-2"
                        pageClassName="px-2 md:px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer"
                        activeClassName="bg-[#a35a37] text-white border-[#a35a37]"
                        previousClassName="px-2 md:px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer"
                        nextClassName="px-2 md:px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer"
                        disabledClassName="opacity-40 cursor-not-allowed"
                        forcePage={page}
                    />
                </div>
            )}
        </>
    );
}
