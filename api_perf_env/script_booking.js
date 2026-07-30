import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 100,          // 100 người dùng ảo đồng thời
    duration: '10s',   // Ép tải liên tục trong 10 giây
};

export default function () {
    const url = 'http://localhost:8080/api/bookings/create'; 
    
    const payload = JSON.stringify({
        chuyenKhoa: 'Tim mạch',
        bacSi: 'Trần Công Sơn',
        ngayKham: '2026-05-25',
        gioKham: '14:00',
        lyDoKham: 'Test chịu tải đồng thời k6 chống trùng lịch',
        tienMat: true
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
            // 🔐 Nhét Token xịn của Shin vào đây để bẻ khóa Spring Security
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzaGludGVzdEBoZWFsdGhjYXJlLnZuIiwiaWF0IjoxNzc5MjA2ODY0LCJleHAiOjE3NzkyOTMyNjR9.TpptvspBcuIXTMqTH7-6VA3vJT-vKs7w3sGdlTrtYqkhoTen'
        },
    };

    const res = http.post(url, payload, params);

    check(res, {
        'Người nhanh tay nhất đặt Đạt (200/201)': (r) => r.status === 200 || r.status === 201,
        'Những người sau bị Chặn trùng lịch (400/409)': (r) => r.status === 400 || r.status === 409,
    });

    sleep(1);
}
