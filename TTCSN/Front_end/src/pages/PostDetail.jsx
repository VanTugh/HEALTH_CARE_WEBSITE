import React, { useEffect, useState } from 'react'
import HeaderSub from "../components/HeaderSub";
import Footer from "../components/Footer";
import { Link, useParams } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/v1/posts/${id}`);
                const data = await res.json();
                if (data.success) {
                    setPost(data.data);
                } else {
                    toast.error("Không tìm thấy bài viết");
                }
            } catch (error) {
                console.error(error);
                toast.error("Lỗi lấy thông tin bài viết");
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id, API_BASE_URL]);

    if (loading) return <div className="text-center p-20 text-gray-500 text-lg">Đang tải bài viết...</div>;
    if (!post) return <div className="text-center p-20 text-red-500 font-bold text-lg border m-20 rounded-xl">Bài viết không tồn tại.</div>;

    return (
        <div className="bg-[#f2f6f9] min-h-screen">
            <HeaderSub />

            <div className="max-w-[800px] mx-auto px-4 py-8 mb-10">
                {/* Breadcrumbs */}
                <div className="text-sm mb-6 bg-white p-3 rounded-lg shadow-sm">
                    <Link to="/" className="text-blue-500 hover:underline font-medium">Trang chủ</Link>
                    <span className="mx-2 text-gray-400">/</span>
                    <Link to={`/category/${post.phanLoai}`} className="text-blue-500 hover:underline font-medium">{post.phanLoai}</Link>
                    <span className="mx-2 text-gray-400">/</span>
                    <span className="text-gray-500">{post.tieuDe}</span>
                </div>

                {/* Article Header */}
                <div className="bg-white rounded-t-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <img
                        src={post.anhBia}
                        alt="cover"
                        className="w-full h-[300px] md:h-[400px] object-cover"
                        onError={(e) => { e.target.src = "https://placehold.co/1200x400/eeeeee/999999?text=No+Cover" }}
                    />
                    <div className="p-6 md:p-10 pb-0">
                        <span className="bg-[#a35a37] text-white text-xs font-bold px-3 py-1 uppercase rounded-full tracking-wide">
                            {post.phanLoai}
                        </span>
                        <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 mt-4 leading-tight">
                            {post.tieuDe}
                        </h1>
                        <div className="flex items-center gap-4 mt-6 text-sm text-gray-500 font-medium">
                            <span className="flex items-center gap-1">✍️ Biên tập: Tác Giả {post.tenNguoiTao}</span>
                            <span className="flex items-center justify-center w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span className="flex items-center gap-1">🗓️ {new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                            <span className="flex items-center justify-center w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span className="flex items-center gap-1">👁️ {post.luotXem}</span>
                        </div>
                    </div>
                </div>

                {/* Article Content rendered as HTML */}
                <div className="bg-white p-6 md:p-10 rounded-b-2xl shadow-sm border border-gray-100 border-t-0">
                    <div
                        className="prose prose-lg prose-blue max-w-none text-gray-700"
                        style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.1rem", lineHeight: "1.8" }}
                        dangerouslySetInnerHTML={{ __html: post.noiDung }}
                    />
                </div>
            </div>

            <Footer />
            <ToastContainer />
        </div>
    )
}

export default PostDetail
