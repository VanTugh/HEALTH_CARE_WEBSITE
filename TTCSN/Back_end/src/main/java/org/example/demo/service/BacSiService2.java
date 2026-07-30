package org.example.demo.service;

import org.example.demo.dto.response.SlotRanhResponse;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class BacSiService2 {

    private final JdbcTemplate jdbcTemplate;

    public BacSiService2(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<SlotRanhResponse> getLichRanhBacSi(Integer bacSiId, String ngayStr) {
        List<SlotRanhResponse> resultSlots = new ArrayList<>();
        try {
            LocalDate ngayKham = LocalDate.parse(ngayStr);

            // Chuyển ngày sang ThuTrongTuan chuẩn DB: T2=2, T3=3... CN=8
            int thuTrongTuan = ngayKham.getDayOfWeek().getValue() + 1;

            // 1. Sửa câu SQL lấy CoSoID (JOIN qua ChuyenKhoa)
            String sqlGetCoSo = """
                SELECT ck.CoSoID 
                FROM BacSi bs
                JOIN ChuyenKhoa ck ON bs.ChuyenKhoaID = ck.ChuyenKhoaID
                WHERE bs.BacSiID = ? AND bs.IsDeleted = 0
            """;
            List<Integer> coSoList = jdbcTemplate.queryForList(sqlGetCoSo, Integer.class, bacSiId);

            if (coSoList.isEmpty() || coSoList.get(0) == null) {
                System.out.println("⚠️ Không tìm thấy BacSiID: " + bacSiId);
                return resultSlots;
            }
            Integer coSoId = coSoList.get(0);

            // 2. Query lịch làm việc mặc định
            String sqlLichChuan = """
                SELECT Ca, ThoiGianBatDau, ThoiGianKetThuc 
                FROM LichLamViecMacDinh 
                WHERE CoSoID = ? AND ThuTrongTuan = ? AND IsActive = 1 AND IsDeleted = 0
                ORDER BY ThoiGianBatDau ASC
            """;

            List<Map<String, Object>> danhSachCa = jdbcTemplate.queryForList(sqlLichChuan, coSoId, thuTrongTuan);

            // 3. Lấy các khung giờ ĐÃ ĐƯỢC ĐẶT từ bảng DatLichKham
           // 2. Sửa câu SQL lấy Lịch đã đặt (Sửa đúng tên Enum TrangThai)
            String sqlLichDaDat = """
                SELECT GioKham 
                FROM DatLichKham 
                WHERE BacSiID = ? 
                  AND NgayKham = ? 
                  AND TrangThai NOT IN ('HUY_BOI_BAC_SI', 'HUY_BOI_BENH_NHAN', 'HUY_BOI_ADMIN', 'TU_CHOI')
                  AND IsDeleted = 0
            """;
            List<String> gioDaDatList = jdbcTemplate.queryForList(sqlLichDaDat, String.class, bacSiId, ngayKham);

            // 4. Chia nhỏ thành các slot 30 phút
            int slotId = 1;
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");

            for (Map<String, Object> row : danhSachCa) {
                String ca = (String) row.get("Ca");
                
                // Ép kiểu thời gian an toàn chống crash
                LocalTime batDau = parseLocalTime(row.get("ThoiGianBatDau"));
                LocalTime ketThuc = parseLocalTime(row.get("ThoiGianKetThuc"));

                if (batDau == null || ketThuc == null) continue;

                LocalTime current = batDau;
                while (current.plusMinutes(30).isBefore(ketThuc) || current.plusMinutes(30).equals(ketThuc)) {
                    LocalTime slotEnd = current.plusMinutes(30);
                    String gioKhamStr = current.format(formatter) + " - " + slotEnd.format(formatter);
                    String gioStartStr = current.format(formatter);

                    // Kiểm tra xem slot này đã bị đặt chưa (so sánh tương đối chuỗi)
                    boolean isBooked = gioDaDatList.stream()
                            .anyMatch(g -> g != null && g.contains(gioStartStr));

                    if (!isBooked) {
                        resultSlots.add(SlotRanhResponse.builder()
                                .id(slotId++)
                                .ca(ca)
                                .gioKham(gioKhamStr)
                                .build());
                    }

                    current = slotEnd;
                }
            }

        } catch (Exception e) {
            System.err.println("❌ LỖI TẠI BacSiService2: " + e.getMessage());
            e.printStackTrace(); // In chi tiết dòng bị lỗi ra console Java
        }

        return resultSlots;
    }

    // Hàm hỗ trợ parse thời gian linh hoạt
    private LocalTime parseLocalTime(Object obj) {
        if (obj == null) return null;
        if (obj instanceof Time) {
            return ((Time) obj).toLocalTime();
        } else if (obj instanceof LocalTime) {
            return (LocalTime) obj;
        } else {
            // Trường hợp DB trả về dạng String "08:00:00" hoặc "08:00"
            String str = obj.toString();
            if (str.length() == 5) str += ":00";
            return LocalTime.parse(str);
        }
    }
}