-- ============================================================
-- UPDATE: Gán tác giả là bác sĩ cho từng bài viết
-- Bác sĩ lấy từ GuiChoTung.sql (NguoiDungID thực tế)
-- Chạy file này SAU khi đã chạy MIGRATION_PHASE5_BAIVIET.sql
-- ============================================================
USE DatLichKham;

-- Tắt chế độ Safe Update để cho phép UPDATE bằng TieuDe (không phải Primary Key)
SET SQL_SAFE_UPDATES = 0;

-- Gán NguoiTao = NguoiDungID của bác sĩ tương ứng
-- (Dựa vào thứ tự INSERT trong GuiChoTung.sql)
-- BacSi Cơ Xương Khớp    → NguoiDungID = 3
-- BacSi Thần Kinh         → NguoiDungID = 4
-- BacSi Tiêu Hóa          → NguoiDungID = 5
-- BacSi Tim Mạch          → NguoiDungID = 6
-- BacSi Tai Mũi Họng     → NguoiDungID = 7
-- BacSi Cột Sống          → NguoiDungID = 8
-- BacSi Da Liễu           → NguoiDungID = 9
-- BacSi Hô Hấp            → NguoiDungID = 10
-- Nguyễn Văn Hưng         → NguoiDungID = 13 (khoảng)
-- Trần Thị Huyền          → NguoiDungID = 14

-- Sử dụng subquery để lấy đúng NguoiDungID theo Email

-- Bài 1 - Sốt xuất huyết → Bác sĩ Hô Hấp
UPDATE BaiViet SET NguoiTao = (SELECT NguoiDungID FROM NguoiDung WHERE Email = 'bs.hohap@example.com' LIMIT 1)
WHERE TieuDe LIKE '%Sốt xuất huyết%';

-- Bài 2 - Rối loạn nhịp tim → Bác sĩ Tim Mạch
UPDATE BaiViet SET NguoiTao = (SELECT NguoiDungID FROM NguoiDung WHERE Email = 'bs.timmach@example.com' LIMIT 1)
WHERE TieuDe LIKE '%Rối loạn nhịp tim%';

-- Bài 3 - Chấn thương thể thao → Bác sĩ Cơ Xương Khớp
UPDATE BaiViet SET NguoiTao = (SELECT NguoiDungID FROM NguoiDung WHERE Email = 'bs.cxk@example.com' LIMIT 1)
WHERE TieuDe LIKE '%Chấn Thương Thể Thao%';

-- Bài 4 - Tăng huyết áp → Bác sĩ Tim Mạch
UPDATE BaiViet SET NguoiTao = (SELECT NguoiDungID FROM NguoiDung WHERE Email = 'bs.timmach@example.com' LIMIT 1)
WHERE TieuDe LIKE '%Tăng huyết áp%';

-- Bài 5 - Tiểu đường → Bác sĩ Nội tiết (dùng Bs Tiêu Hóa thay thế)
UPDATE BaiViet SET NguoiTao = (SELECT NguoiDungID FROM NguoiDung WHERE Email = 'bs.tieuhóa@example.com' LIMIT 1)
WHERE TieuDe LIKE '%tiểu đường%';

-- Bài 6 - Vaccine HPV → Bác sĩ (Trần Thị Huyền)
UPDATE BaiViet SET NguoiTao = (SELECT NguoiDungID FROM NguoiDung WHERE Email = 'huyentt.truyennhiem@healthcare.vn' LIMIT 1)
WHERE TieuDe LIKE '%Vaccine HPV%';

-- Bài 7 - Đột quỵ → Bác sĩ Thần Kinh
UPDATE BaiViet SET NguoiTao = (SELECT NguoiDungID FROM NguoiDung WHERE Email = 'bs.thankinh@example.com' LIMIT 1)
WHERE TieuDe LIKE '%Đột quỵ não%';

