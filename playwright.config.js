const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './src/__tests__/automation', // Nơi lưu 20 file test case
  fullyParallel: false, // Chạy tuần tự để tránh xung đột dữ liệu DB khi tạo lịch/hủy lịch
  retries: 0,
  reporter: [['html', { outputFolder: 'failures/html-report' }]], // Báo cáo HTML nằm trong failures

  /* 💡 ĐÂY CHÍNH LÀ ĐOẠN KHÓA CẤU HÌNH Y HỆT OPENCART */
  outputDir: 'failures', // TẤT CẢ screenshots, videos, traces của các case bị lọt lưới (Fail) sẽ gom hết vào đây

  use: {
    baseURL: 'http://localhost:5173', // URL trang Web Front-end của Shin
    headless: true, // Để true nếu muốn chạy ngầm, đổi thành false nếu muốn nhìn thấy trình duyệt tự click gõ

    /* 📸 Cấu hình tự động chụp và quay phim khi có lỗi */
    screenshot: 'only-on-failure', // Chỉ chụp ảnh màn hình giao diện khi bước đó bị FAIL
    video: 'retain-on-failure',    // Chỉ giữ lại video quay màn hình thao tác nếu test case bị FAIL
    trace: 'retain-on-failure',    // Ghi lại log trace chi tiết của hệ thống nếu ca test bị sập
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});