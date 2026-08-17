import React, { useEffect, useState, useRef } from 'react'
import HeaderSub from "../components/HeaderSub";
import Footer from "../components/Footer";
import { Link, useParams } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toc, setToc] = useState([]);
    const contentRef = useRef(null);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/v1/posts/${id}`);
                const data = await res.json();
                if (data.success) {
                    const items = [];
                    let i = 0;

                    // Inject IDs into the <h2> tags and extract content for TOC
                    const processedHtml = data.data.noiDung.replace(/<h2([^>]*)>(.*?)<\/h2>/gi, (match, attrs, content) => {
                        const originalText = content.replace(/<[^>]+>/g, '').trim();
                        if (!originalText) return match;

                        i++; // Increment step
                        const id = `heading-${i}`;
                        const numberedText = `${i}. ${originalText}`;
                        items.push({ id, text: numberedText });

                        // Inject id, add styling to make it look like a section header (bold, larger), and add the number
                        const extraStyles = "scroll-margin-top: 100px; font-weight: 800; font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem;";
                        return `<h2 id="${id}" style="${extraStyles}"${attrs}>${i}. ${content}</h2>`;
                    });

                    data.data.noiDung = processedHtml;
                    setPost(data.data);
                    setToc(items);
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

    if (loading) return <div className="text-center p-20 text-gray-500">Đang tải bài viết...</div>;
    if (!post) return <div className="text-center p-20 text-red-500 font-bold">Bài viết không tồn tại.</div>;

    return (
        <div className="bg-white min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
            <HeaderSub />

            <style>{`
                .custom-html * { max-width: 100% !important; box-sizing: border-box !important; }
                .custom-html img, .custom-html iframe { max-width: 100% !important; height: auto !important; }
            `}</style>

            <div className="w-full flex justify-center">
                <div className="max-w-[1100px] w-full px-4 lg:px-8 py-10 mb-16">

                    {/* Header */}
                    <div className="mb-8 text-center border-b border-gray-100 pb-8">
                        <div className="text-[13px] mb-4 text-gray-400 flex flex-wrap justify-center items-center gap-2 uppercase tracking-wide">
                            <Link to="/" className="hover:text-[#0b9c7b]">Trang chủ</Link>
                            <span className="text-gray-300">/</span>
                            <Link to={`/category/${post.phanLoai}`} className="text-[#0b9c7b] font-bold hover:underline">{post.phanLoai}</Link>
                        </div>
                        <h1 className="text-3xl md:text-[38px] font-extrabold text-[#111] leading-tight mb-5 max-w-3xl mx-auto">
                            {post.tieuDe}
                        </h1>
                        <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-gray-500 bg-gray-50 px-6 py-3 rounded-full w-fit mx-auto">
                            <span className="flex items-center gap-1.5">
                                <i className="fa-solid fa-pen-nib text-[#0b9c7b]"></i> {post.tenNguoiTao}
                            </span>
                            <span className="text-gray-300">|</span>
                            <span className="flex items-center gap-1.5">
                                <i className="fa-regular fa-calendar text-[#0b9c7b]"></i> {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                            <span className="text-gray-300">|</span>
                            <span className="flex items-center gap-1.5">
                                <i className="fa-regular fa-eye text-[#0b9c7b]"></i> {post.luotXem} lượt xem
                            </span>
                        </div>
                    </div>

                    {/* Two-column layout */}
                    <div className="flex gap-8 items-start">

                        {/* Left: Article content */}
                        <div className="flex-1 min-w-0">
                            {post.anhBia && (
                                <div className="mb-8 rounded-2xl overflow-hidden shadow-sm">
                                    <img src={post.anhBia} alt="cover"
                                        className="w-full h-auto object-cover max-h-[500px]"
                                        onError={(e) => { e.target.style.display = 'none'; }} />
                                </div>
                            )}
                            <div ref={contentRef}
                                className="custom-html prose prose-lg max-w-none text-gray-800 leading-[1.85] prose-headings:font-bold prose-headings:text-[#111] prose-a:text-[#0b9c7b] prose-img:rounded-xl"
                                dangerouslySetInnerHTML={{ __html: post.noiDung }}
                            />
                        </div>

                        {/* Right: Sticky Sidebar */}
                        <div className="hidden lg:block w-[280px] flex-shrink-0">
                            <div className="sticky top-6 space-y-4">

                                {/* TOC Card */}
                                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                                    <h3 className="font-bold text-[#111] mb-4 text-[15px] pb-2 border-b border-gray-100">
                                        Nội dung bài viết
                                    </h3>
                                    {toc.length > 0 ? (
                                        <ul className="space-y-0">
                                            {toc.map((item, idx) => (
                                                <li key={idx}>
                                                    <span
                                                        onClick={() => {
                                                            const element = document.getElementById(item.id);
                                                            if (element) {
                                                                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                            }
                                                        }}
                                                        className="block py-2 text-[13.5px] text-gray-500 hover:text-[#0b9c7b] transition-colors cursor-pointer border-b border-gray-50 last:border-0">
                                                        {item.text}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-[13px] text-gray-400">Đang cập nhật mục lục...</p>
                                    )}
                                </div>

                                {/* Author Card */}
                                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                                    <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-2">
                                        Bài viết được thực hiện bởi
                                    </div>
                                    <div className="font-bold text-[#111] text-[14px]">{post.tenNguoiTao}</div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <Footer />
            <ToastContainer />
        </div>
    )
}

export default PostDetail
