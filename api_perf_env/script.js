import http from 'k6/http';
import { check, sleep } from 'k6';

// 1. Cấu hình kịch bản chịu tải (Load Profile)
export const options = {
    vus: 100,          // Giả lập 100 người dùng (bệnh nhân) truy cập CÙNG MỘT LÚC
    duration: '30s',   // Bắn phá liên tục, giữ tải trong vòng 30 giây
};

export default function () {
    // 2. Định nghĩa URL API Spring Boot (Sửa lại port và endpoint cho đúng với Backend của ông)
    const url = 'http://localhost:8080/api/auth/login'; 
    
    // Dữ liệu tài khoản để test đăng nhập
    const payload = JSON.stringify({
        email: 'shintest@healthcare.vn',
        password: 'admin123', // Thay bằng mật khẩu chuẩn của tài khoản này trong DB của ông
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // 3. Thực hiện bắn 1 request POST lên Backend
    const res = http.post(url, payload, params);

    // 4. Đánh giá chất lượng API (Assertions)
    check(res, {
        'status is 200 (Success)': (r) => r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500, // Phản hồi phải dưới 0.5 giây mới đạt chuẩn UX
    });

    // Mỗi người dùng ảo nghỉ 0.5 giây trước khi bắn request tiếp theo để giả lập hành vi người thật
    sleep(0.5);
}
