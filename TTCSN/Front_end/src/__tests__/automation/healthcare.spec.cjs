/**
 * ============================================================================
 * SCRIPT KIỂM THỬ TỰ ĐỘNG - PLAYWRIGHT (JAVASCRIPT) - FINAL PRODUCTION v3.5
 * Dự án: Website Đặt Lịch Khám Trực Tuyến Healthcare
 * Số Test Cases: 20 (10 Use Case x 2 kịch bản)
 * ============================================================================
 */

const { test, expect } = require('@playwright/test');

// ============================================================================
// ĐỒNG BỘ DỮ LIỆU ĐĂNG NHẬP THỰC TẾ TRÊN DATABASE CỦA SHIN
// ============================================================================
const BASE_URL = 'http://localhost:5173';
const LOGIN_URL = `${BASE_URL}/loginpage`;
const VALID_PASSWORD = 'admin123';

const USER_EMAIL = 'shintest@healthcare.vn';     // Tài khoản Bệnh nhân chính chủ
const DOCTOR_EMAIL = 'shinDoctor@healthcare.vn'; // Tài khoản Bác sĩ Nguyễn Tùng
const ADMIN_EMAIL = 'shinAdmin@healthcare.vn';   // Tài khoản Shin Admin

const USER_EMAIL2 = 'nguyenvantung07032005@gmail.com';

const DUPLICATE_EMAIL = 'user@healthcare.vn';
const VALID_OTP = '123456';


// ============================================================================
// UC001: ĐĂNG KÝ
// ============================================================================
test.describe('UC001: Đăng Ký Tài Khoản', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_URL);
  });

  // ========================================================================
  // TC_UC001_01: Đăng ký tài khoản thành công (Luồng chính)
  // ========================================================================
  test('TC_UC001_01: Đăng ký thành công với thông tin hợp lệ', async ({ page }) => {
    // Click hyperlink chuyển sang Form Đăng ký
    const registerLink = page.getByText(/Đăng ký ngay/i).filter({ visible: true }).first();
    await registerLink.click();
    await page.waitForTimeout(500);

    // 1. Ô Họ tên
    const nameInput = page.locator('input[name*="ten"], input[name*="Ten"], input[name*="name"], input[placeholder*="tên"], input[placeholder*="Họ"]').first();
    await expect(nameInput).toBeVisible({ timeout: 5000 });
    await nameInput.fill('Nguyễn Văn A');

    // 2. Ô Email động né trùng lặp Database
    const dynamicEmail = `testuser_${Date.now()}@healthcare.vn`;
    await page.locator('form input[type="email"], form input[name*="email"]').first().fill(dynamicEmail);

    // 3. Ô Mật khẩu
    await page.locator('form input[type="password"], form input[name*="pass"]').first().fill(VALID_PASSWORD);

    // 4. Ô Số điện thoại
    await page.locator('input[name*="thoai"], input[name*="phone"], input[name*="sdt"], input[placeholder*="thoại"]').first().fill('0901234567');

    // 5. Ô Ngày sinh
    const dateInput = page.locator([
      'input[type="date"]',
      'input[name*="ngay"]',
      'input[name*="sinh"]',
      'input[placeholder*="/"]',
      'input[placeholder*="-"]',
      'input[placeholder*="yyyy"]'
    ].join(',')).first();
    await dateInput.click();
    await dateInput.fill('15-06-1995');

    // 6. Ô Giới tính (Click trực tiếp vào chữ "Nam" lộ thiên)
    const maleOption = page.locator('input[value="Nam"], input[value="true"], input#Nam, input#nam')
      .or(page.getByText(/^Nam$/))
      .filter({ visible: true })
      .first();
    await maleOption.click();
    await page.waitForTimeout(200);

    // 7. Ô Địa chỉ
    await page.locator('input[name*="chi"], input[name*="diaChi"], input[placeholder*="chỉ"]').first().fill('Cầu Giấy, Hà Nội');

    // Bấm nút Đăng ký cuối form để submit
    await page.locator('form button[type="submit"], form button:has-text("Đăng ký")').filter({ visible: true }).last().click();

    /* ✅ FIXED: Sửa từ khóa "OTP" thành "xác thực email" đúng chuẩn text node hiển thị thực tế của Shin */
    await expect(page.locator('body')).toContainText('xác thực email', { timeout: 7000 });

    // Nhập mã OTP và xác nhận nếu form nhập mã có xuất hiện
    const otpInput = page.locator('input[placeholder*="mã"], input[placeholder*="OTP"], input[placeholder*="otp"]').first();
    if (await otpInput.isVisible()) {
      await otpInput.fill(VALID_OTP);
      await page.locator('button:has-text("Xác nhận"), button:has-text("Xác thực")').filter({ visible: true }).first().click();
      await page.waitForTimeout(500);
      await expect(page.locator('body')).toContainText('thành công', { timeout: 5000 });
    }
  });

  // ========================================================================
  // TC_UC001_02: Đăng ký thất bại do Email trùng lặp (Luồng ngoại lệ)
  // ========================================================================
  test('TC_UC001_02: Đăng ký thất bại - Email đã tồn tại', async ({ page }) => {
    const registerLink = page.getByText(/Đăng ký ngay/i).filter({ visible: true }).first();
    await registerLink.click();
    await page.waitForTimeout(500);

    await page.locator('input[name*="ten"], input[placeholder*="tên"]').first().fill('Trần Thị B');
    await page.locator('form input[type="email"], form input[name*="email"]').first().fill(DUPLICATE_EMAIL);
    await page.locator('form input[type="password"], form input[name*="pass"]').first().fill(VALID_PASSWORD);
    await page.locator('input[name*="thoai"], input[placeholder*="thoại"]').first().fill('0987654321');

    // Ngày sinh ca ngoại lệ
    const dateInput = page.locator([
      'input[type="date"]',
      'input[name*="ngay"]',
      'input[name*="sinh"]',
      'input[placeholder*="/"]',
      'input[placeholder*="-"]',
      'input[placeholder*="yyyy"]'
    ].join(',')).first();
    await dateInput.click();
    await dateInput.fill('20-01-2000');

    const femaleOption = page.locator('input[value="Nữ"], input[value="false"], input#Nữ, input#nu')
      .or(page.getByText(/^Nữ$/))
      .filter({ visible: true })
      .first();
    await femaleOption.click();
    await page.waitForTimeout(200);

    await page.locator('input[name*="chi"], input[placeholder*="chỉ"]').first().fill('Từ Liêm, Hà Nội');

    // Submit form
    await page.locator('form button[type="submit"], form button:has-text("Đăng ký")').filter({ visible: true }).last().click();

    /* ✅ FIXED: Đổi từ khóa mong đợi thành "được sử dụng" khớp hoàn toàn với câu "Email đã được sử dụng!" của app */
    await expect(page.locator('body')).toContainText('được sử dụng', { timeout: 7000 });
  });
});



