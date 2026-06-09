/**
 * ============================================================================
 * SCRIPT KIỂM THỬ TỰ ĐỘNG - PLAYWRIGHT (JAVASCRIPT)
 * Dự án: Website Đặt Lịch Khám Trực Tuyến Healthcare
 * Số Test Cases: 20 (10 Use Case x 2 kịch bản)
 * ============================================================================
 *
 * Yêu cầu:
 * 1. Cài đặt Playwright: npm install -D @playwright/test
 * 2. Cài đặt Playwright Browsers: npx playwright install
 * 3. Chạy tests: npx playwright test
 * 4. Chạy tests với UI mode: npx playwright test --ui
 * ============================================================================
 */

const { test, expect } = require('@playwright/test');

// ============================================================================
// FIXTURES & SETUP
// ============================================================================

const BASE_URL = 'http://localhost:5173'; // Điều chỉnh URL theo configure của bạn
const VALID_EMAIL = 'test@example.com';
const VALID_PASSWORD = 'Pass@123456';
const DUPLICATE_EMAIL = 'duplicate@example.com';
const INVALID_OTP = '999999';
const VALID_OTP = '123456';

// ============================================================================
// UC001: ĐĂNG KÝ
// ============================================================================

test.describe('UC001: Đăng Ký Tài Khoản', () => {

  test.beforeEach(async ({ page }) => {
    // Mở trang chủ trước mỗi test
    await page.goto(BASE_URL);
  });

  // ========================================================================
  // TC_UC001_01: Đăng ký tài khoản thành công (Luồng chính)
  // ========================================================================
  test('TC_UC001_01: Đăng ký thành công với thông tin hợp lệ', async ({ page }) => {
    // Bước 1: Kích vào nút "Đăng ký"
    await page.getByRole('button', { name: /Đăng ký/i }).click();

    // Kiểm tra form đăng ký mở ra
    await expect(page.locator('text=Form Đăng Ký')).toBeVisible();

    // Bước 2-3: Nhập thông tin vào form
    await page.locator('input[placeholder*="Họ tên"]').fill('Nguyễn Văn A');
    await page.locator('input[type="email"]').fill('nguyenvana123@gmail.com');
    await page.locator('input[type="password"]').first().fill('Pass@123456');
    await page.locator('input[placeholder*="Số điện thoại"]').fill('0901234567');
    await page.locator('input[type="date"]').fill('1995-06-15');
    await page.locator('select[name="gioiTinh"]').selectOption('Nam');
    await page.locator('input[placeholder*="Địa chỉ"]').fill('123 Đường ABC, TP.HCM');

    // Bước 4: Kích nút "Đăng ký"
    await page.getByRole('button', { name: /Đăng ký/i }).click();

    // Kiểm tra hệ thống gửi mã OTP (thông báo yêu cầu xác thực)
    await expect(page.locator('text=Mã xác thực đã gửi')).toBeVisible({ timeout: 5000 });

    // Bước 5: Nhập mã OTP
    await page.locator('input[placeholder*="mã OTP"]').fill(VALID_OTP);

    // Bước 6: Kích nút "Xác nhận"
    await page.getByRole('button', { name: /Xác nhận/i }).click();

    // KQ MONG ĐỢI: Đăng ký thành công, hiển thị thông báo
    await expect(page.locator('text=Đăng ký thành công')).toBeVisible({ timeout: 5000 });

    // Kiểm tra người dùng được chuyển hướng về trang đăng nhập
    await expect(page).toHaveURL(/.*login/);
  });

  // ========================================================================
  // TC_UC001_02: Đăng ký thất bại do Email trùng lặp (Luồng ngoại lệ 3a-3b)
  // ========================================================================
  test('TC_UC001_02: Đăng ký thất bại - Email đã tồn tại', async ({ page }) => {
    // Bước 1: Kích vào nút "Đăng ký"
    await page.getByRole('button', { name: /Đăng ký/i }).click();

    // Kiểm tra form đăng ký mở ra
    await expect(page.locator('text=Form Đăng Ký')).toBeVisible();

    // Bước 2: Nhập email đã tồn tại
    await page.locator('input[placeholder*="Họ tên"]').fill('Trần Thị B');
    await page.locator('input[type="email"]').fill(DUPLICATE_EMAIL); // Email đã tồn tại
    await page.locator('input[type="password"]').first().fill('Pass@654321');
    await page.locator('input[placeholder*="Số điện thoại"]').fill('0987654321');
    await page.locator('input[type="date"]').fill('2000-01-20');
    await page.locator('select[name="gioiTinh"]').selectOption('Nữ');
    await page.locator('input[placeholder*="Địa chỉ"]').fill('456 Đường XYZ, Hà Nội');

    // Bước 3: Kích nút "Đăng ký"
    await page.getByRole('button', { name: /Đăng ký/i }).click();

    // KQ MONG ĐỢI: Hiển thị thông báo lỗi email trùng lặp
    await expect(page.locator('text=Email này đã được sử dụng')).toBeVisible({ timeout: 3000 });

    // Kiểm tra form được giữ lại với dữ liệu
    await expect(page.locator('input[type="email"]')).toHaveValue(DUPLICATE_EMAIL);

    // Kiểm tra không tạo tài khoản (vẫn ở trang đăng ký)
    await expect(page).toHaveURL(/.*register/);
  });
});

