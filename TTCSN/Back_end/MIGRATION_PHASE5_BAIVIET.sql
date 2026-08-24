-- Cập nhật bài viết mẫu đầy đủ với nội dung chỉnh chu, hình ảnh thực tế
USE DatLichKham;

CREATE TABLE IF NOT EXISTS BaiViet (
    BaiVietID INT AUTO_INCREMENT PRIMARY KEY,
    TieuDe VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    AnhBia VARCHAR(1000) DEFAULT NULL,
    PhanLoai VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    NoiDung LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    LuotXem INT DEFAULT 0,
    NguoiTao INT,
    TenTacGia VARCHAR(255) DEFAULT NULL,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    DeletedAt DATETIME DEFAULT NULL,
    CreatedBy INT DEFAULT NULL,
    UpdatedBy INT DEFAULT NULL,
    DeletedBy INT DEFAULT NULL,
    IsDeleted TINYINT(1) DEFAULT 0
);

-- Thêm cột TenTacGia cho bảng đang tồn tại (tương thích MySQL 5.7+)
DROP PROCEDURE IF EXISTS sp_AddTenTacGia;
DELIMITER $$
CREATE PROCEDURE sp_AddTenTacGia()
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = 'DatLichKham'
          AND TABLE_NAME   = 'BaiViet'
          AND COLUMN_NAME  = 'TenTacGia'
    ) THEN
        ALTER TABLE BaiViet ADD COLUMN TenTacGia VARCHAR(255) DEFAULT NULL AFTER NguoiTao;
    END IF;
END$$
DELIMITER ;
CALL sp_AddTenTacGia();
DROP PROCEDURE IF EXISTS sp_AddTenTacGia;

-- Xóa toàn bộ dữ liệu cũ và reset AUTO_INCREMENT về 1
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE BaiViet;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- BÀI VIẾT 1 — Chuyên mục: Được quan tâm
-- ============================================================
INSERT INTO BaiViet (TieuDe, AnhBia, PhanLoai, NoiDung, LuotXem, NguoiTao) VALUES (
'Sốt xuất huyết: Nguyên nhân, Triệu chứng và Cách phòng tránh hiệu quả',
'https://www.sannhinghean.vn/Resources/Editors/Images/muoi-van-la-thu-pham-lay-truyen-benh-sot-xuat-huyet.jpg.jpg',
'Được quan tâm',
'<h2 style="color:#a35a37; font-size:1.5rem; margin-top:1.5rem">Sốt xuất huyết là gì?</h2>
<p>Sốt xuất huyết (Dengue) là bệnh truyền nhiễm cấp tính do virus Dengue gây ra. Bệnh lây truyền qua vết đốt của muỗi vằn Aedes aegypti — loài muỗi có sọc đen trắng đặc trưng, hoạt động mạnh vào ban ngày. Đây là một trong những bệnh truyền nhiễm phổ biến nhất ở vùng nhiệt đới và cận nhiệt đới, đặc biệt trong mùa mưa.</p>

<img src="https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2022/8/30/sot-xuat-huyet-16618432628261622698680.jpg" style="width:100%; max-height:400px; object-fit:cover; border-radius:12px; margin:1rem 0" alt="Muỗi vằn gây sốt xuất huyết" />

<h2 style="color:#a35a37; font-size:1.5rem; margin-top:1.5rem">Triệu chứng điển hình</h2>
<p>Sau khi bị muỗi đốt từ <strong>4–10 ngày</strong>, người bệnh thường xuất hiện các triệu chứng sau:</p>
<ul style="padding-left:1.5rem; line-height:2">
  <li>🌡️ <strong>Sốt cao đột ngột</strong> từ 39–40°C, kéo dài liên tục 2–7 ngày</li>
  <li>🤕 <strong>Đau đầu dữ dội</strong>, đặc biệt là đau sau hốc mắt</li>
  <li>💪 <strong>Đau nhức cơ bắp và các khớp</strong> toàn thân (còn gọi là "bệnh gãy xương")</li>
  <li>🔴 <strong>Nổi ban đỏ</strong> trên da, xuất hiện từ ngày thứ 3–5</li>
  <li>🤢 Buồn nôn, nôn mửa, mệt mỏi cực độ</li>
  <li>⚠️ Trong trường hợp nặng: chảy máu nướu, chảy máu mũi, bầm tím dưới da</li>
</ul>

<div style="background:#fff3cd; border-left:4px solid #f6c310; padding:1rem; border-radius:8px; margin:1.5rem 0">
  <strong>⚠️ Dấu hiệu cảnh báo khẩn cấp:</strong> Nếu bệnh nhân có dấu hiệu <em>đau bụng dữ dội, nôn liên tục, chảy máu bất thường, hoặc li bì khó đánh thức</em> — hãy đưa đến bệnh viện NGAY LẬP TỨC!
</div>

<h2 style="color:#a35a37; font-size:1.5rem; margin-top:1.5rem">Phương pháp điều trị</h2>
<p>Hiện nay <strong>chưa có thuốc đặc trị</strong> sốt xuất huyết. Điều trị chủ yếu là hỗ trợ triệu chứng:</p>
<ul style="padding-left:1.5rem; line-height:2">
  <li>Uống nhiều nước và dung dịch bù điện giải (Oresol)</li>
  <li>Dùng <strong>Paracetamol</strong> để hạ sốt — <em>Tuyệt đối không dùng Aspirin hoặc Ibuprofen</em> vì có nguy cơ xuất huyết</li>
  <li>Nghỉ ngơi tuyệt đối, theo dõi nhiệt độ thường xuyên</li>
  <li>Trường hợp nặng cần truyền dịch và theo dõi tiểu cầu tại bệnh viện</li>
</ul>

<img src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80" style="width:100%; max-height:350px; object-fit:cover; border-radius:12px; margin:1rem 0" alt="Điều trị sốt xuất huyết" />

<h2 style="color:#a35a37; font-size:1.5rem; margin-top:1.5rem">Biện pháp phòng ngừa hiệu quả</h2>
<p>Phòng bệnh hơn chữa bệnh! Dưới đây là những biện pháp được Bộ Y tế khuyến cáo:</p>
<ul style="padding-left:1.5rem; line-height:2">
  <li>🦟 <strong>Diệt muỗi và bọ gậy:</strong> Đậy kín dụng cụ chứa nước, thay nước bình hoa mỗi tuần</li>
  <li>🛡️ Mặc quần áo dài tay, dùng kem xua muỗi khi ra ngoài</li>
  <li>🏠 Ngủ trong màn kể cả ban ngày</li>
  <li>💉 Tiêm vaccine phòng Dengue cho trẻ em từ 9–45 tuổi (Dengvaxia)</li>
  <li>🧹 Dọn dẹp vật dụng phế liệu xung quanh nhà tránh đọng nước</li>
</ul>

<div style="background:#e8f5e9; border-left:4px solid #4caf50; padding:1rem; border-radius:8px; margin:1.5rem 0">
  <strong>💡 Lời khuyên từ HealthCare:</strong> Nếu bạn sống ở khu vực đang có dịch, hãy chủ động đến các cơ sở y tế gần nhất để được xét nghiệm và theo dõi, đừng chờ đến khi triệu chứng trở nên nghiêm trọng mới đến khám.
</div>',
325, 1);