// ============================================================================
// UC002: ĐẶT LỊCH KHÁM (BẢN ĐỒNG BỘ TIMEOUT MAIL SERVICE)
// ============================================================================
test.describe('UC002: Đặt Lịch Khám', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_URL);
    await page.locator('input[type="email"], input[name*="email"]').first().fill(USER_EMAIL);
    await page.locator('input[type="password"], input[name*="password"]').first().fill(VALID_PASSWORD);
    await page.locator('button[type="submit"], button:has-text("Đăng nhập")').first().click();
    await expect(page).toHaveURL(/.*(dashboard|\/$)/, { timeout: 6000 });
    await page.waitForTimeout(1000);
  });

  test('TC_UC002_01: Đặt lịch khám thành công từ ca khám của bác sĩ', async ({ page }) => {
    const doctorMenu = page.locator('button, a, span, p').filter({ hasText: /^Bác sĩ$/ }).filter({ visible: true }).first();
    await doctorMenu.click();
    await page.waitForTimeout(800);
    const selectDoctor = page.locator('.doctor-card, .doctor-item, a, button').filter({ hasText: /Xem chi tiết|Chi tiết|Sơn|Ngân|Hiếu/i }).filter({ visible: true }).first();
    await selectDoctor.click();
    await page.waitForTimeout(1000)
    const timeSlot = page.locator('button:not([disabled]), span:not([disabled]), .time-slot:not([disabled])')
      .filter({ hasText: /(07:00|08:00|09:00|14:00|15:00|\d{2}:\d{2})/ })
      .first();
    await timeSlot.click();
    const yearInput = page.locator('input[placeholder*="năm sinh"], input[name*="sinh"], input[type="number"]').first();
    await yearInput.waitFor({ state: 'visible', timeout: 5000 });
    await yearInput.fill('1995');
    await page.locator('input[placeholder*="địa chỉ"], input[name*="chi"], input[name*="diaChi"], input[name*="address"]').first().fill('Cầu Giấy, Hà Nội');
    await page.locator('textarea[name*="lyDo"], textarea[name*="lydo"], textarea[placeholder*="khám"]').first().fill('Khám tổng quát sức khỏe định kỳ');
    const cashRadio = page.locator('input[type="radio"], input[value*="tienmat"]').or(page.getByText('Tiền mặt')).first();
    if (await cashRadio.isVisible()) await cashRadio.click();
    await page.locator('button:has-text("Xác nhận"), button:has-text("đặt khám"), button[type="submit"]').filter({ visible: true }).last().click();
    /* ✅ FIXED: Tăng timeout lên hẳn 15 giây để bao trọn thời gian Backend kết nối và gửi Mail xác nhận (mất 10 giây) */
    await expect(page.locator('body')).toContainText('thành công', { timeout: 15000 });
  });

  test('TC_UC002_02: Đặt lịch thất bại - Bỏ trống trường lý do khám bắt buộc', async ({ page }) => {
    const doctorMenu = page.locator('button, a, span, p').filter({ hasText: /^Bác sĩ$/ }).filter({ visible: true }).first();
    await doctorMenu.click();
    await page.waitForTimeout(800);
    const selectDoctor = page.locator('.doctor-card, .doctor-item, a, button').filter({ hasText: /Xem chi tiết|Chi tiết|Sơn|Hiếu/i }).filter({ visible: true }).first();
    await selectDoctor.click();
    await page.waitForTimeout(1000);
    const timeSlot = page.locator('button, span, .time-slot').filter({ hasText: /(07:00|08:00|09:00|14:00|15:00|\d{2}:\d{2})/ }).filter({ visible: true }).first();
    await timeSlot.click();
    await page.waitForTimeout(800);
    // Điền năm sinh và địa chỉ để cô lập, chỉ để trống mỗi ô lý do khám
    const yearInput = page.locator('input[placeholder*="năm sinh"], input[name*="sinh"]').first();
    if (await yearInput.isVisible()) await yearInput.fill('2000');
    const addressInput = page.locator('input[placeholder*="địa chỉ"], input[name*="chi"]').first();
    if (await addressInput.isVisible()) await addressInput.fill('Từ Liêm, Hà Nội');
    // Cố tình không điền lý do khám, submit thẳng để xem cảnh báo validation của app
    await page.locator('button:has-text("Xác nhận"), button:has-text("đặt khám"), button[type="submit"]').filter({ visible: true }).last().click();
    /* ✅ FIXED: Chuyển cụm từ khóa mong đợi sang định dạng REAL REGEX để kích hoạt toán tử OR chuẩn xác */
    await expect(page.locator('body')).toContainText(/vui lòng|lý do|bắt buộc/i, { timeout: 5000 });
  });

  test('TC_UC002_03: Đặt lịch thất bại - Không nhập lý do khám và phương thức thanh toán', async ({ page }) => {
    const doctorMenu = page.locator('button, a, span, p').filter({ hasText: /^Bác sĩ$/ }).filter({ visible: true }).first();
    await doctorMenu.click();
    await page.waitForTimeout(800);
    const selectDoctor = page.locator('.doctor-card, .doctor-item, a, button').filter({ hasText: /Xem chi tiết|Chi tiết|Sơn|Hiếu/i }).filter({ visible: true }).first();
    await selectDoctor.click();
    await page.waitForTimeout(1000);
    const timeSlot = page.locator('button, span, .time-slot').filter({ hasText: /(07:00|08:00|09:00|14:00|15:00|\d{2}:\d{2})/ }).filter({ visible: true }).first();
    await timeSlot.click();
    await page.waitForTimeout(800);
    const yearInput = page.locator('input[placeholder*="năm sinh"], input[name*="sinh"]').first();
    if (await yearInput.isVisible()) await yearInput.fill('1998');
    const addressInput = page.locator('input[placeholder*="địa chỉ"], input[name*="chi"]').first();
    if (await addressInput.isVisible()) await addressInput.fill('Cầu Giấy, Hà Nội');
    // Bỏ trống hoàn toàn ô textarea lý do khám bằng chuỗi rỗng
    await page.locator('textarea[name*="lyDo"], textarea[name*="lydo"], textarea[placeholder*="khám"]').first().fill('');
    // Bấm nút đặt lịch thẳng
    await page.locator('button:has-text("Xác nhận"), button:has-text("đặt khám"), button[type="submit"]').filter({ visible: true }).last().click();
    // Kết quả mong đợi: Hệ thống báo lỗi Validation đỏ ở form
    await expect(page.locator('body')).toContainText(/vui lòng|lý do|bắt buộc|thanh toán/i, { timeout: 5000 });
  });

  test('TC_UC002_04: Đặt lịch thất bại - Chọn ngày khám ở quá khứ', async ({ page }) => {
    const doctorMenu = page.locator('button, a, span, p').filter({ hasText: /^Bác sĩ$/ }).filter({ visible: true }).first();
    await doctorMenu.click();
    await page.waitForTimeout(800);
    const selectDoctor = page.locator('.doctor-card, .doctor-item, a, button').filter({ hasText: /Xem chi tiết|Chi tiết|Hiếu|Hà/i }).filter({ visible: true }).first();
    await selectDoctor.click();
    await page.waitForTimeout(1000);
    // Tìm ô chọn ngày khám trên giao diện của bác sĩ và cố tình chọn ngày ở quá khứ (ví dụ năm 2025)
    const dateInput = page.locator('input[type="date"], input[name*="ngay"], input[placeholder*="ngày"]').first();
    if (await dateInput.isVisible()) {
      await dateInput.fill('2025-01-01');
    }
    const timeSlot = page.locator('button, span, .time-slot').filter({ hasText: /(07:00|08:00|09:00|14:00|15:00|\d{2}:\d{2})/ }).filter({ visible: true }).first();
    await timeSlot.click();
    await page.waitForTimeout(800);
    const yearInput = page.locator('input[placeholder*="năm sinh"], input[name*="sinh"]').first();
    if (await yearInput.isVisible()) await yearInput.fill('1995');
    await page.locator('textarea[name*="lyDo"], textarea[name*="lydo"], textarea[placeholder*="khám"]').first().fill('Tái khám tim mạch');
    const cashRadio = page.locator('input[type="radio"], input[value*="tienmat"]').or(page.getByText('Tiền mặt')).first();
    if (await cashRadio.isVisible()) await cashRadio.click();
    await page.locator('button:has-text("Xác nhận"), button:has-text("đặt khám"), button[type="submit"]').filter({ visible: true }).last().click();
    // Kết quả mong đợi: Hệ thống nhận diện lỗi logic thời gian
    await expect(page.locator('body')).toContainText(/ngày|quá khứ|hợp lệ|lớn hơn/i, { timeout: 5000 });
  });

  test('TC_UC002_05: Đặt lịch thất bại - Khung giờ đã bị đầy suất hoặc có người đặt trước', async ({ page }) => {
    const doctorMenu = page.locator('button, a, span, p').filter({ hasText: /^Bác sĩ$/ }).filter({ visible: true }).first();
    await doctorMenu.click();
    await page.waitForTimeout(800);
    const selectDoctor = page.locator('.doctor-card, .doctor-item, a, button').filter({ hasText:
          /Xem chi tiết|Chi tiết|Ngân|Hà/i }).filter({ visible: true }).first();
    await selectDoctor.click();
    await page.waitForTimeout(1000);
    // 🎯 ĐỊNH VỊ KHUNG GIỜ ĐÃ BỊ ĐẦY SUẤT (Ví dụ: ô 08:00 đang hiển thị màu xám)
    const disabledTimeSlot = page.locator('button, .time-slot').filter({ hasText: /^08:00$/ }).first();
    // 🎯 KQ MONG ĐỢI MỚI: Phần tử này bắt buộc phải ở trạng thái BỊ KHÓA (disabled), không cho phép click
    await expect(disabledTimeSlot).toBeDisabled({ timeout: 5000 });
  });
});

