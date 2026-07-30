package org.example.demo.controller;

import org.example.demo.dto.request.DatLichRequest;
import org.example.demo.security.CustomUserDetails;
import org.example.demo.service.DatLichService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dat-lich")
@CrossOrigin(origins = "*")
public class DatLichController {

    private final DatLichService datLichService;

    public DatLichController(DatLichService datLichService) {
        this.datLichService = datLichService;
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody DatLichRequest request) {
        try {
            // 1. Lấy đối tượng Authenticated người dùng từ Security Context
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Vui lòng đăng nhập để thực hiện đặt lịch!");
                return ResponseEntity.status(401).body(errorResponse);
            }

            // 2. Ép kiểu sang CustomUserDetails để lấy NguoiDungID chính xác
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            Integer currentUserId = userDetails.getNguoiDungID();

            System.out.println("DEBUG - Đã xác thực thành công UserID: " + currentUserId);

            // 3. Gọi logic tạo lịch
            String maXacNhan = datLichService.taoLichKham(request, currentUserId);

            // 4. Trả về JSON thành công
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("bookingCode", maXacNhan);
            response.put("message", "Đặt lịch thành công! Đang chờ bác sĩ xác nhận.");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Có lỗi xảy ra khi lưu lịch khám: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
}