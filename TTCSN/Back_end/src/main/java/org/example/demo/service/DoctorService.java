package org.example.demo.service;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class DoctorService {

    private final JdbcTemplate jdbcTemplate;

    public DoctorService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Nơi thực thi câu SQL bạn vừa thắc mắc!
    public Map<String, Object> getDoctorDetailForAI(Integer doctorId) {
        if (doctorId == null) return null;

        String sql = """
            SELECT 
                bs.BacSiID AS id,
                nd.HoTen AS name,
                CONCAT(ck.TenChuyenKhoa, ' - ', td.TenTrinhDo) AS specialty,
                COALESCE(bs.GiaKham, td.GiaKham) AS price,
                COALESCE(nd.AvatarUrl, '👨‍⚕️') AS avatar
            FROM BacSi bs
            JOIN NguoiDung nd ON bs.BacSiID = nd.NguoiDungID
            JOIN ChuyenKhoa ck ON bs.ChuyenKhoaID = ck.ChuyenKhoaID
            JOIN TrinhDo td ON bs.TrinhDoID = td.TrinhDoID
            WHERE bs.BacSiID = ? AND nd.IsDeleted = 0
            """;

        try {
            return jdbcTemplate.queryForMap(sql, doctorId);
        } catch (Exception e) {
            // Không tìm thấy bác sĩ trong DB
            return null;
        }
    }
}