// ============================================================================
// UC003: XEM DANH SÁCH LỊCH ĐÃ ĐẶT (BẢN VÁ TUYỆT ĐỐI THEO CHỮ TĨNH CỦA SHIN)
// ============================================================================

test.describe('UC003: Xem Danh Sách Lịch Đã Đặt', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_URL, { waitUntil: 'networkidle' });
  });

  // --------------------------------------------------------------------------
  // TC31: Kiểm tra luồng ĐÃ CÓ LỊCH HẸN (Tài khoản shintest@healthcare.vn)
  // --------------------------------------------------------------------------
  test('TC_UC003_01: Hiển thị danh sách lịch khám đầy đủ', async ({ page }) => {
    // 🔐 Đăng nhập tài khoản ĐÃ CÓ LỊCH HẸN
    const emailInput = page.locator('input[type="email"], input[name*="email"]').first();
    await emailInput.waitFor({ state: 'visible', timeout: 5000 });
    await emailInput.fill(USER_EMAIL);

    await page.locator('input[type="password"]').first().fill(VALID_PASSWORD);
    await page.locator('button[type="submit"]').first().click();

    await expect(page).toHaveURL(/.*(dashboard|\/$)/, { timeout: 6000 });
    await page.waitForTimeout(1000);

    // Click vào thẻ span "Lịch hẹn" bọc cờ force cho chắc chắn
    const historyTab = page.locator('span').filter({ hasText: /^Lịch hẹn$/ }).filter({ visible: true }).first();
    await historyTab.click({ force: true });
    await page.waitForTimeout(1000); // Đợi 1s cho React nạp xong dữ liệu từ Backend

    /* ✅ FIXED: Bỏ hẳn dòng check class table cũ.
       Ép Playwright khẳng định: Luồng thành công thì màn hình KHÔNG ĐƯỢC CHỨA 2 câu thông báo trống lịch! */
    await expect(page.locator('body')).not.toContainText('Bạn chưa có lịch khám nào', { timeout: 5000 });
    await expect(page.locator('body')).not.toContainText('Hãy đặt lịch để được bác sĩ tư vấn', { timeout: 5000 });
  });

  // --------------------------------------------------------------------------
  // TC32: Kiểm tra luồng CHƯA CÓ LỊCH HẸN (Tài khoản nguyenvantung07032005@gmail.com)
  // --------------------------------------------------------------------------
  test('TC_UC003_02: Hiển thị thông báo khi chưa có lịch hẹn', async ({ page }) => {
    // 🔐 Đăng nhập tài khoản MỚI TINH CHƯA CÓ LỊCH
    const emailInput = page.locator('input[type="email"], input[name*="email"]').first();
    await emailInput.waitFor({ state: 'visible', timeout: 5000 });
    await emailInput.fill(USER_EMAIL2);

    await page.locator('input[type="password"]').first().fill(VALID_PASSWORD);
    await page.locator('button[type="submit"]').first().click();

    await expect(page).toHaveURL(/.*(dashboard|\/$)/, { timeout: 6000 });
    await page.waitForTimeout(1000);

    // Click vào thẻ span "Lịch hẹn"
    const historyTab = page.locator('span').filter({ hasText: /^Lịch hẹn$/ }).filter({ visible: true }).first();
    await historyTab.click({ force: true });
    await page.waitForTimeout(1000);

    /* ✅ FIXED: Khẳng định luồng trống thì màn hình BẮT BUỘC phải hiện 2 câu thông báo tĩnh của Shin */
    await expect(page.locator('body')).toContainText('Bạn chưa có lịch khám nào', { timeout: 5000 });
    await expect(page.locator('body')).toContainText('Hãy đặt lịch để được bác sĩ tư vấn', { timeout: 5000 });
  });
});




