import React, { useState } from "react";

const RejectModal = ({ isOpen, onClose, onSubmit }) => {
    const [reason, setReason] = useState("");

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!reason.trim()) {
            alert("Vui lòng nhập lý do từ chối!");
            return;
        }
        onSubmit(reason);
        setReason("");
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Nhập lý do từ chối</h2>
                <textarea
                    className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                    rows={4}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                    <button
                        className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 cursor-pointer"
                        onClick={() => {
                            onClose();
                            setReason("");
                        }}
                    >
                        Hủy
                    </button>
                    <button
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
                        onClick={handleSubmit}
                    >
                        Từ chối
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RejectModal;