-- ============================================================
-- BÀI VIẾT 2 — Chuyên mục: Y tế
-- ============================================================
INSERT INTO BaiViet (TieuDe, AnhBia, PhanLoai, NoiDung, LuotXem, NguoiTao) VALUES (
'Rối loạn nhịp tim: Phân loại, Chẩn đoán và Phương pháp điều trị hiện đại',
'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=800&q=80',
'Y tế',
'<h2 style="color:#a35a37; font-size:1.5rem; margin-top:1.5rem">Rối loạn nhịp tim là gì?</h2>
<p>Rối loạn nhịp tim (Arrhythmia) là tình trạng tim đập không đều — quá nhanh, quá chậm, hoặc theo nhịp không đồng bộ. Bình thường, tim người trưởng thành đập từ <strong>60–100 lần/phút</strong>. Khi hệ thống điện của tim bị rối loạn, nhịp đập có thể trở nên nguy hiểm và thậm chí đe dọa tính mạng.</p>

<img src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80" style="width:100%; max-height:400px; object-fit:cover; border-radius:12px; margin:1rem 0" alt="Rối loạn nhịp tim" />

<h2 style="color:#a35a37; font-size:1.5rem; margin-top:1.5rem">Phân loại rối loạn nhịp tim</h2>
<p>Có 4 nhóm chính được phân loại theo nguồn gốc và biểu hiện:</p>

<div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin:1rem 0">
  <div style="background:#fff; border:1px solid #e0e0e0; border-radius:12px; padding:1rem">
    <h3 style="color:#1565c0">⚡ Tim đập nhanh (Tachycardia)</h3>
    <p>Nhịp tim > 100 lần/phút. Bao gồm: rung nhĩ, cuồng nhĩ, nhịp nhanh thất</p>
  </div>
  <div style="background:#fff; border:1px solid #e0e0e0; border-radius:12px; padding:1rem">
    <h3 style="color:#1565c0">🐢 Tim đập chậm (Bradycardia)</h3>
    <p>Nhịp tim &lt; 60 lần/phút. Thường gặp ở người lớn tuổi hoặc vận động viên</p>
  </div>
  <div style="background:#fff; border:1px solid #e0e0e0; border-radius:12px; padding:1rem">
    <h3 style="color:#c62828">❤️ Rung nhĩ (Atrial Fibrillation)</h3>
    <p>Phổ biến nhất, tâm nhĩ co bóp hỗn loạn làm tăng nguy cơ đột quỵ 5 lần</p>
  </div>
  <div style="background:#fff; border:1px solid #e0e0e0; border-radius:12px; padding:1rem">
    <h3 style="color:#c62828">⚠️ Nhịp nhanh thất (Ventricular Tachycardia)</h3>
    <p>Nguy hiểm nhất, có thể dẫn đến đột tử tim nếu không can thiệp kịp thời</p>
  </div>
</div>

<h2 style="color:#a35a37; font-size:1.5rem; margin-top:1.5rem">Triệu chứng cần chú ý</h2>
<ul style="padding-left:1.5rem; line-height:2">
  <li>💓 Tim đập thình thịch, hồi hộp rõ rệt</li>
  <li>😵 Chóng mặt, choáng váng đột ngột</li>
  <li>😮‍💨 Khó thở khi gắng sức hoặc lúc nghỉ ngơi</li>
  <li>😰 Đau ngực, cảm giác bóp nghẹt ở ngực</li>
  <li>😴 Mệt mỏi kéo dài không rõ nguyên nhân</li>
  <li>🫥 Ngất xỉu hoặc sắp ngất (cần cấp cứu ngay!)</li>
</ul>

<h2 style="color:#a35a37; font-size:1.5rem; margin-top:1.5rem">Các phương pháp chẩn đoán</h2>

<img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80" style="width:100%; max-height:350px; object-fit:cover; border-radius:12px; margin:1rem 0" alt="Chẩn đoán tim mạch" />

<ul style="padding-left:1.5rem; line-height:2.2">
  <li>📈 <strong>Điện tâm đồ (ECG/EKG):</strong> Ghi lại hoạt động điện của tim, nhanh và không xâm lấn</li>
  <li>📟 <strong>Holter tim 24–48 giờ:</strong> Theo dõi nhịp tim liên tục bằng máy đeo trên người</li>
  <li>🏃 <strong>Nghiệm pháp gắng sức (Test tim mạch):</strong> Phát hiện rối loạn nhịp khi vận động</li>
  <li>🔊 <strong>Siêu âm tim (Echocardiography):</strong> Đánh giá cấu trúc và chức năng tim</li>
  <li>🩺 <strong>Điện sinh lý tim:</strong> Khảo sát chuyên sâu hệ thống điện, thường trước khi can thiệp</li>
</ul>

<h2 style="color:#a35a37; font-size:1.5rem; margin-top:1.5rem">Điều trị hiện đại</h2>
<p>Phương pháp điều trị phụ thuộc vào loại và mức độ rối loạn:</p>
<ul style="padding-left:1.5rem; line-height:2">
  <li>💊 <strong>Thuốc chống loạn nhịp:</strong> Beta-blocker, Amiodarone, Flecainide</li>
  <li>⚡ <strong>Sốc điện chuyển nhịp (Cardioversion):</strong> Dùng điện tái lập nhịp xoang bình thường</li>
  <li>🔥 <strong>Triệt đốt bằng sóng cao tần (Ablation):</strong> Phá hủy mô tim gây rối loạn nhịp</li>
  <li>🔋 <strong>Máy tạo nhịp tim (Pacemaker):</strong> Cấy vào ngực để điều chỉnh nhịp tim tự động</li>
  <li>🛡️ <strong>Máy phá rung ICD:</strong> Phát xung điện khi phát hiện nhịp nguy hiểm</li>
</ul>

<div style="background:#e3f2fd; border-left:4px solid #1565c0; padding:1rem; border-radius:8px; margin:1.5rem 0">
  <strong>💡 Khuyến cáo từ chuyên gia tim mạch HealthCare:</strong> Nếu bạn trên 40 tuổi, huyết áp cao, tiểu đường, hoặc có tiền sử gia đình mắc bệnh tim — hãy khám tim định kỳ mỗi 6 tháng/lần để phát hiện sớm và điều trị kịp thời.
</div>',
189, 1);

