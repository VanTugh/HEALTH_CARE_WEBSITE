package org.example.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.example.demo.dto.request.*;
import org.example.demo.dto.response.ApiResponseDTO;
import org.example.demo.dto.response.BookingResponse;
import org.example.demo.dto.response.DoctorScheduleItemResponse;
import org.example.demo.dto.response.AvailableSlotsResponse;
import org.example.demo.dto.response.BookingStatisticsResponse;
import org.example.demo.dto.response.SpecialtyRevenueResponse;
import org.example.demo.dto.response.DoctorRevenueResponse;
import org.example.demo.security.CustomUserDetails;
import org.example.demo.service.BookingService;
import org.example.demo.enums.TrangThaiDatLich;
import org.example.demo.enums.PhuongThucThanhToan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * BookingController - REST API cho quản lý đặt lịch khám
 * 
 * Endpoints:
 * - Patient: Create, view, cancel bookings
 * - Doctor: Confirm/reject, view appointments, complete
 * - Admin: View all bookings, statistics
 * 
 * Security:
 * - All endpoints require authentication
 * - Role-based access control
 * 
 * @author Healthcare System Team
 * @version 1.0 - Phase 2D
 */
@Slf4j
@RestController
@RequestMapping("/api/bookings")
@Tag(name = "Booking Management", description = "APIs quản lý đặt lịch khám bệnh")
@SecurityRequirement(name = "bearerAuth")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // ========================================
    // PATIENT ENDPOINTS
    // ========================================

    /**
     * Thống kê booking (Admin)
     */
    @GetMapping("/statistics")
    @PreAuthorize("hasAuthority('Admin')")
    @Operation(
        summary = "Thống kê booking",
        description = "Thống kê tổng quan: số lượng theo trạng thái, theo ngày/tuần/tháng, doanh thu, đánh giá, hoàn tiền"
    )
    public ResponseEntity<ApiResponseDTO<BookingStatisticsResponse>> getStatistics() {
        BookingStatisticsResponse response = bookingService.getBookingStatistics();
        return ResponseEntity.ok(ApiResponseDTO.success(response, "Lấy thống kê booking thành công"));
    }

    /**
     * Doanh thu theo chuyên khoa
     */
    @GetMapping("/statistics/revenue/specialties")
    @PreAuthorize("hasAuthority('Admin')")
    @Operation(summary = "Doanh thu theo chuyên khoa")
    public ResponseEntity<ApiResponseDTO<List<SpecialtyRevenueResponse>>> revenueBySpecialty(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate
    ) {
        List<SpecialtyRevenueResponse> data = bookingService.getRevenueBySpecialty(fromDate, toDate);
        return ResponseEntity.ok(ApiResponseDTO.success(data, "Lấy doanh thu theo chuyên khoa thành công"));
    }

    /**
     * Doanh thu theo bác sĩ (full danh sách, tối đa 200)
     */
    @GetMapping("/statistics/revenue/doctors")
    @PreAuthorize("hasAuthority('Admin')")
    @Operation(summary = "Doanh thu theo bác sĩ")
    public ResponseEntity<ApiResponseDTO<List<DoctorRevenueResponse>>> revenueByDoctor(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate
    ) {
        List<DoctorRevenueResponse> data = bookingService.getRevenueByDoctor(fromDate, toDate);
        return ResponseEntity.ok(ApiResponseDTO.success(data, "Lấy doanh thu theo bác sĩ thành công"));
    }

    /**
     * Top bác sĩ doanh thu cao nhất
     */
    @GetMapping("/statistics/top-doctors/revenue")
    @PreAuthorize("hasAuthority('Admin')")
    @Operation(summary = "Top bác sĩ theo doanh thu")
    public ResponseEntity<ApiResponseDTO<List<DoctorRevenueResponse>>> topDoctorRevenue(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
        @RequestParam(defaultValue = "10") int size
    ) {
        List<DoctorRevenueResponse> data = bookingService.getTopDoctorRevenue(fromDate, toDate, size);
        return ResponseEntity.ok(ApiResponseDTO.success(data, "Lấy top doanh thu bác sĩ thành công"));
    }

    /**
     * Top bác sĩ có số ca khám hoàn thành cao nhất
     */
    @GetMapping("/statistics/top-doctors/completed")
    @PreAuthorize("hasAuthority('Admin')")
    @Operation(summary = "Top bác sĩ theo số ca hoàn thành")
    public ResponseEntity<ApiResponseDTO<List<DoctorRevenueResponse>>> topDoctorCompleted(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
        @RequestParam(defaultValue = "10") int size
    ) {
        List<DoctorRevenueResponse> data = bookingService.getTopDoctorCompleted(fromDate, toDate, size);
        return ResponseEntity.ok(ApiResponseDTO.success(data, "Lấy top bác sĩ theo số ca hoàn thành thành công"));
    }

    /**
     * Tìm slot trống theo bác sĩ / ngày / ca
     */
    @GetMapping("/available-slots")
    @PreAuthorize("hasAnyAuthority('BenhNhan', 'BacSi', 'Admin')")
    @Operation(
        summary = "Tìm slot trống",
        description = "Trả về danh sách slot (theo bước cấu hình) cho 1 bác sĩ trong ngày/ca"
    )
    public ResponseEntity<ApiResponseDTO<AvailableSlotsResponse>> searchAvailableSlots(
        @Valid SearchAvailableSlotsRequest request
    ) {
        AvailableSlotsResponse response = bookingService.searchAvailableSlots(request);
        return ResponseEntity.ok(ApiResponseDTO.success(response, "Lấy danh sách slot thành công"));
    }

    /**
     * Tìm slot trống của 1 bác sĩ cho 1 ngày (trong 7 ngày từ hôm nay)
     */
    @GetMapping("/doctor/{id}/available-slots/day")
    @PreAuthorize("hasAnyAuthority('BenhNhan', 'BacSi', 'Admin')")
    @Operation(
        summary = "Xem slot trống trong 1 ngày",
        description = "Trả về slot trống theo ca cho bác sĩ trong 1 ngày (giới hạn 7 ngày từ hôm nay)"
    )
    public ResponseEntity<ApiResponseDTO<List<AvailableSlotsResponse>>> getAvailableSlotsForDay(
        @Parameter(description = "ID bác sĩ", example = "5")
        @PathVariable("id") Integer bacSiId,

        @Parameter(description = "Ngày cần xem (default = hôm nay)", example = "2025-12-05")
        @RequestParam(value = "date", required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        List<AvailableSlotsResponse> responses = bookingService.getAvailableSlotsForDay(bacSiId, date);
        return ResponseEntity.ok(ApiResponseDTO.success(responses, "Lấy danh sách slot theo ngày thành công"));
    }

    /**
     * Tạo lịch khám mới (Bệnh nhân)
     */
    @PostMapping
    @PreAuthorize("hasAuthority('BenhNhan')")
    @Operation(
        summary = "Đặt lịch khám mới",
        description = "Bệnh nhân đặt lịch khám với bác sĩ. Hỗ trợ thanh toán tiền mặt hoặc online (VNPay, MoMo)"
    )
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Đặt lịch thành công"),
        @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ"),
        @ApiResponse(responseCode = "409", description = "Slot đã bị đặt hoặc bệnh nhân có lịch trùng")
    })
    public ResponseEntity<ApiResponseDTO<BookingResponse>> createBooking(
        @Valid @RequestBody CreateBookingRequest request,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        log.info("📝 Creating booking for patient: {}", userDetails.getNguoiDungID());
        
        BookingResponse booking = bookingService.createBooking(request, userDetails.getNguoiDungID());
        
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponseDTO.success(
                booking,
                "Đặt lịch khám thành công! Mã xác nhận: " + booking.getMaXacNhan()
            ));
    }

    /**
     * Lấy danh sách lịch khám của bệnh nhân (có phân trang)
     */
    @GetMapping("/my")
    @PreAuthorize("hasAuthority('BenhNhan')")
    @Operation(
        summary = "Xem lịch khám của tôi",
        description = "Bệnh nhân xem tất cả lịch khám của mình (có phân trang)"
    )
    public ResponseEntity<ApiResponseDTO<Page<BookingResponse>>> getMyBookings(
        @Parameter(description = "Số trang (0-based)", example = "0")
        @RequestParam(defaultValue = "0") int page,
        
        @Parameter(description = "Số lượng mỗi trang", example = "10")
        @RequestParam(defaultValue = "10") int size,
        
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        log.info("📋 Getting bookings for patient: {}", userDetails.getNguoiDungID());
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("ngayDat").descending());
        Page<BookingResponse> bookings = bookingService.getMyBookings(
            userDetails.getNguoiDungID(), 
            pageable
        );
        
        return ResponseEntity.ok(ApiResponseDTO.success(
            bookings,
            String.format("Tìm thấy %d lịch khám", bookings.getTotalElements())
        ));
    }

    /**
     * Lịch sử khám của bệnh nhân (có lọc)
     */
    @GetMapping("/history")
    @PreAuthorize("hasAuthority('BenhNhan')")
    @Operation(
        summary = "Lịch sử khám (bệnh nhân)",
        description = "Xem lịch sử khám của chính mình, có lọc theo ngày, trạng thái, thanh toán, đánh giá"
    )
    public ResponseEntity<ApiResponseDTO<Page<BookingResponse>>> getPatientHistory(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
        @RequestParam(required = false) TrangThaiDatLich status,
        @RequestParam(required = false) PhuongThucThanhToan paymentMethod,
        @RequestParam(required = false) Boolean hasRating,
        @RequestParam(required = false) Integer doctorId,
        @RequestParam(required = false) Integer facilityId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "ngayKham") String sortBy,
        @RequestParam(defaultValue = "DESC") Sort.Direction direction,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<BookingResponse> bookings = bookingService.getPatientHistory(
            userDetails.getNguoiDungID(),
            fromDate,
            toDate,
            status,
            paymentMethod,
            hasRating,
            doctorId,
            facilityId,
            pageable
        );
        return ResponseEntity.ok(ApiResponseDTO.success(bookings, "Lấy lịch sử khám thành công"));
    }

    /**
     * Xem chi tiết 1 lịch khám
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('BenhNhan', 'BacSi', 'Admin')")
    @Operation(
        summary = "Xem chi tiết lịch khám",
        description = "Xem thông tin chi tiết của 1 lịch khám (chỉ bệnh nhân hoặc bác sĩ liên quan)"
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Thành công"),
        @ApiResponse(responseCode = "403", description = "Không có quyền xem"),
        @ApiResponse(responseCode = "404", description = "Không tìm thấy lịch khám")
    })
    public ResponseEntity<ApiResponseDTO<BookingResponse>> getBookingDetails(
        @Parameter(description = "ID lịch khám", example = "123")
        @PathVariable Integer id,
        
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        log.info("👁️ User {} viewing booking #{}", userDetails.getNguoiDungID(), id);
        
        BookingResponse booking = bookingService.getBookingDetails(id, userDetails.getNguoiDungID());
        
        return ResponseEntity.ok(ApiResponseDTO.success(booking, "Lấy thông tin thành công"));
    }

    /**
     * Hủy lịch khám (Bệnh nhân hoặc Bác sĩ)
     */
    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasAnyAuthority('BenhNhan', 'BacSi')")
    @Operation(
        summary = "Hủy lịch khám",
        description = "Bệnh nhân hủy trước 24h, bác sĩ có thể hủy bất kỳ lúc nào"
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Hủy thành công"),
        @ApiResponse(responseCode = "400", description = "Không thể hủy (< 24h hoặc trạng thái không hợp lệ)"),
        @ApiResponse(responseCode = "403", description = "Không có quyền hủy")
    })
    public ResponseEntity<ApiResponseDTO<Void>> cancelBooking(
        @Parameter(description = "ID lịch khám", example = "123")
        @PathVariable Integer id,
        
        @Valid @RequestBody CancelBookingRequest request,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        log.info("🚫 User {} cancelling booking #{}", userDetails.getNguoiDungID(), id);
        
        request.setDatLichID(id);
        bookingService.cancelBooking(request, userDetails.getNguoiDungID());
        
        return ResponseEntity.ok(ApiResponseDTO.success(null, "Hủy lịch khám thành công"));
    }

    /**
     * Đánh giá sau khám (Bệnh nhân)
     */
    @PostMapping("/{id}/rate")
    @PreAuthorize("hasAuthority('BenhNhan')")
    @Operation(
        summary = "Đánh giá sau khám",
        description = "Bệnh nhân đánh giá bác sĩ sau khi hoàn thành khám (1-5 sao)"
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Đánh giá thành công"),
        @ApiResponse(responseCode = "400", description = "Chưa hoàn thành khám hoặc đã đánh giá rồi")
    })
    public ResponseEntity<ApiResponseDTO<BookingResponse>> rateBooking(
        @Parameter(description = "ID lịch khám", example = "123")
        @PathVariable Integer id,
        
        @Valid @RequestBody RateBookingRequest request,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        log.info("⭐ Patient {} rating booking #{}", userDetails.getNguoiDungID(), id);
        
        request.setDatLichID(id);
        BookingResponse booking = bookingService.rateBooking(request, userDetails.getNguoiDungID());
        
        return ResponseEntity.ok(ApiResponseDTO.success(
            booking, 
            "Cảm ơn bạn đã đánh giá!"
        ));
    }

    // ========================================
    // DOCTOR ENDPOINTS
    // ========================================

    /**
     * Xem lịch hẹn của bác sĩ theo ngày
     */
    @GetMapping("/doctor/appointments")
    @PreAuthorize("hasAuthority('BacSi')")
    @Operation(
        summary = "Xem lịch hẹn của bác sĩ",
        description = "Bác sĩ xem danh sách lịch hẹn theo ngày (mặc định = hôm nay)"
    )
    public ResponseEntity<ApiResponseDTO<List<BookingResponse>>> getDoctorAppointments(
        @Parameter(description = "Ngày khám (yyyy-MM-dd)", example = "2025-12-15")
        @RequestParam(required = false) LocalDate ngayKham,
        
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        LocalDate date = ngayKham != null ? ngayKham : LocalDate.now();
        log.info("📅 Doctor {} viewing appointments for {}", userDetails.getNguoiDungID(), date);
        
        List<BookingResponse> appointments = bookingService.getDoctorAppointments(
            userDetails.getNguoiDungID(), 
            date
        );
        
        return ResponseEntity.ok(ApiResponseDTO.success(
            appointments,
            String.format("Tìm thấy %d lịch hẹn", appointments.size())
        ));
    }

    /**
     * Lịch sử khám của bác sĩ (có lọc)
     */
    @GetMapping("/doctor/history")
    @PreAuthorize("hasAuthority('BacSi')")
    @Operation(
        summary = "Lịch sử khám (bác sĩ)",
        description = "Bác sĩ xem lịch sử khám của mình, có lọc theo ngày, trạng thái, thanh toán, đánh giá"
    )
    public ResponseEntity<ApiResponseDTO<Page<BookingResponse>>> getDoctorHistory(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
        @RequestParam(required = false) TrangThaiDatLich status,
        @RequestParam(required = false) PhuongThucThanhToan paymentMethod,
        @RequestParam(required = false) Boolean hasRating,
        @RequestParam(required = false) Integer patientId,
        @RequestParam(required = false) Integer facilityId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "ngayKham") String sortBy,
        @RequestParam(defaultValue = "DESC") Sort.Direction direction,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<BookingResponse> bookings = bookingService.getDoctorHistory(
            userDetails.getNguoiDungID(),
            fromDate,
            toDate,
            status,
            paymentMethod,
            hasRating,
            patientId,
            facilityId,
            pageable
        );
        return ResponseEntity.ok(ApiResponseDTO.success(bookings, "Lấy lịch sử khám của bác sĩ thành công"));
    }

    /**
     * Lịch sử khám của bệnh nhân theo số điện thoại (chỉ bác sĩ, giới hạn trong các lịch của chính bác sĩ)
     */
    @GetMapping("/doctor/history/by-phone")
    @PreAuthorize("hasAuthority('BacSi')")
    @Operation(
        summary = "Lịch sử khám bệnh nhân theo số điện thoại",
        description = "Bác sĩ tra cứu lịch sử khám của bệnh nhân bằng số điện thoại, chỉ trả về các lịch do chính bác sĩ này khám"
    )
    public ResponseEntity<ApiResponseDTO<Page<BookingResponse>>> getDoctorHistoryByPhone(
        @RequestParam String phone,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
        @RequestParam(required = false) TrangThaiDatLich status,
        @RequestParam(required = false) PhuongThucThanhToan paymentMethod,
        @RequestParam(required = false) Boolean hasRating,
        @RequestParam(required = false) Integer doctorId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "ngayKham") String sortBy,
        @RequestParam(defaultValue = "DESC") Sort.Direction direction,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<BookingResponse> bookings = bookingService.getDoctorHistoryByPhone(
            userDetails.getNguoiDungID(),
            phone,
            fromDate,
            toDate,
            status,
            paymentMethod,
            hasRating,
            doctorId,
            pageable
        );
        return ResponseEntity.ok(ApiResponseDTO.success(bookings, "Lấy lịch sử khám theo số điện thoại thành công"));
    }

    /**
     * Xem lịch làm việc thực tế của bác sĩ (cho phép bệnh nhân xem để đặt)
     */
    @GetMapping("/doctor/{id}/schedule")
    @PreAuthorize("hasAnyAuthority('BenhNhan', 'BacSi', 'Admin')")
    @Operation(
        summary = "Xem lịch làm việc thực tế của bác sĩ",
        description = "Hiển thị ca làm việc, ca nghỉ đã duyệt và slot đã đặt trong khoảng ngày (mặc định 7 ngày từ hôm nay)"
    )
    public ResponseEntity<ApiResponseDTO<List<DoctorScheduleItemResponse>>> getDoctorSchedule(
        @Parameter(description = "ID bác sĩ", example = "10")
        @PathVariable Integer id,

        @Parameter(description = "Từ ngày (yyyy-MM-dd), mặc định = hôm nay", example = "2025-12-05")
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,

        @Parameter(description = "Đến ngày (yyyy-MM-dd), mặc định = +6 ngày", example = "2025-12-12")
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        log.info("🗓️ View doctor schedule for doctor {} from {} to {}", id, from, to);

        List<DoctorScheduleItemResponse> schedule = bookingService.getDoctorSchedule(id, from, to);

        return ResponseEntity.ok(ApiResponseDTO.success(
            schedule,
            String.format("Lấy lịch làm việc từ %s đến %s", 
                schedule.isEmpty() ? (from != null ? from : LocalDate.now()) : schedule.get(0).getNgay(),
                to != null ? to : (from != null ? from.plusDays(6) : LocalDate.now().plusDays(6))
            )
        ));
    }

    /**
     * Bác sĩ xác nhận/từ chối lịch hẹn
     */
    @PostMapping("/{id}/confirm")
    @PreAuthorize("hasAuthority('BacSi')")
    @Operation(
        summary = "Xác nhận/Từ chối lịch hẹn",
        description = "Bác sĩ xác nhận hoặc từ chối lịch hẹn của bệnh nhân"
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Xử lý thành công"),
        @ApiResponse(responseCode = "400", description = "Trạng thái không hợp lệ hoặc thiếu lý do từ chối"),
        @ApiResponse(responseCode = "403", description = "Không phải lịch hẹn của bác sĩ này")
    })
    public ResponseEntity<ApiResponseDTO<BookingResponse>> confirmBooking(
        @Parameter(description = "ID lịch khám", example = "123")
        @PathVariable Integer id,
        
        @Valid @RequestBody DoctorConfirmBookingRequest request,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        log.info("✅ Doctor {} processing booking #{}", userDetails.getNguoiDungID(), id);
        
        request.setDatLichID(id);
        BookingResponse booking = bookingService.doctorConfirmBooking(
            request, 
            userDetails.getNguoiDungID()
        );
        
        String message = request.isApprove() 
            ? "Đã xác nhận lịch hẹn thành công" 
            : "Đã từ chối lịch hẹn";
        
        return ResponseEntity.ok(ApiResponseDTO.success(booking, message));
    }

    /**
     * Lịch sử khám cho admin (có lọc)
     */
    @GetMapping("/admin/history")
    @PreAuthorize("hasAuthority('Admin')")
    @Operation(
        summary = "Lịch sử khám (admin)",
        description = "Admin xem lịch sử khám toàn hệ thống, có lọc theo ngày, trạng thái, thanh toán, bác sĩ, bệnh nhân, cơ sở"
    )
    public ResponseEntity<ApiResponseDTO<Page<BookingResponse>>> getAdminHistory(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
        @RequestParam(required = false) TrangThaiDatLich status,
        @RequestParam(required = false) PhuongThucThanhToan paymentMethod,
        @RequestParam(required = false) Boolean hasRating,
        @RequestParam(required = false) Integer doctorId,
        @RequestParam(required = false) Integer patientId,
        @RequestParam(required = false) Integer facilityId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "ngayKham") String sortBy,
        @RequestParam(defaultValue = "DESC") Sort.Direction direction
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<BookingResponse> bookings = bookingService.getAdminHistory(
            fromDate,
            toDate,
            status,
            paymentMethod,
            hasRating,
            doctorId,
            patientId,
            facilityId,
            pageable
        );
        return ResponseEntity.ok(ApiResponseDTO.success(bookings, "Lấy lịch sử khám thành công"));
    }

    /**
     * Check-in bệnh nhân (Lễ tân hoặc Bác sĩ)
     */
    @PostMapping("/{id}/checkin")
    @PreAuthorize("hasAnyAuthority('BacSi', 'LeTan', 'Admin')")
    @Operation(
        summary = "Check-in bệnh nhân",
        description = "Check-in bệnh nhân khi đến khám (chỉ check-in được vào đúng ngày hẹn)"
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Check-in thành công"),
        @ApiResponse(responseCode = "400", description = "Chưa đến ngày khám hoặc trạng thái không hợp lệ")
    })
    public ResponseEntity<ApiResponseDTO<BookingResponse>> checkInPatient(
        @Parameter(description = "ID lịch khám", example = "123")
        @PathVariable Integer id
    ) {
        log.info("👤 Checking in patient for booking #{}", id);
        
        CheckInBookingRequest request = CheckInBookingRequest.builder()
            .datLichID(id)
            .build();
        
        BookingResponse booking = bookingService.checkInPatient(request);
        
        return ResponseEntity.ok(ApiResponseDTO.success(
            booking, 
            "Check-in thành công. Vui lòng chờ bác sĩ khám!"
        ));
    }

    /**
     * Hoàn thành khám bệnh (Bác sĩ)
     */
    @PostMapping("/{id}/complete")
    @PreAuthorize("hasAuthority('BacSi')")
    @Operation(
        summary = "Hoàn thành khám bệnh",
        description = "Bác sĩ nhập kết quả khám và hoàn thành buổi khám"
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Hoàn thành thành công"),
        @ApiResponse(responseCode = "400", description = "Chưa check-in hoặc trạng thái không hợp lệ"),
        @ApiResponse(responseCode = "403", description = "Không phải bác sĩ của lịch hẹn này")
    })
    public ResponseEntity<ApiResponseDTO<BookingResponse>> completeAppointment(
        @Parameter(description = "ID lịch khám", example = "123")
        @PathVariable Integer id,
        
        @Valid @RequestBody CompleteAppointmentRequest request,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        log.info("✅ Doctor {} completing appointment #{}", userDetails.getNguoiDungID(), id);
        
        request.setDatLichID(id);
        BookingResponse booking = bookingService.completeAppointment(
            request, 
            userDetails.getNguoiDungID()
        );
        
        return ResponseEntity.ok(ApiResponseDTO.success(
            booking, 
            "Đã hoàn thành khám bệnh. Kết quả đã được lưu!"
        ));
    }

    /**
     * Xác nhận đã thanh toán tiền mặt (Lễ tân/Bác sĩ/Admin)
     */
    @PostMapping("/{id}/pay-cash")
    @PreAuthorize("hasAnyAuthority('BacSi', 'Admin')")
    @Operation(
        summary = "Xác nhận thanh toán tiền mặt",
        description = "Đánh dấu booking đã thanh toán tiền mặt tại quầy"
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Xác nhận thanh toán thành công"),
        @ApiResponse(responseCode = "400", description = "Phương thức không phải tiền mặt")
    })
    public ResponseEntity<ApiResponseDTO<BookingResponse>> confirmCashPayment(
        @Parameter(description = "ID lịch khám", example = "123")
        @PathVariable Integer id
    ) {
        BookingResponse booking = bookingService.confirmCashPayment(id);
        return ResponseEntity.ok(ApiResponseDTO.success(
            booking,
            "Đã xác nhận thanh toán tiền mặt"
        ));
    }

    /**
     * Xác nhận thanh toán tiền mặt bằng mã xác nhận (Bác sĩ/Admin)
     */
    @PostMapping("/pay-cash/by-code")
    @PreAuthorize("hasAnyAuthority('BacSi', 'Admin')")
    @Operation(
        summary = "Xác nhận thanh toán tiền mặt bằng mã xác nhận",
        description = "Tìm booking bằng MaXacNhan và đánh dấu đã thanh toán tiền mặt"
    )
    public ResponseEntity<ApiResponseDTO<BookingResponse>> confirmCashPaymentByCode(
        @Parameter(description = "Mã xác nhận booking", example = "BK2512050830001234")
        @RequestParam("code") String confirmationCode
    ) {
        BookingResponse booking = bookingService.confirmCashPaymentByCode(confirmationCode);
        return ResponseEntity.ok(ApiResponseDTO.success(
            booking,
            "Đã xác nhận thanh toán tiền mặt theo mã"
        ));
    }

    // ========================================
    // HELPER METHODS
    // ========================================

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Kiểm tra booking service hoạt động")
    public ResponseEntity<ApiResponseDTO<String>> healthCheck() {
        return ResponseEntity.ok(ApiResponseDTO.success(
            "Booking Service is running", 
            "OK"
        ));
    }

    /**
     * ✅ TEST ENDPOINT - Bypass Authentication
     * Dùng cho k6 load testing mà không cần JWT token
     */
    @PostMapping("/test/create")
    @Operation(
        summary = "Test endpoint - Đặt lịch khám (không cần auth)",
        description = "Endpoint này dùng cho k6 load test. Bypass authentication để đo lường hiệu năng Database"
    )
    public ResponseEntity<ApiResponseDTO<BookingResponse>> testCreateBooking(
        @Valid @RequestBody CreateBookingRequest request
    ) {
        log.info("🔧 TEST ENDPOINT: Creating booking for load test");

        // Hardcode userID = 1 (giả định là bệnh nhân test)
        // Trong production, hãy disable endpoint này!
        BookingResponse booking = bookingService.createBooking(request, 1);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponseDTO.success(
                booking,
                "Test endpoint: Đặt lịch khám thành công! (Load Test Mode)"
            ));
    }
}
