# BÁO CÁO TỔNG HỢP ĐẶC TẢ USE CASE VÀ THIẾT KẾ KỊCH BẢN KIỂM THỬ (TEST SPECIFICATION)
## DỰ ÁN: WEBSITE ĐẶT LỊCH KHÁM TRỰC TUYẾN HEALTHCARE

---

## 📑 MỤC LỤC
1. [HƯỚNG DẪN CHIẾN LƯỢC KIỂM THỬ (TESTING STRATEGY)](#1-hướng-dẫn-chiến-lược-kiểm-thử-testing-strategy)
2. [DANH SÁCH 10 USE CASE CHI TIẾT VÀ KỊCH BẢN KIỂM THỬ](#2-danh-sách-10-use-case-chi-tiết-vài-kịch-bản-kiểm-thử)
   - [UC001: Đăng Ký](#uc001-đăng-ký)
   - [UC002: Đặt Lịch Khám](#uc002-đặt-lịch-khám)
   - [UC003: Xem Danh Sách Lịch Đã Đặt](#uc003-xem-danh-sách-lịch-đã-đặt)
   - [UC004: Xem Chi Tiết Thông Tin Bác Sĩ](#uc004-xem-chi-tiết-thông-tin-bác-sĩ)
   - [UC005: Xác Nhận Lịch Khám](#uc005-xác-nhận-lịch-khám)
   - [UC006: Xác Nhận Hoàn Thành Ca Khám](#uc006-xác-nhận-hoàn-thành-ca-khám)
   - [UC007: Đăng Ký Lịch Nghỉ](#uc007-đăng-ký-lịch-nghỉ)
   - [UC008: Quản Lý Thông Tin Chuyên Khoa](#uc008-quản-lý-thông-tin-chuyên-khoa)
   - [UC009: Quản Lý Thông Tin Bác Sĩ](#uc009-quản-lý-thông-tin-bác-sĩ)
   - [UC010: Quản Lý Thông Tin Cơ Sở Y Tế](#uc010-quản-lý-thông-tin-cơ-sở-y-tế)

---

## 1. HƯỚNG DẪN CHIẾN LƯỢC KIỂM THỬ (TESTING STRATEGY)

Tài liệu này tổng hợp toàn bộ 10 Use Case từ tài liệu đặc tả hệ thống phục vụ cho quá trình thiết kế **Kịch bản kiểm thử chức năng (Functional Test Cases)** và viết **Kiểm thử đơn vị (Unit Test)** trên Backend (Spring Boot / JUnit 5 / Mockito) cũng như Frontend (Vite / React / Vitest / Jest).

### 🛠️ Nguyên tắc ánh xạ từ Đặc tả sang Kiểm thử:
1. **Kiểm thử Chức năng (E2E / Integration Test):** Mỗi bước trong **Luồng sự kiện chính** và các nhánh rẽ trong **Luồng sự kiện thay thế** bắt buộc phải có ít nhất một Test Case tương ứng.
2. **Kiểm thử Đơn vị (Unit Test - Backend):** Tập trung vào lớp Service (`@Service`) và Controller (`@RestController`). 
   - Sử dụng **Mockito** để mock dữ liệu tầng Repository (`@Repository`).
   - Sử dụng các kỹ thuật phân hoạch tương đương (Equivalence Partitioning) và phân tích giá trị biên (Boundary Value Analysis) đối với các trường thông tin dữ liệu đầu vào.
   - Kiểm tra việc ném ra các Ngoại lệ (Exceptions) phù hợp (Ví dụ: `UnauthorizedException`, `ResourceNotFoundException`, `BadRequestException`) tương ứng với luồng lỗi trong tài liệu đặc tả.

---

## 2. DANH SÁCH 10 USE CASE CHI TIẾT VÀ KỊCH BẢN KIỂM THỬ

### UC001: ĐĂNG KÝ

#### 1. Thông tin chung
* **Mã Use Case:** 001
* **Tên Use Case:** Đăng ký
* **Tác nhân:** Người dùng
* **Mô tả:** Tác nhân người dùng sử dụng chức năng này vào việc đăng ký tài khoản mới.
* **Sự kiện kích hoạt:** Người dùng kích chuột vào ô “Đăng ký”.
* **Tiền điều kiện:** Người dùng chưa có tài khoản trên hệ thống.
* **Hậu điều kiện:** Tài khoản mới được tạo thành công và lưu vào CSDL với trạng thái kích hoạt.

#### 2. Luồng sự kiện chính
| # | Thực hiện bởi | Hành động |
|---|---|---|
| 1 | Người dùng | Kích vào ô “Đăng ký” trong hệ thống |
| 2 | Hệ thống | Hiển thị form đăng ký lên và sau đó yêu cầu người dùng nhập họ tên, giới tính, email, mật khẩu, số điện thoại, địa chỉ, ngày sinh và mật khẩu. |
| 3 | Người dùng | Nhập họ tên, giới tính, email, mật khẩu, số điện thoại, địa chỉ, ngày sinh của mình và sau đó kích vào nút “Đăng ký”. |
| 4 | Hệ thống | Kiểm tra email có trùng với tài khoản khác trong bảng `NguoiDung`. Nếu không gửi mã code xác thực email đến email người dùng. |
| 5 | Người dùng | Người nhập mã code được gửi từ hệ thống để xác thực email. |
| 6 | Hệ thống | Kiểm tra thông tin nếu hợp lệ thì tạo tài khoản mới và lưu vào bảng `NguoiDung` và hiển thị lên màn hình. |

#### 3. Luồng sự kiện thay thế / ngoại lệ
| # | Thực hiện bởi | Hành động |
|---|---|---|
| 3a | Người dùng | Nhập email đã tồn tại trên hệ thống. |
| 3b | Hệ thống | Hiển thị thông báo lỗi yêu cầu email khác. |
| 5a | Người dùng | Nhập sai mã xác nhận email. |
| 5b | Hệ thống | Hiển thị thông báo lỗi yêu cầu nhập đúng. |
| 6a | Hệ thống | Hiển thị thông báo lỗi yêu cầu nhập lại nếu có trường không hợp lệ. |
| 6b | Hệ thống | Tại bất kỳ thời điểm nào trong quá trình thực hiện use case, nếu không kết nối được với CSDL thì hệ thống sẽ thông báo lỗi. |

#### 4. Kịch bản kiểm thử đề xuất (Test Cases)
* **TC_UC001_01:** Đăng ký tài khoản thành công với thông tin hợp lệ và mã OTP chính xác.
* **TC_UC001_02:** Đăng ký thất bại do Email đã tồn tại trong hệ thống (Luồng 3a-3b).
* **TC_UC001_03:** Đăng ký thất bại do nhập sai mã OTP xác thực email (Luồng 5a-5b).
* **TC_UC001_04:** Đăng ký thất bại khi để trống các trường bắt buộc (Họ tên, Email, Mật khẩu).
* **TC_UC001_05:** Đăng ký thất bại do lỗi mất kết nối CSDL đột ngột (Luồng 6b).

#### 5. Định hướng Unit Test (Backend JUnit)
* **Target Method:** `AuthService.register(RegisterDto dto)`
* **Test Case 1 (`testRegister_Success`):** Mock `NguoiDungRepository.existsByEmail(email) -> false`. Kiểm tra hàm trả về thành công hoặc mã xác thực được lưu đúng.
* **Test Case 2 (`testRegister_DuplicateEmail`):** Mock `NguoiDungRepository.existsByEmail(email) -> true`. Đoán nhận việc ném ra ngoại lệ `BadRequestException` hoặc `EmailAlreadyExistsException`.
* **Test Case 3 (`testVerifyEmail_WrongOtp`):** Gọi hàm verify với OTP sai, kiểm tra ném ra `UnauthorizedException`.

---

### UC002: ĐẶT LỊCH KHÁM

#### 1. Thông tin chung
* **Mã Use Case:** 002
* **Tên Use Case:** Đặt lịch khám
* **Tác nhân:** Người dùng
* **Mô tả:** Người dùng sử dụng chức năng này để đặt lịch khám với bác sĩ mong muốn. Hệ thống sẽ kiểm tra lịch làm việc của bác sĩ, kiểm tra thời gian trống và tạo một lịch khám mới nếu hợp lệ.
* **Sự kiện kích hoạt:** Người dùng chọn chức năng “Đặt lịch khám” trong hệ thống.
* **Tiền điều kiện:** Người dùng đã đăng nhập vào hệ thống và bác sĩ phải có lịch làm việc.
* **Hậu điều kiện:** Tạo một bản ghi đặt lịch khám mới ở trạng thái "Chờ xác nhận".

#### 2. Luồng sự kiện chính
| # | Thực hiện bởi | Hành động |
|---|---|---|
| 1 | Người dùng | Chọn chức năng “Đặt lịch khám”. |
| 2 | Hệ thống | Truy vấn bảng `ChuyenKhoa` và hiển thị danh sách các chuyên khoa. |
| 3 | Người dùng | Chọn một chuyên khoa. |
| 4 | Hệ thống | Truy vấn bảng `BacSi` và hiển thị danh sách bác sĩ thuộc chuyên khoa đã chọn. |
| 5 | Người dùng | Chọn bác sĩ muốn đặt khám. |
| 6 | Hệ thống | Truy vấn bảng `LichLamViec` lấy lịch làm việc của bác sĩ đã chọn. |
| 7 | Người dùng | Chọn ngày và giờ khám mong muốn. |
| 8 | Hệ thống | Kiểm tra lịch trống, kiểm tra bác sĩ có nghỉ hay không, kiểm tra trùng lịch. |
| 9 | Người dùng | Nhập lý do khám và xác nhận đặt lịch khám. |
| 10 | Người dùng | Chọn phương thức thanh toán “Tiền mặt” hoặc “VNPay”. |
| 11 | Hệ thống | Tạo bản ghi mới trong bảng `DatLichKham`, đặt trạng thái lịch là “Chờ xác nhận”. |
| 12 | Hệ thống | Thông báo đặt lịch thành công lên màn hình và tự động chuyển hướng về trang chủ. |

#### 3. Luồng sự kiện thay thế / ngoại lệ
| # | Thực hiện bởi | Hành động |
|---|---|---|
| 2a | Hệ thống | Không tìm thấy chuyên khoa trong bảng `ChuyenKhoa`. |
| 2b | Hệ thống | Hiển thị thông báo “Hiện chưa có chuyên khoa”. |
| 4a | Hệ thống | Không tìm thấy bác sĩ thuộc chuyên khoa đã chọn. |
| 4b | Hệ thống | Thông báo “Chuyên khoa hiện chưa có bác sĩ”. |
| 6a | Hệ thống | Không có dữ liệu lịch làm việc trong bảng `LichLamViec`. |
| 6b | Hệ thống | Thông báo “Bác sĩ chưa có lịch làm việc”. |
| 9a | Người dùng | Không nhập lý do khám. |
| 9b | Hệ thống | Hiển thị lỗi và yêu cầu nhập lý do khám. |
| 12a | Hệ thống | Nếu không kết nối được CSDL tại bất kỳ bước nào → hiển thị lỗi và không tạo lịch. |

#### 4. Kịch bản kiểm thử đề xuất (Test Cases)
* **TC_UC002_01:** Đặt lịch khám thành công với đầy đủ thông tin hợp lệ, chọn thanh toán Tiền mặt.
* **TC_UC002_02:** Hiển thị đúng thông báo lỗi khi hệ thống chưa có dữ liệu chuyên khoa (Luồng 2a-2b).
* **TC_UC002_03:** Hiển thị đúng thông báo khi một chuyên khoa trống không có bác sĩ (Luồng 4a-4b).
* **TC_UC002_04:** Đặt lịch thất bại do bác sĩ không có lịch làm việc trong khung giờ/ngày đã chọn (Luồng 6a-6b).
* **TC_UC002_05:** Đặt lịch thất bại khi người dùng bỏ trống trường lý do khám (Luồng 9a-9b).
* **TC_UC002_06:** Đặt lịch thất bại/Báo lỗi khi chọn khung giờ trùng lịch hẹn đã được người khác đặt trước.

#### 5. Định hướng Unit Test (Backend JUnit)
* **Target Method:** `BookingService.createBooking(BookingRequestDto dto, Long userId)`
* **Test Case 1 (`testCreateBooking_Success`):** Mock các bước kiểm tra lịch trống đều hợp lệ. Kết quả mong đợi phương thức `save()` của `DatLichKhamRepository` được gọi và trả về bản ghi có trạng thái bằng `CHO_XAC_NHAN` (hoặc chuỗi/số tương ứng).
* **Test Case 2 (`testCreateBooking_MissingReason`):** Truyền lý do trống, kiểm tra xem tầng Validation hoặc Service có ném ra lỗi yêu cầu nhập không.
* **Test Case 3 (`testCreateBooking_DoctorNoSchedule`):** Mock `LichLamViecRepository.findByDoctorId` trả về danh sách rỗng, xác thực hàm ném lỗi thích hợp.

---

### UC003: XEM DANH SÁCH LỊCH ĐÃ ĐẶT

#### 1. Thông tin chung
* **Mã Use Case:** 003
* **Tên Use Case:** Xem danh sách lịch đã đặt
* **Tác nhân:** Người dùng
* **Mô tả:** Người dùng muốn xem danh sách các lịch khám đã đặt để theo dõi và quản lý lịch hẹn của mình.
* **Sự kiện kích hoạt:** Người dùng kích chuột vào ô “Lịch hẹn”.
* **Tiền điều kiện:** Người dùng đã có tài khoản trên hệ thống và truy cập vào giao diện quản lý lịch khám cá nhân.
* **Hậu điều kiện:** Hiển thị thông tin danh sách toàn bộ lịch hẹn của người dùng.

#### 2. Luồng sự kiện chính
| # | Thực hiện bởi | Hành động |
|---|---|---|
| 1 | Người dùng | Kích vào ô “Lịch hẹn” trong hệ thống |
| 2 | Hệ thống | Truy vấn dữ liệu trong bảng `DatLichKham` và hiển thị ra màn hình các lịch hẹn gồm các thông tin: mã xác nhận lịch, ngày khám, giờ khám, họ tên bác sĩ, tên chuyên khoa, tên trình độ, họ tên bệnh nhân, số điện thoại, giá khám, trạng thái lịch... |

#### 3. Luồng sự kiện thay thế / ngoại lệ
| # | Thực hiện bởi | Hành động |
|---|---|---|
| 2a | Hệ thống | Tại bất kỳ thời điểm nào trong quá trình thực hiện use case, nếu không kết nối được với CSDL thì hệ thống sẽ thông báo lỗi. |

#### 4. Kịch bản kiểm thử đề xuất (Test Cases)
* **TC_UC003_01:** Hiển thị danh sách đầy đủ, chính xác các lịch hẹn của người dùng (nếu có dữ liệu).
* **TC_UC003_02:** Hiển thị màn hình trống hoặc thông báo "Chưa có lịch hẹn nào" nếu người dùng mới tinh chưa từng đặt khám.
* **TC_UC003_03:** Kiểm thử giao diện hiển thị đúng định dạng trạng thái (Ví dụ: Chờ xác nhận, Đã xác nhận, Đã hủy, Hoàn thành).

#### 5. Định hướng Unit Test (Backend JUnit)
* **Target Method:** `BookingService.getBookingsByUser(Long userId)`
* **Test Case 1:** Người dùng có lịch hẹn $ightarrow$ Mock Repository trả về danh sách phần tử, assert kích thước mảng > 0.
* **Test Case 2:** Người dùng không có lịch hẹn $ightarrow$ Mock Repository trả về mảng trống, assert danh sách trả về rỗng không lỗi.

---

### UC004: XEM CHI TIẾT THÔNG TIN BÁC SĨ

#### 1. Thông tin chung
* **Mã Use Case:** 004
* **Tên Use Case:** Xem chi tiết thông tin bác sĩ
* **Tác nhân:** Người dùng
* **Mô tả:** Người dùng muốn xem thông tin chi tiết bác sĩ để biết bác sĩ có khung giờ khám phù hợp với bản thân.
* **Sự kiện kích hoạt:** Người dùng chọn một bác sĩ bất kỳ ở trang chủ hoặc xem danh sách bác sĩ theo chuyên khoa và chọn một bác sĩ.
* **Tiền điều kiện:** Không có.
* **Hậu điều kiện:** Giao diện chi tiết thông tin bác sĩ hiển thị đầy đủ.

#### 2. Luồng sự kiện chính
| # | Thực hiện bởi | Hành động |
|---|---|---|
| 1 | Người dùng | Chọn vào một bác sĩ bất kỳ. |
| 2 | Hệ thống | Truy vấn lấy dữ liệu từ các bảng `BacSi`, `LichLamViecMacDinh`, `BacSiNgayNghi` và hiện ra giao diện với đầy đủ thông tin gồm: họ tên, chuyên khoa, trình độ, lịch làm việc, giới thiệu chung, địa chỉ làm việc. |

#### 3. Luồng sự kiện thay thế / ngoại lệ
| # | Thực hiện bởi | Hành động |
|---|---|---|
| 2a | Hệ thống | Tại bất kỳ thời điểm nào trong quá trình thực hiện use case, nếu không kết nối được với CSDL thì hệ thống sẽ thông báo lỗi. |

#### 4. Kịch bản kiểm thử đề xuất (Test Cases)
* **TC_UC004_01:** Xem chi tiết một bác sĩ tồn tại hợp lệ, kiểm tra hiển thị đúng các khung giờ làm việc và ngày nghỉ.
* **TC_UC004_02:** Báo lỗi 404 (Không tìm thấy tài nguyên) nếu cố tình nhập một mã bác sĩ không tồn tại lên URL thanh địa chỉ.

#### 5. Định hướng Unit Test (Backend JUnit)
* **Target Method:** `DoctorService.getDoctorDetail(Long doctorId)`
* **Test Case 1:** Tìm thấy bác sĩ $ightarrow$ Mock Repository trả về Object thực thể, kiểm tra các trường Dto map chính xác.
* **Test Case 2:** Không tìm thấy bác sĩ $ightarrow$ Mock Repository trả về `Optional.empty()`, assert ném lỗi `ResourceNotFoundException`.

---

### UC005: XÁC NHẬN LỊCH KHÁM

#### 1. Thông tin chung
* **Mã Use Case:** 005
* **Tên Use Case:** Xác nhận lịch khám
* **Tác nhân:** Bác sĩ
* **Mô tả:** Bác sĩ xác nhận lịch đặt khám của bệnh nhân để hệ thống gửi email xác nhận đến bệnh nhân.
* **Sự kiện kích hoạt:** Bác sĩ nhấn nút “Xác nhận” trên lịch đặt khám của bệnh nhân.
* **Tiền điều kiện:** Bác sĩ đã đăng nhập vào hệ thống với tài khoản vai trò là bác sĩ và đang ở trang danh sách lịch chờ.
* **Hậu điều kiện:** Trạng thái lịch khám chuyển thành “Đã xác nhận”, hệ thống kích hoạt tiến trình gửi email.

#### 2. Luồng sự kiện chính
| # | Thực hiện bởi | Hành động |
|---|---|---|
| 1 | Bác sĩ | Chọn vào giao diện danh sách lịch chờ. |
| 2 | Hệ thống | Truy vấn lấy dữ liệu từ bảng `DatLichKham` để hiển thị danh sách lịch của bệnh nhân chờ xác nhận. |
| 3 | Bác sĩ | Nhấn vào nút xác nhận trên 1 lịch đặt khám của bệnh nhân. |
| 4 | Hệ thống | Hiển thị thông báo xác nhận thành công và chuyển trạng thái của lịch sang “Đã xác nhận”. |

#### 3. Luồng sự kiện thay thế / ngoại lệ
| # | Thực hiện bởi | Hành động |
|---|---|---|
| 2a | Hệ thống | Không có dữ liệu trong bảng `DatLichKham`. |
| 2b | Hệ thống | Thông báo “Hôm nay chưa có lịch đặt nào”. |
| 3a | Bác sĩ | Nhấn nút từ chối trên 1 lịch đặt khám của bệnh nhân. |
| 3b | Hệ thống | Hiển thị thông báo từ chối thành công và chuyển trạng thái lịch thành “Từ chối”. |
| 4a | Hệ thống | Tại bất kỳ thời điểm nào trong quá trình thực hiện use case, nếu không kết nối được với CSDL thì hệ thống sẽ thông báo lỗi. |

#### 4. Kịch bản kiểm thử đề xuất (Test Cases)
* **TC_UC005_01:** Bác sĩ duyệt lịch hẹn hợp lệ $ightarrow$ Trạng thái cập nhật thành công (Luồng chính).
* **TC_UC005_02:** Giao diện hiển thị đúng dòng chữ báo trống khi bác sĩ không có lịch hẹn nào đang chờ (Luồng 2a-2b).
* **TC_UC005_03:** Bác sĩ thực hiện hành động "Từ chối" lịch khám $ightarrow$ Cập nhật trạng thái thành "Từ chối" thành công (Luồng 3a-3b).

#### 5. Định hướng Unit Test (Backend JUnit)
* **Target Method:** `DoctorService.updateBookingStatus(Long bookingId, String status)`
* **Test Case 1 (`testApproveBooking`):** Chuyển trạng thái sang `DA_XAC_NHAN`. Xác thực trường trạng thái lưu xuống DB thay đổi thành công.
* **Test Case 2 (`testRejectBooking`):** Chuyển trạng thái sang `TU_CHOI`. Xác thực nghiệp vụ hợp lệ và kiểm tra tích hợp hàm gửi email từ chối.

---

### UC006: XÁC NHẬN HOÀN THÀNH CA KHÁM

#### 1. Thông tin chung
* **Mã Use Case:** 006
* **Tên Use Case:** Xác nhận hoàn thành ca khám
* **Tác nhân:** Bác sĩ
* **Mô tả:** Sau khi hoàn thành ca khám bác sĩ xác nhận hoàn thành ca khám trên hệ thống.
* **Sự kiện kích hoạt:** Bác sĩ ấn nút “Hoàn thành” trên một lịch đặt khám của bệnh nhân.
* **Tiền điều kiện:** Bác sĩ đã đăng nhập vào hệ thống với tài khoản có vai trò là bác sĩ và truy cập vào giao diện danh sách lịch hẹn.
* **Hậu điều kiện:** Trạng thái lịch khám chuyển thành hoàn thành, thông tin hồ sơ bệnh án được lưu trữ.

#### 2. Luồng sự kiện chính
| # | Thực hiện bởi | Hành động |
|---|---|---|
| 1 | Bác sĩ | Nhấn vào nút “Check-in” để xác nhận bắt đầu ca khám. |
| 2 | Hệ thống | Truy vấn vào bảng `DatLichKham` lấy dữ liệu để kiểm tra thời gian check-in có trùng khớp với thời gian bắt đầu ca khám trên lịch đặt. |
| 3 | Bác sĩ | Sau khi hoàn thành việc khám, bác sĩ nhấn nút “Hoàn thành”. |
| 4 | Hệ thống | Hiển thị ra form yêu cầu bác sĩ điền đầy đủ các trường gồm: chẩn đoán, kết quả khám, đơn thuốc, lời dặn, ngày tái khám. |
| 5 | Bác sĩ | Nhấn nút “Xác nhận” ở form. |
| 6 | Hệ thống | Hiển thị thông báo hoàn thành ca khám thành công và chuyển trạng thái lịch khám sang hoàn thành. |

#### 3. Luồng sự kiện thay thế / ngoại lệ
| # | Thực hiện bởi | Hành động |
|---|---|---|
| 2a | Hệ thống | Thời gian check-in không trùng khớp với thời gian bắt đầu ca khám trên lịch. |
| 2b | Hệ thống | Thông báo “Check-in phải đúng với giờ bắt đầu ca khám”. |
| 4a | Bác sĩ | Không nhập đủ các trường bắt buộc trên form xác nhận hoàn thành. |
| 4b | Hệ thống | Hiển thị thông báo lỗi và yêu cầu nhập đầy đủ thông tin. |
| 6a | Hệ thống | Tại bất kỳ thời điểm nào trong quá trình thực hiện use case, nếu không kết nối được với CSDL thì hệ thống sẽ thông báo lỗi. |

#### 4. Kịch bản kiểm thử đề xuất (Test Cases)
* **TC_UC006_01:** Thực hiện quy trình Check-in đúng giờ, nhập form kết quả khám đầy đủ và xác nhận hoàn thành thành công.
* **TC_UC006_02:** Lỗi Check-in thất bại do sai thời gian quy định của ca khám (Luồng 2a-2b).
* **TC_UC006_03:** Lỗi không cho phép nhấn hoàn thành do form thông tin chẩn đoán, đơn thuốc bị bỏ trống (Luồng 4a-4b).

#### 5. Định hướng Unit Test (Backend JUnit)
* **Target Method:** `DoctorService.completeMedicalExamination(MedicalResultDto resultDto)`
* **Test Case 1:** Thực hiện lưu bệnh án thành công, assert trạng thái lịch đổi sang `HOAN_THANH`.
* **Test Case 2:** Dữ liệu chẩn đoán bị `null` hoặc rỗng, assert phương thức trả về mã lỗi 400 Bad Request (hoặc ném ngoại lệ tương ứng).

---

### UC007: ĐĂNG KÝ LỊCH NGHỈ

#### 1. Thông tin chung
* **Mã Use Case:** 007
* **Tên Use Case:** Đăng ký lịch nghỉ
* **Tác nhân:** Bác sĩ
* **Mô tả:** Bác sĩ có lý do cá nhân nên muốn đăng ký lịch nghỉ để nghỉ việc trong một thời gian nhất định.
* **Sự kiện kích hoạt:** Bác sĩ nhấn nút “Tạo yêu cầu nghỉ” trên giao diện đăng ký lịch nghỉ.
* **Tiền điều kiện:** Bác sĩ đã đăng nhập vào hệ thống với tài khoản vai trò bác sĩ và truy cập vào giao diện đăng ký lịch nghỉ.
* **Hậu điều kiện:** Tạo một lịch nghỉ mới được ghi nhận vào bảng hệ thống lưu trữ ngày nghỉ bác sĩ.

#### 2. Luồng sự kiện chính
| # | Thực hiện bởi | Hành động |
|---|---|---|
| 1 | Bác sĩ | Nhấn vào nút “Tạo yêu cầu nghỉ” trên thanh toolbar. |
| 2 | Hệ thống | Hiển thị ra form tạo yêu cầu nghỉ gồm các trường: ngày nghỉ, lý do, loại nghỉ, file xin nghỉ đính kèm, mô tả thời gian nghỉ. |
| 3 | Bác sĩ | Nhập đầy đủ thông tin vào các trường trong form và nhấn nút “Tạo”. |
| 4 | Hệ thống | Kiểm tra thông tin nếu hợp lệ thì tạo lịch nghỉ và lưu vào bảng `BacSiNgayNghi`. |

#### 3. Luồng sự kiện thay thế / ngoại lệ
| # | Thực hiện bởi | Hành động |
|---|---|---|
| 3a | Bác sĩ | Không nhập đầy đủ hoặc sai định dạng các trường trong form tạo yêu cầu nghỉ. |
| 3b | Hệ thống | Thông báo lỗi và yêu cầu bác sĩ nhập đầy đủ thông tin và đúng định dạng vào form. |
| 3c | Bác sĩ | Đã nhập đầy đủ thông tin nhưng nhấn nút “Hủy”. |
| 3d | Hệ thống | Ẩn form tạo yêu cầu nghỉ trở về giao diện đăng ký lịch nghỉ. |
| 4a | Hệ thống | Tại bất kỳ thời điểm nào trong quá trình thực hiện use case, nếu không kết nối được với CSDL thì hệ thống sẽ thông báo lỗi. |

#### 4. Kịch bản kiểm thử đề xuất (Test Cases)
* **TC_UC007_01:** Tạo yêu cầu đăng ký lịch nghỉ thành công với lý do hợp lệ.
* **TC_UC007_02:** Báo lỗi form khi bỏ trống trường "Ngày nghỉ" hoặc "Lý do nghỉ" (Luồng 3a-3b).
* **TC_UC007_03:** Kiểm tra chức năng hủy bỏ thao tác khi nhấn nút "Hủy" trên form (Luồng 3c-3d).

#### 5. Định hướng Unit Test (Backend JUnit)
* **Target Method:** `DoctorService.requestLeave(LeaveRequestDto dto)`
* **Test Case 1:** Ngày nghỉ hợp lệ (trong tương lai) $ightarrow$ Bản ghi được chèn thành công vào bảng `BacSiNgayNghi`.
* **Test Case 2:** Ngày nghỉ không hợp lệ (ngày trong quá khứ) $ightarrow$ Assert ngoại lệ `IllegalArgumentException` bị kích hoạt.

---

### UC008: QUẢN LÝ THÔNG TIN CHUYÊN KHOA

#### 1. Thông tin chung
* **Mã Use Case:** 008
* **Tên Use Case:** Quản lý thông tin chuyên khoa
* **Tác nhân:** Quản trị viên (Admin)
* **Mô tả:** Quản trị viên thực hiện xem danh sách, tìm kiếm, thêm mới, sửa hoặc xóa thông tin chuyên khoa trong hệ thống.
* **Sự kiện kích hoạt:** Quản trị viên chọn menu "Quản lý chuyên khoa" trên thanh điều hướng bên trái.
* **Tiền điều kiện:** Quản trị viên đã đăng nhập thành công vào hệ thống trang quản trị (Admin Dashboard).
* **Hậu điều kiện:** Dữ liệu chuyên khoa được cập nhật chính xác vào CSDL theo hành động thêm/sửa/xóa.

#### 2. Luồng sự kiện chính
| # | Thực hiện bởi | Hành động |
|---|---|---|
| 1 | Quản trị viên | Nhấn chọn mục "Quản lý chuyên khoa" trên menu. |
| 2 | Hệ thống | Truy vấn cơ sở dữ liệu từ bảng `ChuyenKhoa` để lấy danh sách các chuyên khoa hiện có. Hiển thị danh sách dưới dạng bảng kèm thanh tìm kiếm. |
| 3 | Quản trị viên | Nhập từ khóa vào ô "Tìm kiếm...". |
| 4 | Hệ thống | Lọc dữ liệu theo `TenChuyenKhoa` gần đúng và hiển thị danh sách kết quả tương ứng. |
| 5 | Quản trị viên | Nhấn nút "Thêm chuyên khoa". |
| 6 | Hệ thống | Hiển thị Popup/Modal nhập liệu gồm: Tên chuyên khoa, Mô tả, Cơ sở y tế. |
| 7 | Quản trị viên | Nhập thông tin và chọn nút “Thêm mới”. |
| 8 | Hệ thống | Truy vấn cơ sở dữ liệu, nếu hợp lệ hiển thị thông báo thành công và cập nhật danh sách mới. |
| 9 | Quản trị viên | Nhấn vào icon "Xem chi tiết chuyên khoa". |
| 10 | Hệ thống | Hiển thị Popup chứa đầy đủ thông tin: Mã chuyên khoa, Tên chuyên khoa, Mô tả, Tên cơ sở y tế... |
| 11 | Quản trị viên | Nhấn vào biểu tượng "Sửa" (hình bút chì) trên dòng chuyên khoa cần thay đổi. |
| 12 | Hệ thống | Truy vấn dữ liệu hiện tại, hiển thị Popup "Sửa thông tin chuyên khoa" điền sẵn dữ liệu cũ. |
| 13 | Quản trị viên | Thay đổi các thông tin cần thiết và nhấn nút "Cập nhật". |
| 14 | Hệ thống | Kiểm tra dữ liệu mới, cập nhật vào bảng `ChuyenKhoa`, thông báo thành công và làm mới danh sách. |
| 15 | Quản trị viên | Nhấn vào biểu tượng "Xóa" (hình thùng rác) trên dòng chuyên khoa muốn xóa. |
| 16 | Hệ thống | Kiểm tra ràng buộc dữ liệu: Truy vấn bảng `BacSi` xem có bác sĩ nào thuộc `ChuyenKhoaID` này không. Hiển thị Popup xác nhận xóa. |
| 17 | Quản trị viên | Nhấn nút "Xóa" trên Popup xác nhận. |
| 18 | Hệ thống | Hiển thị thông báo "Xóa thành công" và loại bỏ dòng đó khỏi danh sách hiển thị. |

#### 3. Luồng sự kiện thay thế / ngoại lệ
| # | Thực hiện bởi | Hành động |
|---|---|---|
| 2a | Hệ thống | Không tìm thấy dữ liệu chuyên khoa nào trong bảng `ChuyenKhoa`. |
| 8a | Quản trị viên | Tên chuyên khoa bị để trống hoặc trùng lặp tên đã có. |
| 8b | Hệ thống | Hiển thị thông báo lỗi "Tên chuyên khoa không hợp lệ hoặc đã tồn tại" trên Popup. |
| 13a | Quản trị viên | Nhập thông tin chỉnh sửa không hợp lệ. |
| 13b | Hệ thống | Hiển thị thông báo lỗi ngay trên form sửa. |
| 17a | Quản trị viên | Nhấn nút “Hủy” trên popup xác nhận xóa. |
| 17b | Hệ thống | Thoát popup về màn hình chính, không thực hiện hành động xóa. |
| 18a | Hệ thống | Tại bất kỳ thời điểm nào trong quá trình thực hiện use case, nếu không kết nối được với CSDL thì hệ thống sẽ thông báo lỗi. |

#### 4. Kịch bản kiểm thử đề xuất (Test Cases)
* **TC_UC008_01:** Thêm mới một chuyên khoa với thông tin tên chuyên khoa độc nhất $ightarrow$ Lưu thành công.
* **TC_UC008_02:** Lỗi thêm mới khi nhập trùng tên chuyên khoa đã tồn tại trong hệ thống (Luồng 8a-8b).
* **TC_UC008_03:** Tìm kiếm chuyên khoa theo từ khóa gần đúng hoạt động chính xác (Luồng 3-4).
* **TC_UC008_04:** Sửa thông tin chuyên khoa thành công và hiển thị dữ liệu mới (Luồng 11-14).
* **TC_UC008_05:** Lỗi không cho phép xóa chuyên khoa nếu có ràng buộc thực thể (có bác sĩ thuộc chuyên khoa đó) (Luồng 16).

#### 5. Định hướng Unit Test (Backend JUnit)
* **Target Method:** `AdminService.createSpecialty(SpecialtyDto dto)` / `deleteSpecialty(Long id)`
* **Test Case 1 (`testCreateSpecialty_Duplicate`):** Mock `SpecialtyRepository.existsByName` trả về `true`, assert ném lỗi trùng lặp dữ liệu.
* **Test Case 2 (`testDeleteSpecialty_InUse`):** Mock `DoctorRepository.countBySpecialtyId > 0`, xác thực việc chặn hành động xóa và trả về thông báo lỗi ràng buộc ngoại khóa.

---

### UC009: QUẢN LÝ THÔNG TIN BÁC SĨ

#### 1. Thông tin chung
* **Mã Use Case:** 009
* **Tên Use Case:** Quản lý thông tin bác sĩ
* **Tác nhân:** Quản trị viên (Admin)
* **Mô tả:** Quản trị viên thực hiện xem, thêm mới, cập nhật hoặc xóa thông tin bác sĩ trên hệ thống nhằm đảm bảo dữ liệu bác sĩ luôn chính xác và đầy đủ.
* **Sự kiện kích hoạt:** Quản trị viên truy cập chức năng “Quản lý thông tin bác sĩ” từ menu quản trị hệ thống.
* **Tiền điều kiện:** Quản trị viên đã đăng nhập vào hệ thống với tài khoản có quyền quản trị.
* **Hậu điều kiện:** Dữ liệu hồ sơ bác sĩ được cập nhật tương ứng vào CSDL.

#### 2. Luồng sự kiện chính
| # | Thực hiện bởi | Hành động |
|---|---|---|
| 1 | Quản trị viên | Truy cập vào chức năng “Quản lý thông tin bác sĩ”. |
| 2 | Hệ thống | Truy cập vào bảng `BacSi` và hiển thị danh sách bác sĩ gồm các thông tin cơ bản: mã bác sĩ, họ tên, chuyên khoa, số điện thoại, email, trạng thái hoạt động. |
| 3 | Quản trị viên | Chọn chức năng “Thêm mới” hoặc chọn một bác sĩ trong danh sách để “Cập nhật thông tin”. |
| 4 | Hệ thống | Hiển thị form nhập/chỉnh sửa thông tin bác sĩ gồm: họ tên, ngày sinh, giới tính, chuyên khoa, số điện thoại, email, địa chỉ, mô tả chuyên môn. |
| 5 | Quản trị viên | Nhập hoặc chỉnh sửa thông tin và nhấn nút “Lưu”. |
| 6 | Hệ thống | Kiểm tra tính hợp lệ của dữ liệu, lưu thông tin bác sĩ vào CSDL và hiển thị thông báo cập nhật thành công. |

#### 3. Luồng sự kiện thay thế / ngoại lệ
| # | Thực hiện bởi | Hành động |
|---|---|---|
| 3a | Quản trị viên | Chọn chức năng “Xóa” bác sĩ. |
| 3b | Hệ thống | Hiển thị thông báo xác nhận xóa thông tin bác sĩ. |
| 3c | Quản trị viên | Xác nhận hành động xóa. |
| 5a | Quản trị viên | Không nhập đầy đủ hoặc nhập sai định dạng các trường thông tin bắt buộc. |
| 5b | Hệ Thống | Hiển thị thông báo lỗi và yêu cầu nhập lại dữ liệu hợp lệ. |
| 6a | Hệ thống | Tại bất kỳ thời điểm nào trong quá trình thực hiện use case, nếu không kết nối được với CSDL thì hệ thống sẽ thông báo lỗi. |

#### 4. Kịch bản kiểm thử đề xuất (Test Cases)
* **TC_UC009_01:** Thêm mới thông tin một bác sĩ thành công với định dạng Email, Số điện thoại chuẩn xác.
* **TC_UC009_02:** Báo lỗi nhập liệu form khi trường Số điện thoại nhập sai định dạng (chứa chữ cái hoặc không đủ số) (Luồng 5a-5b).
* **TC_UC009_03:** Xóa thành công tài khoản bác sĩ (hoặc chuyển đổi cờ `isDeleted = 1`) khỏi danh sách hoạt động (Luồng 3a-3c).

#### 5. Định hướng Unit Test (Backend JUnit)
* **Target Method:** `AdminService.saveDoctor(DoctorDto dto)`
* **Test Case 1:** Kiểm tra nghiệp vụ lưu thành công thực thể thông qua mock Repository.
* **Test Case 2:** Truyền sai cấu trúc regex Số điện thoại, kiểm tra tầng Dto Validation có bắt được lỗi không.

---

### UC010: QUẢN LÝ THÔNG TIN CƠ SỞ Y TẾ

#### 1. Thông tin chung
* **Mã Use Case:** 010
* **Tên Use Case:** Quản lý thông tin cơ sở y tế
* **Tác nhân:** Quản trị viên (Admin)
* **Mô tả:** Quản trị viên thực hiện cập nhật, chỉnh sửa thông tin của cơ sở y tế (tên cơ sở, địa chỉ, số điện thoại, email, mô tả…) nhằm đảm bảo thông tin hiển thị cho người dùng là chính xác và đầy đủ.
* **Sự kiện kích hoạt:** Quản trị viên nhấn vào nút “Chỉnh sửa” thông tin cơ sở y tế trên giao diện quản lý cơ sở y tế.
* **Tiền điều kiện:** Quản trị viên đã đăng nhập vào hệ thống với quyền quản trị viên và đang ở giao diện cấu hình thông tin cơ sở y tế.
* **Hậu điều kiện:** Toàn bộ thông tin cấu hình cốt lõi của phòng khám/bệnh viện được lưu mới vào CSDL.

#### 2. Luồng sự kiện chính
| # | Thực hiện bởi | Hành động |
|---|---|---|
| 1 | Quản trị viên | Truy cập vào giao diện quản lý thông tin cơ sở y tế. |
| 2 | Hệ thống | Hiển thị thông tin hiện tại của cơ sở y tế. |
| 3 | Quản trị viên | Nhấn nút “Chỉnh sửa”. |
| 4 | Hệ thống | Hiển thị form cập nhật thông tin cơ sở y tế. |
| 5 | Quản trị viên | Cập nhật các thông tin cần thiết và nhấn nút “Lưu”. |
| 6 | Hệ thống | Kiểm tra dữ liệu hợp lệ, cập nhật thông tin và lưu vào CSDL. |
| 7 | Hệ thống | Hiển thị thông báo cập nhật thông tin cơ sở y tế thành công. |

#### 3. Luồng sự kiện thay thế / ngoại lệ
| # | Thực hiện bởi | Hành động |
|---|---|---|
| 5a | Quản trị viên | Nhập thiếu hoặc sai định dạng thông tin (Email/Số điện thoại trống). |
| 5b | Hệ thống | Thông báo lỗi và yêu cầu nhập lại thông tin hợp lệ. |
| 5c | Quản trị viên | Nhấn nút “Hủy” khi đang chỉnh sửa. |
| 5d | Hệ thống | Hủy thao tác cập nhật và quay về giao diện quản lý thông tin cơ sở y tế ban đầu. |
| 6a | Hệ thống | Tại bất kỳ thời điểm nào trong quá trình thực hiện use case, nếu không kết nối được với CSDL thì hệ thống sẽ thông báo lỗi. |

#### 4. Kịch bản kiểm thử đề xuất (Test Cases)
* **TC_UC010_01:** Cập nhật thành công các trường thông tin cơ sở y tế (Tên bệnh viện, Giờ mở cửa, Số hotline).
* **TC_UC010_02:** Kiểm tra hành vi hệ thống khôi phục nguyên trạng thông tin cũ khi người dùng nhấn nút "Hủy" giữa chừng (Luồng 5c-5d).

#### 5. Định hướng Unit Test (Backend JUnit)
* **Target Method:** `AdminService.updateFacilityInfo(FacilityDto dto)`
* **Test Case 1:** Truy vấn lấy Id mặc định = 1, thực hiện gọi hàm cập nhật dữ liệu của bảng `CoSoYTe` và kiểm tra các trường lưu xuống đúng giá trị mới.

---

## 💡 MẸO CHO QUÁ TRÌNH VIẾT UNIT TEST & INTEGRATION TEST TRÊN UBUNTU
1. **Kiểm thử bất biến tên bảng:** Vì hệ thống của ông đã cấu hình `--lower-case-table-names=1` chạy native trên Ubuntu, hãy đảm bảo các chuỗi Annotation `@Table(name = "NguoiDung")` trong Java khớp hoàn toàn về ngữ nghĩa chữ hoa/thường với database di động cổng `3307`.
2. **Sử dụng H2 Database hoặc Testcontainers:** Nếu muốn chạy Unit Test cô lập hoàn toàn mà không cần bật MySQL ngầm, ông có thể cấu hình file `src/test/resources/application-test.properties` sử dụng H2 Memory Database để tốc độ chạy test case đạt mức tối đa (millisecond).