-- Bài 8 - Thực phẩm tim mạch → Nguyễn Văn Hưng
UPDATE BaiViet SET NguoiTao = (SELECT NguoiDungID FROM NguoiDung WHERE Email = 'hungnv.truyennhiem@healthcare.vn' LIMIT 1)
WHERE TieuDe LIKE '%siêu thực phẩm%';

-- Bài 9 - Sức khỏe tâm thần → Lê Thị Ngân
UPDATE BaiViet SET NguoiTao = (SELECT NguoiDungID FROM NguoiDung WHERE Email = 'nganlt.truyennhiem@healthcare.vn' LIMIT 1)
WHERE TieuDe LIKE '%sức khỏe tâm thần%';

-- Bài 10 - Lupus → Bác sĩ Da Liễu
UPDATE BaiViet SET NguoiTao = (SELECT NguoiDungID FROM NguoiDung WHERE Email = 'bs.dalie@example.com' LIMIT 1)
WHERE TieuDe LIKE '%Lupus ban đỏ%';

-- ============================================================
-- XÓA ICON EMOJI KHỎI NỘI DUNG BÀI VIẾT
-- Xóa các ký tự emoji phổ biến (💔🧠🚿😴👀🩹🦶🚭💊📱⚖️...)
-- ============================================================

-- Thay từng emoji bằng chuỗi rỗng
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '💔', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '🧠', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '🫀', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '👁️', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '🫘', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '⚠️', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '🥗', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '🏃', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '⚖️', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '🚭', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '💊', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '📱', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '💡', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '🚿', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '😴', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '👀', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '🩹', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '🦶', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '🔬', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '📊', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '📌', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '✅', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '❌', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '🔬', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '📅', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '🚨', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '⏰', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '🩸', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '💥', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '⚡', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '🚫', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '🐟', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '🥑', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '🫐', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '🌰', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '🧄', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '🥬', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '🌾', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '🍅', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '😔', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '😰', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '🎯', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '🍽️', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '👥', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '💭', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '🧘', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '✍️', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '🌿', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '💚', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '🥦', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '💪', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '🗣️', '');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '📞', '');

-- Xóa khoảng trắng thừa đầu nội dung trong <li> sau khi xóa emoji
-- (Tùy chọn: thay "  " thành " ")
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '<li>  ', '<li>');
UPDATE BaiViet SET NoiDung = REPLACE(NoiDung, '<li> ', '<li>');

-- Xác nhận kết quả
SELECT BaiVietID, TieuDe, NguoiTao,
    (SELECT HoTen FROM NguoiDung WHERE NguoiDungID = BaiViet.NguoiTao) AS TenTacGia
FROM BaiViet
ORDER BY BaiVietID;

-- Bật lại chế độ Safe Update
SET SQL_SAFE_UPDATES = 1;

USE DatLichKham;
SET SQL_SAFE_UPDATES = 0;
UPDATE BaiViet 
SET AnhBia = 'https://www.sannhinghean.vn/Resources/Editors/Images/muoi-van-la-thu-pham-lay-truyen-benh-sot-xuat-huyet.jpg.jpg'
WHERE TieuDe LIKE '%Sốt xuất huyết: Nguyên nhân, Triệu chứng%';
SET SQL_SAFE_UPDATES = 1;

USE DatLichKham;
SET SQL_SAFE_UPDATES = 0;
UPDATE BaiViet 
SET AnhBia = 'https://cdn.nhathuoclongchau.com.vn/v1/static/DT_Ds2_1_4b82c6beb2.jpeg'
WHERE TieuDe LIKE '%Bệnh tiểu đường tuýp 2%';
SET SQL_SAFE_UPDATES = 1;

USE DatLichKham;
SET SQL_SAFE_UPDATES = 0;
UPDATE BaiViet 
SET AnhBia = 'https://dalieudhyd.vn/wp-content/uploads/2025/01/lupus-ban-do-1.webp'
WHERE TieuDe LIKE '%Bệnh Lupus ban đỏ là gì%';
SET SQL_SAFE_UPDATES = 1;