-- ============================================================
-- BÀI VIẾT 3 — Chuyên mục: Bài viết liên quan
-- ============================================================
INSERT INTO BaiViet (TieuDe, AnhBia, PhanLoai, NoiDung, LuotXem, NguoiTao) VALUES (
'Top 5 Bệnh viện Chấn Thương Thể Thao uy tín nhất tại TP.HCM và Hà Nội',
'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&q=80',
'Bài viết liên quan',
'<h2 style="color:#a35a37; font-size:1.5rem; margin-top:1.5rem">Tại sao cần chọn đúng nơi khám chấn thương thể thao?</h2>
<p>Chấn thương thể thao nếu không được chẩn đoán và điều trị đúng cách có thể dẫn đến <strong>tái phát mãn tính</strong>, thậm chí tàn phế vĩnh viễn. Không ít vận động viên đã phải giải nghệ chỉ vì chủ quan bỏ qua các tổn thương ban đầu. Chọn đúng cơ sở y tế có chuyên khoa <em>Cơ - Xương - Khớp</em> hoặc <em>Y học thể thao</em> là điều kiện tiên quyết để phục hồi hoàn toàn.</p>

<img src="https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&q=80" style="width:100%; max-height:400px; object-fit:cover; border-radius:12px; margin:1rem 0" alt="Chấn thương thể thao" />

<h2 style="color:#a35a37; font-size:1.5rem; margin-top:1.5rem">Các dạng chấn thương thể thao phổ biến</h2>
<ul style="padding-left:1.5rem; line-height:2">
  <li>🦵 <strong>Bong gân cổ chân:</strong> Chấn thương phổ biến nhất, thường do xoắn mắt cá chân</li>
  <li>🦴 <strong>Rách dây chằng chéo trước (ACL):</strong> Thường gặp ở cầu thủ bóng đá, cần phẫu thuật</li>
  <li>💪 <strong>Viêm gân cơ (Tendinitis):</strong> Đau nhức mãn tính do vận động quá mức lặp đi lặp lại</li>
  <li>🦷 <strong>Gãy xương do căng thẳng (Stress fracture):</strong> Nứt vi thể xương do tải trọng quá cao</li>
  <li>🧠 <strong>Chấn động não (Concussion):</strong> Cực kỳ nguy hiểm, cần xử lý y tế khẩn ngay</li>
</ul>

<h2 style="color:#a35a37; font-size:1.5rem; margin-top:1.5rem">Top 5 địa chỉ khám uy tín</h2>

<div style="border:1px solid #e0e0e0; border-radius:12px; overflow:hidden; margin:1rem 0">
  <div style="background:#a35a37; color:white; padding:0.8rem 1rem; font-weight:bold">🏥 1. Bệnh viện Chỉnh hình và Phục hồi chức năng TP.HCM</div>
  <div style="padding:1rem; background:#fafafa">
    <p>📍 <strong>Địa chỉ:</strong> 1A Lý Thường Kiệt, Quận 10, TP.HCM</p>
    <p>⭐ <strong>Thế mạnh:</strong> Phẫu thuật nội soi khớp, Phục hồi chức năng sau chấn thương, Điều trị bại liệt</p>
    <p>📞 <strong>Hotline:</strong> 028 3865 4740</p>
  </div>
</div>

<div style="border:1px solid #e0e0e0; border-radius:12px; overflow:hidden; margin:1rem 0">
  <div style="background:#a35a37; color:white; padding:0.8rem 1rem; font-weight:bold">🏥 2. Bệnh viện Thể thao Việt Nam (Hà Nội)</div>
  <div style="padding:1rem; background:#fafafa">
    <p>📍 <strong>Địa chỉ:</strong> 36 Trần Phú, Ba Đình, Hà Nội</p>
    <p>⭐ <strong>Thế mạnh:</strong> Bệnh viện chuyên ngành Y học thể thao đầu tiên tại Việt Nam, điều trị chấn thương thể thao chuyên sâu</p>
    <p>📞 <strong>Hotline:</strong> 024 3734 0789</p>
  </div>
</div>

<div style="border:1px solid #e0e0e0; border-radius:12px; overflow:hidden; margin:1rem 0">
  <div style="background:#a35a37; color:white; padding:0.8rem 1rem; font-weight:bold">🏥 3. Bệnh viện Đại học Y Dược TP.HCM</div>
  <div style="padding:1rem; background:#fafafa">
    <p>📍 <strong>Địa chỉ:</strong> 215 Hồng Bàng, Quận 5, TP.HCM</p>
    <p>⭐ <strong>Thế mạnh:</strong> Khoa Cơ Xương Khớp với đội ngũ GS/PGS, phẫu thuật nội soi khớp vai-gối nổi tiếng</p>
    <p>📞 <strong>Hotline:</strong> 028 3855 4269</p>
  </div>
</div>

<div style="border:1px solid #e0e0e0; border-radius:12px; overflow:hidden; margin:1rem 0">
  <div style="background:#a35a37; color:white; padding:0.8rem 1rem; font-weight:bold">🏥 4. Phòng khám FV Sport Medicine (TP.HCM)</div>
  <div style="padding:1rem; background:#fafafa">
    <p>📍 <strong>Địa chỉ:</strong> Tầng 4, Bệnh viện FV, 6 Nguyễn Lương Bằng, Quận 7</p>
    <p>⭐ <strong>Thế mạnh:</strong> Tiêu chuẩn quốc tế Pháp, siêu âm cơ xương cơ realtime, chêm PRP điều trị gân cơ</p>
    <p>📞 <strong>Hotline:</strong> 028 5411 3333</p>
  </div>
</div>

<div style="border:1px solid #e0e0e0; border-radius:12px; overflow:hidden; margin:1rem 0">
  <div style="background:#a35a37; color:white; padding:0.8rem 1rem; font-weight:bold">🏥 5. Bệnh viện Bạch Mai — Khoa Cơ Xương Khớp (Hà Nội)</div>
  <div style="padding:1rem; background:#fafafa">
    <p>📍 <strong>Địa chỉ:</strong> 78 Giải Phóng, Đống Đa, Hà Nội</p>
    <p>⭐ <strong>Thế mạnh:</strong> Bệnh viện đầu ngành, nhiều chuyên gia hàng đầu về viêm khớp dạng thấp và chấn thương</p>
    <p>📞 <strong>Hotline:</strong> 024 3869 3731</p>
  </div>
</div>

<img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80" style="width:100%; max-height:350px; object-fit:cover; border-radius:12px; margin:1rem 0" alt="Phục hồi chức năng sau chấn thương" />

<h2 style="color:#a35a37; font-size:1.5rem; margin-top:1.5rem">Lời khuyên khi bị chấn thương thể thao</h2>
<p>Khi xảy ra chấn thương, hãy áp dụng nguyên tắc <strong>RICE</strong> ngay lập tức:</p>
<ul style="padding-left:1.5rem; line-height:2">
  <li>🧊 <strong>R — Rest (Nghỉ ngơi):</strong> Ngừng hoạt động ngay lập tức</li>
  <li>❄️ <strong>I — Ice (Chườm lạnh):</strong> Chườm đá 20 phút mỗi lần, trong 48 giờ đầu</li>
  <li>🩹 <strong>C — Compression (Băng ép):</strong> Băng ép nhẹ để giảm sưng tấy</li>
  <li>⬆️ <strong>E — Elevation (Nâng cao):</strong> Nâng vùng bị thương lên cao hơn tim</li>
</ul>

<div style="background:#fce4ec; border-left:4px solid #c62828; padding:1rem; border-radius:8px; margin:1.5rem 0">
  <strong>🚫 Tuyệt đối KHÔNG làm:</strong> Xoa bóp mạnh, chườm nóng trong 48 giờ đầu, hoặc cố gắng tiếp tục vận động khi đau — điều này có thể làm chấn thương nặng thêm nhiều lần!
</div>

<div style="background:#e8f5e9; border-left:4px solid #4caf50; padding:1rem; border-radius:8px; margin:1.5rem 0">
  <strong>💡 Mẹo từ HealthCare:</strong> Đặt lịch khám ngay tại HealthCare để kết nối với các bác sĩ chuyên khoa Cơ Xương Khớp giàu kinh nghiệm. Đừng để chấn thương nhỏ trở thành vấn đề lớn!
</div>',
412, 1);