// ============================================================================
// UC002: ĐẶT LỊCH KHÁM
// ============================================================================

test.describe('UC002: Đặt Lịch Khám', () => {

  test.beforeEach(async ({ page }) => {
    // Giả định người dùng đã đăng nhập
    await page.goto(`${BASE_URL}/login`);
    await page.locator('input[type="email"]').fill(VALID_EMAIL);
    await page.locator('input[type="password"]').fill(VALID_PASSWORD);
    await page.getByRole('button', { name: /Đăng nhập/i }).click();

    // Chờ redirect đến dashboard
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 5000 });
  });

  // ========================================================================
  // TC_UC002_01: Đặt lịch khám thành công (Luồng chính)
  // ========================================================================
  test('TC_UC002_01: Đặt lịch khám thành công', async ({ page }) => {
    // Bước 1: Kích "Đặt lịch khám"
    await page.getByRole('button', { name: /Đặt lịch khám/i }).click();

    // Kiểm tra trang đặt lịch mở ra
    await expect(page.locator('text=Chọn Chuyên Khoa')).toBeVisible();

    // Bước 2-3: Chọn chuyên khoa "Tim mạch"
    await page.locator('select[name="chuyenKhoa"]').selectOption('Tim mạch');

    // Kiểm tra danh sách bác sĩ được cập nhật
    await expect(page.locator('text=Trần Công Sơn')).toBeVisible();

    // Bước 4-5: Chọn bác sĩ "Trần Công Sơn"
    await page.locator('select[name="bacSi"]').selectOption('Trần Công Sơn');

    // Kiểm tra lịch làm việc được hiển thị
    await expect(page.locator('text=Lịch làm việc')).toBeVisible();

    // Bước 6-7: Chọn ngày và giờ khám
    await page.locator('input[name="ngayKham"]').fill('2026-05-25');
    await page.locator('select[name="gioKham"]').selectOption('14:00');

    // Bước 8: Nhập lý do khám
    await page.locator('textarea[name="lyDoKham"]').fill('Khám tim, đo huyết áp');

    // Bước 9: Chọn thanh toán "Tiền mặt"
    await page.locator('input[name="tienMat"]').check();

    // Bước 10: Kích nút "Xác nhận đặt lịch"
    await page.getByRole('button', { name: /Xác nhận đặt lịch/i }).click();

    // KQ MONG ĐỢI: Đặt lịch thành công
    await expect(page.locator('text=Đặt lịch khám thành công')).toBeVisible({ timeout: 5000 });

    // Kiểm tra mã xác nhận được sinh
    await expect(page.getByText(/BK\d+/)).toBeVisible();

    // Kiểm tra chuyển hướng về trang chủ
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 5000 });
  });

  // ========================================================================
  // TC_UC002_02: Đặt lịch thất bại - Bác sĩ không có lịch (Luồng ngoại lệ 6a-6b)
  // ========================================================================
  test('TC_UC002_02: Đặt lịch thất bại - Bác sĩ không có lịch làm việc', async ({ page }) => {
    // Bước 1: Kích "Đặt lịch khám"
    await page.getByRole('button', { name: /Đặt lịch khám/i }).click();

    // Kiểm tra trang đặt lịch mở ra
    await expect(page.locator('text=Chọn Chuyên Khoa')).toBeVisible();

    // Bước 2: Chọn chuyên khoa (giả định có chuyên khoa nhưng bác sĩ không có lịch)
    await page.locator('select[name="chuyenKhoa"]').selectOption('Mắt'); // Chọn chuyên khoa trống

    // Bước 3: Chọn bác sĩ
    await page.locator('select[name="bacSi"]').selectOption('Lê Hoàng Tú');

    // KQ MONG ĐỢI: Hiển thị thông báo lỗi
    await expect(page.locator('text=Bác sĩ chưa có lịch làm việc')).toBeVisible({ timeout: 3000 });

    // Kiểm tra không thể tiếp tục
    await expect(page.locator('input[name="ngayKham"]')).toBeDisabled();
  });
  // ========================================================================
  // TC_UC002_03: Đặt lịch thất bại - Để trống các trường bắt buộc (MỚI 1)
  // ========================================================================
  test('TC_UC002_03: Đặt lịch thất bại - Không nhập lý do khám và phương thức thanh toán', async ({ page }) => {
    await page.getByRole('button', { name: /Đặt lịch khám/i }).click();

    // Chỉ chọn Chuyên khoa, Bác sĩ, Ngày giờ nhưng bỏ trống Lý do và Phương thức thanh toán
    await page.locator('select[name="chuyenKhoa"]').selectOption('Tim mạch');
    await page.locator('select[name="bacSi"]').selectOption('Trần Công Sơn');
    await page.locator('input[name="ngayKham"]').fill('2026-05-25');
    await page.locator('select[name="gioKham"]').selectOption('14:00');

    // Bỏ trống hoàn toàn ô textarea lý do khám và không check ô thanh toán
    await page.locator('textarea[name="lyDoKham"]').fill('');

    // Bấm nút đặt lịch
    await page.getByRole('button', { name: /Xác nhận đặt lịch/i }).click();

    // Kết quả mong đợi: Hệ thống báo lỗi Validation đỏ ở form, không cho gửi API lên Backend
    await expect(page.locator('text=Lý do khám không được để trống')).toBeVisible();
    await expect(page.locator('text=Vui lòng chọn phương thức thanh toán')).toBeVisible();
  });

  // ========================================================================
  // TC_UC002_04: Đặt lịch thất bại - Chọn ngày khám ở quá khứ (MỚI 2 - Test Giá trị biên)
  // ========================================================================
  test('TC_UC002_04: Đặt lịch thất bại - Chọn ngày khám ở quá khứ', async ({ page }) => {
    await page.getByRole('button', { name: /Đặt lịch khám/i }).click();

    await page.locator('select[name="chuyenKhoa"]').selectOption('Tim mạch');
    await page.locator('select[name="bacSi"]').selectOption('Trần Công Sơn');

    // Cố tình nhập ngày khám thuộc về quá khứ (Ví dụ: Năm 2025 trong khi hiện tại là 2026)
    await page.locator('input[name="ngayKham"]').fill('2025-01-01');
    await page.locator('select[name="gioKham"]').selectOption('09:00');
    await page.locator('textarea[name="lyDoKham"]').fill('Khám định kỳ tái khám');
    await page.locator('input[name="tienMat"]').check();

    await page.getByRole('button', { name: /Xác nhận đặt lịch/i }).click();

    // Kết quả mong đợi: Hệ thống nhận diện lỗi logic thời gian và hiển thị thông báo chặn lại
    await expect(page.locator('text=Ngày khám không thể nhỏ hơn ngày hiện tại')).toBeVisible();
  });

  // ========================================================================
  // TC_UC002_05: Đặt lịch thất bại - Trùng khung giờ đã có người đặt (MỚI 3 - Test Lỗi Logic)
  // ========================================================================
  test('TC_UC002_05: Đặt lịch thất bại - Khung giờ đã bị đầy suất hoặc có người đặt trước', async ({ page }) => {
    await page.getByRole('button', { name: /Đặt lịch khám/i }).click();

    await page.locator('select[name="chuyenKhoa"]').selectOption('Tim mạch');
    await page.locator('select[name="bacSi"]').selectOption('Trần Công Sơn');

    // Chọn đúng ngày và khung giờ cao điểm đã được đặt hết suất trong file SQL (`GuiChoTung.sql`)
    await page.locator('input[name="ngayKham"]').fill('2026-05-17');
    await page.locator('select[name="gioKham"]').selectOption('08:00'); // Khung giờ giả định đã bị chiếm chỗ

    await page.locator('textarea[name="lyDoKham"]').fill('Khám đau thắt ngực');
    await page.locator('input[name="tienMat"]').check();

    await page.getByRole('button', { name: /Xác nhận đặt lịch/i }).click();

    // Kết quả mong đợi: Backend trả về lỗi logic nghiệp vụ phản hồi lên giao diện
    await expect(page.locator('text=Khung giờ này đã đầy suất khám, vui lòng chọn giờ khác')).toBeVisible();
  });
});

