package org.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "KhuyenMai")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class KhuyenMai extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "KhuyenMaiID")
    private Integer khuyenMaiID;

    @Column(name = "MaVoucher", unique = true, nullable = false, length = 50)
    private String maVoucher;

    @Column(name = "TenKhuyenMai", nullable = false, length = 255)
    private String tenKhuyenMai;

    @Column(name = "PhanTramGiam", nullable = false)
    private BigDecimal phanTramGiam;

    @Column(name = "GiamToiDa", nullable = false)
    private BigDecimal giamToiDa;

    @Column(name = "SoLuong")
    private Integer soLuong;

    @Column(name = "NgayBatDau", nullable = false)
    private LocalDateTime ngayBatDau;

    @Column(name = "NgayKetThuc", nullable = false)
    private LocalDateTime ngayKetThuc;

    @Column(name = "TrangThai")
    private Boolean trangThai = true;
}
