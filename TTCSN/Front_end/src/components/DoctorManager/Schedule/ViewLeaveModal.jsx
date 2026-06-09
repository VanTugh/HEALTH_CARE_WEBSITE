import React from "react";

export default function ViewLeaveModal({ leave, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 shadow-lg">
            <div className="bg-white rounded-xl shadow-lg p-6 w-[400px] max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4 text-center">
                    Chi tiết yêu cầu nghỉ
                </h2>
                <div className="flex flex-col gap-2">
                    <p>
                        <strong>Thời gian nghỉ:</strong> {leave.thoiGianNghi}
                    </p>
                    <p>
                        <strong>Lý do:</strong> {leave.lyDo}
                    </p>
                    <p>
                        <strong>Loại phép:</strong> {leave.moTaLoaiPhep}
                    </p>
                    <p>
                        <strong>Trạng thái:</strong> {leave.moTaTrangThai}
                    </p>
                    {leave.fileDinhKem && (
                        <p>
                            <strong>File đính kèm:</strong>{" "}
                            <a
                                href={leave.fileDinhKem}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                            >
                                Link
                            </a>
                        </p>
                    )}
                </div>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 cursor-pointer"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}
