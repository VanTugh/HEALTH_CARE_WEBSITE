/**
 * ============================================================================
 * K6 LOAD TEST - SCRIPT SỬA LỖI V2 (CÁCH 3 - ADVANCED)
 * ============================================================================
 *
 * FIX: Sinh JWT token dynamically qua endpoint /api/auth/login
 * Endpoint: POST /api/bookings (endpoint chính thực)
 *
 * Lợi ích:
 * - Sử dụng endpoint chính xác (giống production)
 * - Test cả logic authentication
 * - More realistic load test
 *
 * Requirement:
 * - Tài khoản test phải tồn tại: email='shintest@healthcare.vn', password='abc123!@#'
 * - Tài khoản phải có role 'BenhNhan' (BenhNhan, không Admin/BacSi)
 * - Tài khoản phải có status TrangThai = 1
 *
 * Chạy: npx k6 run api_perf_env/script_booking_jwt.js
 * ============================================================================
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        // Ramp-up: từ 0 VUs lên 50 VUs trong 10 giây
        { duration: '10s', target: 50 },

        // Steady state: 50 VUs trong 30 giây
        { duration: '30s', target: 50 },

        // Ramp-down: từ 50 VUs xuống 0 VUs trong 10 giây
        { duration: '10s', target: 0 },
    ],

    // Thresholds für hộ tính chất
    thresholds: {
        http_req_failed: ['p(95)<5'],       // 95% requests < 5% fail
        http_req_duration: ['p(95)<500'],   // 95% requests < 500ms
        'http_req_duration{staticAsset:yes}': ['p(99)<1000'], // Static < 1s
    }
};

// Biến global
const BASE_URL = 'http://localhost:8080';
const LOGIN_ENDPOINT = `${BASE_URL}/api/auth/login`;
const BOOKING_ENDPOINT = `${BASE_URL}/api/bookings`;

// Thông tin tài khoản test
const TEST_ACCOUNT = {
    email: 'shintest@healthcare.vn',
    password: 'abc123!@#'
};

// Data để đặt lịch
const BOOKING_DATA = {
    bacSiID: 3,                      // ID bác sĩ "Trần Công Sơn"
    chuyenKhoaID: 1,                 // ID chuyên khoa "Tim mạch"
    ngayKham: '2026-05-25',          // Ngày khám
    gioKham: '14:00',                // Giờ khám
    lyDoKham: 'Load test k6 - JWT authentication',
    phuongThucThanhToan: 'TIEN_MAT'
};

/**
 * Setup function: Chạy 1 lần trước các load tests
 * Dùng để lấy JWT token
 */
export function setup() {
    console.log('🔐 Bắt đầu setup: Lấy JWT token từ endpoint /api/auth/login');

    // ================================================
    // STEP 1: Gọi endpoint login để lấy JWT token
    // ================================================
    const loginPayload = JSON.stringify({
        email: TEST_ACCOUNT.email,
        password: TEST_ACCOUNT.password
    });

    const loginParams = {
        headers: {
            'Content-Type': 'application/json',
        },
        timeout: '5s',
    };

    const loginRes = http.post(LOGIN_ENDPOINT, loginPayload, loginParams);

    console.log(`📊 Login response status: ${loginRes.status}`);

    // ================================================
    // STEP 2: Kiểm tra login thành công
    // ================================================
    check(loginRes, {
        'Login status 200': (r) => r.status === 200,
        'Login response contains token': (r) => r.body.includes('accessToken') || r.body.includes('token'),
    });

    // ================================================
    // STEP 3: Parse token từ response
    // ================================================
    let token = null;
    if (loginRes.status === 200) {
        try {
            const responseData = JSON.parse(loginRes.body);
            // Thử các key phổ biến
            token = responseData.data?.accessToken ||
                    responseData.data?.token ||
                    responseData.accessToken ||
                    responseData.token;

            if (token) {
                console.log(`✅ Token lấy thành công: ${token.substring(0, 50)}...`);
            } else {
                console.error('❌ Không tìm thấy token trong response');
                console.error('Response body:', loginRes.body);
            }
        } catch (e) {
            console.error('❌ Lỗi parse JSON response:', e);
            console.error('Response body:', loginRes.body);
        }
    } else {
        console.error(`❌ Login thất bại: Status ${loginRes.status}`);
        console.error('Response body:', loginRes.body);
    }

    return { token: token };
}

/**
 * Main load test function
 */
export default function (data) {
    const token = data.token;

    // ================================================
    // STEP 1: Kiểm tra token
    // ================================================
    if (!token) {
        console.error('❌ Token không tồn tại! Không thể tiếp tục test');
        return;
    }

    // ================================================
    // STEP 2: Gọi endpoint POST create booking
    // ================================================
    const bookingPayload = JSON.stringify(BOOKING_DATA);

    const bookingParams = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,  // ✅ Sử dụng JWT token
        },
        timeout: '5s',
    };

    const bookingRes = http.post(BOOKING_ENDPOINT, bookingPayload, bookingParams);

    // ================================================
    // STEP 3: Kiểm tra kết quả
    // ================================================
    check(bookingRes, {
        // Status 201 = Created (thành công)
        'Booking status 201': (r) => r.status === 201,

        // Status 2xx (success)
        'Booking status 2xx': (r) => r.status >= 200 && r.status < 300,

        // Không phải 401 (authentication fail)
        'NOT 401 Unauthorized': (r) => r.status !== 401,

        // Không phải 403 (permission deny)
        'NOT 403 Forbidden': (r) => r.status !== 403,

        // Response time < 500ms
        'Response time < 500ms': (r) => r.timings.duration < 500,

        // Response time < 1000ms
        'Response time < 1s': (r) => r.timings.duration < 1000,

        // Response body hợp lệ
        'Response contains success': (r) => r.body.includes('success') || r.body.includes('thành công'),
    });

    // Log chi tiết lỗi
    if (bookingRes.status !== 201) {
        console.error(`❌ Booking failed: Status ${bookingRes.status}`);
        if (bookingRes.status === 401) {
            console.error('   → JWT Token hết hạn hoặc không hợp lệ');
        } else if (bookingRes.status === 403) {
            console.error('   → User không có quyền (role không phải BenhNhan)');
        }
        console.error(`   → Response: ${bookingRes.body.substring(0, 200)}`);
    }

    // ================================================
    // STEP 4: Tạm dừng
    // ================================================
    sleep(1);
}

/**
 * Teardown function: Chạy 1 lần sau khi tất cả tests kết thúc
 */
export function teardown(data) {
    console.log('✅ Load test hoàn thành!');
    console.log(`📊 Kiểm tra kết quả bằng lệnh:`);
    console.log(`   k6 run api_perf_env/script_booking_jwt.js --summary-export=result.json`);
}

