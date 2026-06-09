package org.example.demo.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.demo.config.VnPayProperties;
import org.example.demo.dto.response.VnPayReturnResponse;
import org.example.demo.entity.DatLichKham;
import org.example.demo.enums.*;
import org.example.demo.exception.*;
import org.example.demo.repository.DatLichKhamRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class VnPayService {

    private static final ZoneId VN_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");
    private static final DateTimeFormatter VNP_TIME_FMT =
            DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    private final DatLichKhamRepository datLichKhamRepository;
    private final VnPayProperties vnPayProperties;

    /* ================= CREATE PAYMENT URL ================= */

    @Transactional
    public String createPaymentUrl(Integer datLichID, Integer currentUserId, String clientIp) {
        log.info("🔨 Creating VNPay payment URL for booking ID: {}", datLichID);

        DatLichKham booking = datLichKhamRepository.findById(datLichID)
                .orElseThrow(() -> new ResourceNotFoundException("Lịch khám không tồn tại"));

        log.info("📊 Booking status - TrangThai: {}, TrangThaiThanhToan: {}",
                booking.getTrangThai(),
                booking.getTrangThaiThanhToan());

        if (!booking.getBenhNhan().getNguoiDungID().equals(currentUserId))
            throw new UnauthorizedException("Không sở hữu lịch khám");

        if (booking.getPhuongThucThanhToan() != PhuongThucThanhToan.VNPAY)
            throw new BadRequestException("Không phải thanh toán VNPay");

        if (booking.getTrangThaiThanhToan() == TrangThaiThanhToan.THANH_CONG)
            throw new BadRequestException("Đã thanh toán");

        // Chỉ cho phép thanh toán khi TrangThai = CHO_THANH_TOAN hoặc DA_XAC_NHAN_CHO_THANH_TOAN
        boolean waiting =
                booking.getTrangThai() == TrangThaiDatLich.CHO_THANH_TOAN ||
                        booking.getTrangThai() == TrangThaiDatLich.DA_XAC_NHAN_CHO_THANH_TOAN;

        if (!waiting) {
            log.error("❌ Cannot create payment URL - booking status is {}, expected CHO_THANH_TOAN or DA_XAC_NHAN_CHO_THANH_TOAN",
                    booking.getTrangThai());
            throw new BadRequestException("Lịch chưa sẵn sàng thanh toán");
        }

        String txnRef = booking.getMaGiaoDich();
        if (txnRef == null || txnRef.isBlank()) {
            txnRef = "VNP" + booking.getDatLichID() + System.currentTimeMillis();
            booking.setMaGiaoDich(txnRef);
            datLichKhamRepository.save(booking);
        }

        long amount = booking.getGiaKham()
                .multiply(BigDecimal.valueOf(100))
                .longValue();

        LocalDateTime now = LocalDateTime.now(VN_ZONE);
        LocalDateTime expire = now.plusMinutes(
                vnPayProperties.getExpireMinutes() != null
                        ? vnPayProperties.getExpireMinutes()
                        : 15
        );

        Map<String, String> params = new TreeMap<>();
        params.put("vnp_Version", vnPayProperties.getVersion());
        params.put("vnp_Command", vnPayProperties.getCommand());
        params.put("vnp_TmnCode", vnPayProperties.getTmnCode());
        params.put("vnp_Amount", String.valueOf(amount));
        params.put("vnp_CurrCode", vnPayProperties.getCurrCode());
        params.put("vnp_TxnRef", txnRef);
        params.put("vnp_OrderInfo", "Thanh toan lich kham " + booking.getDatLichID());
        params.put("vnp_OrderType", vnPayProperties.getOrderType());
        params.put("vnp_Locale", vnPayProperties.getLocale());
        params.put("vnp_ReturnUrl", vnPayProperties.getReturnUrl());
        params.put("vnp_IpAddr", clientIp != null ? clientIp : "127.0.0.1");
        params.put("vnp_CreateDate", VNP_TIME_FMT.format(now));
        params.put("vnp_ExpireDate", VNP_TIME_FMT.format(expire));

        /* ========= ENCODE + SIGN (CHUẨN VNPay) ========= */
        String queryString = buildQuery(params);
        String secureHash = hmacSHA512(
                vnPayProperties.getHashSecret(),
                queryString
        );

        return vnPayProperties.getPayUrl()
                + "?" + queryString
                + "&vnp_SecureHash=" + secureHash;
    }

    /* ================= RETURN ================= */

    @Transactional(readOnly = true)
    public VnPayReturnResponse handleReturn(Map<String, String> params) {
        log.info("🔙 RETURN CALLBACK from VNPay");
        log.info("📦 Return Params: {}", params);

        // Verify signature (KHÔNG thay đổi params gốc)
        boolean valid = verifySignature(new HashMap<>(params));

        boolean success = valid
                && "00".equals(params.get("vnp_ResponseCode"))
                && "00".equals(params.get("vnp_TransactionStatus"));

        log.info("💳 Return: ResponseCode: {}, TransactionStatus: {}, Valid: {}, Success: {}",
                params.get("vnp_ResponseCode"),
                params.get("vnp_TransactionStatus"),
                valid,
                success);

        String txnRef = params.get("vnp_TxnRef");
        Integer datLichId = datLichKhamRepository
                .findByMaGiaoDich(txnRef)
                .map(DatLichKham::getDatLichID)
                .orElse(null);

        log.info("📋 Return: txnRef: {}, datLichID: {}", txnRef, datLichId);

        return VnPayReturnResponse.builder()
                .success(success)
                .responseCode(params.get("vnp_ResponseCode"))
                .transactionStatus(params.get("vnp_TransactionStatus"))
                .datLichID(datLichId)
                .message(success ? "Thanh toán thành công" : "Thanh toán thất bại")
                .build();
    }

    /* ================= IPN ================= */

    @Transactional
    public Map<String, String> handleIpn(Map<String, String> params) {
        log.info("🔔 IPN CALLBACK RECEIVED from VNPay");
        log.info("📦 IPN Params: {}", params);

        Map<String, String> response = new HashMap<>();

        // Verify signature (KHÔNG thay đổi params gốc)
        if (!verifySignature(new HashMap<>(params))) {
            log.error("❌ IPN: Invalid signature");
            response.put("RspCode", "97");
            response.put("Message", "Invalid signature");
            return response;
        }

        log.info("✅ IPN: Signature valid");

        String txnRef = params.get("vnp_TxnRef");
        DatLichKham booking = datLichKhamRepository
                .findByMaGiaoDich(txnRef)
                .orElse(null);

        if (booking == null) {
            log.error("❌ IPN: Order not found - txnRef: {}", txnRef);
            response.put("RspCode", "01");
            response.put("Message", "Order not found");
            return response;
        }

        log.info("📋 IPN: Found booking ID: {}", booking.getDatLichID());

        // Check idempotency - Nếu đã thanh toán thành công rồi thì không xử lý nữa
        if (booking.getTrangThaiThanhToan() == TrangThaiThanhToan.THANH_CONG) {
            log.warn("⚠️ IPN: Order already paid - txnRef: {}", txnRef);
            response.put("RspCode", "02");
            response.put("Message", "Order already confirmed");
            return response;
        }

        long amount = Long.parseLong(params.get("vnp_Amount"));
        long expected = booking.getGiaKham()
                .multiply(BigDecimal.valueOf(100))
                .longValue();

        if (amount != expected) {
            log.error("❌ IPN: Invalid amount - received: {}, expected: {}", amount, expected);
            response.put("RspCode", "04");
            response.put("Message", "Invalid amount");
            return response;
        }

        boolean success =
                "00".equals(params.get("vnp_ResponseCode")) &&
                        "00".equals(params.get("vnp_TransactionStatus"));

        log.info("💳 IPN: Payment status - ResponseCode: {}, TransactionStatus: {}, Success: {}",
                params.get("vnp_ResponseCode"),
                params.get("vnp_TransactionStatus"),
                success);

        log.info("📊 IPN: Current booking status - TrangThai: {}, TrangThaiThanhToan: {}",
                booking.getTrangThai(),
                booking.getTrangThaiThanhToan());

        // Lưu thông tin thanh toán
        booking.setThongTinThanhToan(serialize(params));
        booking.setNgayThanhToan(LocalDateTime.now());

        if (success) {
            // ✅ THANH TOÁN THÀNH CÔNG
            booking.setTrangThaiThanhToan(TrangThaiThanhToan.THANH_CONG);

            // Chỉ chuyển sang DA_XAC_NHAN nếu đang ở trạng thái chờ thanh toán
            if (booking.getTrangThai() == TrangThaiDatLich.CHO_THANH_TOAN ||
                booking.getTrangThai() == TrangThaiDatLich.DA_XAC_NHAN_CHO_THANH_TOAN) {
                
                booking.setTrangThai(TrangThaiDatLich.DA_XAC_NHAN);
                log.info("✅ IPN: Updated booking {} → TrangThai: DA_XAC_NHAN, TrangThaiThanhToan: THANH_CONG",
                        booking.getDatLichID());
            } else {
                log.warn("⚠️ IPN: Payment success but booking status is {} (not waiting for payment). Status unchanged.",
                        booking.getTrangThai());
            }

        } else {
            // ❌ THANH TOÁN THẤT BẠI
            booking.setTrangThaiThanhToan(TrangThaiThanhToan.THAT_BAI);
            // Giữ nguyên TrangThai để có thể thanh toán lại
            log.warn("⚠️ IPN: Payment failed for booking {} → TrangThaiThanhToan: THAT_BAI (TrangThai unchanged)",
                    booking.getDatLichID());
        }

        datLichKhamRepository.save(booking);

        response.put("RspCode", "00");
        response.put("Message", "Confirm Success");
        log.info("✅ IPN: Processed successfully - txnRef: {}", txnRef);
        return response;
    }

    /* ================= UTILS ================= */

    private boolean verifySignature(Map<String, String> params) {
        String receivedHash = params.remove("vnp_SecureHash");
        params.remove("vnp_SecureHashType");

        String query = buildQuery(new TreeMap<>(params));
        String calculated = hmacSHA512(vnPayProperties.getHashSecret(), query);

        return calculated.equalsIgnoreCase(receivedHash);
    }

    private String buildQuery(Map<String, String> params) {
        StringBuilder sb = new StringBuilder();
        for (Iterator<Map.Entry<String, String>> it = params.entrySet().iterator(); it.hasNext();) {
            Map.Entry<String, String> e = it.next();
            sb.append(URLEncoder.encode(e.getKey(), StandardCharsets.UTF_8))
                    .append("=")
                    .append(URLEncoder.encode(e.getValue(), StandardCharsets.UTF_8));
            if (it.hasNext()) sb.append("&");
        }
        return sb.toString();
    }

    private String hmacSHA512(String key, String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA512");
            mac.init(new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512"));
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }

    private String serialize(Map<String, String> data) {
        try {
            return OBJECT_MAPPER.writeValueAsString(data);
        } catch (Exception e) {
            return data.toString();
        }
    }
}
