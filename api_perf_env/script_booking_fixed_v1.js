import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    // 🎯 ĐÃ ĐIỀU CHỈNH: Dội thẳng 500 người dùng ảo cùng lúc (Stress Test)
    vus: 500,
    
    // Chạy trong 30 giây (Có thể tăng lên '1m' nếu ông muốn ép lâu hơn)
    duration: '30s',

    thresholds: {
        // Tỷ lệ request bị lỗi (http_req_failed) phải nhỏ hơn 5% (0.05)
        // Lưu ý: Dưới áp lực 500 VUs, nếu lỗi quá 5% chứng tỏ Server đã từ chối kết nối
        http_req_failed: ['rate<0.05'],
        
        // 95% số request phải có thời gian phản hồi nhỏ hơn 2000ms (2 giây)
        http_req_duration: ['p(95)<2000'],
    }
};

// Base URL Backend
const BASE_URL = 'http://localhost:8080';
const TEST_ENDPOINT = `${BASE_URL}/api/bookings/test/create`;

const BOOKING_DATA = {
    bacSiID: 3,                         // ID bác sĩ Trần Công Sơn
    ngayKham: '2026-05-25',             // Ngày khám (future date)
    ca: 'CHIEU',                        // Enum value (SANG, CHIEU, hoặc TOI)
    gioKham: '14:00',                   // Giờ khám cụ thể trong ca
    lyDoKham: 'Khám tim, đo huyết áp - Dội thẳng 500 VUs đồng thời', 
    phuongThucThanhToan: 'TIEN_MAT'     
};

export default function () {
    // ================================================
    // STEP 1: Gọi endpoint POST create booking
    // ================================================
    const payload = JSON.stringify(BOOKING_DATA);

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
        timeout: '10s', // 🎯 Nới timeout lên 10s vì 500 VUs dội cùng lúc sẽ gây nghẽn mạng cục bộ
    };

    const res = http.post(TEST_ENDPOINT, payload, params);

    // ================================================
    // STEP 2: Kiểm tra kết quả response
    // ================================================
    check(res, {
        'Status 201 (Created)': (r) => r.status === 201,
        'Status 2xx (Success)': (r) => r.status >= 200 && r.status < 300,
        'Response time < 500ms': (r) => r.timings.duration < 500,
        'Response time < 1s': (r) => r.timings.duration < 1000,
        'Content-Type is JSON': (r) => r.headers['Content-Type'].includes('application/json'),
        'Response contains booking data': (r) => r.body.includes('success') || r.body.includes('thành công'),
    });

    // Log chi tiết nếu có lỗi để debug
    if (res.status !== 201) {
        // Chỉ log ra những mã lỗi không mong đợi (như 500 Internal Server Error)
        if(res.status >= 500) {
             console.error(`🔥 CRASH: Status ${res.status} - Body: ${res.body.substring(0, 100)}`);
        }
    }

    // STEP 3: Tạm dừng 1 giây trước request tiếp theo
    sleep(1);
}

export function teardown(data) {
    console.log('✅ Stress test (Flat VUs) hoàn thành!');
    console.log('📊 Hãy xem p(95) lần này là bao nhiêu!');
}