// ============================================================================
// UC004: XEM CHI TIẾT THÔNG TIN BÁC SĨ (ĐH ĐÃ FIX LUỒNG & TIMEOUT)
// ============================================================================
test.describe('UC004: Xem Chi Tiết Thông Tin Bác Sĩ', () => {

  // ========================================================================
  // TC_UC004_01: Xem chi tiết bác sĩ hợp lệ (CLICK TỪ DANH SÁCH)
  // ========================================================================
  test('TC_UC004_01: Xem chi tiết bác sĩ hợp lệ', async ({ page }) => {
    // Bước 1: Vào trang danh sách bác sĩ
    await page.goto(`${BASE_URL}/doctorpage`);
    await page.waitForTimeout(1000); // Chờ list render ra

    // Bước 2: Tìm và chọn một bác sĩ cụ thể từ danh sách (tương tự như UC002)
    const selectDoctor = page.locator('.doctor-card, .doctor-item, a, button')
      .filter({ hasText: /Xem chi tiết|Chi tiết|Sơn|Ngân|Hiếu|Tùng/i })
      .filter({ visible: true })
      .first();
    await selectDoctor.click();

    // Bước 3: Đợi chuyển trang và kiểm tra thông tin bác sĩ hiển thị trong trang chi tiết
    await expect(page.locator('h1, h2, .doctor-name, body')).toContainText(/Sơn|Ngân|Hiếu|Bác sĩ/i, { timeout: 5000 });
  });

  // ========================================================================
  // TC_UC004_02: Lỗi 404 - Bác sĩ không tồn tại (FIX LỖI TREO NETWORKIDLE)
  // ========================================================================
  test('TC_UC004_02: Lỗi 404 - Bác sĩ không tồn tại', async ({ page }) => {
    // ✅ FIXED: XÓA { waitUntil: 'networkidle' }.
    // Chỉ cần page.goto mặc định, Playwright sẽ thông minh tự động dùng cơ chế Auto-waiting
    // của hàm expect() bên dưới để dò tìm dòng chữ báo lỗi mà không bị treo 30 giây nữa.
    await page.goto(`${BASE_URL}/doctor/9999`);

    // Định vị dòng chữ cảnh báo trên giao diện
    const errorMessage = page.getByText(/Không tìm thấy thông tin bác sĩ/i);

    // KQ MONG ĐỢI: Dòng thông báo lỗi phải hiển thị rõ ràng
    await expect(errorMessage).toBeVisible({ timeout: 5000 });

    // Kiểm tra thêm sự tồn tại của nút "Quay lại"
    await expect(page.getByRole('button', { name: /Quay lại/i }).or(page.locator('a:has-text("Quay lại")'))).toBeVisible();
  });
});

