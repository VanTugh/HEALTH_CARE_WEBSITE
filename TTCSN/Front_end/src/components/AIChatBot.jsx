import React, { useState } from "react";
import DiabetesPredict from "../components/DiabetesPrediction"; // Import tiện ích dự đoán tiểu đường

const DEV_MODE = import.meta.env.VITE_DEV_MODE || "dev"; 

const AIChatBot = () => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // State quản lý việc hiển thị Popup dự đoán tiểu đường
    const [showDiabetesModal, setShowDiabetesModal] = useState(false);

    // State lưu dữ liệu người dùng đang chọn
    const [bookingData, setBookingData] = useState({
        bacSiId: null,
        ngayKham: "",
        selectedSlot: null,
        lyDoKham: ""
    });

    const [availableSlots, setAvailableSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: "bot",
            text: "Xin chào 👋 Tôi là AI tư vấn y tế. Hãy mô tả triệu chứng của bạn hoặc sử dụng tiện ích bên dưới để được hỗ trợ!"
        }
    ]);

    const mockAiChatApi = async (userMsg) => {
        await new Promise((res) => setTimeout(res, 1000));
        return {
            answer: `Dựa trên triệu chứng "${userMsg}", tôi gợi ý Bác sĩ chuyên khoa phù hợp với bạn:`,
            recommendedDoctor: {
                id: 101,
                name: "BS. CKI Nguyễn Văn A",
                specialty: "Chuyên khoa Tim mạch - Thần kinh",
                price: 300000,
                avatar: "👨‍⚕️"
            }
        };
    };

    const mockGetDoctorScheduleApi = async (bacSiId, ngay) => {
        await new Promise((res) => setTimeout(res, 600));
        return [
            { id: 1, ca: "SANG", gioKham: "08:00 - 08:30" },
            { id: 2, ca: "SANG", gioKham: "09:30 - 10:00" },
            { id: 3, ca: "CHIEU", gioKham: "14:00 - 14:30" },
            { id: 4, ca: "CHIEU", gioKham: "15:30 - 16:00" }
        ];
    };

    const mockSaveBookingApi = async () => {
        await new Promise((res) => setTimeout(res, 800));
        return {
            success: true,
            bookingCode: "DL" + Math.floor(100000 + Math.random() * 900000)
        };
    };

    const fetchDoctorSchedule = async (bacSiId, selectedDate) => {
        setLoadingSlots(true);
        setBookingData(prev => ({ ...prev, selectedSlot: null }));
        try {
            let slots = [];
            if (DEV_MODE === "dev") {
                slots = await mockGetDoctorScheduleApi(bacSiId, selectedDate);
            } else {
                const token = localStorage.getItem("accessToken");
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

                const response = await fetch(
                    `${API_BASE_URL}/api/bac-si-2/${bacSiId}/lich-ranh?ngay=${selectedDate}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                if (!response.ok) throw new Error("Không lấy được lịch bác sĩ");
                slots = await response.json();
            }
            setAvailableSlots(slots);
        } catch (error) {
            console.error("Lỗi lấy lịch:", error);
            setAvailableSlots([]);
        } finally {
            setLoadingSlots(false);
        }
    };

    const sendMessage = async () => {
        if (!message.trim()) return;

        const userMessage = message;
        setMessages((prev) => [...prev, { id: Date.now(), sender: "user", text: userMessage }]);
        setMessage("");

        try {
            setLoading(true);
            let data;

            if (DEV_MODE === "dev") {
                data = await mockAiChatApi(userMessage);
            } else {
                const token = localStorage.getItem("accessToken");
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

                const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ message: userMessage }),
                });

                if (!response.ok) throw new Error("API Error");
                data = await response.json();
            }

            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    sender: "bot",
                    text: data.answer,
                    doctor: data.recommendedDoctor || null
                }
            ]);

            if (data.recommendedDoctor) {
                const today = new Date().toISOString().split("T")[0];
                setBookingData({
                    bacSiId: data.recommendedDoctor.id,
                    ngayKham: today,
                    selectedSlot: null,
                    lyDoKham: userMessage
                });
                fetchDoctorSchedule(data.recommendedDoctor.id, today);
            }
        } catch (e) {
            setMessages((prev) => [
                ...prev,
                { id: Date.now(), sender: "bot", text: "Xin lỗi, AI đang bận." }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (e, bacSiId) => {
        const newDate = e.target.value;
        setBookingData(prev => ({ ...prev, ngayKham: newDate }));
        fetchDoctorSchedule(bacSiId, newDate);
    };

    const handleConfirmBooking = async (msgId, doctor) => {
        if (!bookingData.selectedSlot) {
            alert("Vui lòng chọn một khung giờ còn trống!");
            return;
        }

        try {
            setLoading(true);
            let res;

            if (DEV_MODE === "dev") {
                res = await mockSaveBookingApi();
            } else {
                const token = localStorage.getItem("accessToken");
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

                const response = await fetch(`${API_BASE_URL}/api/dat-lich`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        bacSiID: doctor.id,
                        ngayKham: bookingData.ngayKham,
                        ca: bookingData.selectedSlot.ca,
                        gioKham: bookingData.selectedSlot.gioKham,
                        lyDoKham: bookingData.lyDoKham
                    }),
                });

                if (!response.ok) throw new Error("Lỗi khi lưu lịch");
                res = await response.json();
            }

            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === msgId
                        ? {
                              ...msg,
                              doctor: null,
                              text: `🎉 **ĐẶT LỊCH THÀNH CÔNG!**\n- **Mã lịch**: ${res.bookingCode || "OK"}\n- **Bác sĩ**: ${doctor.name}\n- **Thời gian**: ${bookingData.selectedSlot.gioKham} (${bookingData.ngayKham})`
                          }
                        : msg
                )
            );
            alert("Đặt lịch thành công");
        } catch (error) {
            alert("Đã có lỗi xảy ra khi đặt lịch!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Nút mở Chatbot */}
            <div
                onClick={() => setOpen(!open)}
                style={{
                    position: "fixed",
                    right: 20,
                    bottom: 20,
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    background: "#1976d2",
                    color: "#fff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    fontSize: 28,
                    zIndex: 9999,
                    boxShadow: "0 4px 12px rgba(0,0,0,.25)"
                }}
            >
                🤖
            </div>

            {/* Khung Chat */}
            {open && (
                <div
                    style={{
                        position: "fixed",
                        bottom: 90,
                        right: 20,
                        width: 390,
                        height: 580,
                        background: "#fff",
                        borderRadius: 12,
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: "0 5px 25px rgba(0,0,0,.2)",
                        overflow: "hidden",
                        zIndex: 9999,
                        fontFamily: "sans-serif"
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            background: "#1976d2",
                            color: "#fff",
                            padding: "12px 15px",
                            fontWeight: "bold",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}
                    >
                        <span>🤖 AI Tư Vấn & Đặt Lịch</span>
                        <span style={{ fontSize: 11, background: "#ffffff33", padding: "2px 6px", borderRadius: 4 }}>
                            {DEV_MODE.toUpperCase()}
                        </span>
                    </div>

                    {/* Thanh tiện ích nhanh (Quick Utilities Toolbar) */}
                    <div
                        style={{
                            padding: "8px 12px",
                            background: "#f5f5f5",
                            borderBottom: "1px solid #e0e0e0",
                            display: "flex",
                            gap: 8,
                            overflowX: "auto"
                        }}
                    >
                        <button
                            onClick={() => setShowDiabetesModal(true)}
                            style={{
                                background: "#e0f2f1",
                                color: "#00796b",
                                border: "1px solid #b2dfdb",
                                padding: "4px 10px",
                                borderRadius: 16,
                                fontSize: 12,
                                fontWeight: "600",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                whiteSpace: "nowrap"
                            }}
                        >
                            🩺 Sàng lọc tiểu đường
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
                        {messages.map((m) => (
                            <div
                                key={m.id}
                                style={{
                                    textAlign: m.sender === "user" ? "right" : "left",
                                    marginBottom: 12
                                }}
                            >
                                <span
                                    style={{
                                        display: "inline-block",
                                        padding: "10px 14px",
                                        borderRadius: 12,
                                        maxWidth: "85%",
                                        whiteSpace: "pre-line",
                                        background: m.sender === "user" ? "#1976d2" : "#f0f2f5",
                                        color: m.sender === "user" ? "#fff" : "#1c1e21",
                                        fontSize: 14,
                                        lineHeight: "1.4"
                                    }}
                                >
                                    {m.text}
                                </span>

                                {/* Khung gợi ý Bác sĩ & Lịch rảnh */}
                                {m.doctor && (
                                    <div
                                        style={{
                                            border: "1px solid #e0e0e0",
                                            borderRadius: 10,
                                            padding: 12,
                                            marginTop: 8,
                                            background: "#fafafa",
                                            textAlign: "left"
                                        }}
                                    >
                                        <div style={{ fontWeight: "bold", color: "#1976d2" }}>
                                            {m.doctor.avatar} {m.doctor.name}
                                        </div>
                                        <div style={{ fontSize: 12, color: "#666" }}>{m.doctor.specialty}</div>
                                        <div style={{ fontSize: 12, color: "#d32f2f", fontWeight: "bold", marginTop: 2 }}>
                                            Giá khám: {m.doctor.price.toLocaleString()} VNĐ
                                        </div>

                                        <hr style={{ margin: "8px 0", border: "0.5px solid #eee" }} />

                                        {/* 1. Chọn Ngày */}
                                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                            <label style={{ fontSize: 12, fontWeight: 600 }}>1. Chọn ngày muốn khám:</label>
                                            <input
                                                type="date"
                                                value={bookingData.ngayKham}
                                                min={new Date().toISOString().split("T")[0]}
                                                onChange={(e) => handleDateChange(e, m.doctor.id)}
                                                style={{ padding: 6, borderRadius: 4, border: "1px solid #ccc", fontSize: 13 }}
                                            />
                                        </div>

                                        {/* 2. Chọn Khung Giờ Rảnh của Bác Sĩ */}
                                        <div style={{ marginTop: 8 }}>
                                            <label style={{ fontSize: 12, fontWeight: 600 }}>2. Chọn giờ bác sĩ rảnh:</label>
                                            
                                            {loadingSlots ? (
                                                <div style={{ fontSize: 12, color: "#666", margin: "6px 0" }}>⏳ Đang tải lịch bác sĩ...</div>
                                            ) : availableSlots.length === 0 ? (
                                                <div style={{ fontSize: 12, color: "#d32f2f", margin: "6px 0" }}>❌ Ngày này bác sĩ không có lịch rảnh.</div>
                                            ) : (
                                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                                                    {availableSlots.map((slot) => {
                                                        const isSelected = bookingData.selectedSlot?.id === slot.id;
                                                        return (
                                                            <button
                                                                key={slot.id}
                                                                onClick={() => setBookingData(prev => ({ ...prev, selectedSlot: slot }))}
                                                                style={{
                                                                    padding: "4px 8px",
                                                                    borderRadius: 4,
                                                                    fontSize: 12,
                                                                    border: isSelected ? "1px solid #1976d2" : "1px solid #ccc",
                                                                    background: isSelected ? "#1976d2" : "#fff",
                                                                    color: isSelected ? "#fff" : "#333",
                                                                    cursor: "pointer",
                                                                    fontWeight: isSelected ? "bold" : "normal"
                                                                }}
                                                            >
                                                                {slot.gioKham}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>

                                        {/* Action buttons */}
                                        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                                            <button
                                                onClick={() => handleConfirmBooking(m.id, m.doctor)}
                                                disabled={!bookingData.selectedSlot}
                                                style={{
                                                    flex: 1,
                                                    background: bookingData.selectedSlot ? "#2e7d32" : "#ccc",
                                                    color: "#fff",
                                                    border: "none",
                                                    padding: "8px 0",
                                                    borderRadius: 6,
                                                    cursor: bookingData.selectedSlot ? "pointer" : "not-allowed",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                Xác Nhận Đặt Lịch
                                            </button>
                                            <button
                                                onClick={() => setMessages(prev => prev.map(msg => msg.id === m.id ? { ...msg, doctor: null } : msg))}
                                                style={{
                                                    background: "#757575",
                                                    color: "#fff",
                                                    border: "none",
                                                    padding: "8px 12px",
                                                    borderRadius: 6,
                                                    cursor: "pointer"
                                                }}
                                            >
                                                Hủy
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {loading && (
                            <div style={{ fontSize: 13, color: "#888", fontStyle: "italic" }}>
                                ⏳ AI đang xử lý...
                            </div>
                        )}
                    </div>

                    {/* Input Chat */}
                    <div style={{ display: "flex", borderTop: "1px solid #ddd" }}>
                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Mô tả triệu chứng..."
                            style={{ flex: 1, border: "none", padding: "12px 15px", outline: "none", fontSize: 14 }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") sendMessage();
                            }}
                        />
                        <button
                            onClick={sendMessage}
                            style={{ width: 65, border: "none", background: "#1976d2", color: "#fff", fontWeight: "bold", cursor: "pointer" }}
                        >
                            Gửi
                        </button>
                    </div>
                </div>
            )}

            {/* Popup Dự đoán nguy cơ tiểu đường */}
            {showDiabetesModal && (
                <DiabetesPredict onClose={() => setShowDiabetesModal(false)} />
            )}
        </>
    );
};

export default AIChatBot;