import React from "react";
import { FaCalendarAlt, FaMoneyBill } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

const BookingItem = ({ items, onCancel }) => {
    console.log(items)

    const handlePayment = async (datLichID) => {
        try {
            const token = localStorage.getItem("accessToken");
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const res = await fetch(
                `${API_BASE_URL}/api/payments/vnpay/create`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                        "ngrok-skip-browser-warning": "true"
                    },
                    body: JSON.stringify({
                        datLichID,
                        clientIp: "127.0.0.1"
                    })
                }
            );

            if (!res.ok) {
                const err = await res.json();
                console.error(err);
                alert("Không thể tạo thanh toán");
                return;
            }

            const result = await res.json();
            console.log("Payment response:", result);


            const paymentUrl = result?.data?.paymentUrl;

            if (!paymentUrl) {
                alert("Không nhận được link thanh toán");
                return;
            }


            window.location.href = paymentUrl;

        } catch (error) {
            console.error("Payment error:", error);
            alert("Lỗi khi thanh toán");
        }
    };

    return (
        <>
            <div className="w-full border rounded-[12px] border-gray-300 shadow-md p-4">
                <h2 className="text-xl font-semibold mb-4">Lịch khám của bạn</h2>

                {items.map((item, index) => {

                    const isOnlinePayment = item.phuongThucThanhToan === "VNPAY";

                    const canCancel =
                        item.trangThai === "CHO_XAC_NHAN_BAC_SI" ||
                        item.trangThai === "CHO_THANH_TOAN";


                    const canPay =
                        (item.trangThai === "DA_XAC_NHAN_CHO_THANH_TOAN" || item.trangThai === "CHO_THANH_TOAN") &&
                        isOnlinePayment &&
                        item.trangThaiThanhToan === "CHUA_THANH_TOAN";

                    return (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow p-3 border border-gray-300 mb-3 flex flex-col md:flex-col lg:flex-col"
                        >
                            <div className="flex flex-col md:flex-row justify-between border-b border-gray-300 pb-2 gap-3">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={item.avatarBacSi}
                                        alt="avatar"
                                        className="w-12 h-12 rounded-full object-cover border"
                                    />
                                    <div className="leading-tight">
                                        <p className="font-semibold text-base">{item.tenBacSi}</p>
                                        <p className="text-gray-600 text-sm">
                                            {item.tenChuyenKhoa} • {item.tenTrinhDo}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-2 md:mt-0 text-sm flex flex-col">
                                    <span className="font-semibold">
                                        ID: {item.datLichID}
                                    </span>
                                    <span className="font-semibold">
                                        Mã xác nhận: {item.maXacNhan}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row justify-between mt-2 gap-3 text-sm">
                                <div className="font-medium">
                                    <p>
                                        <strong>Bệnh nhân: </strong> {item.tenBenhNhan}
                                    </p>
                                    <p>
                                        <strong>SĐT: </strong> {item.sdtBenhNhan}
                                    </p>
                                </div>

                                <div className="mt-2 md:mt-0">
                                    <div className="flex items-center gap-2">
                                        <FaCalendarAlt className="text-gray-600" />
                                        <span className="font-semibold">
                                            Ngày khám: {item.ngayKham}
                                        </span>
                                    </div>
                                    <p className="mt-1 font-semibold">
                                        Giờ khám: {item.gioKham}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-2 border-t border-gray-300 pt-2 text-sm gap-3">
                                <div className="font-medium">
                                    <p>
                                        <strong>Giá khám:</strong> {item.giaKhamDisplay}
                                    </p>
                                    <p>
                                        <strong>Phương thức thanh toán:</strong>{" "}
                                        {item.tenPhuongThucThanhToan}
                                    </p>
                                    <p>
                                        <strong>Trạng thái:</strong>{" "}
                                        {item.tenTrangThaiThanhToan}
                                    </p>
                                    <p className="mt-1">
                                        <strong>Trạng thái lịch:</strong>{" "}
                                        <span
                                            className={`px-2 py-1 rounded-lg text-white font-semibold ${item.trangThai === "DA_XAC_NHAN"
                                                ? "bg-green-500"
                                                : "bg-yellow-400"
                                                }`}
                                        >
                                            {item.tenTrangThaiDisplay || item.tenTrangThai}
                                        </span>
                                    </p>
                                </div>

                                <div className="flex flex-col md:flex-row items-start md:items-center gap-2 mt-2 md:mt-0">
                                    {canCancel && (
                                        <button
                                            onClick={() => onCancel(item.datLichID)}
                                            className="flex items-center justify-center gap-1.5 px-3 py-1 text-red-600 border border-red-400 rounded-lg hover:bg-red-50 transition text-sm cursor-pointer"
                                        >
                                            <MdCancel size={14} />
                                            Huỷ lịch
                                        </button>
                                    )}

                                    {canPay && (
                                        <button
                                            onClick={() => handlePayment(item.datLichID)}
                                            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition shadow-sm bg-green-500 text-white hover:bg-green-600 cursor-pointer"
                                        >
                                            <FaMoneyBill size={14} />
                                            Thanh toán
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default BookingItem;