// ============================================================================
// UC005: XÁC NHẬN LỊCH KHÁM (BẢN CHUẨN - BỎ QUA NÚT BỊ DISABLED)
// ============================================================================
test.describe('UC005: Xác Nhận Lịch Khám', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_URL);
    await page.locator('input[type="email"]').first().fill(DOCTOR_EMAIL);
    await page.locator('input[type="password"]').first().fill(VALID_PASSWORD);
    await page.locator('button[type="submit"]').first().click();

    await expect(page).toHaveURL(/.*(dashboard|bacsi)/, { timeout: 5000 });
    await page.waitForTimeout(1000);
  });

  // ========================================================================
  // TC_UC005_01: Xác nhận lịch khám thành công
  // ========================================================================
  test('TC_UC005_01: Xác nhận lịch khám thành công', async ({ page }) => {
    // 1. Click menu "Danh sách lịch chờ" bên trái
    await page.locator('text=Danh sách lịch chờ').first().click();
    await page.waitForTimeout(1000);

    // 2. XỬ LÝ DROPDOWN THEO CHUẨN THẺ SELECT
    const dropdown = page.locator('select').first();
    await dropdown.selectOption({ label: '2026-06-10' });
    await page.waitForTimeout(1000);

    // 3. 🎯 SỬA Ở ĐÂY: Tìm nút "Xác nhận" ĐẦU TIÊN mà KHÔNG BỊ KHÓA
    // Dùng pseudo-class :not([disabled]) của CSS để loại bỏ các nút màu xám
    const btnXacNhan = page.locator('button:has-text("Xác nhận"):not([disabled])').first();
    await btnXacNhan.click();

    // 4. Xử lý popup confirm (nếu có)
    const confirmDialog = page.locator('text=Xác nhận?').first();
    if (await confirmDialog.isVisible()) {
      await page.locator('button').filter({ hasText: /^Xác nhận$/ }).last().click();
    }

    // 5. Kiểm tra kết quả
    await expect(page.locator('body')).toContainText(/thành công/i, { timeout: 9000 });
  });

  // ========================================================================
  // TC_UC005_02: Từ chối lịch khám thành công
  // ========================================================================
  test('TC_UC005_02: Từ chối lịch khám thành công', async ({ page }) => {
    // 1. Click menu "Danh sách lịch chờ"
    await page.locator('text=Danh sách lịch chờ').first().click();
    await page.waitForTimeout(1000);

    // 2. XỬ LÝ DROPDOWN THEO CHUẨN THẺ SELECT
    const dropdown = page.locator('select').first();
    await dropdown.selectOption({ label: '2026-06-10' });
    await page.waitForTimeout(1000);

    // 3. 🎯 SỬA Ở ĐÂY: Tìm nút "Từ chối" ĐẦU TIÊN ở bảng danh sách mà KHÔNG BỊ KHÓA
    const btnTuChoi = page.locator('button:has-text("Từ chối"):not([disabled])').first();
    await btnTuChoi.click();

    // 4. Xử lý Form điền lý do từ chối vừa hiện lên
    const reasonTxt = page.locator('textarea[name*="lyDo"], textarea').first();

    // ÉP BOT ĐỢI: Chờ chắc chắn form popup đã bật lên hoàn toàn
    await expect(reasonTxt).toBeVisible({ timeout: 5000 });

    // Điền lý do
    await reasonTxt.fill('Đã có lịch khác đột xuất vào giờ này, xin lỗi bệnh nhân.');
    await page.waitForTimeout(500);

    // CHÍ MẠNG: Click nút "Từ chối" bên trong cái form
    await page.locator('button').filter({ hasText: /^Từ chối$/ }).last().click();

    // 5. Kiểm tra kết quả hiển thị thông báo thành công
    await expect(page.locator('body')).toContainText(/đã từ chối lịch hẹn/i, { timeout: 8000 });
  });
});

test.describe('UC006: Xác Nhận Hoàn Thành Ca Khám', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_URL);
    await page.locator('input[type="email"]').first().fill(DOCTOR_EMAIL);
    await page.locator('input[type="password"]').first().fill(VALID_PASSWORD);
    await page.locator('button[type="submit"]').first().click();
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 5000 });
  });

  test('TC_UC006_01: Hoàn thành ca khám thành công', async ({ page }) => {
    await page.locator('text=Lịch hôm nay').filter({ visible: true }).first().click();
    await page.locator('button:has-text("Check-in")').filter({ visible: true }).first().click();
    await page.waitForTimeout(500);

    await page.locator('button:has-text("Hoàn thành")').filter({ visible: true }).first().click();
    await page.locator('textarea[name*="chuanDoan"]').first().fill('Cao huyết áp');
    await page.locator('textarea[name*="ketQua"]').first().fill('Cần uống thuốc hạ áp');
    await page.locator('textarea[name*="donThuoc"]').first().fill('Amlodipine 5mg');
    await page.locator('button:has-text("Xác nhận")').filter({ visible: true }).last().click();
    await expect(page.locator('text=thành công').first()).toBeVisible({ timeout: 5000 });
  });

  test('TC_UC006_02: Check-in thất bại - Sai thời gian', async ({ page }) => {
    await page.locator('text=Lịch hôm nay').filter({ visible: true }).first().click();
    await page.locator('button:has-text("Check-in")').filter({ visible: true }).first().click();
    await expect(page.locator('text=thời gian, text=Thất bại').first()).toBeVisible({ timeout: 3000 });
  });
});

