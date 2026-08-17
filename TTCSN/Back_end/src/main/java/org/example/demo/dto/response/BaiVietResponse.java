package org.example.demo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.entity.BaiViet;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BaiVietResponse {
    private Integer baiVietID;
    private String tieuDe;
    private String anhBia;
    private String phanLoai;
    private String noiDung;
    private Integer luotXem;
    private Integer nguoiTaoID;
    private String tenNguoiTao;
    private LocalDateTime createdAt;

    public static BaiVietResponse of(BaiViet bv) {
        return BaiVietResponse.builder()
                .baiVietID(bv.getBaiVietID())
                .tieuDe(bv.getTieuDe())
                .anhBia(bv.getAnhBia())
                .phanLoai(bv.getPhanLoai())
                .noiDung(bv.getNoiDung())
                .luotXem(bv.getLuotXem() != null ? bv.getLuotXem() : 0)
                .nguoiTaoID(bv.getNguoiTaoID())
                // tenNguoiTao gets mapped in the service layer
                .createdAt(bv.getCreatedAt())
                .build();
    }
}