// ============================================================================
// UC003: XEM DANH SÁCH LỊCH ĐÃ ĐẶT
// ============================================================================

test.describe('UC003: Xem Danh Sách Lịch Đã Đặt', () => {

  test.beforeEach(async ({ page }) => {
    // Giả định người dùng đã đăng nhập
    await page.goto(`${BASE_URL}/login`);
    await page.locator('input[type="email"]').fill(VALID_EMAIL);
    await page.locator('input[type="password"]').fill(VALID_PASSWORD);
    await page.getByRole('button', { name: /Đăng nhập/i }).click();
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 5000 });
  });

  // ========================================================================
  // TC_UC003_01: Xem danh sách có dữ liệu (Luồng chính)
  // ========================================================================
  test('TC_UC003_01: Hiển thị danh sách lịch khám đầy đủ', async ({ page }) => {
    // Bước 1: Kích tab "Lịch hẹn"
    await page.getByRole('tab', { name: /Lịch hẹn/i }).click();

    // KQ MONG ĐỢI: Hiển thị danh sách lịch khám
    await expect(page.locator('table')).toBeVisible({ timeout: 3000 });

    // Kiểm tra các cột dữ liệu hiển thị
    await expect(page.locator('th:has-text("Mã xác nhận")')).toBeVisible();
    await expect(page.locator('th:has-text("Ngày khám")')).toBeVisible();
    await expect(page.locator('th:has-text("Bác sĩ")')).toBeVisible();
    await expect(page.locator('th:has-text("Chuyên khoa")')).toBeVisible();
    await expect(page.locator('th:has-text("Trạng thái")')).toBeVisible();

    // Kiểm tra có ít nhất 1 hàng dữ liệu
    const rows = page.locator('table tbody tr');
    await expect(rows.first()).toBeVisible();
  });

  // ========================================================================
  // TC_UC003_02: Xem danh sách trống (Luồng ngoại lệ)
  // ========================================================================
  test('TC_UC003_02: Hiển thị thông báo khi chưa có lịch hẹn', async ({ page }) => {
    // Giả định người dùng mới không có dữ liệu
    // Bước 1: Kích tab "Lịch hẹn"
    await page.getByRole('tab', { name: /Lịch hẹn/i }).click();

    // KQ MONG ĐỢI: Hiển thị thông báo trống
    await expect(
      page.locator('text=Bạn chưa có lịch hẹn nào')
    ).toBeVisible({ timeout: 3000 });

    // Kiểm tra có nút điều hướng "Đặt lịch khám ngay"
    await expect(
      page.getByRole('button', { name: /Đặt lịch khám ngay/i })
    ).toBeVisible();
  });
});

