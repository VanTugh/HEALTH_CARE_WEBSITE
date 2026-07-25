package org.example.demo.dto.request;

import lombok.Data;

@Data
public class DatLichRequest {
    private Integer bacSiID;
    private String ngayKham;
    private String ca;
    
    // ❌ CŨ: private LocalTime gioKham;  <-- Nguyên nhân gây ra lỗi
    // ✅ MỚI: Đổi sang String
    private String gioKham; 
    
    private String lyDoKham;
}