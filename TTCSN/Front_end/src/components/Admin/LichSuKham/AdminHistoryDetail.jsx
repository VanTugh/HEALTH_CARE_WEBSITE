import React from "react";

const AdminHistoryDetail = ({ history, onClose }) => {
    if (!history) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded-2xl w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between">
                    <h2 className="text-xl font-bold mb-4">Chi tiết lịch khám</h2>
                    <button
                        onClick={onClose}
                        className="mb-4 px-3 py-1 border border-gray-300 rounded cursor-pointer hover:bg-gray-100"
                    >
                        Đóng
                    </button>
                </div>

                <div className="space-y-2">
                    <p><strong>Mã xác nhận:</strong> {history.maXacNhan}</p>
                    <p><strong>Bác sĩ:</strong> {history.tenBacSi} - {history.tenTrinhDo}</p>
                    <p><strong>Chuyên khoa:</strong> {history.tenChuyenKhoa}</p>
                    <p><strong>Bệnh nhân:</strong> {history.tenBenhNhan}</p>
                    <p><strong>SĐT:</strong> {history.sdtBenhNhan}</p>
                    <p><strong>Email:</strong> {history.emailBenhNhan}</p>
                    <p><strong>Ngày khám:</strong> {history.ngayKham}</p>
                    <p><strong>Giờ khám:</strong> {history.gioKham}</p>
                    <p><strong>Ca khám:</strong> {history.tenCa}</p>
                    <p><strong>Lý do khám:</strong> {history.lyDoKham}</p>
                    <p><strong>Ghi chú:</strong> {history.ghiChu || "Không có"}</p>
                    <p><strong>Trạng thái:</strong> {history.tenTrangThai}</p>
                    <p><strong>Giá khám:</strong> {history.giaKhamDisplay}</p>
                    <p><strong>Thanh toán:</strong> {history.tenTrangThaiThanhToan}</p>
                    <p><strong>Phương thức thanh toán:</strong> {history.tenPhuongThucThanhToan}</p>
                    <p><strong>Ngày xác nhận:</strong> {history.ngayBacSiXacNhan || "Chưa có"}</p>
                    <p><strong>Chẩn đoán:</strong> {history.chanDoan || "Chưa có"}</p>
                    <p><strong>Kết quả khám:</strong> {history.ketQuaKham || "Chưa có"}</p>
                    <p><strong>Đơn thuốc:</strong> {history.donThuoc || "Chưa có"}</p>
                    <p><strong>Lời dặn bác sĩ:</strong> {history.loiDanBacSi || "Chưa có"}</p>
                    <p><strong>Ngày tái khám:</strong> {history.ngayTaiKham || "Chưa có"}</p>
                    <p><strong>Lý do hủy:</strong> {history.lyDoHuy || "Không"}</p>
                    <p><strong>Người hủy:</strong> {history.tenNguoiHuy || "Không"}</p>
                </div>
            </div>
        </div>
    );
};

export default AdminHistoryDetail;