// ============================================================================
// UC004: XEM CHI TIẾT THÔNG TIN BÁC SĨ
// ============================================================================

test.describe('UC004: Xem Chi Tiết Thông Tin Bác Sĩ', () => {

  // ========================================================================
  // TC_UC004_01: Xem chi tiết bác sĩ thành công (Luồng chính)
  // ========================================================================
  test('TC_UC004_01: Xem chi tiết bác sĩ hợp lệ', async ({ page }) => {
    // Bước 1: Truy cập trang danh sách bác sĩ
    await page.goto(`${BASE_URL}/doctors/3`);

    // KQ MONG ĐỢI: Hiển thị thông tin chi tiết bác sĩ
    await expect(page.locator('h1:has-text("Trần Công Sơn")')).toBeVisible({ timeout: 3000 });

    // Kiểm tra các thông tin hiển thị
    await expect(page.locator('text=Tim mạch')).toBeVisible();
    await expect(page.locator('text=Thạc sĩ')).toBeVisible();
    await expect(page.locator('text=10 năm')).toBeVisible();

    // Kiểm tra lịch làm việc
    await expect(page.locator('text=Thứ 2 đến Thứ 6')).toBeVisible();
    await expect(page.locator('text=08:00-17:00')).toBeVisible();

    // Kiểm tra nút "Đặt lịch khám"
    await expect(page.getByRole('button', { name: /Đặt lịch khám/i })).toBeVisible();
  });

  // ========================================================================
  // TC_UC004_02: Xem chi tiết bác sĩ không tồn tại (Luồng ngoại lệ)
  // ========================================================================
  test('TC_UC004_02: Lỗi 404 - Bác sĩ không tồn tại', async ({ page }) => {
    // Bước 1: Truy cập URL với ID bác sĩ không tồn tại
    await page.goto(`${BASE_URL}/doctors/9999`, { waitUntil: 'networkidle' });

    // KQ MONG ĐỢI: Hiển thị lỗi 404
    await expect(page.locator('text=Bác sĩ không tồn tại')).toBeVisible({ timeout: 3000 });

    // Kiểm tra có liên kết "Quay lại"
    await expect(page.getByRole('link', { name: /Quay lại/i })).toBeVisible();
  });
});

// ============================================================================
// UC005: XÁC NHẬN LỊCH KHÁM
// ============================================================================

test.describe('UC005: Xác Nhận Lịch Khám', () => {

  test.beforeEach(async ({ page }) => {
    // Giả định bác sĩ đã đăng nhập
    await page.goto(`${BASE_URL}/login`);
    await page.locator('input[type="email"]').fill('doctor@example.com');
    await page.locator('input[type="password"]').fill(VALID_PASSWORD);
    await page.getByRole('button', { name: /Đăng nhập/i }).click();
    await expect(page).toHaveURL(/.*doctor-dashboard/, { timeout: 5000 });
  });

  // ========================================================================
  // TC_UC005_01: Xác nhận lịch thành công (Luồng chính)
  // ========================================================================
  test('TC_UC005_01: Xác nhận lịch khám thành công', async ({ page }) => {
    // Bước 1-2: Truy cập tab "Lịch chờ xác nhận"
    await page.getByRole('tab', { name: /Lịch chờ xác nhận/i }).click();

    // Kiểm tra danh sách lịch chờ xác nhận
    await expect(page.locator('table')).toBeVisible({ timeout: 3000 });

    // Bước 3: Kích nút "Xác nhận" trên lịch ID 15
    await page.locator('tr:has-text("BK20260525001") button:has-text("Xác nhận")').click();

    // Kiểm tra modal xác nhận (nếu có)
    if (await page.locator('text=Bạn có chắc muốn xác nhận lịch?').isVisible()) {
      await page.getByRole('button', { name: /Xác nhận/i }).last().click();
    }

    // KQ MONG ĐỢI: Xác nhận thành công
    await expect(page.locator('text=Xác nhận lịch khám thành công')).toBeVisible({ timeout: 5000 });

    // Kiểm tra lịch được cập nhật trạng thái
    await expect(page.locator('text=Đã xác nhận')).toBeVisible();
  });

  // ========================================================================
  // TC_UC005_02: Từ chối lịch khám (Luồng ngoại lệ)
  // ========================================================================
  test('TC_UC005_02: Từ chối lịch khám thành công', async ({ page }) => {
    // Bước 1-2: Truy cập tab "Lịch chờ xác nhận"
    await page.getByRole('tab', { name: /Lịch chờ xác nhận/i }).click();

    // Kiểm tra danh sách lịch chờ xác nhận
    await expect(page.locator('table')).toBeVisible({ timeout: 3000 });

    // Bước 3: Kích nút "Từ chối"
    await page.locator('tr:has-text("BK20260525002") button:has-text("Từ chối")').click();

    // Kiểm tra modal nhập lý do (nếu có)
    if (await page.locator('textarea[name="lyDoTuChoi"]').isVisible()) {
      await page.locator('textarea[name="lyDoTuChoi"]').fill('Đã có lịch khác vào giờ này');
      await page.getByRole('button', { name: /Xác nhận từ chối/i }).click();
    }

    // KQ MONG ĐỢI: Từ chối thành công
    await expect(page.locator('text=Từ chối lịch khám thành công')).toBeVisible({ timeout: 5000 });

    // Kiểm tra trạng thái cập nhật
    await expect(page.locator('text=Từ chối')).toBeVisible();
  });
});