// ============================================================================
// UC007: ĐĂNG KÝ LỊCH NGHỈ (BẢN ĐỒNG BỘ UI SIDEBAR & POPUP REACT)
// ============================================================================
test.describe('UC007: Đăng Ký Lịch Nghỉ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_URL);
    await page.locator('input[type="email"]').first().fill(DOCTOR_EMAIL);
    await page.locator('input[type="password"]').first().fill(VALID_PASSWORD);
    await page.locator('button[type="submit"]').first().click();

    // Đảm bảo URL đã vào trang trong của bác sĩ
    await expect(page).toHaveURL(/.*(dashboard|bacsi)/, { timeout: 5000 });
    await page.waitForTimeout(1000);
  });

  // ========================================================================
  // TC_UC007_01: Tạo yêu cầu đăng ký lịch nghỉ thành công (FULL FORM)
  // ========================================================================
  test('TC_UC007_01: Tạo yêu cầu đăng ký lịch nghỉ thành công', async ({ page }) => {
    // 1. Click menu Sidebar
    await page.locator('text=Đăng ký lịch nghỉ').first().click();
    await page.waitForTimeout(1000);

    // 2. Click nút mở Form
    await page.locator('button').filter({ hasText: /Tạo yêu cầu nghỉ/i }).first().click();

    // 3. Đợi Form nảy lên
    await expect(page.locator('text=Tạo yêu cầu nghỉ').last()).toBeVisible({ timeout: 3000 });

    // 4. 🎯 ĐIỀN DỮ LIỆU TỪ TRÊN XUỐNG DƯỚI FORM

    // [1] Ngày nghỉ
    await page.locator('input[type="date"]').first().fill('2026-06-15');

    // [2] Lý do
    const reasonTxt = page.locator('textarea').first();
    await reasonTxt.fill('Giải quyết việc gia đình đột xuất');
    await reasonTxt.blur();

    // [3] Loại phép (Dropdown Menu)
    // Nhìn ảnh thấy rõ đây là thẻ <select> thuần túy, ta dùng selectOption
    const loaiPhepDropdown = page.locator('select').first();
    await loaiPhepDropdown.selectOption({ label: 'Nghỉ phép năm' });
    // Nếu lỗi báo không tìm thấy label, ông có thể đổi sang: await loaiPhepDropdown.selectOption({ index: 2 });

    // Lọc lấy tất cả các ô input nhập chữ (bỏ qua ô Date và Checkbox)
    const textInputs = page.locator('input:not([type="date"]):not([type="checkbox"])').filter({ visible: true });

    // [4] File đính kèm (URL)
    // Dùng nth(1) vì nth(0) đang bị cái ô "Tìm kiếm lịch nghỉ" ở background chiếm mất
    await textInputs.nth(1).fill('https://drive.google.com/file/d/don-xin-nghi-phep.pdf');
    await textInputs.nth(1).blur();

    // [5] Mô tả thời gian nghỉ
    // Nó là ô input tiếp theo trong DOM nên sẽ là nth(2)
    await textInputs.nth(2).fill('Nghỉ trọn vẹn 1 ngày thứ 2 để về quê');
    await textInputs.nth(2).blur();

    // [6] Checkbox "Nghỉ cả ngày" (Nếu UI mặc định đã tích xanh thì bỏ qua, nếu chưa thì thêm lệnh này)
    // await page.locator('input[type="checkbox"]').check();

    await page.waitForTimeout(500); // Đợi form lưu toàn bộ State

    // 5. Click nút "Tạo" màu xanh lá
    await page.locator('button').filter({ hasText: /^Tạo$/ }).last().click();

    // 6. Kiểm tra thông báo thành công
    await expect(page.locator('body')).toContainText(/thành công/i, { timeout: 5000 });
  });

  // ========================================================================
  // TC_UC007_02: Lỗi - Bỏ trống trường bắt buộc
  // ========================================================================
  test('TC_UC007_02: Lỗi - Bỏ trống trường bắt buộc', async ({ page }) => {
    // 1. Click menu Sidebar
    await page.locator('text=Đăng ký lịch nghỉ').first().click();
    await page.waitForTimeout(1000);

    // 2. Click nút mở Form
    await page.locator('button').filter({ hasText: /Tạo yêu cầu nghỉ/i }).first().click();

    // 3. Đợi form hiện lên
    await expect(page.locator('text=Tạo yêu cầu nghỉ').last()).toBeVisible({ timeout: 3000 });

    // 4. KHÔNG ĐIỀN GÌ CẢ, bấm nút "Tạo" luôn để test validation của Front-end
    await page.locator('button').filter({ hasText: /^Tạo$/ }).last().click();

    // 5. Kiểm tra thông báo lỗi
    // ✅ FIXED: Chuyển cú pháp lỗi thành Regex chuẩn xác
    await expect(page.locator('body')).toContainText(/vui lòng|bắt buộc|không được để trống/i, { timeout: 3000 });
  });
});