-- ============================================================
-- BÀI VIẾT 4 — Chuyên mục: Được quan tâm
-- Tăng huyết áp - Kẻ giết người thầm lặng
-- ============================================================
INSERT INTO BaiViet (TieuDe, AnhBia, PhanLoai, NoiDung, LuotXem, NguoiTao) VALUES (
'Tăng huyết áp: Kẻ giết người thầm lặng và cách kiểm soát hiệu quả',
'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80',
'Được quan tâm',
'<h2 style="color:#a35a37; font-size:1.5rem; margin-top:1.5rem">Tăng huyết áp là gì?</h2>
<p>Tăng huyết áp (cao huyết áp) là tình trạng áp lực máu lên thành động mạch liên tục ở mức cao. Theo Tổ chức Y tế Thế giới (WHO), huyết áp từ <strong>140/90 mmHg trở lên</strong> được xem là tăng huyết áp. Đây là một trong những bệnh không lây nhiễm phổ biến nhất tại Việt Nam, ảnh hưởng đến hơn <strong>25% dân số trưởng thành</strong>.</p>

<img src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80" style="width:100%; max-height:400px; object-fit:cover; border-radius:12px; margin:1rem 0" alt="Đo huyết áp tại nhà" />

<h2 style="color:#a35a37; font-size:1.5rem; margin-top:1.5rem">Tại sao gọi là "kẻ giết người thầm lặng"?</h2>
<p>Tăng huyết áp thường <strong>không có triệu chứng rõ ràng</strong> trong nhiều năm. Nhiều người chỉ phát hiện bệnh khi đã xảy ra biến chứng nghiêm trọng:</p>
<ul style="padding-left:1.5rem; line-height:2">
  <li>💔 <strong>Nhồi máu cơ tim:</strong> Mạch vành bị tắc nghẽn do mảng xơ vữa</li>
  <li>🧠 <strong>Đột quỵ não:</strong> Nguy cơ tăng 4–6 lần so với người bình thường</li>
  <li>🫀 <strong>Suy tim:</strong> Tim phải bơm máu quá sức dẫn đến suy yếu</li>
  <li>👁️ <strong>Tổn thương mắt:</strong> Xuất huyết võng mạc, có thể gây mù</li>
  <li>🫘 <strong>Suy thận mãn tính:</strong> Tổn thương vi mạch thận theo thời gian</li>
</ul>

<div style="background:#fff3cd; border-left:4px solid #f6c310; padding:1rem; border-radius:8px; margin:1.5rem 0">
  <strong>⚠️ Cảnh báo:</strong> 70% người bị tăng huyết áp không biết mình mắc bệnh! Hãy đo huyết áp định kỳ ít nhất <em>6 tháng/lần</em>.
</div>

<h2 style="color:#a35a37; font-size:1.5rem; margin-top:1.5rem">Kiểm soát huyết áp hiệu quả</h2>
<img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80" style="width:100%; max-height:350px; object-fit:cover; border-radius:12px; margin:1rem 0" alt="Chế độ ăn lành mạnh cho tim mạch" />
<ul style="padding-left:1.5rem; line-height:2">
  <li>🥗 <strong>Chế độ ăn DASH:</strong> Nhiều rau củ, trái cây, ngũ cốc nguyên hạt — giảm muối xuống dưới 5g/ngày</li>
  <li>🏃 <strong>Vận động đều đặn:</strong> 150 phút/tuần aerobic cường độ vừa</li>
  <li>⚖️ <strong>Duy trì cân nặng hợp lý:</strong> Giảm 1kg có thể giảm 1 mmHg huyết áp</li>
  <li>🚭 <strong>Bỏ thuốc lá hoàn toàn</strong></li>
  <li>💊 <strong>Dùng thuốc đúng chỉ định:</strong> Không tự ý ngừng thuốc dù huyết áp đã ổn định</li>
</ul>

<div style="background:#e8f5e9; border-left:4px solid #4caf50; padding:1rem; border-radius:8px; margin:1.5rem 0">
  <strong>💡 Lời khuyên từ HealthCare:</strong> Đặt lịch khám định kỳ với bác sĩ tim mạch để được đánh giá nguy cơ và điều chỉnh phác đồ điều trị phù hợp.
</div>',
487, 1);

-- ============================================================
-- BÀI VIẾT 5 — Chuyên mục: Được quan tâm
-- Tiểu đường tuýp 2 - Phòng ngừa và kiểm soát
-- ============================================================
INSERT INTO BaiViet (TieuDe, AnhBia, PhanLoai, NoiDung, LuotXem, NguoiTao) VALUES (
'Bệnh tiểu đường tuýp 2: Nguyên nhân, triệu chứng và cách phòng ngừa toàn diện',
'https://cdn.nhathuoclongchau.com.vn/v1/static/DT_Ds2_1_4b82c6beb2.jpeg',
'Được quan tâm',
'<h2 style="color:#a35a37; font-size:1.5rem; margin-top:1.5rem">Tiểu đường tuýp 2 là gì?</h2>
<p>Đái tháo đường tuýp 2 (T2DM) là rối loạn chuyển hóa mãn tính, đặc trưng bởi tình trạng <strong>kháng insulin</strong> và suy giảm chức năng tế bào beta tụy. Theo IDF (2023), Việt Nam có khoảng <strong>7 triệu người mắc tiểu đường</strong>.</p>

<img src="https://images.unsplash.com/photo-1550831107-1553da8c8464?w=800&q=80" style="width:100%; max-height:400px; object-fit:cover; border-radius:12px; margin:1rem 0" alt="Xét nghiệm đường huyết" />

<h2 style="color:#a35a37; font-size:1.5rem; margin-top:1.5rem">Triệu chứng cần nhận biết</h2>
<ul style="padding-left:1.5rem; line-height:2">
  <li>🚿 <strong>Khát nước nhiều, tiểu nhiều lần</strong> — đặc biệt về ban đêm</li>
  <li>😴 <strong>Mệt mỏi kéo dài</strong> mặc dù ngủ đủ giấc</li>
  <li>👀 <strong>Mờ mắt</strong> do thay đổi áp suất thủy tinh thể</li>
  <li>🩹 <strong>Vết thương lâu lành</strong>, dễ nhiễm trùng</li>
  <li>🦶 <strong>Tê bì, ngứa ran bàn tay, bàn chân</strong></li>
</ul>

<div style="background:#fff3cd; border-left:4px solid #f6c310; padding:1rem; border-radius:8px; margin:1.5rem 0">
  <strong>🔬 Tiêu chuẩn chẩn đoán:</strong> Đường huyết lúc đói ≥ 7.0 mmol/L trong 2 lần xét nghiệm riêng biệt, HOẶC HbA1c ≥ 6.5%.
</div>

<h2 style="color:#a35a37; font-size:1.5rem; margin-top:1.5rem">Phòng ngừa và điều trị</h2>
<img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80" style="width:100%; max-height:350px; object-fit:cover; border-radius:12px; margin:1rem 0" alt="Vận động thể chất phòng tiểu đường" />
<ul style="padding-left:1.5rem; line-height:2">
  <li>🥦 <strong>Chế độ ăn:</strong> Hạn chế carb tinh chế, tăng chất xơ, ưu tiên GI thấp</li>
  <li>🏃 <strong>Vận động ≥ 150 phút/tuần</strong></li>
  <li>💊 <strong>Thuốc hạ đường huyết:</strong> Metformin là lựa chọn đầu tay</li>
  <li>📊 <strong>Kiểm soát HbA1c &lt; 7%:</strong> Khám và xét nghiệm 3 tháng/lần</li>
</ul>

<div style="background:#e8f5e9; border-left:4px solid #4caf50; padding:1rem; border-radius:8px; margin:1.5rem 0">
  <strong>💡 Hãy nhớ:</strong> Tiểu đường tuýp 2 không thể chữa khỏi hoàn toàn nhưng hoàn toàn có thể kiểm soát tốt để sống khỏe mạnh bình thường.
</div>',
356, 1);

