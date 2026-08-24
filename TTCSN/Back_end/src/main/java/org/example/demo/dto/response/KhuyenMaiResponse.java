package org.example.demo.dto.response;

import lombok.Builder;
import lombok.Data;
import org.example.demo.entity.KhuyenMai;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class KhuyenMaiResponse {
    private Integer khuyenMaiID;
    private String maVoucher;
    private String tenKhuyenMai;
    private BigDecimal phanTramGiam;
    private BigDecimal giamToiDa;
    private Integer soLuong;
    private LocalDateTime ngayBatDau;
    private LocalDateTime ngayKetThuc;
    private Boolean trangThai;

    public static KhuyenMaiResponse of(KhuyenMai entity) {
        if (entity == null) return null;
        return KhuyenMaiResponse.builder()
                .khuyenMaiID(entity.getKhuyenMaiID())
                .maVoucher(entity.getMaVoucher())
                .tenKhuyenMai(entity.getTenKhuyenMai())
                .phanTramGiam(entity.getPhanTramGiam())
                .giamToiDa(entity.getGiamToiDa())
                .soLuong(entity.getSoLuong())
                .ngayBatDau(entity.getNgayBatDau())
                .ngayKetThuc(entity.getNgayKetThuc())
                .trangThai(entity.getTrangThai())
                .build();
    }
}
