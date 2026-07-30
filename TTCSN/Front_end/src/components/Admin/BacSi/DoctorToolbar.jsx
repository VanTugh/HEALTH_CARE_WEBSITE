import React from "react";
import { Search, Plus } from "lucide-react";

const DoctorToolbar = ({ onSearch, onAdd, content, specialties, selectedSpecialty, onSelectSpecialty }) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 p-4 border border-gray-200 rounded-2xl shadow-sm bg-white gap-3">

            <div className="flex items-center gap-3 w-full md:w-1/2">
                <div className="relative flex-1">
                    <Search
                        className="absolute left-3 top-2.5 text-gray-400 pointer-events-none"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder={`Tìm kiếm ${content}...`}
                        onChange={(e) => onSearch(e.target.value)}
                        className="pl-9 pr-3 py-2 rounded-xl w-full border border-gray-200 
                                   focus:ring-1 focus:ring-gray-300 focus:border-gray-400 
                                   outline-none shadow-sm text-gray-700"
                    />
                </div>


                <select
                    value={selectedSpecialty}
                    onChange={(e) => onSelectSpecialty(e.target.value)}
                    className="py-2 px-3 border border-gray-200 rounded-xl shadow-sm text-gray-700 cursor-pointer"
                >
                    <option value="">Tất cả chuyên khoa</option>
                    {specialties.map(s => (
                        <option key={s.chuyenKhoaID} value={s.chuyenKhoaID}>{s.tenChuyenKhoa}</option>
                    ))}
                </select>
            </div>

            <button
                onClick={onAdd}
                className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 
                           rounded-xl flex items-center gap-2 shadow-md transition cursor-pointer"
            >
                <Plus size={18} /> Thêm {content}
            </button>
        </div>
    );
};

export default DoctorToolbar;
