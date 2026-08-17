-- DatLichKham_INIT_fix.sql
-- Clean initialization script for DatLichKham database (for MySQL 8+ / port 3307)
-- Fixed: added ChuyenKhoaID = 10 (Khoa Dinh dưỡng) to ensure FK validity for BacSiID=20

CREATE DATABASE IF NOT EXISTS `DatLichKham` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `DatLichKham`;

SET FOREIGN_KEY_CHECKS = 0;

-- === TABLES (core schema needed by backend) ===

-- 1. CoSoYTe
CREATE TABLE IF NOT EXISTS CoSoYTe (
    CoSoID INT AUTO_INCREMENT PRIMARY KEY,
    TenCoSo NVARCHAR(200) NOT NULL,
    DiaChi NVARCHAR(255),
    SoDienThoai VARCHAR(20),
    Email VARCHAR(100),
    Website VARCHAR(255),
    MoTa TEXT,
    AnhDaiDien VARCHAR(255),
    Logo VARCHAR(255),
    GioLamViec VARCHAR(100),
    NgayLamViec VARCHAR(100),
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CreatedBy INT,
    UpdatedBy INT,
    IsDeleted BIT DEFAULT 0,
    DeletedAt DATETIME,
    DeletedBy INT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. NguoiDung
CREATE TABLE IF NOT EXISTS NguoiDung (
    NguoiDungID INT AUTO_INCREMENT PRIMARY KEY,
    HoTen NVARCHAR(100),
    Email VARCHAR(100) UNIQUE NOT NULL,
    MatKhau VARCHAR(255) NOT NULL,
    SoDienThoai VARCHAR(20),
    DiaChi NVARCHAR(200),
    NgaySinh DATE,
    GioiTinh INT DEFAULT 0,
    VaiTro ENUM('BenhNhan','BacSi','Admin') NOT NULL,
    TrangThai BIT DEFAULT 1,
    AvatarUrl VARCHAR(255),
    VerificationCode VARCHAR(6),
    CodeExpiry DATETIME,
    BadPoint INT DEFAULT 0,
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

-- 3. TrinhDo
CREATE TABLE IF NOT EXISTS TrinhDo (
    TrinhDoID INT AUTO_INCREMENT PRIMARY KEY,
    TenTrinhDo NVARCHAR(100) NOT NULL,
    MoTa NVARCHAR(200),
    GiaKham DECIMAL(10,2) NOT NULL DEFAULT 150000,
    ThuTuUuTien INT DEFAULT 0,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CreatedBy INT,
    UpdatedBy INT,
    IsDeleted BIT DEFAULT 0,
    DeletedAt DATETIME,
    DeletedBy INT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. ChuyenKhoa
CREATE TABLE IF NOT EXISTS ChuyenKhoa (
    ChuyenKhoaID INT AUTO_INCREMENT PRIMARY KEY,
    CoSoID INT NOT NULL DEFAULT 1,
    TenChuyenKhoa NVARCHAR(100) NOT NULL,
    MoTa TEXT,
    AnhDaiDien VARCHAR(255),
    ThuTuHienThi INT DEFAULT 0,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CreatedBy INT,
    UpdatedBy INT,
    IsDeleted BIT DEFAULT 0,
    DeletedAt DATETIME,
    DeletedBy INT,
    FOREIGN KEY (CoSoID) REFERENCES CoSoYTe(CoSoID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. BacSi
CREATE TABLE IF NOT EXISTS BacSi (
    BacSiID INT PRIMARY KEY,
    ChuyenKhoaID INT NOT NULL,
    TrinhDoID INT NOT NULL,
    SoNamKinhNghiem INT DEFAULT 0,
    GioiThieu TEXT,
    QuaTrinhDaoTao TEXT,
    KinhNghiemLamViec TEXT,
    ThanhTich TEXT,
    ChungChi TEXT,
    GiaKham DECIMAL(10,2),
    SoBenhNhanToiDaMotNgay INT DEFAULT 20,
    ThoiGianKhamMotCa INT DEFAULT 30,
    TrangThaiCongViec BIT DEFAULT 1,
    SoNgayPhepNam INT DEFAULT 12,
    SoNgayPhepDaSuDung INT DEFAULT 0,
    NamApDung INT,
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

-- 6. LichLamViecMacDinh
CREATE TABLE IF NOT EXISTS LichLamViecMacDinh (
    ConfigID INT AUTO_INCREMENT PRIMARY KEY,
    CoSoID INT NOT NULL DEFAULT 1,
    ThuTrongTuan INT NOT NULL,
    Ca VARCHAR(20) NOT NULL,
    ThoiGianBatDau TIME NOT NULL,
    ThoiGianKetThuc TIME NOT NULL,
    IsActive BIT DEFAULT 1,
    GhiChu VARCHAR(500),
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CreatedBy INT,
    UpdatedBy INT,
    IsDeleted BIT DEFAULT 0,
    DeletedAt DATETIME,
    DeletedBy INT,
    FOREIGN KEY (CoSoID) REFERENCES CoSoYTe(CoSoID),
    CONSTRAINT chk_thu CHECK (ThuTrongTuan BETWEEN 2 AND 8),
    CONSTRAINT chk_ca CHECK (Ca IN ('SANG', 'CHIEU', 'TOI')),
    CONSTRAINT chk_time CHECK (ThoiGianKetThuc > ThoiGianBatDau),
    UNIQUE KEY unique_schedule (CoSoID, ThuTrongTuan, Ca),
    INDEX idx_active (IsActive),
    INDEX idx_thu (ThuTrongTuan)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. BacSiNgayNghi
CREATE TABLE IF NOT EXISTS BacSiNgayNghi (
    NghiID INT AUTO_INCREMENT PRIMARY KEY,
    BacSiID INT NOT NULL,
    LoaiNghi VARCHAR(20) NOT NULL,
    NgayNghiCuThe DATE,
    ThuTrongTuan INT,
    Ca VARCHAR(20),
    LyDo VARCHAR(500) NOT NULL,
    LoaiNghiPhep VARCHAR(20) NOT NULL DEFAULT 'PHEP_NAM',
    TrangThai VARCHAR(20) NOT NULL DEFAULT 'CHO_DUYET',
    NguoiDuyet INT,
    NgayDuyet DATETIME,
    LyDoTuChoi VARCHAR(500),
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CreatedBy INT,
    UpdatedBy INT,
    IsDeleted BIT DEFAULT 0,
    DeletedAt DATETIME,
    DeletedBy INT,
    FOREIGN KEY (BacSiID) REFERENCES BacSi(BacSiID) ON DELETE CASCADE,
    FOREIGN KEY (NguoiDuyet) REFERENCES NguoiDung(NguoiDungID),
    CONSTRAINT chk_loai_nghi CHECK (LoaiNghi IN ('NGAY_CU_THE', 'CA_CU_THE', 'CA_HANG_TUAN')),
    CONSTRAINT chk_ca_nghi CHECK (Ca IS NULL OR Ca IN ('SANG', 'CHIEU', 'TOI')),
    CONSTRAINT chk_trang_thai_nghi CHECK (TrangThai IN ('CHO_DUYET', 'DA_DUYET', 'TU_CHOI', 'HUY')),
    CONSTRAINT chk_loai_phep CHECK (LoaiNghiPhep IN ('PHEP_NAM', 'OM', 'CONG_TAC', 'KHAC')),
    INDEX idx_bacsi_trangthai (BacSiID, TrangThai),
    INDEX idx_pending (TrangThai, CreatedAt),
    INDEX idx_check_nghi_ngay (BacSiID, TrangThai, NgayNghiCuThe),
    INDEX idx_check_nghi_tuan (BacSiID, TrangThai, ThuTrongTuan)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. DatLichKham (booking)
CREATE TABLE IF NOT EXISTS DatLichKham (
    DatLichID INT AUTO_INCREMENT PRIMARY KEY,
    BenhNhanID INT NOT NULL,
    BacSiID INT NOT NULL,
    CoSoID INT NOT NULL DEFAULT 1,
    NgayKham DATE NOT NULL,
    Ca ENUM('SANG','CHIEU','TOI') NOT NULL,
    GioKham TIME NOT NULL,
    LyDoKham VARCHAR(1000) NOT NULL,
    GhiChu VARCHAR(500),
    TrangThai VARCHAR(50) NOT NULL,
    MaXacNhan VARCHAR(8) UNIQUE,
    NgayDat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    GiaKham DECIMAL(10,2) NOT NULL,
    PhuongThucThanhToan ENUM('TIEN_MAT','CHUYEN_KHOAN','VNPAY','MOMO','ZALO_PAY'),
    TrangThaiThanhToan VARCHAR(50) NOT NULL DEFAULT 'CHUA_THANH_TOAN',
    NgayThanhToan DATETIME,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    IsDeleted BIT DEFAULT 0,
    FOREIGN KEY (BenhNhanID) REFERENCES NguoiDung(NguoiDungID),
    FOREIGN KEY (BacSiID) REFERENCES BacSi(BacSiID),
    FOREIGN KEY (CoSoID) REFERENCES CoSoYTe(CoSoID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- === INSERTS (clean, ordered to respect FKs) ===

-- CoSoYTe (1 record)
INSERT INTO CoSoYTe (CoSoID, TenCoSo, DiaChi, SoDienThoai, Email, Website, MoTa, Logo, GioLamViec, NgayLamViec)
VALUES
(1, 'Bệnh viện Bạch Mai', 'Số 78, Đường Giải Phóng, Phường Phương Mai, Quận Đống Đa, Hà Nội', '024 3869 3731', 'contact@bvbachmai.vn', 'https://bvbachmai.vn', 'Bệnh viện hàng đầu với đội ngũ y bác sĩ giỏi.', '/images/logo-bachmai.png', '07:00 - 17:30', 'Thứ 2 - Thứ 7')
ON DUPLICATE KEY UPDATE TenCoSo=VALUES(TenCoSo);

-- TrinhDo (7 records)
INSERT INTO TrinhDo (TrinhDoID, TenTrinhDo, MoTa, GiaKham, ThuTuUuTien) VALUES
(1, 'Bác sĩ Đa khoa', 'Bác sĩ đa khoa', 150000, 1),
(2, 'Bác sĩ Chuyên khoa I', 'Bác sĩ chuyên khoa cấp 1', 250000, 2),
(3, 'Bác sĩ Chuyên khoa II', 'Bác sĩ chuyên khoa cấp 2', 300000, 3),
(4, 'Thạc sĩ', 'Thạc sĩ Y khoa', 400000, 4),
(5, 'Tiến sĩ', 'Tiến sĩ Y khoa', 500000, 5),
(6, 'Phó Giáo sư', 'Phó Giáo sư', 700000, 6),
(7, 'Giáo sư', 'Giáo sư', 800000, 7)
ON DUPLICATE KEY UPDATE TenTrinhDo=VALUES(TenTrinhDo);

-- ChuyenKhoa (9 records + added ID=10)
INSERT INTO ChuyenKhoa (ChuyenKhoaID, CoSoID, TenChuyenKhoa, MoTa, AnhDaiDien, ThuTuHienThi) VALUES
(1,1,'Cơ xương khớp','Chuyên khoa điều trị xương khớp','https://cdn.bookingcare.vn/fo/w640/2023/12/26/101627-co-xuong-khop.png',1),
(2,1,'Thần kinh','Khám và điều trị thần kinh','https://cdn.bookingcare.vn/fo/w640/2023/12/26/101739-than-kinh.png',2),
(3,1,'Tiêu hóa','Chẩn đoán tiêu hóa','https://cdn.bookingcare.vn/fo/w640/2023/12/26/101713-tieu-hoa.png',3),
(4,1,'Tim mạch','Chuyên khoa tim mạch','https://cdn.bookingcare.vn/fo/w640/2023/12/26/101713-tim-mach.png',4),
(5,1,'Tai Mũi Họng','Khám tai mũi họng','https://cdn.bookingcare.vn/fo/w640/2023/12/26/101713-tai-mui-hong.png',5),
(6,1,'Cột sống','Điều trị cột sống','https://cdn.bookingcare.vn/fo/w640/2023/12/26/101627-cot-song.png',6),
(7,1,'Da liễu','Điều trị da liễu','https://cdn.bookingcare.vn/fo/w640/2023/12/26/101638-da-lieu.png',7),
(8,1,'Hô hấp','Điều trị hô hấp','https://cdn.bookingcare.vn/fo/w640/2023/12/26/101638-ho-hap-phoi.png',8),
(9,1,'Mắt','Điều trị về mắt','https://cdn.bookingcare.vn/fo/w640/2023/12/26/101638-mat.png',9),
(10,1,'Khoa Dinh dưỡng','Tư vấn chế độ ăn uống cho người béo phì, giảm cân, tăng cân, thực đơn cho người tiểu đường.','',10)
ON DUPLICATE KEY UPDATE TenChuyenKhoa=VALUES(TenChuyenKhoa);

-- NguoiDung (10 doctors, explicit IDs 11..20)
INSERT INTO NguoiDung (NguoiDungID, HoTen, Email, MatKhau, SoDienThoai, DiaChi, NgaySinh, GioiTinh, VaiTro, TrangThai, AvatarUrl)
VALUES
(11, 'Nguyễn Văn An', 'an.nguyen@hospital.com', '$2a$10$hash', '0912345601', 'Hà Nội', '1978-01-01', 1, 'BacSi', 1, ''),
(12, 'Lê Thị Bình', 'binh.le@hospital.com', '$2a$10$hash', '0912345602', 'Hà Nội', '1980-02-02', 0, 'BacSi', 1, ''),
(13, 'Trần Quốc Cường', 'cuong.tran@hospital.com', '$2a$10$hash', '0912345603', 'Hà Nội', '1981-03-03', 1, 'BacSi', 1, ''),
(14, 'Phạm Minh Đức', 'duc.pham@hospital.com', '$2a$10$hash', '0912345604', 'Hà Nội', '1979-04-04', 1, 'BacSi', 1, ''),
(15, 'Hoàng Lan Hương', 'huong.hoang@hospital.com', '$2a$10$hash', '0912345605', 'Hà Nội', '1985-05-05', 0, 'BacSi', 1, ''),
(16, 'Đỗ Hùng Khang', 'khang.do@hospital.com', '$2a$10$hash', '0912345606', 'Hà Nội', '1982-06-06', 1, 'BacSi', 1, ''),
(17, 'Ngô Quang Long', 'long.ngo@hospital.com', '$2a$10$hash', '0912345607', 'Hà Nội', '1983-07-07', 1, 'BacSi', 1, ''),
(18, 'Vũ Thị Mai', 'mai.vu@hospital.com', '$2a$10$hash', '0912345608', 'Hà Nội', '1986-08-08', 0, 'BacSi', 1, ''),
(19, 'Đặng Tài Nam', 'nam.dang@hospital.com', '$2a$10$hash', '0912345609', 'Hà Nội', '1984-09-09', 1, 'BacSi', 1, ''),
(20, 'Bùi Tuyết Nhung', 'nhung.bui@hospital.com', '$2a$10$hash', '0912345610', 'Hà Nội', '1990-10-10', 0, 'BacSi', 1, '')
ON DUPLICATE KEY UPDATE Email=VALUES(Email);

-- BacSi (matching BacSiID = NguoiDungID)
INSERT INTO BacSi (BacSiID, ChuyenKhoaID, TrinhDoID, SoNamKinhNghiem, GioiThieu, QuaTrinhDaoTao, KinhNghiemLamViec, GiaKham) VALUES
(11, 1, 4, 25, 'Chuyên gia đầu ngành về điều trị đau nửa đầu kinh niên, mất ngủ và rối loạn tiền đình.', 'Tốt nghiệp Tiến sĩ Y khoa tại Đại học Y Hà Nội', 'Nguyên Trưởng khoa Thần kinh tại Bệnh viện Bạch Mai', 500000.00),
(12, 2, 3, 18, 'Chuyên điều trị viêm loét dạ dày HP, trào ngược dịch dạ dày.', 'Tốt nghiệp Bác sĩ Chuyên khoa II', 'Phó trưởng khoa Tiêu hóa', 350000.00),
(13, 3, 1, 8, 'Chuyên trị các bệnh nhi', 'Tốt nghiệp Thạc sĩ Nhi khoa', 'Bác sĩ điều trị tại khoa Nhi', 200000.00),
(14, 4, 2, 12, 'Chuyên tham vấn và điều trị tâm lý', 'Bác sĩ Chuyên khoa I', 'Bác sĩ điều trị', 250000.00),
(15, 5, 4, 30, 'Chuyên khám và điều trị bệnh tim mạch', 'Tiến sĩ tại Đức', 'Cố vấn chuyên môn tim mạch', 600000.00),
(16, 6, 1, 6, 'Chuyên trị các bệnh da liễu', 'Thạc sĩ Da liễu', 'Bác sĩ hợp tác chuyên môn', 200000.00),
(17, 7, 3, 20, 'Chuyên trị thoát vị đĩa đệm cột sống', 'Bác sĩ Chuyên khoa II', 'Nguyên bác sĩ khoa Cơ xương khớp', 400000.00),
(18, 8, 2, 10, 'Chuyên khám điều trị viêm xoang mũi dị ứng', 'Bác sĩ Chuyên khoa I', 'Bác sĩ chính tại khoa Tai Mũi Họng', 250000.00),
(19, 9, 3, 15, 'Chuyên theo dõi và lập phác đồ điều trị cho bệnh nhân tiểu đường', 'Bác sĩ Chuyên khoa II', 'Bác sĩ điều trị khoa Nội tiết', 350000.00),
(20, 10, 1, 7, 'Chuyên tư vấn dinh dưỡng', 'Thạc sĩ Dinh dưỡng', 'Chuyên gia tư vấn dinh dưỡng', 200000.00)
ON DUPLICATE KEY UPDATE GiaKham=VALUES(GiaKham);

-- Lịch làm việc mặc định (CoSoID = 1)
INSERT INTO LichLamViecMacDinh (CoSoID, ThuTrongTuan, Ca, ThoiGianBatDau, ThoiGianKetThuc, IsActive, GhiChu, CreatedBy) VALUES
(1,2,'SANG','08:00:00','12:00:00',1,'Lịch chuẩn Thứ 2',1),(1,2,'CHIEU','14:00:00','17:00:00',1,'Lịch chuẩn Thứ 2',1),
(1,3,'SANG','08:00:00','12:00:00',1,'Lịch chuẩn Thứ 3',1),(1,3,'CHIEU','14:00:00','17:00:00',1,'Lịch chuẩn Thứ 3',1),
(1,4,'SANG','08:00:00','12:00:00',1,'Lịch chuẩn Thứ 4',1),(1,4,'CHIEU','14:00:00','17:00:00',1,'Lịch chuẩn Thứ 4',1),
(1,5,'SANG','08:00:00','12:00:00',1,'Lịch chuẩn Thứ 5',1),(1,5,'CHIEU','14:00:00','17:00:00',1,'Lịch chuẩn Thứ 5',1),
(1,6,'SANG','08:00:00','12:00:00',1,'Lịch chuẩn Thứ 6',1),(1,6,'CHIEU','14:00:00','17:00:00',1,'Lịch chuẩn Thứ 6',1),
(1,7,'SANG','08:00:00','12:00:00',1,'Lịch chuẩn Thứ 7',1),(1,7,'CHIEU','14:00:00','17:00:00',1,'Lịch chuẩn Thứ 7',1),
(1,8,'SANG','08:00:00','12:00:00',1,'Lịch Chủ nhật',1),(1,8,'CHIEU','14:00:00','17:00:00',1,'Lịch Chủ nhật',1)
ON DUPLICATE KEY UPDATE GhiChu=VALUES(GhiChu);

SET FOREIGN_KEY_CHECKS = 1;

-- === STATISTICS (to be reviewed after import) ===
-- Expected counts in this script:
-- BacSi: 10 (IDs 11..20)
-- ChuyenKhoa: 10 (IDs 1..10)
-- NguoiDung: 10 (IDs 11..20)
-- TrinhDo: 7 (IDs 1..7)
-- CoSoYTe: 1 (ID 1)

-- End of DatLichKham_INIT_fix.sql
USE DatLichKham;

SELECT COUNT(*) AS BacSi FROM BacSi;
SELECT COUNT(*) AS ChuyenKhoa FROM ChuyenKhoa;
SELECT COUNT(*) AS NguoiDung FROM NguoiDung;
SELECT COUNT(*) AS TrinhDo FROM TrinhDo;
SELECT COUNT(*) AS CoSoYTe FROM CoSoYTe;



SELECT 
    b.BacSiID,
    nd.HoTen,
    ck.TenChuyenKhoa,
    td.TenTrinhDo
FROM BacSi b
JOIN NguoiDung nd 
    ON b.BacSiID = nd.NguoiDungID
JOIN ChuyenKhoa ck 
    ON b.ChuyenKhoaID = ck.ChuyenKhoaID
JOIN TrinhDo td 
    ON b.TrinhDoID = td.TrinhDoID
ORDER BY b.BacSiID;


select * from BacSi;