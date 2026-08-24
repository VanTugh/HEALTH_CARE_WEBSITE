USE DatLichKham;

-- Tắt chế độ Safe Update để cho phép DELETE mà không cần khoá chính
SET SQL_SAFE_UPDATES = 0;

-- ============================================================
-- XÓA BÀI VIẾT TRÙNG LẶP
-- Xóa bài viết nếu có TieuDe trùng nhau, chỉ giữ lại bản ghi có ID lớn nhất 
-- (những bản ghi mới nhất, sau khi đã cập nhật Tác giả và xóa Emoji)
-- ============================================================
DELETE t1 FROM BaiViet t1
INNER JOIN BaiViet t2 
WHERE t1.BaiVietID < t2.BaiVietID AND t1.TieuDe = t2.TieuDe;

-- Bật lại chế độ Safe Update
SET SQL_SAFE_UPDATES = 1;

-- Kiểm tra lại số lượng (Sẽ chỉ còn đúng 10 bài viết duy nhất)
SELECT BaiVietID, TieuDe, NguoiTao, LuotXem 
FROM BaiViet 
ORDER BY BaiVietID;
