DROP DATABASE IF EXISTS DatLichKham;
CREATE DATABASE DatLichKham CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE DatLichKham;

-- ==========================================
-- 1. BẢNG CƠ SỞ Y TẾ
-- ==========================================
CREATE TABLE CoSoYTe (
    CoSoID INT AUTO_INCREMENT PRIMARY KEY,
    TenCoSo NVARCHAR(200) NOT NULL,
    DiaChi NVARCHAR(255),
    SoDienThoai VARCHAR(20),
    Email VARCHAR(100),
    Website VARCHAR(255),
    MoTa TEXT,
    AnhDaiDien VARCHAR(255),
    Logo VARCHAR(255),
    
    -- Thông tin thêm
    GioLamViec VARCHAR(100) COMMENT 'VD: 08:00 - 17:30',
    NgayLamViec VARCHAR(100) COMMENT 'VD: Thứ 2 - Thứ 7',
    
    -- Audit fields
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CreatedBy INT,
    UpdatedBy INT,
    IsDeleted BIT DEFAULT 0,
    DeletedAt DATETIME,
    DeletedBy INT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 2. BẢNG NGƯỜI DÙNG
-- ==========================================
CREATE TABLE NguoiDung (
    NguoiDungID INT AUTO_INCREMENT PRIMARY KEY,
    HoTen NVARCHAR(100),
    Email VARCHAR(100) UNIQUE NOT NULL,
    MatKhau VARCHAR(255) NOT NULL,
    SoDienThoai VARCHAR(20),
    DiaChi NVARCHAR(200),
    NgaySinh DATE,
    GioiTinh INT DEFAULT 0 COMMENT '0=Nữ, 1=Nam, 2=Khác',
    VaiTro ENUM('BenhNhan','BacSi','Admin') NOT NULL,
    TrangThai BIT DEFAULT 1 COMMENT '1=Active, 0=Inactive',
    AvatarUrl VARCHAR(255),
    
    -- Verification
    VerificationCode VARCHAR(6),
    CodeExpiry DATETIME,
    
    -- Bad Point System
    BadPoint INT DEFAULT 0 COMMENT 'Số lần không đến khám',
    
    -- Audit fields
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CreatedBy INT,
    UpdatedBy INT,
    IsDeleted BIT DEFAULT 0,
    DeletedAt DATETIME,
    DeletedBy INT,
    
    INDEX idx_email (Email),
    INDEX idx_vai_tro (VaiTro),
    INDEX idx_trang_thai (TrangThai)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 3. BẢNG TRÌNH ĐỘ
-- ==========================================
CREATE TABLE TrinhDo (
    TrinhDoID INT AUTO_INCREMENT PRIMARY KEY,
    TenTrinhDo NVARCHAR(100) NOT NULL,
    MoTa NVARCHAR(200),
    GiaKham DECIMAL(10,2) NOT NULL DEFAULT 150000,
    ThuTuUuTien INT DEFAULT 0 COMMENT 'Số càng cao = trình độ càng cao',
    
    -- Audit fields
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CreatedBy INT,
    UpdatedBy INT,
    IsDeleted BIT DEFAULT 0,
    DeletedAt DATETIME,
    DeletedBy INT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 4. BẢNG CHUYÊN KHOA
-- ==========================================
CREATE TABLE ChuyenKhoa (
    ChuyenKhoaID INT AUTO_INCREMENT PRIMARY KEY,
    CoSoID INT NOT NULL DEFAULT 1 COMMENT 'Luôn = 1 (cơ sở duy nhất)',
    TenChuyenKhoa NVARCHAR(100) NOT NULL,
    MoTa TEXT,
    AnhDaiDien VARCHAR(255),
    ThuTuHienThi INT DEFAULT 0,
    
    -- Audit fields
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CreatedBy INT,
    UpdatedBy INT,
    IsDeleted BIT DEFAULT 0,
    DeletedAt DATETIME,
    DeletedBy INT,
    
    FOREIGN KEY (CoSoID) REFERENCES CoSoYTe(CoSoID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 5. BẢNG BÁC SĨ
-- ==========================================
CREATE TABLE BacSi (
    BacSiID INT PRIMARY KEY,
    ChuyenKhoaID INT NOT NULL,
    TrinhDoID INT NOT NULL,
    
    -- Thông tin chuyên môn
    SoNamKinhNghiem INT DEFAULT 0,
    GioiThieu TEXT COMMENT 'Giới thiệu ngắn',
    QuaTrinhDaoTao TEXT COMMENT 'Quá trình học tập',
    KinhNghiemLamViec TEXT COMMENT 'Kinh nghiệm làm việc',
    ThanhTich TEXT COMMENT 'Thành tích, giải thưởng',
    ChungChi TEXT COMMENT 'Chứng chỉ hành nghề',
    
    -- Giá khám
    GiaKham DECIMAL(10,2) COMMENT 'Giá khám (có thể override từ TrinhDo)',
    
    -- Cài đặt làm việc
    SoBenhNhanToiDaMotNgay INT DEFAULT 20,
    ThoiGianKhamMotCa INT DEFAULT 30 COMMENT 'Phút',
    TrangThaiCongViec BIT DEFAULT 1 COMMENT '1=Đang làm việc, 0=Nghỉ',
    
    -- Quản lý ngày phép (PHASE 1 - MỚI THÊM)
    SoNgayPhepNam INT DEFAULT 12 COMMENT 'Tổng số ngày phép/năm',
    SoNgayPhepDaSuDung INT DEFAULT 0 COMMENT 'Số ngày phép đã sử dụng',
    NamApDung INT COMMENT 'Năm áp dụng (reset đầu năm)',
    
    -- Audit fields
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CreatedBy INT,
    UpdatedBy INT,
    IsDeleted BIT DEFAULT 0,
    DeletedAt DATETIME,
    DeletedBy INT,
    
    FOREIGN KEY (BacSiID) REFERENCES NguoiDung(NguoiDungID) ON DELETE CASCADE,
    FOREIGN KEY (ChuyenKhoaID) REFERENCES ChuyenKhoa(ChuyenKhoaID),
    FOREIGN KEY (TrinhDoID) REFERENCES TrinhDo(TrinhDoID),
    
    INDEX idx_chuyen_khoa (ChuyenKhoaID),
    INDEX idx_trinh_do (TrinhDoID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 6. BẢNG LỊCH LÀM VIỆC MẶC ĐỊNH (TOÀN BỆNH VIỆN)
-- ==========================================
-- ⭐ THAY ĐỔI: Từ lịch riêng cho từng bác sĩ → Lịch chung cho tất cả
-- Admin setup 1 lần, áp dụng cho TẤT CẢ bác sĩ
CREATE TABLE LichLamViecMacDinh (
    ConfigID INT AUTO_INCREMENT PRIMARY KEY,
    CoSoID INT NOT NULL DEFAULT 1,
    
    -- Thời gian
    ThuTrongTuan INT NOT NULL COMMENT '2=Thứ 2, 3=Thứ 3, ..., 8=Chủ nhật',
    Ca VARCHAR(20) NOT NULL COMMENT 'SANG, CHIEU, TOI',
    ThoiGianBatDau TIME NOT NULL COMMENT 'VD: 08:00:00',
    ThoiGianKetThuc TIME NOT NULL COMMENT 'VD: 12:00:00',
    
    -- Status
    IsActive BIT DEFAULT 1 COMMENT 'Đang áp dụng hay không',
    GhiChu VARCHAR(500),
    
    -- Audit fields
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CreatedBy INT,
    UpdatedBy INT,
    IsDeleted BIT DEFAULT 0,
    DeletedAt DATETIME,
    DeletedBy INT,
    
    FOREIGN KEY (CoSoID) REFERENCES CoSoYTe(CoSoID),
    
    -- Constraints
    CONSTRAINT chk_thu CHECK (ThuTrongTuan BETWEEN 2 AND 8),
    CONSTRAINT chk_ca CHECK (Ca IN ('SANG', 'CHIEU', 'TOI')),
    CONSTRAINT chk_time CHECK (ThoiGianKetThuc > ThoiGianBatDau),
    
    -- Unique: Không được trùng (CoSoID + Thu + Ca)
    UNIQUE KEY unique_schedule (CoSoID, ThuTrongTuan, Ca),
    
    -- Indexes
    INDEX idx_active (IsActive),
    INDEX idx_thu (ThuTrongTuan)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 7. BẢNG YÊU CẦU NGHỈ CỦA BÁC SĨ (APPROVAL WORKFLOW)
-- ==========================================
-- ⭐ THAY ĐỔI: Từ khoảng thời gian → Ngày cụ thể/Ca hàng tuần + Approval
CREATE TABLE BacSiNgayNghi (
    NghiID INT AUTO_INCREMENT PRIMARY KEY,
    BacSiID INT NOT NULL,
    
    -- ===== LOẠI NGHỈ =====
    LoaiNghi VARCHAR(20) NOT NULL COMMENT 'NGAY_CU_THE, CA_CU_THE, CA_HANG_TUAN',
    
    -- ===== THỜI GIAN NGHỈ =====
    -- Dùng cho NGAY_CU_THE, CA_CU_THE
    NgayNghiCuThe DATE COMMENT 'VD: 2025-12-25',
    
    -- Dùng cho CA_HANG_TUAN
    ThuTrongTuan INT COMMENT '2-8, NULL nếu nghỉ ngày cụ thể',
    
    -- Ca nghỉ (NULL = nghỉ cả ngày)
    Ca VARCHAR(20) COMMENT 'SANG, CHIEU, TOI hoặc NULL',
    
    -- ===== THÔNG TIN ĐƠN =====
    LyDo VARCHAR(500) NOT NULL COMMENT 'Lý do xin nghỉ',
    LoaiNghiPhep VARCHAR(20) NOT NULL DEFAULT 'PHEP_NAM' COMMENT 'PHEP_NAM, OM, CONG_TAC, KHAC',
    FileDinhKem VARCHAR(255) COMMENT 'Path đến file đơn xin nghỉ',
    
    -- ===== APPROVAL WORKFLOW =====
    TrangThai VARCHAR(20) NOT NULL DEFAULT 'CHO_DUYET' COMMENT 'CHO_DUYET, DA_DUYET, TU_CHOI, HUY',
    NguoiDuyet INT COMMENT 'Admin ID, NULL nếu chưa duyệt',
    NgayDuyet DATETIME COMMENT 'Thời điểm duyệt/từ chối',
    LyDoTuChoi VARCHAR(500) COMMENT 'Lý do nếu từ chối',
    
    -- ===== AUDIT =====
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CreatedBy INT,
    UpdatedBy INT,
    IsDeleted BIT DEFAULT 0,
    DeletedAt DATETIME,
    DeletedBy INT,
    
    FOREIGN KEY (BacSiID) REFERENCES BacSi(BacSiID) ON DELETE CASCADE,
    FOREIGN KEY (NguoiDuyet) REFERENCES NguoiDung(NguoiDungID),
    
    -- Constraints
    CONSTRAINT chk_loai_nghi CHECK (LoaiNghi IN ('NGAY_CU_THE', 'CA_CU_THE', 'CA_HANG_TUAN')),
    CONSTRAINT chk_ca_nghi CHECK (Ca IS NULL OR Ca IN ('SANG', 'CHIEU', 'TOI')),
    CONSTRAINT chk_trang_thai_nghi CHECK (TrangThai IN ('CHO_DUYET', 'DA_DUYET', 'TU_CHOI', 'HUY')),
    CONSTRAINT chk_loai_phep CHECK (LoaiNghiPhep IN ('PHEP_NAM', 'OM', 'CONG_TAC', 'KHAC')),
    
    -- Indexes
    INDEX idx_bacsi_trangthai (BacSiID, TrangThai),
    INDEX idx_pending (TrangThai, CreatedAt),
    INDEX idx_check_nghi_ngay (BacSiID, TrangThai, NgayNghiCuThe),
    INDEX idx_check_nghi_tuan (BacSiID, TrangThai, ThuTrongTuan)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 8. BẢNG ĐẶT LỊCH KHÁM (PHASE 2)
-- ==========================================
-- Phase 2 Features:
-- - VNPay/MoMo/ZaloPay integration
-- - Doctor confirmation workflow (Bác sĩ xác nhận/từ chối)
-- - Reminder system (Nhắc nhở trước 24h)
-- - Refund support (Hoàn tiền)
-- - Rating & Review (Đánh giá sau khám)
-- - Follow-up appointments (Tái khám)
CREATE TABLE DatLichKham (
    DatLichID INT AUTO_INCREMENT PRIMARY KEY,
    
    -- ========== THÔNG TIN CƠ BẢN ==========
    BenhNhanID INT NOT NULL,
    BacSiID INT NOT NULL,
    CoSoID INT NOT NULL DEFAULT 1,
    NgayKham DATE NOT NULL,
    Ca ENUM('SANG','CHIEU','TOI') NOT NULL COMMENT 'Ca làm việc',
    GioKham TIME NOT NULL COMMENT 'Giờ cụ thể trong ca (VD: 08:30, 09:00)',
    LyDoKham VARCHAR(1000) NOT NULL,
    GhiChu VARCHAR(500),
    
    -- ========== TRẠNG THÁI ==========
    TrangThai ENUM(
        'CHO_XAC_NHAN_BAC_SI',   -- Chờ bác sĩ xác nhận
        'TU_CHOI',                -- Bác sĩ từ chối
        'CHO_THANH_TOAN',         -- Chờ thanh toán
        'DA_XAC_NHAN',            -- Đã xác nhận
        'DANG_KHAM',              -- Đang khám
        'HOAN_THANH',             -- Hoàn thành
        'HUY_BOI_BENH_NHAN',      -- Hủy bởi bệnh nhân
        'HUY_BOI_BAC_SI',         -- Hủy bởi bác sĩ
        'HUY_BOI_ADMIN',          -- Hủy bởi admin
        'KHONG_DEN',              -- Không đến
        'QUA_HAN'                 -- Quá hạn
    ) NOT NULL DEFAULT 'CHO_XAC_NHAN_BAC_SI',
    MaXacNhan VARCHAR(8) UNIQUE NOT NULL COMMENT 'Mã xác nhận booking (8 ký tự)',
    NgayDat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- ========== THANH TOÁN ==========
    GiaKham DECIMAL(10,2) NOT NULL,
    PhuongThucThanhToan ENUM('TIEN_MAT','CHUYEN_KHOAN','VNPAY','MOMO','ZALO_PAY'),
    TrangThaiThanhToan ENUM('CHUA_THANH_TOAN','DANG_XU_LY','THANH_CONG','THAT_BAI','HOAN_TIEN') 
        NOT NULL DEFAULT 'CHUA_THANH_TOAN',
    MaGiaoDich VARCHAR(100) COMMENT 'Transaction ID từ VNPay/MoMo/ZaloPay',
    NgayThanhToan DATETIME,
    ThongTinThanhToan TEXT COMMENT 'JSON chi tiết thanh toán',
    
    -- ========== XÁC NHẬN BÁC SĨ ==========
    NgayBacSiXacNhan DATETIME COMMENT 'Thời gian bác sĩ xác nhận',
    LyDoTuChoi VARCHAR(500) COMMENT 'Lý do bác sĩ từ chối',
    
    -- ========== HỦY LỊCH ==========
    NgayHuy DATETIME,
    LyDoHuy VARCHAR(500),
    NguoiHuy INT COMMENT 'NguoiDungID người hủy',
    
    -- ========== KHÁM BỆNH ==========
    NgayCheckIn DATETIME COMMENT 'Thời gian check-in tại phòng khám',
    NgayKhamThucTe DATETIME COMMENT 'Thời gian bắt đầu khám',
    NgayHoanThanh DATETIME COMMENT 'Thời gian hoàn thành khám',
    KetQuaKham TEXT,
    DonThuoc TEXT,
    ChanDoan VARCHAR(500),
    LoiDanBacSi TEXT,
    
    -- ========== REMINDER ==========
    DaNhacNho BIT NOT NULL DEFAULT 0,
    NgayNhacNho DATETIME COMMENT 'Thời gian gửi email nhắc nhở',
    
    -- ========== HOÀN TIỀN ==========
    NgayHoanTien DATETIME,
    SoTienHoan DECIMAL(10,2),
    LyDoHoanTien VARCHAR(500),
    
    -- ========== ĐÁNH GIÁ SAU KHÁM ==========
    SoSao INT CHECK (SoSao BETWEEN 1 AND 5),
    NhanXet TEXT,
    NgayDanhGia DATETIME,
    
    -- ========== TÁI KHÁM ==========
    NgayTaiKham DATE COMMENT 'Ngày hẹn tái khám (bác sĩ chỉ định)',
    
    -- ========== AUDIT FIELDS ==========
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CreatedBy INT,
    UpdatedBy INT,
    IsDeleted BIT DEFAULT 0,
    DeletedAt DATETIME,
    DeletedBy INT,
    
    -- ========== FOREIGN KEYS ==========
    FOREIGN KEY (BenhNhanID) REFERENCES NguoiDung(NguoiDungID),
    FOREIGN KEY (BacSiID) REFERENCES BacSi(BacSiID),
    FOREIGN KEY (CoSoID) REFERENCES CoSoYTe(CoSoID),
    FOREIGN KEY (NguoiHuy) REFERENCES NguoiDung(NguoiDungID),
    
    -- ========== INDEXES ==========
    INDEX idx_benhnhan_trangthai (BenhNhanID, TrangThai),
    INDEX idx_bacsi_ngay (BacSiID, NgayKham, Ca),
    INDEX idx_ngaykham (NgayKham, Ca, TrangThai),
    INDEX idx_maxacnhan (MaXacNhan),
    INDEX idx_trangthai_ngay (TrangThai, NgayKham),
    INDEX idx_bacsi_trangthai (BacSiID, TrangThai),
    
    -- ========== UNIQUE CONSTRAINTS ==========
    -- NOTE: Không thể dùng UNIQUE với TrangThai vì MySQL không hỗ trợ partial unique index
    -- Sẽ validate trong application layer: chỉ cho phép 1 booking active per slot
    INDEX idx_slot_validation (BacSiID, NgayKham, Ca, GioKham)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Phase 2: Booking with Doctor Confirmation + VNPay + Reminder + Rating';

-- ==========================================
-- 9. BẢNG THÔNG BÁO (NOTIFICATION SYSTEM)
-- ==========================================
-- Phase 2 Features:
-- - Email tracking (DaGuiEmail, NgayGuiEmail)
-- - Link to booking (DatLichID)
-- - Categorized notification types
-- - Metadata support (JSON)
CREATE TABLE ThongBao (
    ThongBaoID INT AUTO_INCREMENT PRIMARY KEY,
    
    -- ========== NGƯỜI NHẬN ==========
    NguoiNhanID INT NOT NULL,
    
    -- ========== NỘI DUNG ==========
    LoaiThongBao ENUM(
        'DAT_LICH_MOI',
        'BAC_SI_XAC_NHAN',
        'BAC_SI_TU_CHOI',
        'HUY_LICH',
        'NHAC_LICH_KHAM',
        'LICH_KHAM_HON_THANH',
        'THANH_TOAN_THANH_CONG',
        'THANH_TOAN_THAT_BAI',
        'HOAN_TIEN',
        'NGAY_NGHI_MOI',
        'NGAY_NGHI_DUYET',
        'NGAY_NGHI_TU_CHOI',
        'HE_THONG',
        'KHAC'
    ) NOT NULL,
    TieuDe VARCHAR(200) NOT NULL,
    NoiDung TEXT NOT NULL,
    ThoiGian DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- ========== TRẠNG THÁI ==========
    DaDoc BIT NOT NULL DEFAULT 0,
    NgayDoc DATETIME,
    
    -- ========== LIÊN KẾT ==========
    DatLichID INT COMMENT 'Liên kết đến lịch khám (nếu có)',
    LinkDinhKem VARCHAR(500) COMMENT 'Link đến trang chi tiết',
    
    -- ========== EMAIL ==========
    DaGuiEmail BIT NOT NULL DEFAULT 0,
    NgayGuiEmail DATETIME,
    
    -- ========== METADATA ==========
    MetaData TEXT COMMENT 'JSON string chứa dữ liệu bổ sung',
    
    -- ========== AUDIT FIELDS ==========
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CreatedBy INT,
    UpdatedBy INT,
    IsDeleted BIT DEFAULT 0,
    DeletedAt DATETIME,
    DeletedBy INT,
    
    -- ========== FOREIGN KEYS ==========
    FOREIGN KEY (NguoiNhanID) REFERENCES NguoiDung(NguoiDungID),
    FOREIGN KEY (DatLichID) REFERENCES DatLichKham(DatLichID) ON DELETE SET NULL,
    
    -- ========== INDEXES ==========
    INDEX idx_nguoinhan_dadoc (NguoiNhanID, DaDoc),
    INDEX idx_nguoinhan_thoigian (NguoiNhanID, ThoiGian),
    INDEX idx_loai (LoaiThongBao),
    INDEX idx_datlich (DatLichID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Notification system with email tracking';

-- ==========================================
-- 10. BẢNG HỒ SƠ BỆNH ÁN
-- ==========================================
CREATE TABLE HoSoBenhAn (
    HoSoID INT AUTO_INCREMENT PRIMARY KEY,
    BenhNhanID INT NOT NULL UNIQUE,
    
    -- Thông tin y tế cơ bản
    NhomMau VARCHAR(10),
    ChieuCao DECIMAL(5,2) COMMENT 'cm',
    CanNang DECIMAL(5,2) COMMENT 'kg',
    
    -- Tiền sử bệnh
    DiUng TEXT COMMENT 'Dị ứng thuốc, thực phẩm',
    BenhManTinh TEXT COMMENT 'Đái tháo đường, huyết áp...',
    PhauThuatDaQua TEXT,
    TienSuGiaDinh TEXT,
    
    -- Thói quen
    HutThuoc BIT DEFAULT 0,
    UongRuou BIT DEFAULT 0,
    
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (BenhNhanID) REFERENCES NguoiDung(NguoiDungID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================


-- ==========================================
-- INSERT DỮ LIỆU MẪU
-- ==========================================

-- 1. Cơ sở y tế (CHỈ 1 RECORD)
INSERT INTO CoSoYTe (TenCoSo, DiaChi, SoDienThoai, Email, Website, MoTa, Logo, GioLamViec, NgayLamViec)
VALUES (
    'Bệnh viện Bạch Mai',
    'Số 78, Đường Giải Phóng, Phường Phương Mai, Quận Đống Đa, Hà Nội',
    '024 3869 3731',
    'contact@bvbachmai.vn',
    'https://bvbachmai.vn',
    'Bệnh viện Bạch Mai là một trong những bệnh viện hàng đầu Việt Nam với đội ngũ y bác sĩ giỏi và trang thiết bị hiện đại.',
    '/images/logo-bachmai.png',
    '07:00 - 17:30',
    'Thứ 2 - Thứ 7'
);

-- 2. Trình độ
INSERT INTO TrinhDo (TenTrinhDo, MoTa, GiaKham, ThuTuUuTien) VALUES
('Bác sĩ Đa khoa', 'Bác sĩ đa khoa', 150000, 1),
('Bác sĩ Chuyên khoa I', 'Bác sĩ chuyên khoa cấp 1', 250000, 2),
('Bác sĩ Chuyên khoa II', 'Bác sĩ chuyên khoa cấp 2', 300000, 3),
('Thạc sĩ', 'Thạc sĩ Y khoa', 400000, 4),
('Tiến sĩ', 'Tiến sĩ Y khoa', 500000, 5),
('Phó Giáo sư', 'Phó Giáo sư', 700000, 6),
('Giáo sư', 'Giáo sư', 800000, 7);

-- 3. Chuyên khoa (TẤT CẢ ĐỀU CoSoID = 1)
INSERT INTO ChuyenKhoa (CoSoID, TenChuyenKhoa, MoTa, AnhDaiDien, ThuTuHienThi) VALUES
(1, 'Cơ xương khớp', 'Chuyên khoa điều trị xương khớp', 'https://cdn.bookingcare.vn/fo/w640/2023/12/26/101627-co-xuong-khop.png', 1),
(1, 'Thần kinh', 'Khám và điều trị thần kinh', 'https://cdn.bookingcare.vn/fo/w640/2023/12/26/101739-than-kinh.png', 2),
(1, 'Tiêu hóa', 'Chẩn đoán tiêu hóa', 'https://cdn.bookingcare.vn/fo/w640/2023/12/26/101713-tieu-hoa.png', 3),
(1, 'Tim mạch', 'Chuyên khoa tim mạch', 'https://cdn.bookingcare.vn/fo/w640/2023/12/26/101713-tim-mach.png', 4),
(1, 'Tai Mũi Họng', 'Khám tai mũi họng', 'https://cdn.bookingcare.vn/fo/w640/2023/12/26/101713-tai-mui-hong.png', 5),
(1, 'Cột sống', 'Điều trị cột sống', 'https://cdn.bookingcare.vn/fo/w640/2023/12/26/101627-cot-song.png', 6),
(1, 'Da liễu', 'Điều trị da liễu', 'https://cdn.bookingcare.vn/fo/w640/2023/12/26/101638-da-lieu.png', 7),
(1, 'Hô hấp', 'Điều trị hô hấp', 'https://cdn.bookingcare.vn/fo/w640/2023/12/26/101638-ho-hap-phoi.png', 8),
(1, 'Mắt', 'Điều trị về mắt', 'https://cdn.bookingcare.vn/fo/w640/2023/12/26/101638-mat.png', 9);

-- 4. Dữ liệu mẫu User (Admin)
INSERT INTO NguoiDung (HoTen, Email, MatKhau, VaiTro, TrangThai) VALUES
('Admin', 'admin@bvbachmai.vn', '$2a$10$dummyHashedPassword', 'Admin', 1);

-- ==========================================
DELETE FROM LichLamViecMacDinh;

-- Insert lịch mặc định: Thứ 2-8, mỗi ngày 2 ca (SANG + CHIEU)
INSERT INTO LichLamViecMacDinh (CoSoID, ThuTrongTuan, Ca, ThoiGianBatDau, ThoiGianKetThuc, IsActive, GhiChu, CreatedBy) VALUES
-- Thứ 2
(1, 2, 'SANG', '08:00:00', '12:00:00', 1, 'Lịch chuẩn Thứ 2', 1),
(1, 2, 'CHIEU', '14:00:00', '17:00:00', 1, 'Lịch chuẩn Thứ 2', 1),

-- Thứ 3
(1, 3, 'SANG', '08:00:00', '12:00:00', 1, 'Lịch chuẩn Thứ 3', 1),
(1, 3, 'CHIEU', '14:00:00', '17:00:00', 1, 'Lịch chuẩn Thứ 3', 1),

-- Thứ 4
(1, 4, 'SANG', '08:00:00', '12:00:00', 1, 'Lịch chuẩn Thứ 4', 1),
(1, 4, 'CHIEU', '14:00:00', '17:00:00', 1, 'Lịch chuẩn Thứ 4', 1),

-- Thứ 5
(1, 5, 'SANG', '08:00:00', '12:00:00', 1, 'Lịch chuẩn Thứ 5', 1),
(1, 5, 'CHIEU', '14:00:00', '17:00:00', 1, 'Lịch chuẩn Thứ 5', 1),

-- Thứ 6
(1, 6, 'SANG', '08:00:00', '12:00:00', 1, 'Lịch chuẩn Thứ 6', 1),
(1, 6, 'CHIEU', '14:00:00', '17:00:00', 1, 'Lịch chuẩn Thứ 6', 1),

-- Thứ 7
(1, 7, 'SANG', '08:00:00', '12:00:00', 1, 'Lịch chuẩn Thứ 7', 1),
(1, 7, 'CHIEU', '14:00:00', '17:00:00', 1, 'Lịch chuẩn Thứ 7', 1),

-- Chủ nhật (ThuTrongTuan = 8) ⭐
(1, 8, 'SANG', '08:00:00', '12:00:00', 1, 'Lịch Chủ nhật', 1),
(1, 8, 'CHIEU', '14:00:00', '17:00:00', 1, 'Lịch Chủ nhật', 1);

-- Verify
SELECT 
    ConfigID,
    CASE ThuTrongTuan
        WHEN 2 THEN 'Thứ 2'
        WHEN 3 THEN 'Thứ 3'
        WHEN 4 THEN 'Thứ 4'
        WHEN 5 THEN 'Thứ 5'
        WHEN 6 THEN 'Thứ 6'
        WHEN 7 THEN 'Thứ 7'
        WHEN 8 THEN 'Chủ nhật'
    END AS TenThu,
    Ca,
    CONCAT(TIME_FORMAT(ThoiGianBatDau, '%H:%i'), ' - ', TIME_FORMAT(ThoiGianKetThuc, '%H:%i')) AS ThoiGian,
    IsActive
FROM LichLamViecMacDinh
ORDER BY ThuTrongTuan, FIELD(Ca, 'SANG', 'CHIEU', 'TOI');

-- ==========================================
-- 2. YÊU CẦU NGHỈ MẪU (CHỈ CHẠY NẾU ĐÃ CÓ BÁC SĨ)
-- ==========================================
-- Uncomment và thay BacSiID phù hợp

-- Example 1: Bác sĩ nghỉ mỗi Chủ nhật (hàng tuần)
/*
INSERT INTO BacSiNgayNghi (
    BacSiID, 
    LoaiNghi, 
    ThuTrongTuan, 
    Ca, 
    LyDo, 
    LoaiNghiPhep, 
    TrangThai, 
    NguoiDuyet, 
    NgayDuyet
) VALUES (
    1,                          -- BacSiID (thay theo thực tế)
    'CA_HANG_TUAN',            -- Loại nghỉ
    8,                         -- Chủ nhật
    NULL,                      -- NULL = nghỉ cả ngày
    'Nghỉ Chủ nhật hàng tuần', -- Lý do
    'PHEP_NAM',                -- Loại phép
    'DA_DUYET',                -- Đã duyệt
    1,                         -- Admin ID
    NOW()                      -- Ngày duyệt
);
*/

-- Example 2: Bác sĩ nghỉ ca CHIEU mỗi Thứ 6
/*
INSERT INTO BacSiNgayNghi (
    BacSiID, 
    LoaiNghi, 
    ThuTrongTuan, 
    Ca, 
    LyDo, 
    LoaiNghiPhep, 
    TrangThai
) VALUES (
    2,                              -- BacSiID
    'CA_HANG_TUAN',                -- Loại nghỉ
    6,                             -- Thứ 6
    'CHIEU',                       -- Ca CHIEU
    'Không làm ca chiều Thứ 6',   -- Lý do
    'PHEP_NAM',                    -- Loại phép
    'CHO_DUYET'                    -- Chờ duyệt
);
*/

-- Example 3: Bác sĩ nghỉ ngày cụ thể (25/12/2025 - Giáng sinh)
/*
INSERT INTO BacSiNgayNghi (
    BacSiID, 
    LoaiNghi, 
    NgayNghiCuThe, 
    Ca, 
    LyDo, 
    LoaiNghiPhep, 
    TrangThai
) VALUES (
    3,                          -- BacSiID
    'NGAY_CU_THE',             -- Loại nghỉ
    '2025-12-25',              -- Ngày Giáng sinh
    NULL,                      -- NULL = nghỉ cả ngày
    'Nghỉ lễ Giáng sinh',     -- Lý do
    'PHEP_NAM',                -- Loại phép
    'CHO_DUYET'                -- Chờ duyệt
);
*/

-- Example 4: Bác sĩ nghỉ ốm 1 ca cụ thể
/*
INSERT INTO BacSiNgayNghi (
    BacSiID, 
    LoaiNghi, 
    NgayNghiCuThe, 
    Ca, 
    LyDo, 
    LoaiNghiPhep, 
    TrangThai,
    FileDinhKem
) VALUES (
    4,                              -- BacSiID
    'CA_CU_THE',                   -- Loại nghỉ
    '2025-12-01',                  -- Ngày cụ thể
    'SANG',                        -- Ca SANG
    'Đi khám bệnh',               -- Lý do
    'OM',                          -- Nghỉ ốm (không trừ phép)
    'CHO_DUYET',                   -- Chờ duyệt
    '/uploads/giay-kham-benh.pdf'  -- File đính kèm
);
*/

-- ==========================================
-- QUERIES HỮU ÍCH
-- ==========================================

-- Query 1: Xem yêu cầu nghỉ chờ duyệt
/*
SELECT 
    n.NghiID,
    b.HoTen AS TenBacSi,
    n.LoaiNghi,
    CASE 
        WHEN n.LoaiNghi = 'NGAY_CU_THE' THEN CONCAT('Ngày ', DATE_FORMAT(n.NgayNghiCuThe, '%d/%m/%Y'))
        WHEN n.LoaiNghi = 'CA_CU_THE' THEN CONCAT(DATE_FORMAT(n.NgayNghiCuThe, '%d/%m/%Y'), ' - ', n.Ca)
        WHEN n.LoaiNghi = 'CA_HANG_TUAN' THEN CONCAT('Mỗi ', 
            CASE n.ThuTrongTuan
                WHEN 2 THEN 'Thứ 2'
                WHEN 3 THEN 'Thứ 3'
                WHEN 4 THEN 'Thứ 4'
                WHEN 5 THEN 'Thứ 5'
                WHEN 6 THEN 'Thứ 6'
                WHEN 7 THEN 'Thứ 7'
                WHEN 8 THEN 'Chủ nhật'
            END,
            IF(n.Ca IS NULL, ' (cả ngày)', CONCAT(' - ', n.Ca))
        )
    END AS ThoiGianNghi,
    n.LyDo,
    n.LoaiNghiPhep,
    n.TrangThai,
    n.CreatedAt
FROM BacSiNgayNghi n
JOIN BacSi bs ON n.BacSiID = bs.BacSiID
JOIN NguoiDung b ON bs.BacSiID = b.NguoiDungID
WHERE n.TrangThai = 'CHO_DUYET'
ORDER BY n.CreatedAt ASC;
*/

-- Query 2: Thống kê ngày phép của bác sĩ
/*
SELECT 
    b.BacSiID,
    u.HoTen,
    b.SoNgayPhepNam AS TongPhep,
    b.SoNgayPhepDaSuDung AS DaSuDung,
    (b.SoNgayPhepNam - b.SoNgayPhepDaSuDung) AS ConLai,
    COUNT(n.NghiID) AS SoLanXinNghi,
    SUM(CASE WHEN n.TrangThai = 'DA_DUYET' THEN 1 ELSE 0 END) AS SoLanDuocDuyet
FROM BacSi b
JOIN NguoiDung u ON b.BacSiID = u.NguoiDungID
LEFT JOIN BacSiNgayNghi n ON b.BacSiID = n.BacSiID
WHERE b.IsDeleted = 0
GROUP BY b.BacSiID
ORDER BY ConLai ASC;
*/

-- ==========================================
-- VIEWS HỮU ÍCH
-- ==========================================

-- View: Thông tin bác sĩ đầy đủ
CREATE VIEW V_BacSi_DayDu AS
SELECT 
    b.BacSiID,
    n.HoTen,
    n.Email,
    n.SoDienThoai,
    n.AvatarUrl,
    c.TenChuyenKhoa,
    c.ChuyenKhoaID,
    t.TenTrinhDo,
    t.TrinhDoID,
    b.SoNamKinhNghiem,
    b.GioiThieu,
    COALESCE(b.GiaKham, t.GiaKham) as GiaKham,
    b.TrangThaiCongViec,
    AVG(l.SoSao) as RatingTrungBinh,
    COUNT(CASE WHEN l.TrangThai = 'HOAN_THANH' THEN 1 END) as TongCaKham
FROM BacSi b
JOIN NguoiDung n ON b.BacSiID = n.NguoiDungID
JOIN ChuyenKhoa c ON b.ChuyenKhoaID = c.ChuyenKhoaID
JOIN TrinhDo t ON b.TrinhDoID = t.TrinhDoID
LEFT JOIN DatLichKham l ON b.BacSiID = l.BacSiID
WHERE n.IsDeleted = 0 AND b.IsDeleted = 0
GROUP BY b.BacSiID;

-- View: Thống kê dashboard
CREATE VIEW V_Dashboard_ThongKe AS
SELECT 
    (SELECT COUNT(*) FROM NguoiDung WHERE VaiTro = 'BenhNhan' AND IsDeleted = 0) as TongBenhNhan,
    (SELECT COUNT(*) FROM BacSi WHERE IsDeleted = 0) as TongBacSi,
    (SELECT COUNT(*) FROM ChuyenKhoa WHERE IsDeleted = 0) as TongChuyenKhoa,
    (SELECT COUNT(*) FROM DatLichKham WHERE DATE(NgayKham) = CURDATE()) as CaKhamHomNay,
    (SELECT SUM(GiaKham) FROM DatLichKham WHERE TrangThaiThanhToan = 'THANH_CONG' AND DATE(NgayThanhToan) = CURDATE()) as DoanhThuHomNay,
    (SELECT SUM(GiaKham) FROM DatLichKham WHERE TrangThaiThanhToan = 'THANH_CONG' AND MONTH(NgayThanhToan) = MONTH(CURDATE())) as DoanhThuThangNay;
    
-- ===================================================
-- Script: Tạo Admin User và Cơ Sở Y Tế
-- Password: admin123
-- ===================================================


-- Bước 2: Tạo Admin User
-- Password đã hash bằng BCrypt (strength=12): admin123
INSERT INTO NguoiDung (
    HoTen, 
    Email, 
    MatKhau, 
    SoDienThoai, 
    DiaChi, 
    NgaySinh, 
    GioiTinh, 
    VaiTro, 
    TrangThai, 
    CreatedAt, 
    UpdatedAt, 
    IsDeleted,
    BadPoint
)
VALUES (
    'Admin System', 
    'admin@healthcare.com', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LwvY6tEJHt/vK4P8i', -- admin123
    '0901234567',
    'TP. Hồ Chí Minh',
    '1990-01-01',
    1,
    'Admin',
    TRUE,
    NOW(),
    NOW(),
    FALSE,
    0
)
ON DUPLICATE KEY UPDATE 
    Email = Email; -- Không làm gì nếu email đã tồn tại

-- Bước 3: Verify Admin đã được tạo
SELECT 
    NguoiDungID,
    HoTen,
    Email,
    VaiTro,
    TrangThai
FROM NguoiDung 
WHERE Email = 'admin@healthcare.com';

-- Bước 4: Verify Cơ Sở Y Tế đã được tạo
SELECT 
    CoSoID,
    TenCoSo,
    Email,
    SoDienThoai
FROM CoSoYTe 
WHERE IsDeleted = FALSE
LIMIT 1;

USE DatLichKham;


SELECT * FROM CoSoYTe;
SELECT * FROM BacSi;
SELECT * FROM lichlamviecmacdinh;
SELECT * FROM NguoiDung;
SELECT * FROM chuyenkhoa;
SELECT * FROM trinhdo;

INSERT INTO NguoiDung (HoTen, Email, MatKhau, SoDienThoai, DiaChi, GioiTinh, NgaySinh, VaiTro, TrangThai) VALUES
('Bác sĩ Cơ Xương Khớp', 'bs.cxk@example.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoO5a1S9S8eHLzN5Vx2YyN3k.lYb.e5WCa', '0900000001', 'Hà Nội', 1, '1980-01-01', 'BacSi', 1),
('Bác sĩ Thần Kinh', 'bs.thankinh@example.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoO5a1S9S8eHLzN5Vx2YyN3k.lYb.e5WCa', '0900000002', 'Hà Nội', 1, '1980-02-01', 'BacSi', 1),
('Bác sĩ Tiêu Hóa', 'bs.tieuhóa@example.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoO5a1S9S8eHLzN5Vx2YyN3k.lYb.e5WCa', '0900000003', 'Hà Nội', 1, '1980-03-01', 'BacSi', 1),
('Bác sĩ Tim Mạch', 'bs.timmach@example.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoO5a1S9S8eHLzN5Vx2YyN3k.lYb.e5WCa', '0900000004', 'Hà Nội', 1, '1980-04-01', 'BacSi', 1),
('Bác sĩ Tai Mũi Họng', 'bs.taimuihong@example.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoO5a1S9S8eHLzN5Vx2YyN3k.lYb.e5WCa', '0900000005', 'Hà Nội', 1, '1980-05-01', 'BacSi', 1),
('Bác sĩ Cột Sống', 'bs.cotsong@example.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoO5a1S9S8eHLzN5Vx2YyN3k.lYb.e5WCa', '0900000006', 'Hà Nội', 1, '1980-06-01', 'BacSi', 1),
('Bác sĩ Da Liễu', 'bs.dalie@example.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoO5a1S9S8eHLzN5Vx2YyN3k.lYb.e5WCa', '0900000007', 'Hà Nội', 1, '1980-07-01', 'BacSi', 1),
('Bác sĩ Hô Hấp', 'bs.hohap@example.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoO5a1S9S8eHLzN5Vx2YyN3k.lYb.e5WCa', '0900000008', 'Hà Nội', 1, '1980-08-01', 'BacSi', 1),
('Bác sĩ Mắt', 'bs.mat@example.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoO5a1S9S8eHLzN5Vx2YyN3k.lYb.e5WCa', '0900000009', 'Hà Nội', 1, '1980-09-01', 'BacSi', 1),
('Bác sĩ Mắt', 'bs.mat1@example.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoO5a1S9S8eHLzN5Vx2YyN3k.lYb.e5WCa', '0900000009', 'Hà Nội', 1, '1980-09-01', 'BacSi', 1);

INSERT INTO BacSi (BacSiID, ChuyenKhoaID, TrinhDoID)
VALUES
(3, 1, 1),
(4, 2, 2),
(5, 3, 3),
(6, 4, 4),
(7, 5, 5),
(8, 6, 6),
(9, 7, 7),
(10, 8, 1),
(11, 1, 2),
(12, 2, 3);

INSERT INTO BacSi (BacSiID, ChuyenKhoaID, TrinhDoID)
VALUES
(2, 3, 3);

INSERT INTO NguoiDung
(HoTen, Email, MatKhau, SoDienThoai, DiaChi, GioiTinh, NgaySinh, VaiTro, TrangThai, AvatarUrl)
VALUES
('Nguyễn Văn Hưng', 'hungnv.truyennhiem@healthcare.vn',
'$2a$10$7EqJtq98hPqEX7fNZaFWoO5a1S9S8eHLzN5Vx2YyN3k.lYb.e5WCa',
'0900001001', 'Ba Đình, Hà Nội', 1, '1978-06-12', 'BacSi', 1,
'https://cdn.bookingcare.vn/fo/w256/2025/06/18/103749-bs-le-van-nghi.png'),

('Trần Thị Huyền', 'huyentt.truyennhiem@healthcare.vn',
'$2a$10$7EqJtq98hPqEX7fNZaFWoO5a1S9S8eHLzN5Vx2YyN3k.lYb.e5WCa',
'0900001002', 'Đống Đa, Hà Nội', 0, '1984-10-03', 'BacSi', 1,
'https://cdn.bookingcare.vn/fo/w256/2025/06/19/110142-ts-pham-hong-hoa.png'),

('Phạm Quốc Khánh', 'khanhpq.truyennhiem@healthcare.vn',
'$2a$10$7EqJtq98hPqEX7fNZaFWoO5a1S9S8eHLzN5Vx2YyN3k.lYb.e5WCa',
'0900001003', 'Cầu Giấy, Hà Nội', 1, '1981-01-27', 'BacSi', 1,
'https://cdn.bookingcare.vn/fo/w256/2025/06/20/111658-giao-su-tien-si-thai-hong-quang.png'),

('Lê Thị Ngân', 'nganlt.truyennhiem@healthcare.vn',
'$2a$10$7EqJtq98hPqEX7fNZaFWoO5a1S9S8eHLzN5Vx2YyN3k.lYb.e5WCa',
'0900001004', 'Hai Bà Trưng, Hà Nội', 0, '1987-05-14', 'BacSi', 1,
'https://cdn.bookingcare.vn/fo/w256/2022/12/23/100929-1-bsi-thao-tam-tri.png'),

('Vũ Minh Đức', 'ducvm.truyennhiem@healthcare.vn',
'$2a$10$7EqJtq98hPqEX7fNZaFWoO5a1S9S8eHLzN5Vx2YyN3k.lYb.e5WCa',
'0900001005', 'Thanh Xuân, Hà Nội', 1, '1975-09-09', 'BacSi', 1,
'https://cdn.bookingcare.vn/fo/w256/2023/11/15/145138-bs-thien1.jpg'),

('Đỗ Thị Phương', 'phuongdt.truyennhiem@healthcare.vn',
'$2a$10$7EqJtq98hPqEX7fNZaFWoO5a1S9S8eHLzN5Vx2YyN3k.lYb.e5WCa',
'0900001006', 'Hà Đông, Hà Nội', 0, '1989-11-21', 'BacSi', 1,
'https://cdn.bookingcare.vn/fo/w256/2025/06/19/094344-pho-giao-su-tien-si-bac-si-nguyen-khoa-dieu-van.png'),

('Nguyễn Hoàng Long', 'longnh.truyennhiem@healthcare.vn',
'$2a$10$7EqJtq98hPqEX7fNZaFWoO5a1S9S8eHLzN5Vx2YyN3k.lYb.e5WCa',
'0900001007', 'Long Biên, Hà Nội', 1, '1983-03-30', 'BacSi', 1,
'https://cdn.bookingcare.vn/fo/w256/2025/05/06/100622-bs-nguyen-quoc-ai.png'),

('Hoàng Thị Mai', 'maiht.truyennhiem@healthcare.vn',
'$2a$10$7EqJtq98hPqEX7fNZaFWoO5a1S9S8eHLzN5Vx2YyN3k.lYb.e5WCa',
'0900001008', 'Nam Từ Liêm, Hà Nội', 0, '1990-07-18', 'BacSi', 1,
'https://cdn.bookingcare.vn/fo/w256/2023/01/04/173250-1-bs-hien-trong-rang-sg.jpg'),

('Bùi Quốc Tuấn', 'tuanbq.truyennhiem@healthcare.vn',
'$2a$10$7EqJtq98hPqEX7fNZaFWoO5a1S9S8eHLzN5Vx2YyN3k.lYb.e5WCa',
'0900001009', 'Gia Lâm, Hà Nội', 1, '1979-12-05', 'BacSi', 1,
'https://cdn.bookingcare.vn/fo/w256/2025/02/17/112242-bscki-pham-duy-thanh.png'),

('Trịnh Thị Lan', 'lantt.truyennhiem@healthcare.vn',
'$2a$10$7EqJtq98hPqEX7fNZaFWoO5a1S9S8eHLzN5Vx2YyN3k.lYb.e5WCa',
'0900001010', 'Bắc Từ Liêm, Hà Nội', 0, '1986-04-02', 'BacSi', 1,
'https://cdn.bookingcare.vn/fo/w256/2022/08/26/110357-bs-ngatrong-rang.jpg');


UPDATE BacSi
SET
    SoNamKinhNghiem = 8,
    GioiThieu = 'Bác sĩ chuyên khoa Tiêu hóa, chẩn đoán và điều trị các bệnh tiêu hóa',
    QuaTrinhDaoTao = 'Tốt nghiệp Đại học Y Hà Nội, đào tạo chuyên sâu Tiêu Hóa',
    KinhNghiemLamViec = 'Nhiều năm điều trị các bệnh về tiêu hóa',
    ThanhTich = 'Tham gia công tác khám và điều trị bện về tiêu hóa',
    ChungChi = 'Chứng chỉ hành nghề Tiêu Hóa – Bộ Y tế'
WHERE BacSiID = 3;






Update nguoidung
set VaiTro = "BacSi"
where NguoiDungID = 246;

UPDATE BacSi
SET GiaKham = 300000.00
WHERE TrinhDoID = 3;

update cosoyte
set GioLamViec = "07:00 - 17:00"
where CoSoID = 1;

SELECT 
    b.BacSiID,
    n.HoTen,
    t.TenTrinhDo,
    b.GiaKham
FROM BacSi b
JOIN NguoiDung n ON b.BacSiID = n.NguoiDungID
JOIN TrinhDo t ON b.TrinhDoID = t.TrinhDoID
ORDER BY t.ThuTuUuTien;


select * from bacsi where BacSiID = 174;
UPDATE chuyenkhoa
SET
	ThuTuHienThi = 10
WHERE ChuyenKhoaID = 11;

DELETE FROM NguoiDung
WHERE NguoiDungID = 14;

UPDATE nguoidung
SET
	HoTen = "Nguyễn Đức Hiếu"
WHERE NguoiDungID = 11;

UPDATE nguoidung
SET
	AvatarUrl = "https://cdn.bookingcare.vn/fo/w256/2025/05/06/105200-bs-luu.png"
WHERE NguoiDungID in (3,4,5,6,7,8,9,10,11,12);

UPDATE BacSi
SET 
    TrinhDoID = 2
WHERE BacSiID = 245;

USE DatLichKham;
SET SQL_SAFE_UPDATES = 0;

-- 1. Cập nhật thông tin chi tiết cho bảng BacSi
UPDATE BacSi 
SET 
    SoNamKinhNghiem = FLOOR(5 + RAND() * 20), -- Ngẫu nhiên từ 5-25 năm
    GioiThieu = 'Bác sĩ chuyên khoa giàu kinh nghiệm, luôn tận tâm với bệnh nhân. Đã có nhiều năm công tác tại các bệnh viện tuyến trung ương.',
    QuaTrinhDaoTao = 'Tốt nghiệp Đại học Y Hà Nội hệ chính quy. Hoàn thành chương trình đào tạo chuyên sâu và tu nghiệp tại nước ngoài.',
    KinhNghiemLamViec = 'Từng giữ vị trí trưởng khoa tại các cơ sở y tế lớn. Có thế mạnh trong chẩn đoán và điều trị các ca bệnh phức tạp.',
    ThanhTich = 'Nhận bằng khen của Bộ Y tế về những đóng góp trong công tác khám chữa bệnh cho cộng đồng.',
    ChungChi = 'Chứng chỉ hành nghề khám bệnh, chữa bệnh do Bộ Y tế cấp.',
    GiaKham = 300000.00, -- Giá khám mặc định
    SoBenhNhanToiDaMotNgay = 20,
    ThoiGianKhamMotCa = 30,
    TrangThaiCongViec = 1
WHERE SoNamKinhNghiem = 0 OR GioiThieu IS NULL;

-- 2. Cập nhật các trường còn thiếu trong bảng NguoiDung (Địa chỉ, Ngày sinh...)
UPDATE NguoiDung
SET 
    DiaChi = 'Quận Đống Đa, Hà Nội',
    NgaySinh = '1985-05-15',
    GioiTinh = 1,
    AvatarUrl = COALESCE(AvatarUrl, 'https://cdn.bookingcare.vn/fo/w256/2025/05/06/100622-bs-nguyen-quoc-ai.png')
WHERE VaiTro = 'BacSi' AND (DiaChi IS NULL OR NgaySinh IS NULL);

-- 3. Đảm bảo giá khám khớp với TrinhDo nếu bạn muốn phân cấp giá
UPDATE BacSi b
JOIN TrinhDo t ON b.TrinhDoID = t.TrinhDoID
SET b.GiaKham = t.GiaKham;

-- 4. Kiểm tra xem các thuộc tính đã "đầy đặn" chưa
SELECT 
    b.BacSiID, 
    n.HoTen, 
    b.SoNamKinhNghiem, 
    b.GioiThieu, 
    b.GiaKham, 
    n.AvatarUrl 
FROM BacSi b
JOIN NguoiDung n ON b.BacSiID = n.NguoiDungID;


INSERT INTO ChuyenKhoa (CoSoID, TenChuyenKhoa, MoTa, AnhDaiDien, ThuTuHienThi) VALUES
(1, 'Chấn thương chỉnh hình', 'Chuyên khoa chấn thương chỉnh hình', 'https://cdn.bookingcare.vn/fo/w384/2023/12/26/101627-chan-thuong-chinh-hinh.png', 20),
(1, 'Truyền nhiễm', 'Chuyên khoa khám và điều trị bệnh truyền nhiễm', 'https://cdn.bookingcare.vn/fo/w640/2023/12/26/101739-truyen-nhiem.png', 21);


SELECT 
    dk.DatLichID,
    dk.NgayKham,
    dk.Ca,
    dk.GioKham,
    dk.TrangThai,
    dk.GiaKham,
    dk.TrangThaiThanhToan,
    dk.NgayDat,

    -- Bác sĩ
    nd.HoTen        AS TenBacSi,
    nd.SoDienThoai AS DienThoaiBacSi,

    -- Chuyên khoa
    ck.TenChuyenKhoa

FROM DatLichKham dk
JOIN BacSi bs        ON dk.BacSiID = bs.BacSiID
JOIN NguoiDung nd    ON bs.BacSiID = nd.NguoiDungID
JOIN ChuyenKhoa ck   ON bs.ChuyenKhoaID = ck.ChuyenKhoaID

WHERE dk.BenhNhanID = 12
  AND dk.IsDeleted = 0

ORDER BY dk.NgayKham DESC, dk.GioKham DESC;


SELECT 
    l.ConfigID,
    CASE l.ThuTrongTuan
        WHEN 2 THEN 'Thứ 2'
        WHEN 3 THEN 'Thứ 3'
        WHEN 4 THEN 'Thứ 4'
        WHEN 5 THEN 'Thứ 5'
        WHEN 6 THEN 'Thứ 6'
        WHEN 7 THEN 'Thứ 7'
        WHEN 8 THEN 'Chủ nhật'
    END AS Thu,
    l.Ca,
    l.ThoiGianBatDau,
    l.ThoiGianKetThuc
FROM LichLamViecMacDinh l
LEFT JOIN BacSiNgayNghi n
    ON n.BacSiID = 11        -- 👉 ĐỔI ID Ở ĐÂY
    AND n.TrangThai = 'DA_DUYET'
    AND n.LoaiNghi = 'CA_HANG_TUAN'
    AND n.ThuTrongTuan = l.ThuTrongTuan
    AND (n.Ca IS NULL OR n.Ca = l.Ca)
WHERE l.IsActive = 1
  AND n.NghiID IS NULL      -- ✅ loại ca nghỉ
ORDER BY l.ThuTrongTuan, FIELD(l.Ca,'SANG','CHIEU','TOI');


ALTER TABLE DatLichKham MODIFY COLUMN TrangThai VARCHAR(50) NOT NULL;

SELECT 
    b.BacSiID,
    n.HoTen,
    ck.TenChuyenKhoa
FROM BacSi b
LEFT JOIN NguoiDung n ON b.BacSiID = n.NguoiDungID
LEFT JOIN ChuyenKhoa ck ON b.ChuyenKhoaID = ck.ChuyenKhoaID;

SELECT * FROM NguoiDung;
INSERT INTO NguoiDung 
(HoTen, Email, MatKhau, SoDienThoai, DiaChi, GioiTinh, NgaySinh, VaiTro, TrangThai)
VALUES
('Nguyễn Văn Minh', 'bs.minh01@hospital.vn', '$2a$10$hash', '0901000001', 'Ba Đình, Hà Nội', 1, '1980-03-12', 'BacSi', 1),
('Trần Thị Lan', 'bs.lan02@hospital.vn', '$2a$10$hash', '0901000002', 'Đống Đa, Hà Nội', 0, '1985-07-22', 'BacSi', 1),
('Lê Văn Hùng', 'bs.hung03@hospital.vn', '$2a$10$hash', '0901000003', 'Cầu Giấy, Hà Nội', 1, '1978-11-05', 'BacSi', 1),
('Phạm Thị Hương', 'bs.huong04@hospital.vn', '$2a$10$hash', '0901000004', 'Hai Bà Trưng, Hà Nội', 0, '1987-01-18', 'BacSi', 1),
('Hoàng Văn Nam', 'bs.nam05@hospital.vn', '$2a$10$hash', '0901000005', 'Thanh Xuân, Hà Nội', 1, '1982-09-09', 'BacSi', 1),

('Đỗ Thị Mai', 'bs.mai06@hospital.vn', '$2a$10$hash', '0901000006', 'Hà Đông, Hà Nội', 0, '1990-06-14', 'BacSi', 1),
('Nguyễn Văn Tuấn', 'bs.tuan07@hospital.vn', '$2a$10$hash', '0901000007', 'Long Biên, Hà Nội', 1, '1983-04-25', 'BacSi', 1),
('Bùi Thị Hạnh', 'bs.hanh08@hospital.vn', '$2a$10$hash', '0901000008', 'Nam Từ Liêm, Hà Nội', 0, '1988-12-30', 'BacSi', 1),
('Vũ Văn Đức', 'bs.duc09@hospital.vn', '$2a$10$hash', '0901000009', 'Bắc Từ Liêm, Hà Nội', 1, '1979-08-17', 'BacSi', 1),
('Trịnh Thị Hoa', 'bs.hoa10@hospital.vn', '$2a$10$hash', '0901000010', 'Gia Lâm, Hà Nội', 0, '1986-02-11', 'BacSi', 1),

('Phan Văn Sơn', 'bs.son11@hospital.vn', '$2a$10$hash', '0901000011', 'Hoàng Mai, Hà Nội', 1, '1981-05-05', 'BacSi', 1),
('Đặng Thị Nga', 'bs.nga12@hospital.vn', '$2a$10$hash', '0901000012', 'Tây Hồ, Hà Nội', 0, '1989-03-27', 'BacSi', 1),
('Ngô Văn Long', 'bs.long13@hospital.vn', '$2a$10$hash', '0901000013', 'Thanh Trì, Hà Nội', 1, '1984-10-10', 'BacSi', 1),
('Lý Thị Thảo', 'bs.thao14@hospital.vn', '$2a$10$hash', '0901000014', 'Sóc Sơn, Hà Nội', 0, '1991-07-19', 'BacSi', 1),
('Phùng Văn Bình', 'bs.binh15@hospital.vn', '$2a$10$hash', '0901000015', 'Đông Anh, Hà Nội', 1, '1980-01-01', 'BacSi', 1),

('Tạ Thị Linh', 'bs.linh16@hospital.vn', '$2a$10$hash', '0901000016', 'Mê Linh, Hà Nội', 0, '1992-09-09', 'BacSi', 1),
('Cao Văn Quân', 'bs.quan17@hospital.vn', '$2a$10$hash', '0901000017', 'Phú Xuyên, Hà Nội', 1, '1983-06-06', 'BacSi', 1),
('Hồ Thị Ngọc', 'bs.ngoc18@hospital.vn', '$2a$10$hash', '0901000018', 'Ứng Hòa, Hà Nội', 0, '1987-11-11', 'BacSi', 1),
('Lương Văn Phúc', 'bs.phuc19@hospital.vn', '$2a$10$hash', '0901000019', 'Thường Tín, Hà Nội', 1, '1985-04-04', 'BacSi', 1),
('Mai Thị Tuyết', 'bs.tuyet20@hospital.vn', '$2a$10$hash', '0901000020', 'Ba Vì, Hà Nội', 0, '1990-12-12', 'BacSi', 1);

select * from NguoiDung;

INSERT INTO BacSi (BacSiID, ChuyenKhoaID, TrinhDoID)
SELECT 
    NguoiDungID,
    FLOOR(1 + RAND() * 9), -- vì bạn có 9 chuyên khoa
    FLOOR(1 + RAND() * 5)  -- trình độ 1-5
FROM NguoiDung
WHERE VaiTro = 'BacSi'
AND NguoiDungID NOT IN (SELECT BacSiID FROM BacSi);

SELECT 
    b.BacSiID,
    n.HoTen,
    ck.TenChuyenKhoa
FROM BacSi b
JOIN NguoiDung n ON b.BacSiID = n.NguoiDungID
JOIN ChuyenKhoa ck ON b.ChuyenKhoaID = ck.ChuyenKhoaID;

UPDATE NguoiDung
SET AvatarUrl = 'https://cdn.bookingcare.vn/fo/w256/2025/05/06/100622-bs-nguyen-quoc-ai.png'
WHERE VaiTro = 'BacSi' AND AvatarUrl IS NULL;

-- 1. Fix duplicate email
DELETE FROM NguoiDung
WHERE Email = 'bs.mat@example.com'
LIMIT 1;

-- 2. Sync BacSi
INSERT INTO BacSi (BacSiID, ChuyenKhoaID, TrinhDoID)
SELECT 
    NguoiDungID,
    FLOOR(1 + RAND() * 9),
    FLOOR(1 + RAND() * 5)
FROM NguoiDung
WHERE VaiTro = 'BacSi'
AND NguoiDungID NOT IN (SELECT BacSiID FROM BacSi);

-- 3. Update random chuẩn
UPDATE BacSi
SET ChuyenKhoaID = FLOOR(1 + RAND() * 9);

USE DatLichKham;
SET SQL_SAFE_UPDATES = 0;
SET FOREIGN_KEY_CHECKS = 0;

-- ==========================================
-- 1. FIX ẢNH ĐẠI DIỆN CƠ SỞ Y TẾ
-- ==========================================
UPDATE CoSoYTe 
SET AnhDaiDien = 'https://cdn.bookingcare.vn/fo/w1024/2018/04/13/160622bach-mai-1.jpg',
    Logo = 'https://upload.wikimedia.org/wikipedia/vi/1/1b/Logo_BV_B%E1%BA%A1ch_Mai.png'
WHERE CoSoID = 1;

-- ==========================================
-- 2. XÓA ADMIN KHỎI DANH SÁCH BÁC SĨ
-- Tìm ông 'Admin System' và xóa khỏi bảng BacSi (chỉ giữ lại ở bảng NguoiDung)
-- ==========================================
DELETE FROM BacSi 
WHERE BacSiID IN (SELECT NguoiDungID FROM NguoiDung WHERE HoTen LIKE '%Admin%');

-- Đảm bảo vai trò của ông ấy là Admin chứ không phải BacSi
UPDATE NguoiDung SET VaiTro = 'Admin' WHERE HoTen LIKE '%Admin%';

-- ==========================================
-- 3. CẬP NHẬT TÊN NGƯỜI THẬT CHO BÁC SĨ
-- Thay thế các tên "Bác sĩ Cơ xương khớp..." bằng tên bác sĩ thực tế
-- ==========================================

-- Cập nhật tên cho các tài khoản đang có tên placeholder
UPDATE NguoiDung SET HoTen = 'GS.TS Nguyễn Gia Bình' WHERE Email = 'bs.cxk@example.com';
UPDATE NguoiDung SET HoTen = 'PGS.TS Nguyễn Văn Liệu' WHERE Email = 'bs.thankinh@example.com';
UPDATE NguoiDung SET HoTen = 'TS.BS Phạm Thị Hồng Hoa' WHERE Email = 'bs.tieuhóa@example.com';
UPDATE NguoiDung SET HoTen = 'BSCKII Trần Thu Hà' WHERE Email = 'bs.timmach@example.com';
UPDATE NguoiDung SET HoTen = 'Thạc sĩ Nguyễn Văn Hưng' WHERE Email = 'bs.taimuihong@example.com';
UPDATE NguoiDung SET HoTen = 'BS. Lê Thị Ngân' WHERE Email = 'bs.cotsong@example.com';
UPDATE NguoiDung SET HoTen = 'TS. Bùi Quốc Tuấn' WHERE Email = 'bs.dalie@example.com';
UPDATE NguoiDung SET HoTen = 'BS. Vũ Minh Đức' WHERE Email = 'bs.hohap@example.com';
UPDATE NguoiDung SET HoTen = 'PGS. Lê Minh Khôi' WHERE Email = 'bs.mat@example.com';
UPDATE NguoiDung SET HoTen = 'BS. Nguyễn Đức Hiếu' WHERE Email = 'bs.mat1@example.com';

-- Cập nhật đồng bộ giới thiệu cho bảng bác sĩ để không bị trống
UPDATE BacSi 
SET GioiThieu = CONCAT('Chuyên gia đầu ngành tại Bệnh viện Bạch Mai với hơn ', SoNamKinhNghiem, ' năm kinh nghiệm.'),
    QuaTrinhDaoTao = 'Tốt nghiệp Đại học Y Hà Nội, tu nghiệp tại CH Pháp.',
    KinhNghiemLamViec = 'Nhiều năm công tác và giữ vị trí lãnh đạo tại các khoa trọng điểm.'
WHERE GioiThieu IS NULL OR GioiThieu = '';

-- ==========================================
-- 4. KIỂM TRA LẠI DỮ LIỆU SAU KHI FIX
-- ==========================================
SET FOREIGN_KEY_CHECKS = 1;

-- Kiểm tra xem Admin còn trong bảng BacSi không (Kết quả phải = 0)
SELECT COUNT(*) AS AdminInDoctorTable 
FROM BacSi b 
JOIN NguoiDung n ON b.BacSiID = n.NguoiDungID 
WHERE n.VaiTro = 'Admin';

-- Xem danh sách bác sĩ mới
SELECT b.BacSiID, n.HoTen, ck.TenChuyenKhoa, n.AvatarUrl
FROM BacSi b
JOIN NguoiDung n ON b.BacSiID = n.NguoiDungID
JOIN ChuyenKhoa ck ON b.ChuyenKhoaID = ck.ChuyenKhoaID;


select * from BacSi;
select * from NguoiDung;

-- UPDATE NguoiDung
-- SET VaiTro = 'BacSi'
-- WHERE NguoiDungID = 14;


-- USE DatLichKham;
-- SET SQL_SAFE_UPDATES = 0;
-- SET FOREIGN_KEY_CHECKS = 0;

-- ==========================================
-- 1. CẬP NHẬT THÔNG TIN CÁ NHÂN (Bảng NguoiDung)
-- ==========================================
-- UPDATE NguoiDung 
-- SET 
--     HoTen = 'TS.BS Nguyễn Văn Tùng',
--     SoDienThoai = '0988776655',
--     DiaChi = 'Số 10 Tràng Thi, Hoàn Kiếm, Hà Nội',
--     NgaySinh = '1982-12-20',
--     GioiTinh = 1,
--     VaiTro = 'BacSi',
--     TrangThai = 1,
--     AvatarUrl = 'https://cdn.bookingcare.vn/fo/w256/2023/11/15/145138-bs-thien1.jpg'
-- WHERE NguoiDungID = 44;

-- -- ==========================================
-- -- 2. TẠO HỒ SƠ CHUYÊN MÔN (Bảng BacSi)
-- -- ==========================================
-- -- Xóa nếu lỡ có bản ghi rác trước đó
-- DELETE FROM BacSi WHERE BacSiID = 44;

-- INSERT INTO BacSi (
--     BacSiID, ChuyenKhoaID, TrinhDoID, SoNamKinhNghiem, 
--     GioiThieu, QuaTrinhDaoTao, KinhNghiemLamViec, 
--     ThanhTich, ChungChi, GiaKham, 
--     SoBenhNhanToiDaMotNgay, ThoiGianKhamMotCa, TrangThaiCongViec
-- ) VALUES (
--     44, 
--     2, -- Chuyên khoa Thần kinh (Bạn có thể đổi từ 1-9)
--     5, -- Trình độ Tiến sĩ
--     20, 
--     'Tiến sĩ Tùng là chuyên gia hàng đầu trong lĩnh vực Thần kinh học với hơn 20 năm kinh nghiệm điều trị.',
--     'Tốt nghiệp xuất sắc Đại học Y Hà Nội. Bảo vệ luận án Tiến sĩ tại Đại học Oxford, Vương Quốc Anh.',
--     'Nguyên Trưởng khoa Thần kinh - Bệnh viện Bạch Mai. Giảng viên cao cấp tại Đại học Y Hà Nội.',
--     'Huân chương lao động hạng Ba. Giải thưởng nhân tài Đất Việt trong lĩnh vực Y tế.',
--     'Chứng chỉ hành nghề khám chữa bệnh Thần kinh Quốc tế. Chứng chỉ phẫu thuật nội soi nâng cao.',
--     500000.00, -- Giá khám
--     30, -- Tối đa 30 bệnh nhân/ngày
--     30, -- 30 phút mỗi ca
--     1   -- Đang làm việc
-- );

-- -- ==========================================
-- -- 3. TẠO LỊCH NGHỈ MẪU (Bảng BacSiNgayNghi)
-- -- Giúp test chức năng quản lý ngày nghỉ của bác sĩ
-- -- ==========================================
-- DELETE FROM BacSiNgayNghi WHERE BacSiID = 14;

-- INSERT INTO BacSiNgayNghi (BacSiID, LoaiNghi, NgayNghiCuThe, ThuTrongTuan, Ca, LyDo, LoaiNghiPhep, TrangThai)
-- VALUES 
-- (44, 'NGAY_CU_THE', '2026-04-30', NULL, NULL, 'Nghỉ lễ Giải phóng miền Nam', 'KHAC', 'DA_DUYET'),
-- (44, 'CA_HANG_TUAN', NULL, 8, 'CHIEU', 'Nghỉ chiều Chủ nhật hàng tuần', 'PHEP_NAM', 'DA_DUYET'),
-- (44, 'NGAY_CU_THE', '2026-05-15', NULL, 'SANG', 'Đi hội thảo quốc tế', 'CONG_TAC', 'CHO_DUYET');

-- -- ==========================================
-- -- 4. TẠO LỊCH KHÁM MẪU (Bảng DatLichKham)
-- -- Để bác sĩ thấy danh sách bệnh nhân chờ khám trong Dashboard
-- -- ==========================================
-- -- Chèn 1 ca đang chờ xác nhận và 1 ca đã hoàn thành
-- INSERT INTO DatLichKham (BenhNhanID, BacSiID, CoSoID, NgayKham, Ca, GioKham, LyDoKham, TrangThai, MaXacNhan, GiaKham, PhuongThucThanhToan, TrangThaiThanhToan)
-- VALUES 
-- (1, 44, 1, CURDATE(), 'SANG', '09:00:00', 'Đau đầu kinh niên, mất ngủ kéo dài', 'CHO_XAC_NHAN_BAC_SI', 'DB140001', 500000, 'TIEN_MAT', 'CHUA_THANH_TOAN'),
-- (1, 44, 1, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'CHIEU', '15:30:00', 'Tái khám định kỳ', 'HOAN_THANH', 'DB140002', 500000, 'CHUYEN_KHOAN', 'THANH_CONG');

-- ==========================================
-- 5. KIỂM TRA ĐỒNG BỘ
-- ==========================================
-- SET FOREIGN_KEY_CHECKS = 1;

-- Kiểm tra xem API Join có ra dữ liệu không
-- SELECT n.HoTen, ck.TenChuyenKhoa, t.TenTrinhDo, b.GiaKham
-- FROM BacSi b
-- JOIN NguoiDung n ON b.BacSiID = n.NguoiDungID
-- JOIN ChuyenKhoa ck ON b.ChuyenKhoaID = ck.ChuyenKhoaID
-- JOIN TrinhDo t ON b.TrinhDoID = t.TrinhDoID
-- WHERE b.BacSiID = 44;



-- UPDATE NguoiDung 
-- SET 
--     VaiTro = 'Admin',
--     TrangThai = 1,
--     HoTen = 'Quản Trị Viên Mới' -- Bạn có thể đổi tên tùy ý
-- WHERE NguoiDungID = 45;
-- SET SQL_SAFE_UPDATES = 0;
-- SET FOREIGN_KEY_CHECKS = 0;




USE DatLichKham;
select * from NguoiDung;
select * from BacSi;