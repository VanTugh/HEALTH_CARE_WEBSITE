import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const generateTimeSlots = (start, end) => {
    let slots = [];
    let current = new Date(`2000-01-01 ${start}`);
    let stop = new Date(`2000-01-01 ${end}`);

    while (current < stop) {
        const hh = current.getHours().toString().padStart(2, "0");
        const mm = current.getMinutes().toString().padStart(2, "0");
        slots.push(`${hh}:${mm}`);
        current.setMinutes(current.getMinutes() + 30);
    }
    return slots;
};

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
    });
};

const DoctorSchedule = ({ doctor }) => {
    const [scheduleList, setScheduleList] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedCa, setSelectedCa] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!doctor?.bacSiID) return;

        const token = localStorage.getItem("accessToken");
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        fetch(`${API_BASE_URL}/api/bookings/doctor/${doctor.bacSiID}/schedule`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "ngrok-skip-browser-warning": "true",
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data?.data) {

                    const todayStr = new Date().toISOString().split("T")[0];

                    const filtered = data.data.filter(item => {
                        return item.ngay > todayStr;
                    });

                    const sorted = filtered.sort((a, b) =>
                        a.gioBatDau.localeCompare(b.gioBatDau)
                    );

                    setScheduleList(sorted);


                    const firstDate = sorted[0]?.ngay;
                    if (firstDate) setSelectedDate(firstDate);


                    const firstCa = sorted.find(x => x.ngay === firstDate)?.tenCa;
                    if (firstCa) setSelectedCa(firstCa);
                }
            })
            .catch(err => console.error("Lỗi lấy lịch khám:", err));
    }, [doctor?.bacSiID]);

    if (scheduleList.length === 0) {
        return <p className="text-gray-500">Bác sĩ chưa có lịch khám.</p>;
    }

    const groupedByDate = scheduleList.reduce((acc, item) => {
        if (!acc[item.ngay]) acc[item.ngay] = [];
        acc[item.ngay].push(item);
        return acc;
    }, {});

    const dates = Object.keys(groupedByDate);

    const cas = selectedDate
        ? [...new Set(groupedByDate[selectedDate].map(c => c.tenCa))]
        : [];

    const handleSelectSlot = (date, time, caInfo) => {
        if (!caInfo.available || caInfo.gioDaDat.includes(time)) return;

        navigate("/dat-lich", {
            state: { doctor, date, time, ca: caInfo.ca },
        });
    };

    return (
        <>

            <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-[18px]">LỊCH KHÁM</h3>

                <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border border-gray-300 p-2 rounded text-sm w-[180px] outline-none cursor-pointer"
                >
                    {dates.map(date => (
                        <option key={date} value={date}>
                            {formatDate(date)}
                        </option>
                    ))}
                </select>
            </div>


            <div className="flex gap-2 mb-3">
                {cas.map((ca, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedCa(ca)}
                        className={`px-3 py-1 rounded border text-sm cursor-pointer
                            ${selectedCa === ca
                                ? "bg-sky-100 border-sky-500 text-sky-700 font-medium"
                                : "border-gray-300 hover:bg-gray-100"
                            }`}
                    >
                        {ca}
                    </button>
                ))}
            </div>


            {selectedDate &&
                groupedByDate[selectedDate]
                    .filter(ca => ca.tenCa === selectedCa)
                    .map((ca, index) => (
                        <div key={index} className="mb-4">


                            {!ca.available && (
                                <p className="text-red-500 text-sm">
                                    Ca này đã nghỉ ({ca.loaiNghi})
                                </p>
                            )}


                            <div className="grid grid-cols-4 gap-2 mt-1">
                                {generateTimeSlots(ca.gioBatDau, ca.gioKetThuc).map((slot, idx) => {
                                    const isBooked = ca.gioDaDat.includes(slot);

                                    return (
                                        <button
                                            key={idx}
                                            disabled={!ca.available || isBooked}
                                            onClick={() => handleSelectSlot(selectedDate, slot, ca)}
                                            className={`border rounded p-2 text-sm cursor-pointer
                                                ${!ca.available || isBooked
                                                    ? "bg-gray-300 border-gray-300 cursor-not-allowed"
                                                    : "border-gray-300 hover:bg-sky-100"
                                                }`}
                                        >
                                            {slot}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

            <p className="text-gray-500 text-sm mt-2 italic">
                * Lịch khám cần đặt trước ít nhất <strong>1 ngày </strong>
                Chọn giờ để đặt lịch khám (phí đặt lịch: Miễn phí)
            </p>
        </>
    );
};

export default DoctorSchedule;