// ============================================================================
// UC006: XÁC NHẬN HOÀN THÀNH CA KHÁM
// ============================================================================

test.describe('UC006: Xác Nhận Hoàn Thành Ca Khám', () => {

  test.beforeEach(async ({ page }) => {
    // Giả định bác sĩ đã đăng nhập
    await page.goto(`${BASE_URL}/login`);
    await page.locator('input[type="email"]').fill('doctor@example.com');
    await page.locator('input[type="password"]').fill(VALID_PASSWORD);
    await page.getByRole('button', { name: /Đăng nhập/i }).click();
    await expect(page).toHaveURL(/.*doctor-dashboard/, { timeout: 5000 });
  });

  // ========================================================================
  // TC_UC006_01: Hoàn thành ca khám thành công (Luồng chính)
  // ========================================================================
  test('TC_UC006_01: Hoàn thành ca khám thành công', async ({ page }) => {
    // Bước 1-2: Truy cập "Lịch hẹn hôm nay"
    await page.getByRole('tab', { name: /Lịch hôm nay/i }).click();

    // Kiểm tra lịch được hiển thị
    await expect(page.locator('table')).toBeVisible({ timeout: 3000 });

    // Bước 3: Kích nút "Check-in"
    await page.locator('tr:has-text("BK20260525020") button:has-text("Check-in")').click();

    // KQ kiểm tra: Check-in thành công
    await expect(page.locator('text=Check-in thành công')).toBeVisible({ timeout: 3000 });

    // Bước 4: Kích nút "Hoàn thành"
    await page.locator('tr:has-text("BK20260525020") button:has-text("Hoàn thành")').click();

    // Kiểm tra form kết quả khám mở ra
    await expect(page.locator('form:has-text("Chẩn đoán")')).toBeVisible({ timeout: 3000 });

    // Bước 5: Nhập thông tin form
    await page.locator('textarea[name="chuanDoan"]').fill('Cao huyết áp');
    await page.locator('textarea[name="ketQua"]').fill('Bệnh nhân cần uống thuốc hạ áp');
    await page.locator('textarea[name="donThuoc"]').fill('Amlodipine 5mg x 2 viên/ngày');
    await page.locator('input[name="ngayTaiKham"]').fill('2026-06-25');

    // Bước 6: Kích nút "Xác nhận hoàn thành"
    await page.getByRole('button', { name: /Xác nhận hoàn thành/i }).click();

    // KQ MONG ĐỢI: Hoàn thành thành công
    await expect(page.locator('text=Hoàn thành ca khám thành công')).toBeVisible({ timeout: 5000 });

    // Kiểm tra trạng thái cập nhật
    await expect(page.locator('text=Hoàn thành')).toBeVisible();
  });

  // ========================================================================
  // TC_UC006_02: Check-in sai giờ (Luồng ngoại lệ)
  // ========================================================================
  test('TC_UC006_02: Check-in thất bại - Sai thời gian', async ({ page }) => {
    // Bước 1-2: Truy cập "Lịch hẹn hôm nay"
    await page.getByRole('tab', { name: /Lịch hôm nay/i }).click();

    // Kiểm tra lịch được hiển thị
    await expect(page.locator('table')).toBeVisible({ timeout: 3000 });

    // Bước 3: Kích nút "Check-in" nhưng sai thời gian
    // Giả định hệ thống kiểm tra thời gian check-in
    await page.locator('tr:has-text("BK20260525020") button:has-text("Check-in")').click();

    // KQ MONG ĐỢI: Hiển thị lỗi check-in
    await expect(
      page.locator('text=Check-in phải đúng giờ bắt đầu ca khám')
    ).toBeVisible({ timeout: 3000 });
  });
});

