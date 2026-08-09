import React, { useState, useEffect, useRef } from "react";
import DiabetesPredict from "../components/DiabetesPrediction";

const DEV_MODE = import.meta.env.VITE_DEV_MODE || "dev";

const AIChatBot = () => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showDiabetesModal, setShowDiabetesModal] = useState(false);
    const messagesEndRef = useRef(null);

    const [bookingData, setBookingData] = useState({
        bacSiId: null,
        ngayKham: "",
        selectedSlot: null,
        lyDoKham: ""
    });

    const [availableSlots, setAvailableSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    // Khởi tạo tin nhắn mặc định chứa Extension
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: "bot",
            text: "Xin chào 👋 Tôi là Trợ lý AI Tư vấn Y tế.\n\nBạn có thể mô tả các triệu chứng sức khỏe đang gặp phải để tôi tư vấn bác sĩ phù hợp, hoặc trải nghiệm tiện ích mở rộng bên dưới để kiểm tra sức khỏe nhanh nhé!",
            hasExtension: true // Flag để render giao diện tiện ích
        }
    ]);

    // Tự động cuộn xuống tin nhắn mới nhất
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (open) {
            scrollToBottom();
        }
    }, [messages, open]);

    // Mock API (giữ nguyên logic cũ)
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
        setBookingData((prev) => ({ ...prev, selectedSlot: null }));
        try {
            let slots = [];
            if (DEV_MODE === "dev") {
                slots = await mockGetDoctorScheduleApi(bacSiId, selectedDate);
            } else {
                const token = localStorage.getItem("accessToken");
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
                const response = await fetch(
                    `${API_BASE_URL}/api/bac-si-2/${bacSiId}/lich-ranh?ngay=${selectedDate}`,
                    { headers: { Authorization: `Bearer ${token}` } }
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
                { id: Date.now(), sender: "bot", text: "Xin lỗi, AI đang bận. Vui lòng thử lại sau." }
            ]);
        } finally {
            setLoading(false);
        }
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
        } catch (error) {
            alert("Đã có lỗi xảy ra khi đặt lịch!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="font-sans">
            {/* Nút Float Mở Chatbot */}
            <button
                onClick={() => setOpen(!open)}
                className="fixed right-6 bottom-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center text-3xl shadow-xl z-[9999] transition-transform hover:scale-105"
            >
                🤖
            </button>

            {/* Khung Chatbot */}
            {open && (
                <div className="fixed bottom-24 right-6 w-[380px] h-[600px] bg-slate-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-[9999] border border-slate-200">
                    
                    {/* Header */}
                    <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center shadow-sm z-10">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🤖</span>
                            <div>
                                <h3 className="font-bold text-sm">Trợ lý AI Y Tế</h3>
                                <p className="text-[10px] text-blue-100">Luôn sẵn sàng hỗ trợ bạn</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] bg-blue-800/50 px-2 py-1 rounded-md font-mono uppercase">
                                {DEV_MODE}
                            </span>
                            <button onClick={() => setOpen(false)} className="text-blue-100 hover:text-white text-xl leading-none">
                                &times;
                            </button>
                        </div>
                    </div>

                    {/* Chat Body */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                        {messages.map((m) => (
                            <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                                
                                {/* Avatar Bot (chỉ hiện nếu là bot) */}
                                {m.sender === "bot" && (
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm mr-2 mt-1 shrink-0">
                                        🤖
                                    </div>
                                )}

                                <div className="max-w-[85%]">
                                    {/* Text Message */}
                                    <div
                                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                                            m.sender === "user"
                                                ? "bg-blue-600 text-white rounded-tr-sm"
                                                : "bg-white text-slate-800 shadow-sm border border-slate-100 rounded-tl-sm"
                                        }`}
                                    >
                                        {m.text}
                                    </div>

                                    {/* Khối Giao diện Tiện ích mở rộng (Extension) */}
                                    {m.hasExtension && (
                                        <div className="mt-3 bg-white border border-teal-200 shadow-sm rounded-xl p-4 w-full">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-8 h-8 bg-teal-50 rounded-full flex items-center justify-center text-lg">
                                                    🩺
                                                </div>
                                                <h4 className="font-bold text-teal-800 text-sm">Tiện ích AI Sàng Lọc</h4>
                                            </div>
                                            <p className="text-xs text-slate-600 mb-4">
                                                Trả lời vài câu hỏi ngắn để hệ thống AI đánh giá nguy cơ mắc bệnh tiểu đường của bạn, từ đó có hướng phòng ngừa kịp thời.
                                            </p>
                                            <button
                                                onClick={() => setShowDiabetesModal(true)}
                                                className="w-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors"
                                            >
                                                Mở tiện ích sàng lọc
                                            </button>
                                        </div>
                                    )}

                                    {/* Khối Đặt Lịch Khám */}
                                    {m.doctor && (
                                        <div className="mt-3 bg-white border border-slate-200 shadow-sm rounded-xl p-4">
                                            <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-3">
                                                <div className="text-3xl">{m.doctor.avatar}</div>
                                                <div>
                                                    <div className="font-bold text-sm text-blue-700">{m.doctor.name}</div>
                                                    <div className="text-[11px] text-slate-500">{m.doctor.specialty}</div>
                                                    <div className="text-[11px] text-red-600 font-bold mt-0.5">
                                                        Phí khám: {m.doctor.price.toLocaleString()} VNĐ
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-[11px] font-bold text-slate-700 mb-1">1. Chọn ngày khám:</label>
                                                    <input
                                                        type="date"
                                                        value={bookingData.ngayKham}
                                                        min={new Date().toISOString().split("T")[0]}
                                                        onChange={(e) => {
                                                            setBookingData(prev => ({ ...prev, ngayKham: e.target.value }));
                                                            fetchDoctorSchedule(m.doctor.id, e.target.value);
                                                        }}
                                                        className="w-full border border-slate-200 rounded-md px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-[11px] font-bold text-slate-700 mb-1">2. Khung giờ trống:</label>
                                                    {loadingSlots ? (
                                                        <div className="text-xs text-slate-500 italic">⏳ Đang tải lịch...</div>
                                                    ) : availableSlots.length === 0 ? (
                                                        <div className="text-xs text-red-500 italic">Kín lịch / Không có ca làm việc.</div>
                                                    ) : (
                                                        <div className="flex flex-wrap gap-2">
                                                            {availableSlots.map((slot) => {
                                                                const isSelected = bookingData.selectedSlot?.id === slot.id;
                                                                return (
                                                                    <button
                                                                        key={slot.id}
                                                                        onClick={() => setBookingData(prev => ({ ...prev, selectedSlot: slot }))}
                                                                        className={`px-2 py-1 text-[11px] rounded transition-colors border ${
                                                                            isSelected
                                                                                ? "bg-blue-600 border-blue-600 text-white font-bold"
                                                                                : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                                                                        }`}
                                                                    >
                                                                        {slot.gioKham}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex gap-2 pt-2">
                                                    <button
                                                        onClick={() => handleConfirmBooking(m.id, m.doctor)}
                                                        disabled={!bookingData.selectedSlot}
                                                        className="flex-1 bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-lg transition-colors"
                                                    >
                                                        Xác Nhận Đặt
                                                    </button>
                                                    <button
                                                        onClick={() => setMessages(prev => prev.map(msg => msg.id === m.id ? { ...msg, doctor: null } : msg))}
                                                        className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                                                    >
                                                        Hủy
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm mr-2 mt-1 shrink-0">🤖</div>
                                <div className="px-4 py-2.5 rounded-2xl bg-white text-slate-500 text-xs shadow-sm border border-slate-100 rounded-tl-sm flex items-center gap-1">
                                    <span className="animate-bounce">●</span><span className="animate-bounce delay-75">●</span><span className="animate-bounce delay-150">●</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="bg-white border-t border-slate-200 p-3 flex gap-2 z-10">
                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Mô tả triệu chứng của bạn..."
                            className="flex-1 bg-slate-100 text-sm rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") sendMessage();
                            }}
                        />
                        <button
                            onClick={sendMessage}
                            className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors shrink-0"
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}

            {/* Modal Tiểu Đường - Vẫn giữ nguyên logic cũ */}
            {showDiabetesModal && (
                <DiabetesPredict onClose={() => setShowDiabetesModal(false)} />
            )}
        </div>
    );
};

export default AIChatBot;