package org.example.demo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SlotRanhResponse {
    private Integer id;        // ID định danh duy nhất cho từng slot
    private String ca;         // "SANG", "CHIEU", "TOI"
    private String gioKham;    // Chuỗi hiển thị trên UI, ví dụ: "08:00 - 08:30"
}