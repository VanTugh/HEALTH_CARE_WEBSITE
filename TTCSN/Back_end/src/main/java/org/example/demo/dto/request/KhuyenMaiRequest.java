package org.example.demo.dto.request;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class KhuyenMaiRequest {
    private String maVoucher;
    private String tenKhuyenMai;
    private BigDecimal phanTramGiam;
    private BigDecimal giamToiDa;
    private Integer soLuong;
    private LocalDateTime ngayBatDau;
    private LocalDateTime ngayKetThuc;
    private Boolean trangThai;
}
