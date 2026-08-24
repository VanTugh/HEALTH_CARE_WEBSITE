package org.example.demo.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;

@Data
public class NguoiThanRequest {
    @NotBlank(message = "Họ tên không được để trống")
    private String hoTen;

    @NotBlank(message = "Mối quan hệ không được để trống")
    private String moiQuanHe;

    private LocalDate ngaySinh;
    private Integer gioiTinh;
    private String soDienThoai;
    private String diaChi;
}
