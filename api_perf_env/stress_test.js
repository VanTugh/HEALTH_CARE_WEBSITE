import http from 'k6/http';
import { check, sleep } from 'k6';
export const options = {
    // 🎯 ĐẬP THẲNG TẢI: Giả lập 500 người dùng ảo đồng thời ngay lập tức
    vus: 500,

    // Ép tải liên tục trong vòng 30 giây để đo khả năng nghẽn cổ chai
    duration: '30s',

    // Cấu hình ngưỡng đánh giá (Thresholds) phù hợp với môi trường Stress Test
    thresholds: {
        // Nới rộng tỷ lệ lỗi lên dưới 95% vì ta đang ép ghi đè dồn dập vào Database thật
        http_req_failed: ['rate<0.95'],

        // Đo lường xem khi chịu tải cực đại, phân vị 95% phản hồi trong bao lâu
        http_req_duration: ['p(95)<5000'],
    }
};

// ============================================================================
// COUNTER CHI TIẾT LỖI (Để phân tích sau khi test kết thúc)
// ============================================================================
let statusCodeCounts = {};
let firstErrorSamples = {
    '400': null,
    '401': null,
    '403': null,
    '404': null,
    '409': null,
    '422': null,
    '500': null
};

// Cấu hình Base URL kết nối tới API Spring Boot cục bộ
const BASE_URL = 'http://localhost:8080';
const TEST_ENDPOINT = `${BASE_URL}/api/bookings/test/create`;

