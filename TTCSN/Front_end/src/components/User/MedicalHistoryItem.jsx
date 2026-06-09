export default function MedicalHistoryItem({ data, onViewDetail }) {
    return (
        <div className="border border-gray-300 rounded-lg p-4 bg-white flex justify-between items-center">
            <div>
                <p className="text-sm text-gray-500">{data.ngayKham}</p>
                <p className="font-semibold">{data.tenBacSi}</p>
                <p className="text-sm text-gray-600">{data.tenChuyenKhoa}</p>

                <span className="inline-block mt-1 px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                    Đã khám
                </span>
            </div>

            <button
                onClick={onViewDetail}
                className="text-blue-600 text-sm hover:underline cursor-pointer"
            >
                Xem chi tiết
            </button>
        </div>
    );
}
