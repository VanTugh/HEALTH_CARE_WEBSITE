package org.example.demo.dto.response;

import lombok.Builder;
import lombok.Data;
import org.example.demo.entity.NguoiThan;

import java.time.LocalDate;

@Data
@Builder
public class NguoiThanResponse {
    private Integer nguoiThanID;
    private String hoTen;
    private String moiQuanHe;
    private LocalDate ngaySinh;
    private Integer gioiTinh;
    private String soDienThoai;
    private String diaChi;

    public static NguoiThanResponse of(NguoiThan entity) {
        if (entity == null) return null;
        return NguoiThanResponse.builder()
                .nguoiThanID(entity.getNguoiThanID())
                .hoTen(entity.getHoTen())
                .moiQuanHe(entity.getMoiQuanHe())
                .ngaySinh(entity.getNgaySinh())
                .gioiTinh(entity.getGioiTinh())
                .soDienThoai(entity.getSoDienThoai())
                .diaChi(entity.getDiaChi())
                .build();
    }
}
