package org.example.demo.service;

import org.example.demo.dto.request.DatLichRequest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Random;

@Service
public class DatLichService {

    private final JdbcTemplate jdbcTemplate;

    public DatLichService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional
    public String taoLichKham(DatLichRequest request, Integer benhNhanId) {
        
        // 1. Lấy giá khám từ BacSi / TrinhDo
        String sqlGetGia = """
            SELECT COALESCE(bs.GiaKham, td.GiaKham) 
            FROM BacSi bs 
            JOIN TrinhDo td ON bs.TrinhDoID = td.TrinhDoID 
            WHERE bs.BacSiID = ?
        """;
        
        BigDecimal giaKham;
        try {
            giaKham = jdbcTemplate.queryForObject(sqlGetGia, BigDecimal.class, request.getBacSiID());
        } catch (Exception e) {
            giaKham = new BigDecimal("150000.00");
        }

        // 2. Sinh MaXacNhan 8 ký tự
        String maXacNhan = generateMaXacNhan(8);

        // 3. 🔥 XỬ LÝ CHẮC CHẮN CHO GIỜ KHÁM (Fix triệt để lỗi Data truncation)
        String rawGioKham = request.getGioKham(); // Nhận "09:30 - 10:00"
        String gioKhamFormatted = rawGioKham;

        if (rawGioKham != null) {
            // Nếu có dấu "-", tách lấy phần đầu "09:30"
            if (rawGioKham.contains("-")) {
                gioKhamFormatted = rawGioKham.split("-")[0].trim(); 
            }
            // Thêm đuôi giây nếu cần để chuẩn kiểu TIME "09:30:00"
            if (gioKhamFormatted.length() == 5) {
                gioKhamFormatted += ":00";
            }
        }

        // 4. Chuẩn hóa Ca (SANG, CHIEU, TOI)
        String caFormatted = request.getCa() != null ? request.getCa().toUpperCase() : "SANG";

        // 5. Insert vào DatLichKham (Dùng gioKhamFormatted đã làm sạch)
        String sqlInsertDatLich = """
            INSERT INTO DatLichKham (
                BenhNhanID, BacSiID, CoSoID, NgayKham, Ca, GioKham, 
                LyDoKham, TrangThai, MaXacNhan, GiaKham, PhuongThucThanhToan, TrangThaiThanhToan
            ) VALUES (?, ?, 1, ?, ?, ?, ?, 'CHO_XAC_NHAN_BAC_SI', ?, ?, 'TIEN_MAT', 'CHUA_THANH_TOAN')
        """;
        
        jdbcTemplate.update(sqlInsertDatLich,
            benhNhanId,
            request.getBacSiID(),
            request.getNgayKham(),
            caFormatted,
            gioKhamFormatted, // <-- TRUYỀN BIẾN ĐÃ FORMAT VÀO ĐÂY ("09:30:00")
            request.getLyDoKham(),
            maXacNhan,
            giaKham
        );

        // 6. Ghi Thông báo
        try {
            String sqlThongBao = """
                INSERT INTO ThongBao (NguoiNhanID, LoaiThongBao, TieuDe, NoiDung, DaDoc, DaGuiEmail) 
                VALUES (?, 'DAT_LICH_MOI', ?, ?, 0, 0)
            """;
            jdbcTemplate.update(sqlThongBao, 
                benhNhanId, 
                "Đặt lịch khám thành công", 
                "Lịch khám của bạn với mã " + maXacNhan + " đang chờ bác sĩ xác nhận."
            );
        } catch (Exception ignored) {
            // Tránh crash nếu bảng ThongBao tạm thời lỗi
        }

        return maXacNhan;
    }

    private String generateMaXacNhan(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder sb = new StringBuilder();
        Random rnd = new Random();
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(rnd.nextInt(chars.length())));
        }
        return sb.toString();
    }
}