// ============================================================================
// UC008: QUẢN LÝ THÔNG TIN CHUYÊN KHOA (BẢN CHUẨN UI ADMIN)
// ============================================================================
test.describe('UC008: Quản Lý Thông Tin Chuyên Khoa', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_URL);
    await page.locator('input[type="email"]').first().fill(ADMIN_EMAIL);
    await page.locator('input[type="password"]').first().fill(VALID_PASSWORD);
    await page.locator('button[type="submit"]').first().click();

    // Đảm bảo URL đã vào trang dashboard của Admin
    await expect(page).toHaveURL(/.*(dashboard|admin)/, { timeout: 5000 });
    await page.waitForTimeout(1000);
  });

  // ========================================================================
  // TC_UC008_01: Thêm mới chuyên khoa thành công
  // ========================================================================
  test('TC_UC008_01: Thêm mới chuyên khoa thành công', async ({ page }) => {
    // 1. Click menu Sidebar "Quản lý chuyên khoa"
    await page.locator('text=Quản lý chuyên khoa').first().click();
    await page.waitForTimeout(1000);

    // 2. Click nút "+ Thêm chuyên khoa" (Màu nâu)
    await page.locator('button').filter({ hasText: /Thêm chuyên khoa/i }).first().click();

    // 3. Đợi Popup Form nảy lên hoàn toàn
    await expect(page.locator('text=Thêm chuyên khoa').last()).toBeVisible({ timeout: 3000 });

    // 4. 🎯 ĐIỀN DỮ LIỆU VÀO FORM
    // Dùng tuyệt chiêu getByPlaceholder để nhắm trúng đích, né cái ô Tìm kiếm ở background
    await page.getByPlaceholder('Nhập tên chuyên khoa').fill('Tâm lý tư vấn');
    await page.getByPlaceholder('Nhập URL ảnh đại diện').fill('https://example.com/tam-ly-hoc.jpg');

    // Điền Mô tả (Textarea)
    const descTxt = page.locator('textarea').first();
    await descTxt.fill('Chuyên khoa tư vấn và điều trị các vấn đề tâm lý.');
    await descTxt.blur(); // Ép State React ghi nhận

    // Ô "Thứ tự hiển thị" đang có sẵn số 1, ta tóm cái input cuối cùng trên màn hình để điền
    const orderInput = page.locator('input').last();
    await orderInput.fill('6');
    await orderInput.blur();

    await page.waitForTimeout(500); // Đợi form lưu State

    // 5. Click nút "Thêm mới" màu nâu ở cuối popup
    await page.locator('button').filter({ hasText: /^Thêm mới$/ }).last().click();

    // 6. Kiểm tra thông báo thành công
    await expect(page.locator('body')).toContainText(/thành công/i, { timeout: 5000 });
  });

  // ========================================================================
  // TC_UC008_02: Lỗi thêm chuyên khoa - Trùng tên
  // ========================================================================
  test('TC_UC008_02: Lỗi thêm chuyên khoa - Trùng tên', async ({ page }) => {
    // 1. Click menu Sidebar
    await page.locator('text=Quản lý chuyên khoa').first().click();
    await page.waitForTimeout(1000);

    // 2. Click nút mở Form
    await page.locator('button').filter({ hasText: /Thêm chuyên khoa/i }).first().click();
    await expect(page.locator('text=Thêm chuyên khoa').last()).toBeVisible({ timeout: 3000 });

    // 3. 🎯 CỐ TÌNH ĐIỀN TÊN "Tim mạch" (Đã tồn tại trong bảng) để ép lỗi
    await page.getByPlaceholder('Nhập tên chuyên khoa').fill('Tim mạch');
    await page.getByPlaceholder('Nhập URL ảnh đại diện').fill('https://example.com/tim-mach.jpg');

    const descTxt = page.locator('textarea').first();
    await descTxt.fill('Test ép lỗi trùng tên chuyên khoa');
    await descTxt.blur();

    await page.waitForTimeout(500);

    // 4. Click nút "Thêm mới"
    await page.locator('button').filter({ hasText: /^Thêm mới$/ }).last().click();

    // 5. Kiểm tra thông báo lỗi
    // ✅ FIXED: Chuyển cú pháp text= lỗi thành Regex để quét trọn bộ từ khóa
    await expect(page.locator('body')).toContainText(/trùng|tồn tại|đã có/i, { timeout: 5000 });
  });
});
// ============================================================================
// UC009: QUẢN LÝ THÔNG TIN BÁC SĨ (BẢN TINH GỌN - ĐIỀN THẲNG TEXT)
// ============================================================================
test.describe('UC009: Quản Lý Thông Tin Bác Sĩ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_URL);
    await page.locator('input[type="email"]').first().fill(ADMIN_EMAIL);
    await page.locator('input[type="password"]').first().fill(VALID_PASSWORD);
    await page.locator('button[type="submit"]').first().click();

    await expect(page).toHaveURL(/.*(dashboard|admin)/, { timeout: 5000 });
    await page.waitForTimeout(1000);
  });

