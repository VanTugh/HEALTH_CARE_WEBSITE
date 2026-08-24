import React, { useState, useEffect } from 'react';
import HeaderMain from '../components/HeaderMain';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const SreachInfor = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('doctor');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const search = async (term) => {
        if (!term.trim()) {
            setResults([]);
            setError(`Vui lòng nhập ${searchType === 'doctor' ? 'tên bác sĩ hoặc chuyên khoa' : 'tên chuyên khoa'}`);
            return;
        }

        setError('');
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            let url = '';

            if (searchType === 'doctor') {
                url = `${API_BASE_URL}/api/doctors/search?keyword=${encodeURIComponent(term)}&page=0&size=10`;
            } else {
                url = `${API_BASE_URL}/api/specialties/search?keyword=${encodeURIComponent(term)}`;
            }

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    "ngrok-skip-browser-warning": "true",
                },
            });

            if (!response.ok) throw new Error('Lỗi khi tìm kiếm');

            const data = await response.json();
            setResults(searchType === 'doctor' ? data.content : data);
        } catch (err) {
            console.error('Lỗi tìm kiếm:', err);
            alert('Có lỗi xảy ra khi tìm kiếm');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm.trim() !== '') {
                search(searchTerm);
            } else {
                setResults([]);
                setError('');
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm, searchType]);

    return (
        <div>
            <HeaderMain check={"tatca"} />

            <div className="max-w-[900px] mx-auto lg:mt-[130px] md:mt-[180px] mt-[190px] px-5">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
                    Tìm kiếm {searchType === 'doctor' ? 'bác sĩ' : 'chuyên khoa'}
                </h2>


                <div className="flex flex-col md:flex-row gap-3 mb-2 justify-center items-center">
                    <input
                        type="text"
                        placeholder={`Nhập tên ${searchType === 'doctor' ? 'bác sĩ hoặc chuyên khoa' : 'chuyên khoa'}`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 flex-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
                    />

                    <select
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                        className="w-full md:w-auto border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    >
                        <option value="doctor">Tên bác sĩ</option>
                        <option value="specialty">Tên chuyên khoa</option>
                    </select>
                </div>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                {loading && <p className="text-center text-gray-500">Đang tìm kiếm...</p>}

                <div className="flex flex-col gap-4 mt-5">
                    {results.map((item) =>
                        searchType === 'doctor' ? (
                            <Link
                                key={item.bacSiID}
                                to={`/doctor/${item.bacSiID}`}
                                className="border border-gray-300 rounded-lg py-2 px-4 flex items-center gap-4 bg-white shadow hover:shadow-lg transition transform hover:-translate-y-1"
                            >
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-100 flex-shrink-0">
                                    <img
                                        src={item.avatarUrl || 'https://via.placeholder.com/150'}
                                        alt={item.hoTen}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-800">{item.hoTen}</h3>
                                    <p className="text-gray-500 text-sm">{item.tenChuyenKhoa}</p>
                                </div>
                            </Link>
                        ) : (
                            <Link
                                key={item.chuyenKhoaID}
                                to={`/chuyenkhoa/${item.chuyenKhoaID}`}
                                className="border border-gray-300 rounded-lg py-2 px-4 flex items-center gap-4 bg-white shadow hover:shadow-lg transition transform hover:-translate-y-1"
                            >
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-100 flex-shrink-0">
                                    <img
                                        src={item.anhDaiDien || 'https://via.placeholder.com/150'}
                                        alt={item.tenChuyenKhoa}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-800">{item.tenChuyenKhoa}</h3>
                                </div>
                            </Link>
                        )
                    )}
                </div>

                {results.length === 0 && !loading && !error && (
                    <p className="text-center text-gray-500 mt-5 text-lg">Chưa có kết quả nào</p>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default SreachInfor;
