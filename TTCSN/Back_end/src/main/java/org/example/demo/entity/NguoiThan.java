package org.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "NguoiThan")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class NguoiThan extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "NguoiThanID")
    private Integer nguoiThanID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "NguoiDungID", nullable = false)
    private NguoiDung nguoiDung;

    @Column(name = "HoTen", nullable = false, length = 100)
    private String hoTen;

    @Column(name = "MoiQuanHe", nullable = false, length = 50)
    private String moiQuanHe;

    @Column(name = "NgaySinh")
    private LocalDate ngaySinh;

    @Column(name = "GioiTinh")
    private Integer gioiTinh;

    @Column(name = "SoDienThoai", length = 20)
    private String soDienThoai;

    @Column(name = "DiaChi", columnDefinition = "NVARCHAR(255)")
    private String diaChi;
}