// Khung dữ liệu nền (Đồng bộ chuẩn xác BacSiID: 45 đang có trong Database)
const BASE_BOOKING = {
    bacSiID: 45,                        // Khám bác sĩ số 45 thực tế trong DB
    chuyenKhoaId: 2,                    // ✅ THÊM field này (có thể yêu cầu)
    ca: 'CHIEU',                        // Ca chiều
    phuongThucThanhToan: 'TIEN_MAT'     // Thanh toán tiền mặt
};
export default function () {

    // 1. Tạo ngày khám ngẫu nhiên từ ngày 10 đến ngày 28 của THÁNG 6 NĂM 2026 (Ngày tương lai hợp lệ)
    const randomDay = Math.floor(Math.random() * 19) + 10;
    // 2. Tạo giờ khám ngẫu nhiên từ 13:00 đến 16:00
    const randomHour = Math.floor(Math.random() * 4) + 13;
    // 3. Đóng gói Payload động hoàn chỉnh gửi lên Backend
    const payload = JSON.stringify({
        ...BASE_BOOKING,
        ngayKham: `2026-06-${String(randomDay).padStart(2, '0')}`,  // ✅ Padding ngày (06-10 chứ không 6-10)
        gioKham: `${String(randomHour).padStart(2, '0')}:00`,
        lyDoKham: `Stress Test Real - VU ID: ${__VU} - Timestamp: ${Date.now()}` // Định danh né trùng lặp
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
        timeout: '15s',
    };

    // ============================================================================
    // GỬI REQUEST & LƯU LẠI RESPONSE
    // ============================================================================
    const res = http.post(TEST_ENDPOINT, payload, params);

    // ============================================================================
    // EXTRACT CHI TIẾT
    // ============================================================================
    const statusCode = res.status;
    const responseBody = res.body;

    // Tính toán status code frequencies
    if (!statusCodeCounts[statusCode]) {
        statusCodeCounts[statusCode] = 0;
    }
    statusCodeCounts[statusCode]++;

    // Lưu lại mẫu lỗi đầu tiên của mỗi loại
    if (firstErrorSamples[statusCode] === null && statusCode !== 201) {
        firstErrorSamples[statusCode] = {
            payload: payload,
            response: responseBody.substring(0, 300)
        };
    }

    // ============================================================================
    // KIỂM TRA ĐÁNH GIÁ (ASSERTIONS)
    // ============================================================================
    check(res, {
        // Lịch khám đặt thành công mới (Hợp lệ, chưa bị ai chiếm khung giờ)
        'Status 201 (Created)': (r) => r.status === 201,

        // Hệ thống xử lý mượt, trả về các lỗi nghiệp vụ 4xx (như trùng giờ) thay vì lăn đùng ra sập
        'Server không bị lỗi hệ thống (No 500)': (r) => r.status !== 500,

        // Đánh giá phản hồi mạng có giữ được dưới ngưỡng 2 giây hay không
        'Phản hồi dưới 2 giây': (r) => r.timings.duration < 2000,
    });

    // ============================================================================
    // LOGGING CHI TIẾT (ENHANCED)
    // ============================================================================
    if (statusCode !== 201 && __VU <= 5) {  // CHỈ log 5 VUs đầu để tránh spam
        console.warn(`\n⚠️  [VU ${__VU}] HTTP ${statusCode} | Duration: ${res.timings.duration.toFixed(2)}ms`);
        console.warn(`    Payload: ${payload.substring(0, 80)}...`);
        console.warn(`    Response: ${responseBody.substring(0, 100)}...`);
    }

    // Log ra console nếu server bị crash
    if (res.status >= 500) {
        console.error(`🔥 [${__VU}] [CRASH SERVER] Status: ${res.status} | Chi tiết: ${res.body.substring(0, 150)}`);
    }
    sleep(1);
}

// ============================================================================
// TEARDOWN - IN RA DIAGNOSTIC REPORT
// ============================================================================
export function teardown(data) {
    console.log(`\n\n` + '═'.repeat(70));
    console.log(`║                  🔍 STRESS TEST DIAGNOSTIC REPORT                 ║`);
    console.log('═'.repeat(70) + `\n`);

    // ============================================================================
    // 1. In ra status code distribution
    // ============================================================================
    console.log(`📊 HTTP STATUS CODE DISTRIBUTION:`);
    console.log(`${'─'.repeat(70)}`);

    const totalRequests = Object.values(statusCodeCounts).reduce((a, b) => a + b, 0);
    const sortedStatuses = Object.keys(statusCodeCounts).sort((a, b) =>
        statusCodeCounts[b] - statusCodeCounts[a]
    );

    for (const status of sortedStatuses) {
        const count = statusCodeCounts[status];
        const percentage = ((count / totalRequests) * 100).toFixed(1);
        const bar = '█'.repeat(Math.ceil(percentage / 5));
        console.log(`   ${status.padEnd(3)} | ${bar.padEnd(20)} | ${count.toString().padEnd(6)} (${percentage}%)`);
    }

    // ============================================================================
    // 2. In ra first error samples
    // ============================================================================
    console.log(`\n\n⚠️  FIRST ERROR SAMPLES (theo status code):`);
    console.log(`${'─'.repeat(70)}`);

    for (const [status, sample] of Object.entries(firstErrorSamples)) {
        if (sample !== null) {
            console.log(`\n❌ [${status}]:`);
            console.log(`   Payload: ${sample.payload.substring(0, 100)}`);
            console.log(`   Response: ${sample.response.substring(0, 100)}`);
        }
    }

    // ============================================================================
    // 3. Phân tích nguyên nhân có thể
    // ============================================================================
    console.log(`\n\n🎯 KẾT LUẬN - NGUYÊN NHÂN CÓ THỂ:`);
    console.log(`${'─'.repeat(70)}`);

    if (statusCodeCounts['404'] && statusCodeCounts['404'] > totalRequests * 0.5) {
        console.log(`\n🔴 CHÍNH: 404 NOT FOUND (${statusCodeCounts['404']} requests)`);
        console.log(`   → Nguyên nhân: Endpoint /api/bookings/test/create không tồn tại`);
        console.log(`   → Cách sửa:`);
        console.log(`      1. Kiểm tra URL chính xác trong BookingController.java`);
        console.log(`      2. Tìm @PostMapping annotation và so sánh với TEST_ENDPOINT`);
        console.log(`      3. Sửa URL trong script k6 nếu cần`);
    }

    if ((statusCodeCounts['401'] || statusCodeCounts['403']) && (statusCodeCounts['401'] || 0) + (statusCodeCounts['403'] || 0) > totalRequests * 0.5) {
        console.log(`\n🔴 CHÍNH: 401/403 UNAUTHORIZED/FORBIDDEN`);
        console.log(`   → Nguyên nhân: Spring Security chặn request`);
        console.log(`   → Cách sửa:`);
        console.log(`      1. Mở SecurityConfig.java`);
        console.log(`      2. Kiểm tra .permitAll() cho /api/bookings/test/**`);
        console.log(`      3. Thêm dòng: .requestMatchers("/api/bookings/test/**").permitAll()`);
        console.log(`      4. Rebuild backend: mvn clean package && mvn spring-boot:run`);
    }

    if (statusCodeCounts['400'] && statusCodeCounts['400'] > totalRequests * 0.5) {
        console.log(`\n🔴 CHÍNH: 400 BAD REQUEST (${statusCodeCounts['400']} requests)`);
        console.log(`   → Nguyên nhân: Payload sai format (thiếu field, sai enum, v.v.)`);
        console.log(`   → Cách sửa:`);
        console.log(`      1. Kiểm tra CreateBookingRequest.java fields bắt buộc`);
        console.log(`      2. Sửa stress_test.js payload phù hợp`);
        console.log(`      3. Đảm bảo: chuyenKhoaId, ngayKham, ca, lyDoKham, v.v.`);
        console.log(`      4. Kiểm tra format ngày (yyyy-MM-dd) và enum values`);
    }

    if (statusCodeCounts['500'] && statusCodeCounts['500'] > totalRequests * 0.5) {
        console.log(`\n🔴 CHÍNH: 500 INTERNAL SERVER ERROR (${statusCodeCounts['500']} requests)`);
        console.log(`   → Nguyên nhân: Backend crash hoặc DB connection issue`);
        console.log(`   → Cách sửa:`);
        console.log(`      1. Kiểm tra MySQL đang chạy: ps aux | grep mysql`);
        console.log(`      2. Xem logs backend: tail -50 /path/to/backend.log`);
        console.log(`      3. Tăng connection pool trong application.properties`);
    }

    if (statusCodeCounts['409'] && (statusCodeCounts['201'] || 0) === 0) {
        console.log(`\n🟡 CHỮ: 409 CONFLICT - Khung giờ trùng`);
        console.log(`   → Cách sửa: Script đã có randomDay/Hour, kiểm tra BacSiID hợp lệ`);
    }

    console.log(`\n\n${'═'.repeat(70)}\n`);
}