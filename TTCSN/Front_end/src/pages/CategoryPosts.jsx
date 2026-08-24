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
        let plain = htmlStr.replace(/<[^>]+>/g, '');
        return plain.length > 150 ? plain.substring(0, 150) + "..." : plain;
    };

    return (
        <div className="bg-[#f8f9fa] min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
            <HeaderSub />

            <div className="w-full flex justify-center">
                <div className="max-w-[1100px] w-full px-4 lg:px-8 py-10">

                    {/* Breadcrumb */}
                    <div className="text-[13px] text-gray-400 mb-6 flex items-center gap-2">
                        <Link to="/" className="hover:text-[#0b9c7b] transition-colors">Trang chủ</Link>
                        <span className="text-gray-300">/</span>
                        <span className="font-semibold text-gray-700">{categoryName}</span>
                    </div>

                    {/* Category Title */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-1 h-8 bg-[#0b9c7b] rounded-full"></div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-[#111]">{categoryName}</h1>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                                    <div className="h-48 bg-gray-200"></div>
                                    <div className="p-5 space-y-3">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-200 rounded"></div>
                                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-gray-100">
                            <i className="fa-regular fa-newspaper text-5xl text-gray-300 mb-4 block"></i>
                            <p className="text-gray-500 text-lg font-medium">Hiện tại mục này chưa có bài viết nào.</p>
                            <p className="text-gray-400 text-sm mt-1">Vui lòng quay lại sau!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.map((post) => (
                                <Link
                                    to={`/post/${post.baiVietID}`}
                                    key={post.baiVietID}
                                    className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col border border-gray-100 group"
                                >
                                    {/* Thumbnail */}
                                    <div className="h-52 overflow-hidden bg-gray-100">
                                        <img
                                            src={post.anhBia}
                                            alt={post.tieuDe}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1576091160550-2173ff9e5c26?auto=format&fit=crop&q=80&w=600&h=400" }}
                                        />
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-5 flex-grow flex flex-col gap-3">
                                        {/* Category Tag */}
                                        <span className="bg-[#eaf8f5] text-[#0b9c7b] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider w-fit">
                                            {post.phanLoai}
                                        </span>

                                        {/* Title */}
                                        <h2 className="text-[16px] font-bold text-[#111] leading-snug line-clamp-2 group-hover:text-[#0b9c7b] transition-colors">
                                            {post.tieuDe}
                                        </h2>

                                        {/* Snippet */}
                                        <p className="text-gray-500 text-[13px] leading-relaxed line-clamp-3 flex-grow">
                                            {formatShortText(post.noiDung)}
                                        </p>

                                        {/* Footer Meta */}
                                        <div className="flex justify-between items-center text-[12px] text-gray-400 pt-3 border-t border-gray-50 font-medium">
                                            <span className="flex items-center gap-1.5">
                                                <i className="fa-regular fa-eye text-[#0b9c7b]"></i> {post.luotXem} lượt xem
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <i className="fa-regular fa-calendar text-[#0b9c7b]"></i> {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
            <ToastContainer />
        </div>
    )
}

export default CategoryPosts