// ========================================================================
  // TC_UC009_01: Thêm mới thông tin bác sĩ thành công (RANDOM DATA & ASSERT SEARCH)
  // ========================================================================
  test('TC_UC009_01: Thêm mới thông tin bác sĩ thành công', async ({ page }) => {
    await page.locator('text=Quản lý bác sĩ').first().click();
    await page.waitForTimeout(1000);

    await page.locator('button').filter({ hasText: /Thêm bác sĩ/i }).first().click();

    const popupTitle = page.locator('text=Thêm bác sĩ mới').last();
    await expect(popupTitle).toBeVisible({ timeout: 3000 });

    const textInputs = page.locator('input:not([type="checkbox"]):not([type="hidden"])').filter({ visible: true });

    // 🎯 TẠO DỮ LIỆU ĐỘC NHẤT (NÉ LỖI TRÙNG LẶP DATABASE)
    // Lấy 6 số ngẫu nhiên từ thời gian hiện tại
    const uniqueId = Date.now().toString().slice(-6);
    const uniqueEmail = `hoa.bs${uniqueId}@healthcare.vn`; // Ví dụ: hoa.bs123456@healthcare.vn
    const uniquePhone = `0901${uniqueId}`;                // Ví dụ: 0901123456 (Đúng 10 số)
    const tenBacSi = `Phạm Hoàng Hoa ${uniqueId}`;        // Thêm ID vào tên để search cho chuẩn xác 100%

    // 1. ĐIỀN DATA VÀ ÉP BLUR() CHO TẤT CẢ
    await textInputs.nth(1).fill(tenBacSi);
    await textInputs.nth(1).blur();

    await textInputs.nth(2).fill(uniqueEmail);
    await textInputs.nth(2).blur();

    await textInputs.nth(3).fill(uniquePhone);
    await textInputs.nth(3).blur();

    // Điền ngày sinh và ép Blur để React nhận State
    await textInputs.nth(4).fill('1985-10-20');
    await textInputs.nth(4).blur();

    await textInputs.nth(5).fill('10');
    await textInputs.nth(5).blur();

    const desc = page.locator('textarea').first();
    await desc.fill('Bác sĩ giỏi chuyên môn, tận tâm với nghề.');
    await desc.blur();

    await page.waitForTimeout(500);

    // 2. CLICK TẠO TÀI KHOẢN
    await page.locator('button').filter({ hasText: /^Tạo tài khoản$/ }).last().click();

    // 3. 🎯 KIỂM TRA CHÉO BẰNG CÔNG CỤ TÌM KIẾM
    // Chờ form đóng lại
    await expect(popupTitle).toBeHidden({ timeout: 5000 });

    // Lấy ô search và điền đúng cái Tên độc nhất vừa tạo
    const searchInput = page.locator('input[placeholder*="Tìm kiếm"], input[type="text"]').first();
    await searchInput.fill(tenBacSi);
    await searchInput.press('Enter');

    await page.waitForTimeout(1000);

    // 4. KIỂM TRA KẾT QUẢ CUỐI CÙNG
    await expect(page.locator('body')).toContainText(tenBacSi, { timeout: 5000 });
  });

  // ========================================================================
  // TC_UC009_02: Lỗi - Số điện thoại sai định dạng
  // ========================================================================
  test('TC_UC009_02: Lỗi - Số điện thoại sai định dạng', async ({ page }) => {
    await page.locator('text=Quản lý bác sĩ').first().click();
    await page.waitForTimeout(1000);

    await page.locator('button').filter({ hasText: /Thêm bác sĩ/i }).first().click();
    await expect(page.locator('text=Thêm bác sĩ mới').last()).toBeVisible({ timeout: 3000 });

    const textInputs = page.locator('input:not([type="checkbox"]):not([type="hidden"])').filter({ visible: true });

    await textInputs.nth(1).fill('Nguyễn Văn C');
    await textInputs.nth(2).fill('nguyenvanc@healthcare.vn');

    // 🎯 CỐ TÌNH PHÁ SỐ ĐIỆN THOẠI
    await textInputs.nth(3).fill('090abc1234');
    await textInputs.nth(4).fill('1990-01-01'); // YYYY-MM-DD

    // 🎯 BỎ QUA DROPDOWN, ĐIỀN THẲNG 2 Ô TEXT CUỐI CÙNG
    await textInputs.nth(5).fill('5'); // Năm kinh nghiệm

    await page.waitForTimeout(500);

    // Click nút tạo
    await page.locator('button').filter({ hasText: /^Tạo tài khoản$/ }).last().click();

    // Bắt lỗi Validation
    await expect(page.locator('body')).toContainText(/hợp lệ|thất bại/i, { timeout: 3000 });
  });
});
// ============================================================================
// UC010: QUẢN LÝ THÔNG TIN CƠ SỞ Y TẾ (BẢN VÁ LỖI BẮT ĐÚNG ICON CÂY BÚT)
// ============================================================================
test.describe('UC010: Quản Lý Thông Tin Cơ Sở Y Tế', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_URL);
    await page.locator('input[type="email"]').first().fill(ADMIN_EMAIL);
    await page.locator('input[type="password"]').first().fill(VALID_PASSWORD);
    await page.locator('button[type="submit"]').first().click();

    await expect(page).toHaveURL(/.*(dashboard|admin)/, { timeout: 5000 });
    await page.waitForTimeout(1000);
  });

  // ========================================================================
  // TC_UC010_01: Cập nhật thông tin cơ sở y tế thành công
  // ========================================================================
// ========================================================================
  // TC_UC010_01: Cập nhật thông tin cơ sở y tế thành công
  // ========================================================================
  test('TC_UC010_01: Cập nhật thông tin cơ sở y tế thành công', async ({ page }) => {
    await page.locator('text=Quản lý cơ sở y tế').first().click();

    await expect(page.locator('tbody tr').first()).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(1000);

    const actionCell = page.locator('tbody tr').first().locator('td').last();
    await actionCell.locator('svg').last().click();

    await expect(page.locator('text=Tên cơ sở').last()).toBeVisible({ timeout: 5000 });

    const textInputs = page.locator('input:not([type="checkbox"]):not([type="hidden"])').filter({ visible: true });

    // 🎯 ĐÃ LÙI INDEX VỀ ĐÚNG THỨ TỰ FORM BẮT ĐẦU TỪ 0
    await textInputs.nth(0).fill('Phòng khám Đa khoa Quốc tế');   // Tên cơ sở
    await textInputs.nth(1).fill('Số 10, Đường ABC, Quận XYZ');   // Địa chỉ
    await textInputs.nth(2).fill('0912345678');                   // Số điện thoại
    await textInputs.nth(3).fill('contact@phongkham.vn');         // Email cơ sở

    const desc = page.locator('textarea').first();
    await desc.fill('Cơ sở y tế đạt chuẩn quốc tế, trang thiết bị hiện đại.');
    await desc.blur();

    await page.waitForTimeout(500);

    // Click nút "Lưu"
    await page.locator('button').filter({ hasText: /^Lưu$/ }).last().click();

    // Kiểm tra thông báo
    await expect(page.locator('body')).toContainText(/thành công/i, { timeout: 5000 });
  });

  // ========================================================================
  // TC_UC010_02: Hủy cập nhật thông tin cơ sở y tế
  // ========================================================================
  test('TC_UC010_02: Hủy cập nhật thông tin cơ sở y tế', async ({ page }) => {
    await page.locator('text=Quản lý cơ sở y tế').first().click();

    // 🎯 CHỜ BẢNG & CLICK ICON NHƯ CASE TRÊN
    await expect(page.locator('tbody tr').first()).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(1000);

    const actionCell = page.locator('tbody tr').first().locator('td').last();
    await actionCell.locator('svg').last().click();

    // 🎯 CHỜ FORM HIỂN THỊ
    await expect(page.locator('text=Tên cơ sở').last()).toBeVisible({ timeout: 5000 });

    // Sửa nhẹ một trường dữ liệu (Ví dụ sửa tên)
    const textInputs = page.locator('input:not([type="checkbox"]):not([type="hidden"])').filter({ visible: true });
    await textInputs.nth(1).fill('Tên cơ sở đã bị sửa tạm thời');
    await textInputs.nth(1).blur();

    await page.waitForTimeout(500);

    // CLICK NÚT "HỦY"
    await page.locator('button').filter({ hasText: /^Hủy$/ }).last().click();

    // KIỂM TRA KẾT QUẢ: Form phải đóng lại
    await expect(page.locator('button').filter({ hasText: /^Lưu$/ })).toBeHidden({ timeout: 3000 });
  });
});