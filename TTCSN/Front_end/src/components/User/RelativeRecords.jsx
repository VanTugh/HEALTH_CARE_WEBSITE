import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const RelativeRecords = () => {
    const [relatives, setRelatives] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        hoTen: '',
        moiQuanHe: 'Cha',
        ngaySinh: '',
        gioiTinh: 1,
        soDienThoai: '',
        diaChi: ''
    });

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        fetchRelatives();
    }, []);

    const fetchRelatives = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/relatives`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            });
            const data = await res.json();
            if (data.success) {
                setRelatives(data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('accessToken');

        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/relatives`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    gioiTinh: parseInt(formData.gioiTinh, 10)
                })
            });
            const data = await res.json();

            if (data.success) {
                toast.success('Thêm người thân thành công!');
                setIsModalOpen(false);
                fetchRelatives();
            } else {
                toast.error(data.message || 'Có lỗi xảy ra');
            }
        } catch (err) {
            toast.error('Lỗi kết nối máy chủ');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xoá người thân này không?")) return;

        const token = localStorage.getItem('accessToken');
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/relatives/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Xoá thành công');
                fetchRelatives();
            } else {
                toast.error(data.message || 'Có lỗi xảy ra');
            }
        } catch (err) {
            toast.error('Lỗi kết nối máy chủ');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-sky-700">Hồ sơ người thân</h2>
                    <p className="text-sm text-gray-500 mt-1">Quản lý đặt lịch khám hộ gia đình, người quen</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-md font-medium text-sm transition"
                >
                    + Thêm người thân
                </button>
            </div>

            {loading ? (
                <p className="text-gray-500 italic">Đang tải danh sách...</p>
            ) : relatives.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded border border-dashed border-gray-300">
                    <p className="text-gray-500 mb-2">Bạn chưa có hồ sơ người thân nào.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {relatives.map(rel => (
                        <div key={rel.nguoiThanID} className="border border-gray-200 rounded-lg p-4 relative group hover:border-sky-300 transition">
                            <h3 className="font-bold text-gray-800 text-lg">{rel.hoTen}</h3>
                            <div className="text-sm text-gray-600 mt-2 space-y-1">
                                <p><span className="font-medium">Quan hệ:</span> {rel.moiQuanHe}</p>
                                <p><span className="font-medium">Số điện thoại:</span> {rel.soDienThoai}</p>
                                <p><span className="font-medium">Giới tính:</span> {rel.gioiTinh === 1 ? 'Nam' : 'Nữ'}</p>
                                {rel.ngaySinh && <p><span className="font-medium">Ngày sinh:</span> {rel.ngaySinh}</p>}
                                {rel.diaChi && <p><span className="font-medium">Quê quán:</span> {rel.diaChi}</p>}
                            </div>

                            <button
                                onClick={() => handleDelete(rel.nguoiThanID)}
                                className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
                            >
                                Xoá
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">Khai báo người thân mới</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
                                <input type="text" name="hoTen" value={formData.hoTen} onChange={handleChange} required className="w-full border p-2 rounded focus:ring-1 focus:ring-sky-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mối quan hệ <span className="text-red-500">*</span></label>
                                <select name="moiQuanHe" value={formData.moiQuanHe} onChange={handleChange} className="w-full border p-2 rounded focus:ring-1 focus:ring-sky-500">
                                    <option value="Cha">Cha</option>
                                    <option value="Mẹ">Mẹ</option>
                                    <option value="Chồng">Chồng</option>
                                    <option value="Vợ">Vợ</option>
                                    <option value="Con trai">Con trai</option>
                                    <option value="Con gái">Con gái</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                                <input type="tel" name="soDienThoai" value={formData.soDienThoai} onChange={handleChange} className="w-full border p-2 rounded focus:ring-1 focus:ring-sky-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quê quán / Địa chỉ</label>
                                <input type="text" name="diaChi" value={formData.diaChi} onChange={handleChange} className="w-full border p-2 rounded focus:ring-1 focus:ring-sky-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                                    <input type="date" name="ngaySinh" value={formData.ngaySinh} onChange={handleChange} className="w-full border p-2 rounded focus:ring-1 focus:ring-sky-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                                    <select name="gioiTinh" value={formData.gioiTinh} onChange={handleChange} className="w-full border p-2 rounded focus:ring-1 focus:ring-sky-500">
                                        <option value={1}>Nam</option>
                                        <option value={0}>Nữ</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">Hủy</button>
                                <button type="submit" className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600">Thêm hồ sơ</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RelativeRecords;
