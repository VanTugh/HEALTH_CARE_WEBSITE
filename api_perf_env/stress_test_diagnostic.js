/**
 * ============================================================================
 * K6 STRESS TEST - DIAGNOSTIC VERSION (VỚI LOGGING CHI TIẾT)
 * ============================================================================
 *
 * Mục đích: Tìm ra nguyên nhân gốc rễ của 100% request bị lỗi
 *
 * Features:
 * - Log chi tiết HTTP Status Code + Response Body
 * - Phân loại lỗi theo status code
 * - Dừng sớm để xem log (chỉ 10 VUs, 20s)
 *
 * Chạy: npx k6 run api_perf_env/stress_test_diagnostic.js
 * ============================================================================
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    // Giảm VUs để dễ theo dõi log
    vus: 10,
    duration: '20s',

    thresholds: {
        // Nới rộng tỷ lệ lỗi vì ta đang diagnose
        http_req_failed: ['rate<1.0'],
        http_req_duration: ['p(95)<10000'],
    }
};

const BASE_URL = 'http://localhost:8080';
const TEST_ENDPOINT = `${BASE_URL}/api/bookings/test/create`;

// ============================================================================
// COUNTER CHI TIẾT LỖI
// ============================================================================
let statusCodeCounts = {};
let errorSamples = {
    '400': [],
    '401': [],
    '403': [],
    '404': [],
    '409': [],
    '422': [],
    '500': [],
    'OTHER': []
};

// ============================================================================
// TEST DATA
// ============================================================================
const BASE_BOOKING = {
    bacSiID: 45,                        // BacSiID 45 trong DB
    ca: 'CHIEU',
    phuongThucThanhToan: 'TIEN_MAT'
};

export default function () {
    // Tạo dữ liệu ngẫu nhiên
    const randomDay = Math.floor(Math.random() * 19) + 10;
    const randomHour = Math.floor(Math.random() * 4) + 13;

    const payload = JSON.stringify({
        ...BASE_BOOKING,
        ngayKham: `2026-06-${String(randomDay).padStart(2, '0')}`,  // ✅ Padding ngày (06-10 chứ không 6-10)
        gioKham: `${String(randomHour).padStart(2, '0')}:00`,
        lyDoKham: `Stress Test - VU: ${__VU} - Time: ${Date.now()}`
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
        timeout: '10s',
    };

    console.log(`[VU ${__VU}] REQUEST PAYLOAD: ${payload}`);

    // ============================================================================
    // GỬI REQUEST & LƯU LẠI RESPONSE
    // ============================================================================
    const res = http.post(TEST_ENDPOINT, payload, params);

    // ============================================================================
    // EXTRACT & LOG CHI TIẾT
    // ============================================================================
    const statusCode = res.status;
    const responseBody = res.body;

    // Tính toán status code frequencies
    if (!statusCodeCounts[statusCode]) {
        statusCodeCounts[statusCode] = 0;
    }
    statusCodeCounts[statusCode]++;

    // ============================================================================
    // LOG TẤT CẢ RESPONSE (không chỉ lỗi 500)
    // ============================================================================
    console.log(`\n╔════════════════════════════════════════════════════════════════╗`);
    console.log(`║ [${__VU}] HTTP ${statusCode} | ${res.status === 201 ? '✅ SUCCESS' : '❌ FAILED'}`);
    console.log(`╠════════════════════════════════════════════════════════════════╣`);
    console.log(`║ URL: ${TEST_ENDPOINT}`);
    console.log(`║ Duration: ${res.timings.duration.toFixed(2)}ms`);
    console.log(`║ Payload: ${payload.substring(0, 100)}...`);
    console.log(`╠════════════════════════════════════════════════════════════════╣`);
    console.log(`║ RESPONSE BODY:`);
    console.log(`╠════════════════════════════════════════════════════════════════╣`);
    console.log(`║ ${responseBody.substring(0, 150)}`);
    console.log(`╚════════════════════════════════════════════════════════════════╝\n`);

    // ============================================================================
    // PHÂN LOẠI & LƯU MẪU LỖI
    // ============================================================================
    if (statusCode === 201) {
        // ✅ Success
        check(res, {
            'Status 201 Created': (r) => r.status === 201,
        });
    } else if (statusCode === 400) {
        // ❌ Bad Request (Validation failed)
        if (errorSamples['400'].length < 3) {
            errorSamples['400'].push({
                payload: payload,
                response: responseBody.substring(0, 200)
            });
        }
        console.error(`❌ [400 Bad Request] Validation failed! Response: ${responseBody.substring(0, 100)}`);
    } else if (statusCode === 401) {
        // ❌ Unauthorized
        if (errorSamples['401'].length < 3) {
            errorSamples['401'].push({
                payload: payload,
                response: responseBody.substring(0, 200)
            });
        }
        console.error(`❌ [401 Unauthorized] Token hoặc auth failed! Response: ${responseBody.substring(0, 100)}`);
    } else if (statusCode === 403) {
        // ❌ Forbidden (CSRF, CORS)
        if (errorSamples['403'].length < 3) {
            errorSamples['403'].push({
                payload: payload,
                response: responseBody.substring(0, 200)
            });
        }
        console.error(`❌ [403 Forbidden] CSRF/CORS? Response: ${responseBody.substring(0, 100)}`);
    } else if (statusCode === 404) {
        // ❌ Not Found (endpoint không tồn tại)
        if (errorSamples['404'].length < 3) {
            errorSamples['404'].push({
                payload: payload,
                response: responseBody.substring(0, 200)
            });
        }
        console.error(`❌ [404 Not Found] Endpoint không tồn tại? URL: ${TEST_ENDPOINT}`);
    } else if (statusCode === 409) {
        // ❌ Conflict (Duplicate booking)
        if (errorSamples['409'].length < 3) {
            errorSamples['409'].push({
                payload: payload,
                response: responseBody.substring(0, 200)
            });
        }
        console.warn(`⚠️  [409 Conflict] Khung giờ đã có người đặt`);
    } else if (statusCode === 422) {
        // ❌ Unprocessable Entity (Logic validation)
        if (errorSamples['422'].length < 3) {
            errorSamples['422'].push({
                payload: payload,
                response: responseBody.substring(0, 200)
            });
        }
        console.error(`❌ [422 Unprocessable] Business logic failed! Response: ${responseBody.substring(0, 100)}`);
    } else if (statusCode >= 500) {
        // ❌ Server Error
        if (errorSamples['500'].length < 3) {
            errorSamples['500'].push({
                payload: payload,
                response: responseBody.substring(0, 200)
            });
        }
        console.error(`🔥 [${statusCode} Server Error] Backend crash! Response: ${responseBody.substring(0, 100)}`);
    } else {
        // ❌ Other errors
        if (errorSamples['OTHER'].length < 3) {
            errorSamples['OTHER'].push({
                statusCode: statusCode,
                payload: payload,
                response: responseBody.substring(0, 200)
            });
        }
    }

    sleep(1);
}

// ============================================================================
// TEARDOWN - IN RA SUMMARY REPORT
// ============================================================================
export function teardown(data) {
    console.log(`\n\n`);
    console.log(`╔════════════════════════════════════════════════════════════════╗`);
    console.log(`║                  🔍 DIAGNOSTIC SUMMARY REPORT                  ║`);
    console.log(`╚════════════════════════════════════════════════════════════════╝\n`);

    // In ra status code distribution
    console.log(`📊 HTTP STATUS CODE DISTRIBUTION:`);
    console.log(`${'─'.repeat(60)}`);
    for (const [status, count] of Object.entries(statusCodeCounts).sort()) {
        const percentage = ((count / Object.values(statusCodeCounts).reduce((a, b) => a + b, 0)) * 100).toFixed(1);
        console.log(`   ${status}: ${count} requests (${percentage}%)`);
    }

    // In ra error samples
    console.log(`\n📋 ERROR SAMPLES (First 3 of each type):`);
    console.log(`${'─'.repeat(60)}`);

    for (const [statusCode, samples] of Object.entries(errorSamples)) {
        if (samples.length > 0) {
            console.log(`\n❌ [${statusCode}] - ${samples.length} sample(s):`);
            samples.forEach((sample, idx) => {
                console.log(`   Sample ${idx + 1}:`);
                console.log(`   Payload: ${sample.payload || sample.statusCode}`);
                console.log(`   Response: ${sample.response}`);
            });
        }
    }

    // Phân tích nguyên nhân
    console.log(`\n\n🎯 PHÂN TÍCH NGUYÊN NHÂN CÓ THỂ:`);
    console.log(`${'─'.repeat(60)}`);

    if (statusCodeCounts['404']) {
        console.log(`❌ 404 NOT FOUND: Endpoint /api/bookings/test/create không tồn tại`);
        console.log(`   → Cách sửa: Kiểm tra BookingController.java có endpoint này không`);
    }

    if (statusCodeCounts['400']) {
        console.log(`❌ 400 BAD REQUEST: Payload không khớp @Valid validation`);
        console.log(`   → Cách sửa: Kiểm tra CreateBookingRequest fields (chuyenKhoaId bị thiếu?)`);
    }

    if (statusCodeCounts['401'] || statusCodeCounts['403']) {
        console.log(`❌ 401/403 UNAUTHORIZED/FORBIDDEN: Spring Security chặn request`);
        console.log(`   → Cách sửa: Kiểm tra SecurityConfig.java có permitAll() endpoint này không`);
    }

    if (statusCodeCounts['500']) {
        console.log(`🔥 500 SERVER ERROR: Backend crash khi xử lý`);
        console.log(`   → Cách sửa: Kiểm tra MySQL connection, NullPointerException, v.v.`);
    }

    if (statusCodeCounts['409'] || statusCodeCounts['422']) {
        console.log(`⚠️  409/422 CONFLICT/UNPROCESSABLE: Business logic errors`);
        console.log(`   → Cách sửa: Kiểm tra BookingService constraint (cùng ngày giờ bác sĩ)`);
    }

    console.log(`\n${'═'.repeat(60)}\n`);
}

