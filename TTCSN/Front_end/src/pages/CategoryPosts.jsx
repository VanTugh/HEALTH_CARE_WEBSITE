import React, { useEffect, useState } from 'react'
import HeaderSub from "../components/HeaderSub";
import Footer from "../components/Footer";
import { Link, useParams } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";

const CategoryPosts = () => {
    const { categoryName } = useParams();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Fetch filter by category
                const res = await fetch(`${API_BASE_URL}/api/v1/posts?category=${categoryName}`);
                const data = await res.json();
                if (data.success) {
                    setPosts(data.data);
                }
            } catch (error) {
                console.error("Lỗi lấy bài viết:", error);
                toast.error("Không thể tải bài viết");
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [categoryName, API_BASE_URL]);

    const formatShortText = (htmlStr) => {
        if (!htmlStr) return "";
        // Strip HTML tags for preview snippet
        let plain = htmlStr.replace(/<[^>]+>/g, '');
        return plain.length > 120 ? plain.substring(0, 120) + "..." : plain;
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <HeaderSub />
            <div className="max-w-[1200px] mx-auto px-4 py-8">
                <div className="text-sm text-gray-500 mb-6">
                    <Link to="/" className="text-blue-500 hover:underline">Trang chủ</Link>
                    <span className="mx-2">/</span>
                    <span className="font-semibold text-gray-700">{categoryName}</span>
                </div>

                <h1 className="text-3xl font-bold text-[#a35a37] mb-8 border-b-2 border-[#a35a37] pb-2 inline-block">
                    {categoryName}
                </h1>

                {loading ? (
                    <p className="text-gray-500 text-lg">Đang tải cấu trúc bài viết...</p>
                ) : posts.length === 0 ? (
                    <div className="bg-white p-8 text-center rounded-xl shadow border">
                        <p className="text-gray-500 text-lg">Hiện tại mục này chưa có bài viết nào mới. Vui lòng quay lại sau!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <Link to={`/post/${post.baiVietID}`} key={post.baiVietID} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group border border-gray-100 transform hover:-translate-y-1">
                                <div className="h-56 overflow-hidden">
                                    <img
                                        src={post.anhBia}
                                        alt={post.tieuDe}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => { e.target.src = "https://placehold.co/600x400/eeeeee/999999?text=No+Image" }}
                                    />
                                </div>
                                <div className="p-5 flex-grow flex flex-col justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-[#a35a37] transition-colors">{post.tieuDe}</h2>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                            {formatShortText(post.noiDung)}
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-gray-400 font-medium pt-3 border-t">
                                        <span>👁️ {post.luotXem} lượt xem</span>
                                        <span>🗓️ {new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
            <ToastContainer />
        </div>
    )
}

export default CategoryPosts