-- ============================================================
-- BÀI VIẾT 6 — Chuyên mục: Y tế
-- Vaccine HPV phòng ung thư cổ tử cung
-- ============================================================
INSERT INTO BaiViet (TieuDe, AnhBia, PhanLoai, NoiDung, LuotXem, NguoiTao) VALUES (
'Vaccine HPV: Lá chắn vàng phòng ung thư cổ tử cung cho phụ nữ Việt',
'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&q=80',
'Y tế',
'<h2 style="color:#a35a37; font-size:1.5rem; margin-top:1.5rem">Ung thư cổ tử cung - Mối đe dọa hàng đầu với phụ nữ</h2>
<p>Ung thư cổ tử cung (UTCTC) là loại ung thư phổ biến thứ 2 ở phụ nữ Việt Nam. Mỗi năm có khoảng <strong>4.000 ca mới mắc và 2.200 ca tử vong</strong>. Đây là loại ung thư <strong>hoàn toàn có thể phòng ngừa</strong> nhờ vaccine HPV.</p>

<img src="https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&q=80" style="width:100%; max-height:400px; object-fit:cover; border-radius:12px; margin:1rem 0" alt="Tiêm vaccine phòng bệnh" />

<h2 style="color:#a35a37; font-size:1.5rem; margin-top:1.5rem">HPV là gì và nguy hiểm thế nào?</h2>
<p>Human Papillomavirus (HPV) là virus lây truyền qua đường tình dục. Trong 200+ type HPV, các type <strong>16 và 18</strong> gây ra 70% ca ung thư cổ tử cung.</p>

<h2 style="color:#a35a37; font-size:1.5rem; margin-top:1.5rem">Các loại vaccine HPV tại Việt Nam</h2>
<div style="border:1px solid #e0e0e0; border-radius:12px; overflow:hidden; margin:1rem 0">
  <table style="width:100%; border-collapse:collapse">
    <thead>
      <tr style="background:#a35a37; color:white">
        <th style="padding:0.8rem; text-align:left">Vaccine</th>
        <th style="padding:0.8rem; text-align:left">Phòng ngừa</th>
        <th style="padding:0.8rem; text-align:left">Đối tượng</th>
      </tr>
    </thead>
    <tbody>
      <tr><td style="padding:0.8rem; border-top:1px solid #eee"><strong>Gardasil 4</strong></td><td style="padding:0.8rem; border-top:1px solid #eee">HPV 6, 11, 16, 18</td><td style="padding:0.8rem; border-top:1px solid #eee">9–26 tuổi</td></tr>
      <tr style="background:#f9f9f9"><td style="padding:0.8rem; border-top:1px solid #eee"><strong>Gardasil 9</strong></td><td style="padding:0.8rem; border-top:1px solid #eee">9 type HPV nguy cơ cao</td><td style="padding:0.8rem; border-top:1px solid #eee">9–45 tuổi</td></tr>
      <tr><td style="padding:0.8rem; border-top:1px solid #eee"><strong>Cervarix</strong></td><td style="padding:0.8rem; border-top:1px solid #eee">HPV 16, 18</td><td style="padding:0.8rem; border-top:1px solid #eee">10–25 tuổi</td></tr>
    </tbody>
  </table>
</div>

<img src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80" style="width:100%; max-height:350px; object-fit:cover; border-radius:12px; margin:1rem 0" alt="Khám phụ khoa định kỳ" />

<div style="background:#e8f5e9; border-left:4px solid #4caf50; padding:1rem; border-radius:8px; margin:1.5rem 0">
  <strong>💡 Lời khuyên từ HealthCare:</strong> Đừng để ung thư cổ tử cung cướp đi sức khỏe khi nó hoàn toàn có thể phòng ngừa. Kết hợp tiêm vaccine + tầm soát Pap smear định kỳ để bảo vệ toàn diện.
</div>',
278, 1);

