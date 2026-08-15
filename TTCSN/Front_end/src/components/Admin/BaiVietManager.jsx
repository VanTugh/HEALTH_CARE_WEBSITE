import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const BaiVietManager = () => {
    const [posts, setPosts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [formData, setFormData] = useState({
        baiVietID: null,
        tieuDe: "",
        anhBia: "",
        phanLoai: "Được quan tâm",
        noiDung: ""
    });

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/posts`);
            const data = await res.json();
            if (data.success) {
                setPosts(data.data);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Lỗi kết nối Server");
        }
    };

    const handleOpenModal = (post = null) => {
        if (post) {
            setIsEdit(true);
            setFormData(post);
        } else {
            setIsEdit(false);
            setFormData({
                baiVietID: null,
                tieuDe: "",
                anhBia: "https://",
                phanLoai: "Được quan tâm",
                noiDung: ""
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("accessToken");
        if (!token) return toast.error("Bạn chưa đăng nhập");

        try {
            const url = isEdit
                ? `${API_BASE_URL}/api/v1/posts/${formData.baiVietID}`
                : `${API_BASE_URL}/api/v1/posts`;
            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (data.success) {
                toast.success(isEdit ? "Cập nhật thành công!" : "Thêm bài viết mới thành công!");
                fetchPosts();
                handleCloseModal();
            } else {
                toast.error(data.message || "Lỗi lưu bài viết");
            }
        } catch (error) {
            console.error(error);
            toast.error("Lỗi kết nối Server");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;
        const token = localStorage.getItem("accessToken");

        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/posts/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Xóa thành công!");
                fetchPosts();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Lỗi xóa bài viết");
        }
    };

    const formatShortText = (str) => {
        return str && str.length > 50 ? str.slice(0, 50) + "..." : str;
    };

    return (
        <div className="p-4 md:p-6 bg-white shadow rounded-lg w-[82vw]">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản Lý Bài Viết & Gợi Ý</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-[#a35a37] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-[#854527] transition"
                >
                    <FaPlus /> Thêm Bài Viết Mới
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-[1050px] border-collapse bg-white shadow-sm rounded-lg overflow-hidden border">
                    <thead className="bg-[#a35a37] text-white text-left">
                        <tr>
                            <th className="p-3 w-16">ID</th>
                            <th className="p-3 w-28">Hình Ảnh</th>
                            <th className="p-3 w-[260px]">Tiêu Đề</th>
                            <th className="p-3 w-32">Chuyên Mục</th>
                            <th className="p-3">Nội Dung (HTML)</th>
                            <th className="p-3 w-20 text-center">Lượt Xem</th>
                            <th className="p-3 w-28 text-center">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((post) => (
                            <tr key={post.baiVietID} className="border-b hover:bg-gray-50 transition">
                                <td className="p-3 font-semibold">{post.baiVietID}</td>
                                <td className="p-3">
                                    <img src={post.anhBia} alt="Thumbnail" className="w-16 h-16 object-cover rounded-md border" />
                                </td>
                                <td className="p-3 font-medium text-gray-800">{post.tieuDe}</td>
                                <td className="p-3 text-blue-600 font-semibold">{post.phanLoai}</td>
                                <td className="p-3 text-gray-500 text-sm">{formatShortText(post.noiDung)}</td>
                                <td className="p-3 text-center text-gray-800">{post.luotXem}</td>
                                <td className="p-3 flex justify-center gap-3">
                                    <button
                                        onClick={() => handleOpenModal(post)}
                                        className="text-blue-500 hover:text-blue-700 bg-blue-100 p-2 rounded-md transition"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(post.baiVietID)}
                                        className="text-red-500 hover:text-red-700 bg-red-100 p-2 rounded-md transition"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {posts.length === 0 && (
                            <tr>
                                <td colSpan="7" className="text-center p-6 text-gray-500">Chưa có bài viết nào!</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Bảng */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 top-[100px]">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden animate-fadeIn">
                        <div className="flex justify-between items-center bg-[#a35a37] p-4 text-white">
                            <h2 className="text-xl font-bold">{isEdit ? "Chỉnh Sửa Bài Viết" : "Thêm Bài Viết"}</h2>
                            <button onClick={handleCloseModal} className="text-2xl cursor-pointer">&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 h-[70vh] overflow-y-auto w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="mb-4 col-span-2">
                                    <label className="block text-gray-700 font-semibold mb-2">Tiêu Đề <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full border p-2 rounded-lg"
                                        value={formData.tieuDe}
                                        onChange={(e) => setFormData({ ...formData, tieuDe: e.target.value })}
                                        placeholder="Tên bài báo..."
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-semibold mb-2">Đường dẩn Ảnh Bìa</label>
                                    <input
                                        type="text"
                                        className="w-full border p-2 rounded-lg"
                                        value={formData.anhBia}
                                        onChange={(e) => setFormData({ ...formData, anhBia: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-semibold mb-2">Danh Chọn Mục (Mục Gợi ý)</label>
                                    <select
                                        className="w-full border p-2 rounded-lg"
                                        value={formData.phanLoai}
                                        onChange={(e) => setFormData({ ...formData, phanLoai: e.target.value })}
                                    >
                                        <option value="Được quan tâm">Phần "Được quan tâm"</option>
                                        <option value="Y tế">Phần "Y tế"</option>
                                        <option value="Bài viết liên quan">Phần "Bài viết liên quan"</option>
                                    </select>
                                </div>
                                <div className="mb-4 col-span-2">
                                    <label className="block text-gray-700 font-semibold mb-2">Thuật Toán Văn Bản Nhúng (HTML)</label>
                                    <p className="text-xs text-gray-500 mb-1">
                                        Mẹo: Bạn có thể viết HTML (như &#60;h1&#62;, &#60;p&#62;, &#60;img&#62;, &#60;b&#62;) để điều chỉnh kiểu thiết kế báo giấy trang nhã.
                                    </p>
                                    <textarea
                                        required
                                        rows="12"
                                        className="w-full border p-2 rounded-lg font-mono text-sm bg-gray-50"
                                        value={formData.noiDung}
                                        onChange={(e) => setFormData({ ...formData, noiDung: e.target.value })}
                                        placeholder="<h1>...</h1>"
                                    ></textarea>
                                </div>
                            </div>
                            <div className="flex justify-end mt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium mr-2 hover:bg-gray-400"
                                >
                                    Đóng
                                </button>
                                <button
                                    type="submit"
                                    className="bg-[#a35a37] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#854527]"
                                >
                                    Lưu Bài Viết
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default BaiVietManager;