// ============================================================================
// UC007: ĐĂNG KÝ LỊCH NGHỈ
// ============================================================================

test.describe('UC007: Đăng Ký Lịch Nghỉ', () => {

  test.beforeEach(async ({ page }) => {
    // Giả định bác sĩ đã đăng nhập
    await page.goto(`${BASE_URL}/login`);
    await page.locator('input[type="email"]').fill('doctor@example.com');
    await page.locator('input[type="password"]').fill(VALID_PASSWORD);
    await page.getByRole('button', { name: /Đăng nhập/i }).click();
    await expect(page).toHaveURL(/.*doctor-dashboard/, { timeout: 5000 });
  });

  // ========================================================================
  // TC_UC007_01: Tạo yêu cầu lịch nghỉ thành công (Luồng chính)
  // ========================================================================
  test('TC_UC007_01: Tạo yêu cầu đăng ký lịch nghỉ thành công', async ({ page }) => {
    // Bước 1: Kích nút "Tạo yêu cầu nghỉ"
    await page.getByRole('button', { name: /Tạo yêu cầu nghỉ/i }).click();

    // Kiểm tra form mở ra
    await expect(page.locator('form:has-text("Ngày nghỉ")')).toBeVisible({ timeout: 3000 });

    // Bước 2-3: Nhập thông tin form
    await page.locator('input[name="ngayNghi"]').fill('2026-05-30');
    await page.locator('textarea[name="lyDo"]').fill('Việc riêng');
    await page.locator('select[name="loaiNghi"]').selectOption('Nửa ngày');
    await page.locator('select[name="gio"]').selectOption('08:00-12:00');
    await page.locator('textarea[name="moTa"]').fill('Cần xin phép hơi để khám sức khỏe');

    // Bước 4: Kích nút "Tạo"
    await page.getByRole('button', { name: /Tạo/i }).click();

    // KQ MONG ĐỢI: Tạo yêu cầu thành công
    await expect(page.locator('text=Tạo yêu cầu nghỉ thành công')).toBeVisible({ timeout: 5000 });

    // Kiểm tra danh sách cập nhật
    await expect(page.locator('text=Chờ duyệt')).toBeVisible();
  });

  // ========================================================================
  // TC_UC007_02: Lỗi bỏ trống trường bắt buộc (Luồng ngoại lệ)
  // ========================================================================
  test('TC_UC007_02: Lỗi - Bỏ trống trường bắt buộc', async ({ page }) => {
    // Bước 1: Kích nút "Tạo yêu cầu nghỉ"
    await page.getByRole('button', { name: /Tạo yêu cầu nghỉ/i }).click();

    // Kiểm tra form mở ra
    await expect(page.locator('form:has-text("Ngày nghỉ")')).toBeVisible({ timeout: 3000 });

    // Bước 2: Để trống trường "Ngày nghỉ"
    await page.locator('textarea[name="lyDo"]').fill('Việc cá nhân');

    // Bước 3: Kích nút "Tạo"
    await page.getByRole('button', { name: /Tạo/i }).click();

    // KQ MONG ĐỢI: Hiển thị thông báo lỗi
    await expect(page.locator('text=Vui lòng chọn ngày nghỉ')).toBeVisible({ timeout: 3000 });

    // Kiểm tra form được giữ lại
    await expect(page.locator('form:has-text("Ngày nghỉ")')).toBeVisible();
  });
});

// ============================================================================
// UC008: QUẢN LÝ THÔNG TIN CHUYÊN KHOA
// ============================================================================

