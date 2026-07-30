import React, { useState } from "react";

export default function EditLeaveForm({
    leave,
    token,
    setLeaves,
    onClose,
    onSuccess,
}) {


    const [formData, setFormData] = useState({
        lyDo: leave.lyDo || "",
        fileDinhKem: leave.fileDinhKem || "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const res = await fetch(
                `${API_BASE_URL}/api/leave-requests/${leave.nghiID}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "ngrok-skip-browser-warning": "true",
                    },
                    body: JSON.stringify({
                        ...formData,
                        updateSummary: "update",
                    }),
                }
            );

            if (!res.ok) throw new Error("Update failed");

            const result = await res.json();

            setLeaves(prev =>
                prev.map(l =>
                    l.nghiID === result.nghiID
                        ? { ...l, ...formData, ...result }
                        : l
                )
            );

            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            alert("Chỉnh sửa thất bại");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-[400px]">
                <h2 className="text-xl font-semibold mb-4 text-center">
                    Chỉnh sửa yêu cầu nghỉ
                </h2>

                <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                    <label className="text-sm font-medium">
                        Lý do:
                        <textarea
                            name="lyDo"
                            value={formData.lyDo}
                            onChange={handleChange}
                            rows={3}
                            className="border border-gray-300 p-2 rounded w-full mt-1"
                            required
                        />
                    </label>

                    <label className="text-sm font-medium">
                        File đính kèm (URL):
                        <input
                            type="text"
                            name="fileDinhKem"
                            value={formData.fileDinhKem}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 rounded w-full mt-1"
                        />
                    </label>

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Lưu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