-- ============================================================
-- BÀI VIẾT 7 — Chuyên mục: Y tế
-- Đột quỵ não - nhận biết và cấp cứu đúng cách
-- ============================================================
INSERT INTO BaiViet (TieuDe, AnhBia, PhanLoai, NoiDung, LuotXem, NguoiTao) VALUES (
'Đột quỵ não: Nhận biết sớm trong 60 giây và cấp cứu đúng cách cứu người thân',
'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
'Y tế',
'<h2 style="color:#a35a37; font-size:1.5rem; margin-top:1.5rem">Đột quỵ não là gì?</h2>
<p>Đột quỵ não (Stroke) xảy ra khi máu ngừng cung cấp đến một vùng não, khiến các tế bào thần kinh chết đi trong vài phút. Đây là <strong>cấp cứu y tế tối khẩn cấp</strong> — mỗi phút trôi qua, não mất khoảng <strong>1.9 triệu tế bào thần kinh</strong>.</p>

<img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80" style="width:100%; max-height:400px; object-fit:cover; border-radius:12px; margin:1rem 0" alt="Chụp cộng hưởng từ não" />

<h2 style="color:#a35a37; font-size:1.5rem; margin-top:1.5rem">🚨 Nhận biết đột quỵ với quy tắc FAST</h2>
<div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin:1rem 0">
  <div style="background:#ffebee; border:2px solid #c62828; border-radius:12px; padding:1.2rem; text-align:center">
    <h3 style="color:#c62828; margin:0.5rem 0">F — Face (Mặt)</h3>
    <p style="margin:0">Yêu cầu người đó cười. Một bên mặt có bị xệ xuống không?</p>
  </div>
  <div style="background:#fff3e0; border:2px solid #e65100; border-radius:12px; padding:1.2rem; text-align:center">
    <h3 style="color:#e65100; margin:0.5rem 0">A — Arms (Tay)</h3>
    <p style="margin:0">Yêu cầu giơ 2 tay lên. Một tay có bị hạ xuống không?</p>
  </div>
  <div style="background:#e3f2fd; border:2px solid #1565c0; border-radius:12px; padding:1.2rem; text-align:center">
    <h3 style="color:#1565c0; margin:0.5rem 0">S — Speech (Nói)</h3>
    <p style="margin:0">Nói một câu đơn giản. Có nói ngọng, lẫn lộn không?</p>
  </div>
  <div style="background:#fce4ec; border:2px solid #880e4f; border-radius:12px; padding:1.2rem; text-align:center">
    <h3 style="color:#880e4f; margin:0.5rem 0">T — Time (Thời gian)</h3>
    <p style="margin:0">Nếu có BẤT KỲ dấu hiệu nào ở trên — GỌI 115 NGAY!</p>
  </div>
</div>

<div style="background:#ffebee; border-left:4px solid #c62828; padding:1rem; border-radius:8px; margin:1.5rem 0">
  <strong>⏰ "Time is Brain"!</strong> Cửa sổ điều trị tốt nhất là <strong>4,5 giờ</strong> kể từ khi xuất hiện triệu chứng. Đừng chờ xem triệu chứng có tự hết không!
</div>

<h2 style="color:#a35a37; font-size:1.5rem; margin-top:1.5rem">Phòng ngừa đột quỵ</h2>
<ul style="padding-left:1.5rem; line-height:2">
  <li>💊 Kiểm soát tốt huyết áp (mục tiêu &lt;130/80 mmHg)</li>
  <li>🥗 Chế độ ăn Địa Trung Hải: nhiều cá, dầu ô liu, rau củ</li>
  <li>🚭 Bỏ thuốc lá — nguy cơ đột quỵ giảm 50% sau 1 năm bỏ thuốc</li>
  <li>🏃 Vận động thể lực đều đặn tối thiểu 30 phút/ngày</li>
</ul>',
521, 1);

-- ============================================================
-- BÀI VIẾT 8 — Chuyên mục: Bài viết liên quan
-- Top 8 thực phẩm tốt cho tim mạch
-- ============================================================
INSERT INTO BaiViet (TieuDe, AnhBia, PhanLoai, NoiDung, LuotXem, NguoiTao) VALUES (
'Top 8 siêu thực phẩm tốt cho tim mạch mà bạn nên ăn mỗi ngày',
'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
'Bài viết liên quan',
'<h2 style="color:#a35a37; font-size:1.5rem; margin-top:1.5rem">Tại sao dinh dưỡng quan trọng với tim mạch?</h2>
<p>Bệnh tim mạch là nguyên nhân tử vong số 1 toàn cầu, nhưng nghiên cứu cho thấy <strong>80% các bệnh tim mạch có thể phòng ngừa</strong> thông qua lối sống lành mạnh — đặc biệt là chế độ ăn uống.</p>

<img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80" style="width:100%; max-height:400px; object-fit:cover; border-radius:12px; margin:1rem 0" alt="Thực phẩm tốt cho tim mạch" />

<h2 style="color:#a35a37; font-size:1.5rem; margin-top:1.5rem">8 siêu thực phẩm bảo vệ tim của bạn</h2>

<div style="border:1px solid #ffe0b2; border-radius:12px; overflow:hidden; margin:1rem 0">
  <div style="background:#e65100; color:white; padding:0.8rem 1rem; font-weight:bold">🐟 1. Cá hồi và cá béo (omega-3)</div>
  <div style="padding:1rem; background:#fff8f5"><p style="margin:0">Axit béo omega-3 giảm triglycerides 20–30%, giảm viêm, ổn định nhịp tim. Ăn cá 2 lần/tuần giảm 36% nguy cơ tử vong do bệnh tim.</p></div>
</div>
<div style="border:1px solid #e8f5e9; border-radius:12px; overflow:hidden; margin:1rem 0">
  <div style="background:#2e7d32; color:white; padding:0.8rem 1rem; font-weight:bold">🥑 2. Quả bơ (Avocado)</div>
  <div style="padding:1rem; background:#f9fbe7"><p style="margin:0">Giàu chất béo không bão hòa đơn, kali và chất xơ. Giúp tăng HDL và giảm LDL-cholesterol.</p></div>
</div>
<div style="border:1px solid #e3f2fd; border-radius:12px; overflow:hidden; margin:1rem 0">
  <div style="background:#1565c0; color:white; padding:0.8rem 1rem; font-weight:bold">🫐 3. Việt quất và các loại berry</div>
  <div style="padding:1rem; background:#f3f8ff"><p style="margin:0">Anthocyanin giảm huyết áp, giảm viêm nội mạc. Ăn 3 lần/tuần giảm 32% nguy cơ nhồi máu cơ tim.</p></div>
</div>
<div style="border:1px solid #fce4ec; border-radius:12px; overflow:hidden; margin:1rem 0">
  <div style="background:#880e4f; color:white; padding:0.8rem 1rem; font-weight:bold">🌰 4. Các loại hạt</div>
  <div style="padding:1rem; background:#fdf5f9"><p style="margin:0">Hạnh nhân, óc chó, hạt điều — ăn 30g mỗi ngày giảm 35% nguy cơ bệnh tim mạch vành.</p></div>
</div>

<img src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80" style="width:100%; max-height:350px; object-fit:cover; border-radius:12px; margin:1rem 0" alt="Rau xanh và ngũ cốc nguyên hạt" />

<div style="border:1px solid #e8f5e9; border-radius:12px; overflow:hidden; margin:1rem 0">
  <div style="background:#388e3c; color:white; padding:0.8rem 1rem; font-weight:bold">🥬 6. Rau lá xanh đậm</div>
  <div style="padding:1rem; background:#f5faf5"><p style="margin:0">Vitamin K1 bảo vệ động mạch, nitrates tự nhiên giảm huyết áp. Ăn rau xanh hàng ngày giảm 16% nguy cơ bệnh tim.</p></div>
</div>
<div style="border:1px solid #fff8e1; border-radius:12px; overflow:hidden; margin:1rem 0">
  <div style="background:#f57f17; color:white; padding:0.8rem 1rem; font-weight:bold">🌾 7. Yến mạch</div>
  <div style="padding:1rem; background:#fffef5"><p style="margin:0">Beta-glucan trong yến mạch liên kết với cholesterol, ngăn hấp thu vào máu. Ăn 75g yến mạch khô/ngày giảm LDL 5–10%.</p></div>
</div>
<div style="border:1px solid #ffccbc; border-radius:12px; overflow:hidden; margin:1rem 0">
  <div style="background:#bf360c; color:white; padding:0.8rem 1rem; font-weight:bold">🍅 8. Cà chua</div>
  <div style="padding:1rem; background:#fff9f7"><p style="margin:0">Lycopene — antioxidant mạnh nhất trong cà chua nấu chín giảm nguy cơ đau tim và đột quỵ.</p></div>
</div>

<div style="background:#e8f5e9; border-left:4px solid #4caf50; padding:1rem; border-radius:8px; margin:1.5rem 0">
  <strong>💡 Tip từ HealthCare:</strong> Hãy bắt đầu bằng cách thêm 1–2 loại thực phẩm trên mỗi tuần và duy trì thói quen đó. Kết hợp ăn uống lành mạnh với khám tim mạch định kỳ!
</div>',
634, 1);