test.describe('UC008: Quản Lý Thông Tin Chuyên Khoa', () => {

  test.beforeEach(async ({ page }) => {
    // Giả định admin đã đăng nhập
    await page.goto(`${BASE_URL}/admin/login`);
    await page.locator('input[type="email"]').fill('admin@example.com');
    await page.locator('input[type="password"]').fill(VALID_PASSWORD);
    await page.getByRole('button', { name: /Đăng nhập/i }).click();
    await expect(page).toHaveURL(/.*admin-dashboard/, { timeout: 5000 });
  });

  // ========================================================================
  // TC_UC008_01: Thêm mới chuyên khoa thành công (Luồng chính)
  // ========================================================================
  test('TC_UC008_01: Thêm mới chuyên khoa thành công', async ({ page }) => {
    // Bước 1: Truy cập "Quản lý chuyên khoa"
    await page.getByRole('link', { name: /Quản lý chuyên khoa/i }).click();

    // Kiểm tra danh sách chuyên khoa
    await expect(page.locator('table')).toBeVisible({ timeout: 3000 });

    // Bước 2: Kích nút "Thêm chuyên khoa"
    await page.getByRole('button', { name: /Thêm chuyên khoa/i }).click();

    // Kiểm tra modal mở ra
    await expect(page.locator('text=Form Thêm Chuyên Khoa')).toBeVisible({ timeout: 3000 });

    // Bước 3: Nhập thông tin
    await page.locator('input[name="tenChuyenKhoa"]').fill('Tâm lý tư vấn');
    await page.locator('textarea[name="moTa"]').fill('Tư vấn tâm lý chuyên sâu, điều trị rối loạn tâm thần');
    await page.locator('select[name="coSoYTe"]').selectOption('Bệnh viện A');

    // Bước 4: Kích nút "Thêm mới"
    await page.getByRole('button', { name: /Thêm mới/i }).click();

    // KQ MONG ĐỢI: Thêm thành công
    await expect(page.locator('text=Thêm chuyên khoa thành công')).toBeVisible({ timeout: 5000 });

    // Kiểm tra danh sách cập nhật
    await expect(page.locator('text=Tâm lý tư vấn')).toBeVisible();
  });

  // ========================================================================
  // TC_UC008_02: Lỗi thêm chuyên khoa trùng tên (Luồng ngoại lệ)
  // ========================================================================
  test('TC_UC008_02: Lỗi thêm chuyên khoa - Trùng tên', async ({ page }) => {
    // Bước 1: Truy cập "Quản lý chuyên khoa"
    await page.getByRole('link', { name: /Quản lý chuyên khoa/i }).click();

    // Kiểm tra danh sách chuyên khoa
    await expect(page.locator('table')).toBeVisible({ timeout: 3000 });

    // Bước 2: Kích nút "Thêm chuyên khoa"
    await page.getByRole('button', { name: /Thêm chuyên khoa/i }).click();

    // Kiểm tra modal mở ra
    await expect(page.locator('text=Form Thêm Chuyên Khoa')).toBeVisible({ timeout: 3000 });

    // Bước 3: Nhập tên chuyên khoa đã tồn tại
    await page.locator('input[name="tenChuyenKhoa"]').fill('Tim mạch');
    await page.locator('textarea[name="moTa"]').fill('Mô tả test');

    // Bước 4: Kích nút "Thêm mới"
    await page.getByRole('button', { name: /Thêm mới/i }).click();

    // KQ MONG ĐỢI: Hiển thị lỗi trùng lặp
    await expect(page.locator('text=Tên chuyên khoa đã tồn tại')).toBeVisible({ timeout: 3000 });
  });
});

// ============================================================================
// UC009: QUẢN LÝ THÔNG TIN BÁC SĨ
// ============================================================================

test.describe('UC009: Quản Lý Thông Tin Bác Sĩ', () => {

  test.beforeEach(async ({ page }) => {
    // Giả định admin đã đăng nhập
    await page.goto(`${BASE_URL}/admin/login`);
    await page.locator('input[type="email"]').fill('admin@example.com');
    await page.locator('input[type="password"]').fill(VALID_PASSWORD);
    await page.getByRole('button', { name: /Đăng nhập/i }).click();
    await expect(page).toHaveURL(/.*admin-dashboard/, { timeout: 5000 });
  });

  // ========================================================================
  // TC_UC009_01: Thêm mới bác sĩ thành công (Luồng chính)
  // ========================================================================
  test('TC_UC009_01: Thêm mới thông tin bác sĩ thành công', async ({ page }) => {
    // Bước 1: Truy cập "Quản lý thông tin bác sĩ"
    await page.getByRole('link', { name: /Quản lý thông tin bác sĩ/i }).click();

    // Kiểm tra danh sách bác sĩ
    await expect(page.locator('table')).toBeVisible({ timeout: 3000 });

    // Bước 2: Kích nút "Thêm mới"
    await page.getByRole('button', { name: /Thêm mới/i }).click();

    // Kiểm tra form mở ra
    await expect(page.locator('form:has-text("Họ tên")')).toBeVisible({ timeout: 3000 });

    // Bước 3: Nhập thông tin bác sĩ
    await page.locator('input[name="hoTen"]').fill('Phạm Hoàng Hoa');
    await page.locator('input[name="ngaySinh"]').fill('1988-03-12');
    await page.locator('select[name="gioiTinh"]').selectOption('Nữ');
    await page.locator('select[name="chuyenKhoa"]').selectOption('Ngoại khoa');
    await page.locator('input[name="soDienThoai"]').fill('0901234565');
    await page.locator('input[name="email"]').fill('hoa.bs@hospital.com');
    await page.locator('input[name="diaChi"]').fill('789 Công Quang, Hà Nội');
    await page.locator('input[name="kinhNghiem"]').fill('12');

    // Bước 4: Kích nút "Lưu"
    await page.getByRole('button', { name: /Lưu/i }).click();

    // KQ MONG ĐỢI: Thêm thành công
    await expect(page.locator('text=Thêm bác sĩ thành công')).toBeVisible({ timeout: 5000 });

    // Kiểm trace danh sách cập nhật
    await expect(page.locator('text=Phạm Hoàng Hoa')).toBeVisible();
  });

  // ========================================================================
  // TC_UC009_02: Lỗi số điện thoại sai định dạng (Luồng ngoại lệ)
  // ========================================================================
  test('TC_UC009_02: Lỗi - Số điện thoại sai định dạng', async ({ page }) => {
    // Bước 1: Truy cập "Quản lý thông tin bác sĩ"
    await page.getByRole('link', { name: /Quản lý thông tin bác sĩ/i }).click();

    // Kiểm tra danh sách bác sĩ
    await expect(page.locator('table')).toBeVisible({ timeout: 3000 });

    // Bước 2: Kích nút "Thêm mới"
    await page.getByRole('button', { name: /Thêm mới/i }).click();

    // Kiểm tra form mở ra
    await expect(page.locator('form:has-text("Họ tên")')).toBeVisible({ timeout: 3000 });

    // Bước 3: Nhập thông tin với SĐT sai định dạng
    await page.locator('input[name="hoTen"]').fill('Nguyễn Văn C');
    await page.locator('input[name="soDienThoai"]').fill('090abc1234'); // Chứa chữ cái

    // Bước 4: Kích nút "Lưu"
    await page.getByRole('button', { name: /Lưu/i }).click();

    // KQ MONG ĐỢI: Hiển thị lỗi định dạng
    await expect(
      page.locator('text=Số điện thoại không hợp lệ')
    ).toBeVisible({ timeout: 3000 });
  });
});

