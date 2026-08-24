package org.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "BaiViet")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class BaiViet extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BaiVietID")
    private Integer baiVietID;

    @Column(name = "TieuDe", nullable = false, length = 500)
    private String tieuDe;

    @Column(name = "AnhBia", length = 1000)
    private String anhBia;

    @Column(name = "PhanLoai", nullable = false, length = 100)
    private String phanLoai;

    @Column(name = "NoiDung", columnDefinition = "LONGTEXT")
    private String noiDung;

    @Column(name = "LuotXem")
    private Integer luotXem = 0;

    // Lưu ID người tạo đơn giản, tránh circular reference khi serialize JSON
    @Column(name = "NguoiTao")
    private Integer nguoiTaoID;

    // Tên tác giả tự điền (không bắt buộc liên kết với bảng NguoiDung)
    @Column(name = "TenTacGia", length = 255)
    private String tenTacGia;
}
