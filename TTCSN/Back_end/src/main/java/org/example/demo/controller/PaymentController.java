package org.example.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.demo.config.VnPayProperties;
import org.example.demo.dto.request.VnPayCreatePaymentRequest;
import org.example.demo.dto.response.ApiResponseDTO;
import org.example.demo.dto.response.VnPayPaymentUrlResponse;
import org.example.demo.dto.response.VnPayReturnResponse;
import org.example.demo.security.CustomUserDetails;
import org.example.demo.service.VnPayService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/payments/vnpay")
@Tag(name = "Payments - VNPay", description = "Tạo URL thanh toán, xử lý return và IPN từ VNPay")
@RequiredArgsConstructor
public class PaymentController {

    private final VnPayService vnPayService;
    private final VnPayProperties vnPayProperties;

    /* ================= CREATE PAYMENT ================= */

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('BenhNhan')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Tạo URL thanh toán VNPay cho lịch khám")
    public ResponseEntity<ApiResponseDTO<VnPayPaymentUrlResponse>> createPaymentUrl(
            @Valid @RequestBody VnPayCreatePaymentRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        String url = vnPayService.createPaymentUrl(
                request.getDatLichID(),
                userDetails.getNguoiDungID(),
                request.getClientIp()
        );

        return ResponseEntity.ok(
                ApiResponseDTO.success(
                        VnPayPaymentUrlResponse.builder()
                                .paymentUrl(url)
                                .build(),
                        "Tạo URL thanh toán thành công"
                )
        );
    }

    /* ================= RETURN (REDIRECT TO REACT) ================= */

    @GetMapping("/return")
    @Operation(
            summary = "VNPay return URL",
            description = "VNPay redirect về backend, backend redirect tiếp sang React"
    )
    public void handleReturn(
            @RequestParam Map<String, String> params,
            HttpServletResponse response
    ) throws IOException {

        VnPayReturnResponse result = vnPayService.handleReturn(params);

        // 🔁 URL FRONTEND (Đọc từ application.properties)
        String frontendBaseUrl = vnPayProperties.getFrontendUrl();

        String redirectUrl;
        if (result.isSuccess()) {
            redirectUrl = frontendBaseUrl
                    + "?status=success"
                    + "&datLichID=" + result.getDatLichID();
        } else {
            redirectUrl = frontendBaseUrl + "?status=failed";
        }

        response.sendRedirect(redirectUrl);
    }

    /* ================= IPN ================= */

    @GetMapping("/ipn")
    @Operation(
            summary = "VNPay IPN",
            description = "VNPay server gọi vào để xác nhận thanh toán"
    )
    public Map<String, String> handleIpn(
            @RequestParam Map<String, String> params
    ) {
        log.info("🔔 IPN endpoint called by VNPay");
        Map<String, String> result = vnPayService.handleIpn(params);
        log.info("📤 IPN Response: {}", result);
        return result;
    }

    /* ================= TEST IPN (CHỈ ĐỂ DEBUG - XÓA KHI PRODUCTION) ================= */

    @PostMapping("/test-ipn")
    @Operation(
            summary = "[DEBUG] Test IPN manually",
            description = "Endpoint để test IPN thủ công khi VNPay chưa gọi được. Body gửi giống params VNPay trả về."
    )
    public ResponseEntity<ApiResponseDTO<Map<String, String>>> testIpn(
            @RequestBody Map<String, String> params
    ) {
        log.warn("⚠️ USING TEST IPN ENDPOINT - THIS SHOULD BE REMOVED IN PRODUCTION");
        Map<String, String> result = vnPayService.handleIpn(params);
        return ResponseEntity.ok(ApiResponseDTO.success(result, "Test IPN completed"));
    }
}
