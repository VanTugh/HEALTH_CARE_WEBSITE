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
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    DeletedAt DATETIME DEFAULT NULL,
    CreatedBy INT DEFAULT NULL,
    UpdatedBy INT DEFAULT NULL,
    DeletedBy INT DEFAULT NULL,
    IsDeleted TINYINT(1) DEFAULT 0
);

-- Xóa dữ liệu cũ nếu tồn tại để chạy lại không bị lỗi
DELETE FROM BaiViet WHERE BaiVietID IN (1, 2, 3);

-- ============================================================
-- BÀI VIẾT 1 — Chuyên mục: Được quan tâm
-- ============================================================
INSERT INTO BaiViet (TieuDe, AnhBia, PhanLoai, NoiDung, LuotXem, NguoiTao) VALUES (
'Sốt xuất huyết: Nguyên nhân, Triệu chứng và Cách phòng tránh hiệu quả',
'https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2022/8/30/sot-xuat-huyet-16618432628261622698680.jpg',
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
