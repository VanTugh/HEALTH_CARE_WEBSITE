import React from "react";
import { CalendarPlus } from "lucide-react";

const ScheduleToolbar = ({ onQuickCreate }) => {
    return (
        <div className="flex items-center justify-end mb-4 p-4 border border-gray-200 rounded-2xl shadow-sm bg-white">
            <button
                onClick={onQuickCreate}
                className="bg-[#ad7555] hover:bg-[#945f46] text-white px-5 py-2 
                   rounded-xl flex items-center gap-2 shadow-md transition"
            >
                <CalendarPlus size={18} />
                Thêm lịch nhanh (1 tuần)
            </button>
        </div>
    );
};

export default ScheduleToolbar;
