-- ==========================================
-- BẢNG KHUYENMAI (VOUCHER/COUPON)
-- ==========================================
USE DatLichKham;

CREATE TABLE KhuyenMai (
    KhuyenMaiID INT AUTO_INCREMENT PRIMARY KEY,
    MaVoucher VARCHAR(50) UNIQUE NOT NULL,
    TenKhuyenMai NVARCHAR(255) NOT NULL,
    PhanTramGiam DECIMAL(5,2) NOT NULL COMMENT 'Phần trăm giảm (VD: 10.0 = 10%)',
    GiamToiDa DECIMAL(18,2) NOT NULL COMMENT 'Số tiền giảm tối đa (VD: 50000)',
    SoLuong INT DEFAULT 0 COMMENT 'Số slot còn lại có thể dùng',
    NgayBatDau DATETIME NOT NULL,
    NgayKetThuc DATETIME NOT NULL,
    TrangThai BIT DEFAULT 1 COMMENT '1 = Khả dụng, 0 = Đã vô hiệu hóa',
    
    -- Cột Audit
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CreatedBy INT,
    UpdatedBy INT,
    IsDeleted BIT DEFAULT 0,
    DeletedAt DATETIME,
    DeletedBy INT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Thêm trường ghi nhận khuyến mãi vào DatLichKham
ALTER TABLE DatLichKham
ADD COLUMN KhuyenMaiID INT NULL;

ALTER TABLE DatLichKham
ADD COLUMN TienGiamGia DECIMAL(18,2) DEFAULT 0.00;

ALTER TABLE DatLichKham
ADD CONSTRAINT FK_DatLichKham_KhuyenMai
FOREIGN KEY (KhuyenMaiID) REFERENCES KhuyenMai(KhuyenMaiID) ON DELETE SET NULL;
