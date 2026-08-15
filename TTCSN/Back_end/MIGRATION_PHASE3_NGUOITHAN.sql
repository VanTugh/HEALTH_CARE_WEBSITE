-- ==========================================
-- MIGRATION SCRIPT FOR PHASE 3: BOOOKING FAMILY (KHÁM HỘ)
-- ==========================================
-- Date: 2026-08-13
-- Description: 
-- - Tạo bảng NguoiThan để quản lý hồ sơ y tế gia đình
-- - Chỉnh sửa bảng DatLichKham để hỗ trợ đặt lịch khám hộ
-- ==========================================

USE DatLichKham;

-- ==========================================
-- STEP 1: TẠO BẢNG NGƯỜI THÂN
-- ==========================================
CREATE TABLE NguoiThan (
    NguoiThanID INT AUTO_INCREMENT PRIMARY KEY,
    NguoiDungID INT NOT NULL COMMENT 'Người tạo (chủ tài khoản)',
    HoTen NVARCHAR(100) NOT NULL,
    MoiQuanHe NVARCHAR(50) NOT NULL COMMENT 'Vợ, Chồng, Con, Cha, Mẹ, Ông, Bà, Khác',
    NgaySinh DATE,
    GioiTinh INT DEFAULT 0 COMMENT '0=Nữ, 1=Nam, 2=Khác',
    SoDienThoai VARCHAR(20),
    DiaChi NVARCHAR(255),
    
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CreatedBy INT,
    UpdatedBy INT,
    IsDeleted BIT DEFAULT 0,
    DeletedAt DATETIME,
    DeletedBy INT,
    
    FOREIGN KEY (NguoiDungID) REFERENCES NguoiDung(NguoiDungID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- STEP 2: CẬP NHẬT BẢNG ĐẶT LỊCH KHÁM
-- ==========================================
-- Cần drop constrain UNIQUE cũ nếu NguoiThanID ảnh hưởng tới logic constraint
-- Ở đây mình thêm NguoiThanID để theo dõi lịch khám cho ai
ALTER TABLE DatLichKham 
ADD COLUMN NguoiThanID INT COMMENT 'NULL nếu tự đặt cho mình, có giá trị nếu đặt hộ' AFTER BenhNhanID;

-- Add Foreign Key Constraint
ALTER TABLE DatLichKham
ADD CONSTRAINT fk_datlichkham_nguoithan 
FOREIGN KEY (NguoiThanID) REFERENCES NguoiThan(NguoiThanID) ON DELETE SET NULL;