-- ============================================================
-- BÀI VIẾT 9 — Chuyên mục: Bài viết liên quan
-- Chăm sóc sức khỏe tâm thần tại nhà
-- ============================================================
INSERT INTO BaiViet (TieuDe, AnhBia, PhanLoai, NoiDung, LuotXem, NguoiTao) VALUES (
'Hướng dẫn toàn diện chăm sóc sức khỏe tâm thần tại nhà: 7 thói quen thay đổi cuộc sống',
'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
'Bài viết liên quan',
'<h2 style="color:#a35a37; font-size:1.5rem; margin-top:1.5rem">Sức khỏe tâm thần quan trọng không kém sức khỏe thể chất</h2>
<p>Theo WHO, <strong>1 trong 4 người</strong> sẽ mắc ít nhất một rối loạn tâm thần trong cuộc đời. Tại Việt Nam, ước tính khoảng <strong>15 triệu người</strong> đang gặp vấn đề về tâm thần.</p>

<img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80" style="width:100%; max-height:400px; object-fit:cover; border-radius:12px; margin:1rem 0" alt="Thư giãn và thiền định" />

<h2 style="color:#a35a37; font-size:1.5rem; margin-top:1.5rem">7 thói quen chăm sóc tâm thần hiệu quả tại nhà</h2>

<div style="background:#f3e5f5; border-radius:12px; padding:1.2rem; margin:1rem 0; border-left:4px solid #7b1fa2">
  <h3 style="color:#7b1fa2; margin-top:0">🧘 1. Thực hành mindfulness (5–10 phút/ngày)</h3>
  <p style="margin:0">Ngồi yên, tập trung vào hơi thở. Thiền định 8 tuần giảm 43% triệu chứng trầm cảm và lo âu.</p>
</div>
<div style="background:#e3f2fd; border-radius:12px; padding:1.2rem; margin:1rem 0; border-left:4px solid #1565c0">
  <h3 style="color:#1565c0; margin-top:0">🏃 2. Vận động thể chất đều đặn</h3>
  <p style="margin:0">Chỉ cần 30 phút đi bộ mỗi ngày có hiệu quả tương đương thuốc chống trầm cảm nhẹ!</p>
</div>
<div style="background:#e8f5e9; border-radius:12px; padding:1.2rem; margin:1rem 0; border-left:4px solid #2e7d32">
  <h3 style="color:#2e7d32; margin-top:0">😴 3. Ưu tiên giấc ngủ chất lượng</h3>
  <p style="margin:0">Người trưởng thành cần 7–9 tiếng/đêm. Thiếu ngủ làm tăng cortisol (hormone stress).</p>
</div>
<div style="background:#fff8e1; border-radius:12px; padding:1.2rem; margin:1rem 0; border-left:4px solid #f57f17">
  <h3 style="color:#f57f17; margin-top:0">✍️ 4. Viết nhật ký cảm xúc</h3>
  <p style="margin:0">Ghi lại 3 điều biết ơn mỗi tối. Sau 3 tuần, tăng 25% cảm giác hạnh phúc.</p>
</div>

<img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80" style="width:100%; max-height:350px; object-fit:cover; border-radius:12px; margin:1rem 0" alt="Kết nối xã hội và bạn bè" />

<div style="background:#fce4ec; border-radius:12px; padding:1.2rem; margin:1rem 0; border-left:4px solid #c62828">
  <h3 style="color:#c62828; margin-top:0">👥 5. Duy trì kết nối xã hội có ý nghĩa</h3>
  <p style="margin:0">Cô đơn nguy hiểm tương đương hút 15 điếu thuốc/ngày. Gọi điện cho bạn bè, ăn tối cùng gia đình.</p>
</div>
<div style="background:#e8eaf6; border-radius:12px; padding:1.2rem; margin:1rem 0; border-left:4px solid #3949ab">
  <h3 style="color:#3949ab; margin-top:0">🌿 6. Dành thời gian trong thiên nhiên</h3>
  <p style="margin:0">Chỉ 20 phút trong công viên giảm đáng kể cortisol và adrenalin.</p>
</div>
<div style="background:#fff3e0; border-radius:12px; padding:1.2rem; margin:1rem 0; border-left:4px solid #e65100">
  <h3 style="color:#e65100; margin-top:0">🚫 7. Hạn chế mạng xã hội và tin tức tiêu cực</h3>
  <p style="margin:0">Đặt giới hạn dùng MXH 30–60 phút/ngày và "digital detox" ít nhất 1 ngày/tuần.</p>
</div>

<div style="background:#e8f5e9; border-left:4px solid #4caf50; padding:1rem; border-radius:8px; margin:1.5rem 0">
  <strong>💚 Từ HealthCare:</strong> Tìm kiếm sự giúp đỡ là hành động <em>dũng cảm</em>, không phải yếu đuối. Sức khỏe tâm thần của bạn quan trọng không kém gì sức khỏe thể chất!
</div>',
298, 1);

