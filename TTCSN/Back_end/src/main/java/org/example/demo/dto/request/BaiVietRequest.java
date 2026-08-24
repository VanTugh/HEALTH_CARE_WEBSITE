package org.example.demo.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BaiVietRequest {
    @NotBlank(message = "Tiêu đề không được để trống")
    private String tieuDe;
    private String anhBia;
    @NotBlank(message = "Phân loại không được để trống")
    private String phanLoai;
    @NotBlank(message = "Nội dung không được để trống")
    private String noiDung;
    private String tenTacGia;
}
