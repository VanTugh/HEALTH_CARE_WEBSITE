package org.example.demo.controller;

import lombok.RequiredArgsConstructor;
import org.example.demo.dto.request.KhuyenMaiRequest;
import org.example.demo.dto.response.ApiResponseDTO;
import org.example.demo.dto.response.KhuyenMaiResponse;
import org.example.demo.service.KhuyenMaiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/vouchers")
@RequiredArgsConstructor
public class KhuyenMaiController {

    private final KhuyenMaiService khuyenMaiService;

    // Lấy mọi voucher (Cho Admin)
    @GetMapping
    public ResponseEntity<ApiResponseDTO<List<KhuyenMaiResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponseDTO.success(khuyenMaiService.getAll()));
    }

    // Lấy danh sách voucher được phép dùng (Cho Bệnh nhân)
    @GetMapping("/active")
    public ResponseEntity<ApiResponseDTO<List<KhuyenMaiResponse>>> getActive() {
        return ResponseEntity.ok(ApiResponseDTO.success(khuyenMaiService.getActiveVouchers()));
    }

    // Validate 1 mã Voucher trước khi thanh toán (Để front-end tính tiền tạm)
    @GetMapping("/validate")
    public ResponseEntity<ApiResponseDTO<KhuyenMaiResponse>> validateVoucher(@RequestParam String code) {
        KhuyenMaiResponse km = khuyenMaiService.getByMaVoucher(code);
        if (km == null) {
            return ResponseEntity.badRequest().body(ApiResponseDTO.error("Mã giảm giá không tồn tại hoặc đã bị xóa"));
        }
        if (!km.getTrangThai() || km.getSoLuong() <= 0) {
            return ResponseEntity.badRequest().body(ApiResponseDTO.error("Mã giảm giá đã hết lượt sử dụng hoặc không khả dụng"));
        }
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(km.getNgayBatDau()) || now.isAfter(km.getNgayKetThuc())) {
            return ResponseEntity.badRequest().body(ApiResponseDTO.error("Mã giảm giá đã hết hạn hoặc chưa đến thời gian áp dụng"));
        }
        return ResponseEntity.ok(ApiResponseDTO.success(km, "Áp dụng mã hợp lệ!"));
    }

    // Tạo mới (Admin)
    @PostMapping
    public ResponseEntity<ApiResponseDTO<KhuyenMaiResponse>> create(@RequestBody KhuyenMaiRequest request) {
        return ResponseEntity.ok(ApiResponseDTO.success(khuyenMaiService.create(request)));
    }

    // Cập nhật (Admin)
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<KhuyenMaiResponse>> update(@PathVariable Integer id, @RequestBody KhuyenMaiRequest request) {
        return ResponseEntity.ok(ApiResponseDTO.success(khuyenMaiService.update(id, request)));
    }

    // Xóa (Admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<String>> delete(@PathVariable Integer id) {
        khuyenMaiService.delete(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Đã xóa mã giảm giá!"));
    }
}
