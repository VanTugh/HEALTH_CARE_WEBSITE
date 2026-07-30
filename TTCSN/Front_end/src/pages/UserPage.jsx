import React, { useState, useEffect } from 'react';
import HeaderSub from '../components/HeaderSub';
import Footer from '../components/Footer';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AccountInfor from '../components/User/AccountInfor';
import ChangePassword from '../components/User/ChangePassword';
import BookingItem from '../components/User/BookingItem';
import CancelBookingModal from '../components/User/CancelBookingModal';
import MedicalHistory from '../components/User/MedicalHistory';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [indexPage, setIndexPage] = useState(0);


    const [allBookings, setAllBookings] = useState([]);
    const [page, setPage] = useState(0);
    const size = 2;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [openCancel, setOpenCancel] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState(null);

    const totalPages = Math.ceil(allBookings.length / size);

    useEffect(() => {
        if (location.state && location.state.indexPage !== undefined) {
            setIndexPage(location.state.indexPage);
        }
    }, [location.state]);


    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            setError("Chưa đăng nhập!");
            return;
        }

        setLoading(true);
        setError(null);
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        fetch(`${API_BASE_URL}/api/bookings/my?page=0&size=10`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                "ngrok-skip-browser-warning": "true",
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.success) {

                    const now = new Date();

                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    const sortedBookings = [...data.data.content]

                        .filter(item => item.tenTrangThai !== "Hủy bởi bệnh nhân")

                        .filter(item => {
                            const bookingDateOnly = new Date(item.ngayKham);
                            bookingDateOnly.setHours(0, 0, 0, 0);


                            if (bookingDateOnly.getTime() === today.getTime()) {
                                return true;
                            }


                            const bookingDateTime = new Date(`${item.ngayKham}T${item.gioKham}`);
                            return bookingDateTime >= now;
                        })

                        .sort((a, b) => {

                            if (a.tenTrangThai === "CHO_XAC_NHAN_BAC_SI" && b.tenTrangThai !== "CHO_XAC_NHAN_BAC_SI") {
                                return -1;
                            }
                            if (b.tenTrangThai === "CHO_XAC_NHAN_BAC_SI" && a.tenTrangThai !== "CHO_XAC_NHAN_BAC_SI") {
                                return 1;
                            }

                            const dateA = new Date(`${a.ngayKham}T${a.gioKham}`);
                            const dateB = new Date(`${b.ngayKham}T${b.gioKham}`);
                            return dateA - dateB;
                        });
                    console.log(sortedBookings)
                    setAllBookings(sortedBookings);

                } else {
                    setError(data.message || "Lỗi khi lấy dữ liệu");
                }
            })

            .catch(err => setError("Lỗi fetch API: " + err.message))
            .finally(() => setLoading(false));
    }, []);


    const bookings = allBookings.slice(page * size, (page + 1) * size);


    const handleCancel = (datLichID) => {
        setSelectedBookingId(datLichID);
        setOpenCancel(true);
    };

    const handleCancelSuccess = (datLichID) => {
        setAllBookings(prev =>
            prev.filter(item => item.datLichID !== datLichID)
        );


        setTimeout(() => {
            const newTotalPages = Math.ceil((allBookings.length - 1) / size) || 1;
            if (page > newTotalPages - 1) {
                setPage(Math.max(0, newTotalPages - 1));
            }
        }, 0);
    };



    return (
        <>
            <HeaderSub />
            <div className='max-w-[1300px] mx-auto mt-5 flex gap-5'>
                <div className='w-[20%] flex flex-col gap-y-2 border-r pr-0.5 border-gray-200 ml-5'>
                    <Link
                        className={`${indexPage === 0 ? "border-[#bb4d00] bg-[#f2edea] text-amber-800" : "border-gray-400"} py-3 px-4 border-l-4 hover:bg-gray-100 rounded-[4px] font-medium`}
                        onClick={() => setIndexPage(0)}
                    >
                        Thông tin tài khoản
                    </Link>
                    <Link
                        className={`${indexPage === 1 ? "border-[#bb4d00] bg-[#f2edea] text-amber-800" : "border-gray-400"} py-3 px-4 border-l-4 hover:bg-gray-100 rounded-[4px] font-medium`}
                        onClick={() => setIndexPage(1)}
                    >
                        Lịch khám của bạn
                    </Link>
                    <Link
                        className={`${indexPage === 3 ? "border-[#bb4d00] bg-[#f2edea] text-amber-800" : "border-gray-400"} py-3 px-4 border-l-4 hover:bg-gray-100 rounded-[4px] font-medium`}
                        onClick={() => setIndexPage(3)}
                    >
                        Lịch sử khám
                    </Link>
                    <Link
                        className={`${indexPage === 2 ? "border-[#bb4d00] bg-[#f2edea] text-amber-800" : "border-gray-400"} py-3 px-4 border-l-4 hover:bg-gray-100 rounded-[4px] font-medium`}
                        onClick={() => setIndexPage(2)}
                    >
                        Đổi mật khẩu
                    </Link>
                </div>

                <div className='w-[80%] mr-5'>
                    {indexPage === 0 && <AccountInfor />}

                    {indexPage === 1 && (
                        <>
                            {loading && <p>Đang tải lịch khám...</p>}
                            {error && <p className="text-red-500">{error}</p>}

                            {!loading && !error && bookings.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-14 text-gray-500">
                                    <p className="text-base font-medium">
                                        Bạn chưa có lịch khám nào
                                    </p>

                                    <p className="text-sm mt-1 mb-5 text-gray-400">
                                        Hãy đặt lịch để được bác sĩ tư vấn
                                    </p>

                                    <button
                                        onClick={() => navigate("/")}
                                        className="px-6 py-2 text-sm font-medium text-white bg-blue-400 rounded-lg hover:bg-blue-700 transition cursor-pointer"
                                    >
                                        Quay về trang chủ
                                    </button>
                                </div>
                            )}


                            {!loading && !error && bookings.length > 0 && (
                                <BookingItem
                                    items={bookings}
                                    onCancel={handleCancel}

                                />
                            )}

                            {!loading && !error && totalPages > 1 && (
                                <div className="flex justify-end gap-2 mt-3">
                                    <button
                                        className="px-3 py-1 border border-gray-300 bg-gray-100 rounded hover:bg-gray-300 cursor-pointer"
                                        onClick={() => setPage(prev => Math.max(prev - 1, 0))}
                                        disabled={page === 0}
                                    >
                                        &lt;
                                    </button>
                                    <span className="px-3 py-1 border rounded border-gray-300">
                                        {page + 1} / {totalPages}
                                    </span>
                                    <button
                                        className="px-3 py-1 border border-gray-300 bg-gray-100 rounded hover:bg-gray-300 cursor-pointer"
                                        onClick={() => setPage(prev => Math.min(prev + 1, totalPages - 1))}
                                        disabled={page === totalPages - 1}
                                    >
                                        &gt;
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {indexPage === 2 && <ChangePassword />}

                    {indexPage === 3 && <MedicalHistory />}
                </div>
            </div>

            <Footer />


            <ToastContainer
                autoClose={2000}
                hideProgressBar={true}
                pauseOnHover={false}
                closeOnClick
            />



            <CancelBookingModal
                open={openCancel}
                datLichID={selectedBookingId}
                onClose={() => setOpenCancel(false)}
                onSuccess={handleCancelSuccess}
            />
        </>
    );
};

export default UserPage;
