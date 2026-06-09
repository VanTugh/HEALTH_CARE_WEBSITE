import React, { useEffect, useState } from "react";
import {
    createSchedule,
    createBulkSchedules,
    deleteSchedule,
    getAllSchedules,
} from "./lichLamViecAPI";
import ScheduleToolbar from "./ScheduleToolbar";
import DeleteScheduleModal from "./DeleteScheduleModal";
import { X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const DAYS = [
    { id: 2, label: "Thứ 2" },
    { id: 3, label: "Thứ 3" },
    { id: 4, label: "Thứ 4" },
    { id: 5, label: "Thứ 5" },
    { id: 6, label: "Thứ 6" },
    { id: 7, label: "Thứ 7" },
    { id: 8, label: "Chủ nhật" },
];

const CA_LIST = [
    { key: "SANG", label: "Sáng (08:00 - 12:00)", start: "08:00", end: "12:00" },
    { key: "CHIEU", label: "Chiều (14:00 - 17:00)", start: "14:00", end: "17:00" },
];


const normalizeCa = (ca) => {
    if (!ca) return "";
    const text = ca.toString().toUpperCase();

    if (text.includes("SANG")) return "SANG";
    if (text.includes("CHIEU")) return "CHIEU";

    return text;
};

const buildKey = (day, ca) => `${day}-${ca}`;



export default function ScheduleTimetable() {
    const [scheduleMap, setScheduleMap] = useState({});
    const [deleteTarget, setDeleteTarget] = useState(null);


    const loadSchedules = async () => {
        try {
            const data = await getAllSchedules();
            const map = {};

            data.forEach(item => {
                const caKey = normalizeCa(item.ca);
                map[buildKey(item.thuTrongTuan, caKey)] = item;
            });

            setScheduleMap(map);
        } catch (err) {
            console.error(err);
            toast.error("Không tải được lịch");
        }
    };

    useEffect(() => {
        loadSchedules();
    }, []);


    const handleCreate = async (day, caObj) => {
        try {
            await createSchedule({
                thuTrongTuan: day,
                ca: caObj.key,
                thoiGianBatDau: caObj.start,
                thoiGianKetThuc: caObj.end,
                isActive: true,
                ghiChu: `Lịch ${caObj.label}`,
            });

            toast.success("Tạo lịch thành công");
            loadSchedules();
        } catch (err) {
            toast.error(err?.message || "Lịch đã tồn tại");
        }
    };


    const confirmDelete = async () => {
        if (!deleteTarget) return;

        try {
            await deleteSchedule(deleteTarget.configID);
            toast.success("Xóa lịch thành công");
            setDeleteTarget(null);
            loadSchedules();
        } catch {
            toast.error("Không thể xoá");
        }
    };


    const handleQuickCreate = async () => {
        try {
            const schedules = [];

            DAYS.forEach(day => {
                CA_LIST.forEach(ca => {
                    schedules.push({
                        thuTrongTuan: day.id,
                        ca: ca.key,
                        thoiGianBatDau: ca.start,
                        thoiGianKetThuc: ca.end,
                        isActive: true,
                        ghiChu: `Lịch chuẩn ${day.label}`,
                    });
                });
            });

            await createBulkSchedules(schedules);
            toast.success("Tạo lịch tuần thành công");
            loadSchedules();
        } catch {
            toast.error("Lịch đã tồn tại");
        }
    };



    return (
        <>
            <ToastContainer position="top-right" autoClose={2000} />

            <ScheduleToolbar onQuickCreate={handleQuickCreate} />

            <div className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 p-2 bg-gray-200">
                                Ca
                            </th>
                            {DAYS.map(d => (
                                <th
                                    key={d.id}
                                    className="border border-gray-300 p-2 bg-gray-200"
                                >
                                    {d.label}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {CA_LIST.map(ca => (
                            <tr key={ca.key}>
                                <td className="border border-gray-300 p-2 bg-gray-100 font-medium">
                                    {ca.label}
                                </td>

                                {DAYS.map(day => {
                                    const item = scheduleMap[buildKey(day.id, ca.key)];

                                    return (
                                        <td
                                            key={day.id}
                                            onClick={() => !item && handleCreate(day.id, ca)}
                                            className={`relative border border-gray-300 p-2 
                                                text-center cursor-pointer transition
                                                ${item
                                                    ? "bg-green-700 text-white"
                                                    : "bg-gray-100 hover:bg-green-300"
                                                }`}
                                        >
                                            {item ? (
                                                <>
                                                    ✔
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setDeleteTarget(item);
                                                        }}
                                                        className="absolute top-1 right-1 
                                                            bg-white text-red-500 
                                                            rounded-full p-[2px]
                                                            hover:bg-red-500 hover:text-white"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </>
                                            ) : (
                                                "Tạo"
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <DeleteScheduleModal
                slot={deleteTarget}
                onCancel={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
            />
        </>
    );
}