-- ============================================================
-- BÀI VIẾT 10 — Chuyên mục: Được quan tâm
-- Bệnh Lupus ban đỏ
-- ============================================================
INSERT INTO BaiViet (TieuDe, AnhBia, PhanLoai, NoiDung, LuotXem, NguoiTao) VALUES (
'Bệnh Lupus ban đỏ là gì? Khám và điều trị với bác sĩ chuyên khoa nào?',
'https://dalieudhyd.vn/wp-content/uploads/2025/01/lupus-ban-do-1.webp',
'Được quan tâm',
'<div style="max-width:100%;font-family:Inter,sans-serif;color:#475467;line-height:1.8">

<div style="margin-bottom:2rem;padding:1.5rem;background:#f4faf7;border-left:4px solid #16885b;border-radius:0 10px 10px 0">
  <p style="font-size:1.1rem;font-weight:600;color:#344054;margin:0">Lupus ban đỏ gồm 2 loại: lupus ban đỏ dạng đĩa và lupus ban đỏ hệ thống. Lupus ban đỏ được xem như một bệnh lý viêm mạch có tính chất tự miễn, gặp ở mọi lứa tuổi, bệnh nhân nữ trẻ tuổi thì dễ gặp hơn.</p>
</div>

<p>Bệnh Lupus ban đỏ hiện vẫn là vấn đề y khoa phổ biến, đứng hàng đầu trong các bệnh rối loạn chất tạo keo, bệnh được biết đến lần đầu vào năm 1845.</p>

<div style="display:flex;gap:1.5rem;margin:1.5rem 0;flex-wrap:wrap">
  <div style="flex:1;min-width:200px;background:#f0faf6;border:1px solid #d8eee4;border-radius:10px;padding:1.2rem">
    <strong style="color:#0d6b47;display:block;margin-bottom:6px">Lupus ban đỏ dạng đĩa</strong>
    <span style="font-size:14px">Chỉ có thương tổn ở da, không ảnh hưởng nội tạng</span>
  </div>
  <div style="flex:1;min-width:200px;background:#fff5f3;border:1px solid #efc9c4;border-radius:10px;padding:1.2rem">
    <strong style="color:#b9382d;display:block;margin-bottom:6px">Lupus ban đỏ hệ thống</strong>
    <span style="font-size:14px">Gây thương tổn nhiều cơ quan: thận, tim, phổi, thần kinh...</span>
  </div>
</div>

<h2 style="font-size:1.4rem;font-weight:800;color:#101828;margin:2rem 0 1rem;padding-left:14px;border-left:4px solid #16885b">1. Bệnh Lupus ban đỏ dạng đĩa</h2>
<ul style="padding-left:1.5rem;margin:0.5rem 0 1.2rem">
  <li style="margin:6px 0">Thể này còn có tên gọi là lupus ban đỏ thể da kinh diễn.</li>
  <li style="margin:6px 0">Bệnh chỉ có thương tổn ở da, không có thương tổn nội tạng.</li>
</ul>

<img src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=1200&q=80" style="width:100%;max-height:380px;object-fit:cover;border-radius:12px;margin:1rem 0" alt="Bệnh lupus ban đỏ - ảnh minh họa" />

<h3 style="font-size:1.1rem;font-weight:700;color:#1d2939;margin:1.5rem 0 0.6rem">Chẩn đoán: dựa vào 3 đặc điểm chính</h3>
<ul style="padding-left:1.5rem;margin:0.5rem 0 1.2rem">
  <li style="margin:6px 0">Ban đỏ</li>
  <li style="margin:6px 0">Vảy dính</li>
  <li style="margin:6px 0">Sẹo teo</li>
</ul>

<h2 style="font-size:1.4rem;font-weight:800;color:#101828;margin:2rem 0 1rem;padding-left:14px;border-left:4px solid #16885b">2. Bệnh Lupus ban đỏ hệ thống</h2>
<p>Lupus ban đỏ hệ thống là một trong các bệnh tự miễn hay gặp ở phụ nữ trẻ tuổi. Bệnh gây thương tổn nhiều cơ quan nội tạng như da, niêm mạc, gan, thận, khớp, tim, phổi, hệ thần kinh.</p>

<img src="https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80" style="width:100%;max-height:380px;object-fit:cover;border-radius:12px;margin:1rem 0" alt="Lupus ban đỏ ảnh hưởng nhiều cơ quan" />

<h2 style="font-size:1.4rem;font-weight:800;color:#101828;margin:2rem 0 1rem;padding-left:14px;border-left:4px solid #16885b">Chẩn đoán xác định (tiêu chuẩn ARA 1997)</h2>
<p>Một người được coi là bị lupus đỏ hệ thống khi có ít nhất <strong>4 trong 11 biểu hiện</strong> sau: ban đỏ ở má, ban dạng đĩa, cảm ứng ánh nắng, loét miệng không đau, viêm khớp, viêm màng phổi/màng tim, biểu hiện thận, biểu hiện thần kinh, rối loạn huyết học, rối loạn miễn dịch, anti-ANA dương tính.</p>

<h2 style="font-size:1.4rem;font-weight:800;color:#101828;margin:2rem 0 1rem;padding-left:14px;border-left:4px solid #16885b">Bệnh lupus ban đỏ khám ở đâu?</h2>
<ul style="padding-left:1.5rem;margin:0.5rem 0 1.2rem">
  <li style="margin:6px 0">Chuyên khoa <strong>Da liễu</strong></li>
  <li style="margin:6px 0">Chuyên khoa <strong>Cơ xương khớp</strong></li>
  <li style="margin:6px 0">Chuyên khoa <strong>Dị ứng - Miễn dịch lâm sàng</strong></li>
</ul>

<div style="background:#f0faf6;border:1px solid #d8eee4;border-radius:10px;padding:1.2rem 1.5rem;margin:1.5rem 0">
  <strong style="color:#0d6b47">HealthCare hỗ trợ bạn:</strong>
  <p style="margin-top:8px;font-size:14.5px">Nền tảng HealthCare hỗ trợ bệnh nhân đặt lịch thăm khám trực tiếp tại các bệnh viện, phòng khám uy tín và thăm khám từ xa qua Video.</p>
</div>

</div>',
48, 1);

-- Xác nhận kết quả
SELECT BaiVietID, TieuDe, PhanLoai, LuotXem FROM BaiViet ORDER BY BaiVietID;
SELECT CONCAT('✅ Hoàn tất! Đã thêm ', COUNT(*), ' bài viết với ID từ 1 đến ', MAX(BaiVietID)) AS ThongBao FROM BaiViet;

-- ============================================================
-- RESET ID BÀI VIẾT VỀ 1, 2, 3, ...
-- (Xử lý được cả ID âm từ lần chạy lỗi trước)
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- Xóa bảng tạm nếu còn tồn tại
DROP TEMPORARY TABLE IF EXISTS TempIDMapping;

-- Tạo mapping cho TẤT CẢ rows (kể cả ID âm),
-- sắp xếp theo ABS(BaiVietID) để giữ thứ tự tự nhiên
CREATE TEMPORARY TABLE TempIDMapping AS
SELECT 
    BaiVietID                                               AS old_id,
    ROW_NUMBER() OVER (ORDER BY ABS(BaiVietID)) + 1000000  AS temp_id,
    ROW_NUMBER() OVER (ORDER BY ABS(BaiVietID))             AS new_id
FROM BaiViet;

-- Bước 1: Chuyển tất cả → temp_id (> 1,000,000, không bao giờ conflict)
UPDATE BaiViet b
JOIN TempIDMapping m ON b.BaiVietID = m.old_id
SET b.BaiVietID = m.temp_id;

-- Bước 2: Chuyển temp_id → new_id (1, 2, 3, ...)
UPDATE BaiViet b
JOIN TempIDMapping m ON b.BaiVietID = m.temp_id
SET b.BaiVietID = m.new_id;

-- Bước 3: Reset AUTO_INCREMENT
SET @max_id = (SELECT MAX(BaiVietID) FROM BaiViet);
SET @reset_sql = CONCAT('ALTER TABLE BaiViet AUTO_INCREMENT = ', @max_id + 1);
PREPARE stmt FROM @reset_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

DROP TEMPORARY TABLE IF EXISTS TempIDMapping;
SET FOREIGN_KEY_CHECKS = 1;

-- Xác nhận kết quả
SELECT BaiVietID, TieuDe, PhanLoai, LuotXem 
FROM BaiViet 
ORDER BY BaiVietID;

SELECT CONCAT('✅ Đã reset thành công! ID hiện tại từ 1 đến ', MAX(BaiVietID)) AS ThongBao
FROM BaiViet;

