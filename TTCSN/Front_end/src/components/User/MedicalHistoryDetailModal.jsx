export default function MedicalHistoryDetailModal({ data, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/40 bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-lg p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-black cursor-pointer"
                >
                    ✕
                </button>

                <h3 className="text-lg font-semibold mb-4">
                    Chi tiết lịch khám
                </h3>

                <div className="space-y-2 text-sm">
                    <p><b>Bác sĩ:</b> {data.tenBacSi}</p>
                    <p><b>Chuyên khoa:</b> {data.tenChuyenKhoa}</p>
                    <p><b>Trình độ:</b> {data.tenTrinhDo}</p>
                    <p><b>Thời gian khám:</b> {data.thoiGianKhamDisplay}</p>
                    <p><b>Lý do khám:</b> {data.lyDoKham}</p>

                    <hr className="border-b border-gray-300" />

                    <p><b>Chẩn đoán:</b> {data.chanDoan}</p>
                    <p><b>Kết quả khám:</b> {data.ketQuaKham}</p>

                    <div>
                        <b>Đơn thuốc:</b>
                        <pre className="bg-gray-50 p-2 rounded mt-1 whitespace-pre-wrap">
                            {data.donThuoc}
                        </pre>
                    </div>

                    <p><b>Lời dặn bác sĩ:</b> {data.loiDanBacSi}</p>
                    <p><b>Ngày tái khám:</b> {data.ngayTaiKham}</p>
                </div>
            </div>
        </div>
    );
}
