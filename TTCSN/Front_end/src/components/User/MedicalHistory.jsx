import { useEffect, useState } from "react";
import MedicalHistoryItem from "./MedicalHistoryItem";
import MedicalHistoryDetailModal from "./MedicalHistoryDetailModal";

export default function MedicalHistory() {
    const [histories, setHistories] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(true);

    // Pagination
    const [page, setPage] = useState(0);
    const ITEMS_PER_PAGE = 3;

    const getDateRange = () => {
        const today = new Date();
        const toDate = today.toISOString().split("T")[0];
        const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const fromDate = firstDayLastMonth.toISOString().split("T")[0];
        return { fromDate, toDate };
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const { fromDate, toDate } = getDateRange();

            const url = `${API_BASE_URL}/api/bookings/history`
                + `?fromDate=${fromDate}`
                + `&toDate=${toDate}`
                + `&status=HOAN_THANH`
                + `&page=0&size=50&sortBy=ngayKham&direction=DESC`;

            const res = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "true",
                }
            });

            const json = await res.json();

            if (json.success && json.data) {
                const sorted = json.data.content.sort(
                    (a, b) => new Date(b.ngayKham) - new Date(a.ngayKham)
                );
                setHistories(sorted);
            } else {
                setHistories([]);
                console.error("Không lấy được lịch sử khám:", json.message);
            }
        } catch (error) {
            console.error("Fetch history error:", error);
            setHistories([]);
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(histories.length / ITEMS_PER_PAGE);
    const pagedHistories = histories.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

    if (loading) return <p className="text-center">Đang tải...</p>;

    return (
        <div className="w-full border rounded-[12px] border-gray-300 shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4">Lịch sử khám</h2>

            {histories.length === 0 ? (
                <div className="text-center text-gray-500">
                    Bạn chưa có lịch sử khám bệnh nào
                </div>
            ) : (
                <>
                    <div className="space-y-3">
                        {pagedHistories.map(item => (
                            <MedicalHistoryItem
                                key={item.datLichID}
                                data={item}
                                onViewDetail={() => setSelectedItem(item)}
                            />
                        ))}
                    </div>

                    <div className="flex justify-end gap-2 mt-3">
                        <button
                            className="px-3 py-1 border border-gray-300 bg-gray-100 rounded hover:bg-gray-300 cursor-pointer disabled:opacity-50"
                            onClick={() => setPage(prev => Math.max(prev - 1, 0))}
                            disabled={page === 0}
                        >
                            &lt;
                        </button>
                        <span className="px-3 py-1 border rounded border-gray-300">
                            {page + 1} / {totalPages}
                        </span>
                        <button
                            className="px-3 py-1 border border-gray-300 bg-gray-100 rounded hover:bg-gray-300 cursor-pointer disabled:opacity-50"
                            onClick={() => setPage(prev => Math.min(prev + 1, totalPages - 1))}
                            disabled={page === totalPages - 1}
                        >
                            &gt;
                        </button>
                    </div>
                </>
            )}

            {selectedItem && (
                <MedicalHistoryDetailModal
                    data={selectedItem}
                    onClose={() => setSelectedItem(null)}
                />
            )}
        </div>
    );
}
