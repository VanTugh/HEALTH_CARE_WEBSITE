import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';

const KhuyenMaiManager = () => {
    const [vouchers, setVouchers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(false);

    const initialFormData = {
        khuyenMaiID: null,
        maVoucher: '',
        tenKhuyenMai: '',
        phanTramGiam: '',
        giamToiDa: '',
        soLuong: '',
        ngayBatDau: '',
        ngayKetThuc: '',
        trangThai: true
    };
    const [formData, setFormData] = useState(initialFormData);

    const fetchVouchers = async () => {
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const res = await fetch(`${API_BASE_URL}/api/v1/vouchers`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            const data = await res.json();
            if (data.success) {
                setVouchers(data.data);
            }
        } catch (error) {
            console.error('Error fetching vouchers:', error);
        }
    };

    useEffect(() => {
        fetchVouchers();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const url = isEdit
                ? `${API_BASE_URL}/api/v1/vouchers/${formData.khuyenMaiID}`
                : `${API_BASE_URL}/api/v1/vouchers`;
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (res.ok && data.success) {
                toast.success(isEdit ? "Cập nhật thành công!" : "Thêm mới thành công!");
                setShowModal(false);
                fetchVouchers();
            } else {
                toast.error(data.message || "Có lỗi xảy ra");
            }
        } catch (error) {
            toast.error("Lỗi kết nối server");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa mã này?")) return;
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const res = await fetch(`${API_BASE_URL}/api/v1/vouchers/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
            });
            if (res.ok) {
                toast.success("Đã xóa mã khuyến mãi");
                fetchVouchers();
            } else {
                toast.error("Xóa thất bại!");
            }
        } catch (error) {
            toast.error("Lỗi kết nối!");
        }
    };

    const openEdit = (voucher) => {
        setFormData({
            ...voucher,
            ngayBatDau: voucher.ngayBatDau?.slice(0, 16), // datetime-local max format Support
            ngayKetThuc: voucher.ngayKetThuc?.slice(0, 16)
        });
        setIsEdit(true);
        setShowModal(true);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Quản Lý Mã Khuyến Mãi</h2>
                <button
                    onClick={() => { setFormData(initialFormData); setIsEdit(false); setShowModal(true); }}
                    className="flex justify-center items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <FaPlus /> Thêm Mã Mới
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="p-3">Mã Voucher</th>
                            <th className="p-3">Tên Khuyến Mãi</th>
                            <th className="p-3">Giảm (%)</th>
                            <th className="p-3">Giảm tối đa (VNĐ)</th>
                            <th className="p-3">Số lượng</th>
                            <th className="p-3">Hạn sử dụng</th>
                            <th className="p-3">Trạng thái</th>
                            <th className="p-3 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vouchers.map((v, i) => (
                            <tr key={i} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-semibold text-blue-600">{v.maVoucher}</td>
                                <td className="p-3">{v.tenKhuyenMai}</td>
                                <td className="p-3">{v.phanTramGiam}%</td>
                                <td className="p-3">{v.giamToiDa}</td>
                                <td className="p-3">{v.soLuong}</td>
                                <td className="p-3 text-sm text-gray-600">
                                    Từ {v.ngayBatDau?.replace('T', ' ')} <br />
                                    Đến {v.ngayKetThuc?.replace('T', ' ')}
                                </td>
                                <td className="p-3">
                                    {v.trangThai ? (
                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold">Kích hoạt</span>
                                    ) : (
                                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-bold">Vô hiệu</span>
                                    )}
                                </td>
                                <td className="p-3 text-center">
                                    <button onClick={() => openEdit(v)} className="text-yellow-600 mx-2 hover:scale-110"><FaEdit size={18} /></button>
                                    <button onClick={() => handleDelete(v.khuyenMaiID)} className="text-red-600 hover:scale-110"><FaTrash size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4">{isEdit ? 'Chỉnh Sửa Mã Khuyến Mãi' : 'Thêm Mã Khuyến Mãi'}</h3>
                        <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Mã Voucher (Code)</label>
                                <input required type="text" name="maVoucher" value={formData.maVoucher} onChange={handleChange} className="w-full border p-2 rounded" placeholder="CHAO_BAN_MOI" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Tên Mã</label>
                                <input required type="text" name="tenKhuyenMai" value={formData.tenKhuyenMai} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Giảm giá 20%" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Phần trăm giảm (%)</label>
                                <input required type="number" step="0.01" name="phanTramGiam" value={formData.phanTramGiam} onChange={handleChange} className="w-full border p-2 rounded" placeholder="20" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Giảm Tối Đa (VNĐ)</label>
                                <input required type="number" name="giamToiDa" value={formData.giamToiDa} onChange={handleChange} className="w-full border p-2 rounded" placeholder="50000" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Số lượng</label>
                                <input required type="number" name="soLuong" value={formData.soLuong} onChange={handleChange} className="w-full border p-2 rounded" placeholder="100" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Trạng thái</label>
                                <label className="flex items-center gap-2 mt-2">
                                    <input type="checkbox" name="trangThai" checked={formData.trangThai} onChange={handleChange} className="w-5 h-5" />
                                    Khả dụng
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Ngày bắt đầu</label>
                                <input required type="datetime-local" name="ngayBatDau" value={formData.ngayBatDau} onChange={handleChange} className="w-full border p-2 rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Ngày kết thúc</label>
                                <input required type="datetime-local" name="ngayKetThuc" value={formData.ngayKetThuc} onChange={handleChange} className="w-full border p-2 rounded" />
                            </div>

                            <div className="col-span-2 flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200">Hủy</button>
                                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{loading ? 'Đang lưu...' : 'Lưu lại'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KhuyenMaiManager;