// ============================================================================
// UC010: QUẢN LÝ THÔNG TIN CƠ SỞ Y TẾ
// ============================================================================

test.describe('UC010: Quản Lý Thông Tin Cơ Sở Y Tế', () => {

  test.beforeEach(async ({ page }) => {
    // Giả định admin đã đăng nhập
    await page.goto(`${BASE_URL}/admin/login`);
    await page.locator('input[type="email"]').fill('admin@example.com');
    await page.locator('input[type="password"]').fill(VALID_PASSWORD);
    await page.getByRole('button', { name: /Đăng nhập/i }).click();
    await expect(page).toHaveURL(/.*admin-dashboard/, { timeout: 5000 });
  });

  // ========================================================================
  // TC_UC010_01: Cập nhật thông tin cơ sở y tế thành công (Luồng chính)
  // ========================================================================
  test('TC_UC010_01: Cập nhật thông tin cơ sở y tế thành công', async ({ page }) => {
    // Bước 1-2: Truy cập "Quản lý cơ sở y tế"
    await page.getByRole('link', { name: /Quản lý cơ sở y tế/i }).click();

    // Kiểm tra thông tin hiện tại được hiển thị
    await expect(page.locator('text=Bệnh viện A')).toBeVisible({ timeout: 3000 });

    // Bước 3: Kích nút "Chỉnh sửa"
    await page.getByRole('button', { name: /Chỉnh sửa/i }).click();

    // Kiểm tra form mở ra
    await expect(page.locator('input[name="gioMoCua"]')).toBeVisible({ timeout: 3000 });

    // Bước 4-5: Cập nhật thông tin
    await page.locator('input[name="gioMoCua"]').clear();
    await page.locator('input[name="gioMoCua"]').fill('07:00');
    await page.locator('input[name="gioDongCua"]').clear();
    await page.locator('input[name="gioDongCua"]').fill('18:00');
    await page.locator('input[name="hotline"]').clear();
    await page.locator('input[name="hotline"]').fill('0912345678');

    // Bước 6: Kích nút "Lưu"
    await page.getByRole('button', { name: /Lưu/i }).click();

    // KQ MONG ĐỢI: Cập nhật thành công
    await expect(page.locator('text=Cập nhật thông tin cơ sở y tế thành công')).toBeVisible({ timeout: 5000 });

    // Kiểm tra thông tin được cập nhật
    await expect(page.locator('text=07:00-18:00')).toBeVisible();
    await expect(page.locator('text=0912345678')).toBeVisible();
  });

  // ========================================================================
  // TC_UC010_02: Hủy cập nhật thông tin (Luồng ngoại lệ)
  // ========================================================================
  test('TC_UC010_02: Hủy cập nhật thông tin cơ sở y tế', async ({ page }) => {
    // Bước 1-2: Truy cập "Quản lý cơ sở y tế"
    await page.getByRole('link', { name: /Quản lý cơ sở y tế/i }).click();

    // Kiểm tra thông tin hiện tại được hiển thị
    const oldGioMoCua = await page.locator('text=08:00').first().textContent();
    await expect(page.locator('text=08:00')).toBeVisible({ timeout: 3000 });

    // Bước 3: Kích nút "Chỉnh sửa"
    await page.getByRole('button', { name: /Chỉnh sửa/i }).click();

    // Kiểm tra form mở ra
    await expect(page.locator('input[name="gioMoCua"]')).toBeVisible({ timeout: 3000 });

    // Bước 4-5: Thay đổi thông tin
    await page.locator('input[name="gioMoCua"]').clear();
    await page.locator('input[name="gioMoCua"]').fill('06:00');

    // Bước 6: Kích nút "Hủy"
    await page.getByRole('button', { name: /Hủy/i }).click();

    // KQ MONG ĐỢI: Quay lại giao diện ban đầu, dữ liệu không thay đổi
    await expect(page.locator('text=08:00').first()).toBeVisible();

    // Kiểm tra thông tin giữ nguyên
    await expect(page.locator('input[name="gioMoCua"]')).toHaveValue('08:00');
  });
});

// ============================================================================
// END OF TEST SUITE
// ============================================================================

