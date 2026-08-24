# HEALTH_CARE_WEBSITE - Hệ Thống Đặt Lịch Khám Sức Khỏe trực Tuyến

Hệ thống Đặt lịch khám sức khỏe (HealthCareBooking) là một nền tảng web toàn diện cho phép bệnh nhân tìm kiếm, chọn lựa và đặt lịch hẹn với các bác sĩ chuyên khoa theo thời gian thực. Hệ thống được xây dựng trên kiến trúc phân tầng vững chắc, hỗ trợ khả năng xử lý đồng thời cao và tích hợp sẵn bộ công cụ kiểm thử tự động (E2E Testing) cùng kiểm thử hiệu năng (Performance/Stress Testing).

---

##  Công Nghệ Sử Dụng (Tech Stack)

| Thành phần | Công nghệ | Chi tiết sử dụng |
| --- | --- | --- |
| **Backend** | Java 17, Spring Boot 3.x | Spring Web, Spring Data JPA, Hibernate, Spring Security (JWT) |
| **Database** | MySQL 8.0 | Quản lý thực thể, ràng buộc dữ liệu, kết nối qua Port `3307` |
| **Frontend** | React, Vite | Giao diện người dùng SPA năng động, xử lý trạng thái real-time |
| **Automation Test** | Playwright | Kiểm thử luồng giao diện đầu cuối (E2E) cho 10 chức năng đặc tả |
| **Performance Test** | K6 (JavaScript) | Kiểm thử sức chịu tải đột biến (Spike/Stress Test) hệ thống |

---

## Yêu Cầu Hệ Thống (Prerequisites)

Trước khi khởi chạy dự án, hãy đảm bảo máy tính của bạn (khuyến nghị môi trường Ubuntu/Linux) đã cài đặt đầy đủ các công cụ sau:

* **Java Development Kit (JDK):** Phiên bản 17
* **Node.js:** Phiên bản 22.x hoặc mới hơn (kèm `npm`)
* **Apache Maven:** Phiên bản 3.8+
* **MySQL Server:** Cấu hình chạy trên Port `3307` (hoặc thay đổi tương ứng trong file cấu hình)
* **K6:** Đã cài đặt global hoặc chạy qua `npx k6`

---

## Cài Đặt và Khởi Chạy (Installation & Setup)

### 1. Cấu hình Cơ sở dữ liệu (Database)

Khởi động MySQL Server trên máy cục bộ, tạo một cơ sở dữ liệu mới có tên trùng với cấu hình hệ thống (ví dụ: `DatLichKham`).
Mở tệp `TTCSN/Back_end/src/main/resources/application.properties` và xác bối cấu hình kết nối:

```properties
spring.datasource.url=jdbc:mysql://127.0.0.1:3307/DatLichKham
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD

```

### 2. Khởi chạy Backend (Spring Boot)

Di chuyển vào thư mục dự án Backend, thực hiện biên dịch và chạy ứng dụng:

```bash
cd TTCSN/Back_end
mvn clean package -DskipTests
mvn spring-boot:run

```

Backend sẽ khởi chạy mặc định tại địa chỉ: `http://localhost:8080`

### 3. Khởi chạy Frontend (React)

Di chuyển vào thư mục chứa mã nguồn Frontend, cài đặt các gói thư viện phụ thuộc và khởi động môi trường phát triển:

```bash
cd TTCSN/Front_end
npm install
npm run dev

```

---

## Tài Liệu Kiểm Thử (Testing Guide)

Hệ thống được tích hợp hai tầng kiểm thử độc lập nhằm đảm bảo cả tính đúng đắn về mặt logic lẫn độ tin cậy về mặt hiệu năng.

### 1. Kiểm Thử Tự Động Giao Diện (E2E Automation Testing với Playwright)

Playwright được lựa chọn nhờ tốc độ thực thi script tối ưu và giao diện UI trực quan. Bộ kiểm thử bao gồm các kịch bản kiểm thử luồng chức năng cơ bản (Happy Path) cho **10 chức năng cốt lõi** được đề cập trong tài liệu đặc tả hệ thống.

* **Chức năng trọng tâm:** `UC005: Xác nhận lịch khám` (Dành cho vai trò Bác sĩ). Kịch bản xử lý thông minh các trạng thái Dropdown React, tự động phát hiện và bỏ qua các nút bấm đã bị vô hiệu hóa (`:not([disabled])`) khi slot khám đã xử lý trước đó.
* **Cách khởi chạy bộ Test tự động:**

```bash
# Chạy ở chế độ giao diện UI trực quan
npx playwright test --ui

# Chạy ở chế độ dòng lệnh (Headless mode)
npx playwright test

```

### 2. Kiểm Thử Hiệu Năng Đột Biến (Spike/Stress Testing với K6)

Kịch bản được thiết kế nhằm mô phỏng tình huống khắc nghiệt trong thực tế: **Một bác sĩ có ID số 45 rất được săn đón, và có 500 bệnh nhân đồng loạt truy cập vào hệ thống trong cùng một giây để tranh nhau đặt lịch hẹn.**

* **Chi tiết kịch bản (`stress_test.js`):** Giả lập **500 người dùng ảo (VUs)** liên tục gửi yêu cầu đặt lịch trong vòng **30 giây**.
* **Cơ chế chống Cache (Bypass Cache):** Script sử dụng hàm `Math.random()` kết hợp nối chuỗi `Timestamp` thời gian thực vào trường lý do khám, ép buộc tầng JPA/Hibernate phải thực thi lệnh `INSERT` ghi mới trực tiếp xuống ổ đĩa, loại bỏ hoàn toàn cơ chế Query Cache của Database.
* **Cách khởi chạy bài test hiệu năng:**

```bash
# Chạy script chẩn đoán lỗi nhanh với 10 VUs
npx k6 run api_perf_env/stress_test_diagnostic.js

# Chạy bài Stress Test toàn tải với 500 VUs
npx k6 run api_perf_env/stress_test.js

```

---

## Bài Học Kỹ Thuật & Tối Ưu Hóa (Engineering Insights)

Qua các đợt kiểm thử hiệu năng diện rộng, hệ thống đã phát hiện và xử lý thành công hai nút thắt cổ chai hệ thống (Bottlenecks) chí mạng:

### 1. Nút thắt cổ chai ở tầng ORM (Hibernate EAGER Fetching Bottleneck)

* **Vấn đề phát hiện:** Khi 500 VUs dồn dập gửi yêu cầu, hệ thống bị nghẽn thời gian phản hồi lên tới hơn 15 giây. Log hệ thống tiết lộ Hibernate sinh ra câu lệnh `SELECT` khổng lồ, tự động thực hiện phép `JOIN` 5 bảng dữ liệu (`BacSi`, `NguoiDung`, `ChuyenKhoa`, `CoSoYTe`, `TrinhDo`) một cách lãng phí chỉ để kiểm tra sự tồn tại của ID Bác sĩ.
* **Giải pháp khắc phục:** Chuyển đổi từ cơ chế tải dữ liệu tức thì sang việc sử dụng hàm **`getReferenceById()`** của Spring Data JPA. Hàm này tạo ra một thực thể ảo (Proxy Object) chứa khóa ngoại mà không cần truy vấn đọc dữ liệu, giúp giải phóng hoàn toàn băng thông CPU của Database.

### 2. Nút thắt cổ chai ở tầng Cấu hình kết nối (Connection Pool Exhaustion)

* **Vấn đề phát hiện:** Cấu hình mặc định của HikariCP chỉ giới hạn tối đa 10 kết nối đồng thời xuống MySQL (`maximum-pool-size=10`), khiến các luồng xử lý của Web Server Tomcat phải xếp hàng chờ đợi dẫn đến lỗi Timeout hàng loạt.
* **Giải pháp khắc phục:** Điều chỉnh thông số cấu hình trong tệp `application.properties` để cân bằng tải:

```properties
# Mở rộng số kết nối tối đa xuống Database phù hợp với phần cứng
spring.datasource.hikari.maximum-pool-size=100
# Tăng số luồng xử lý đồng thời của Web Server Tomcat
server.tomcat.threads.max=500

```

* **Kết quả thu được:** Sau khi tối ưu hóa mã nguồn và cấu hình, hệ thống đạt bước nhảy vọt về hiệu năng: Tổng số request xử lý thành công tăng **7.5 lần** (từ 1.020 lên 7.715 requests), tốc độ xử lý trung vị giảm ngoạn mục từ 15 giây xuống chỉ còn **4.2 mili-giây (ms)**, và logic nghiệp vụ bắt trùng lịch (`409 Conflict`) hoạt động chính xác 100%, bảo vệ toàn vẹn dữ liệu hệ thống.

---

##  Hướng Phát Triển Tương Lai (Future Enhancements)

* **Real-time Slot Locking:** Tích hợp giao thức **WebSockets (STOMP)** kết hợp bộ nhớ đệm **Redis** để triển khai tính năng giữ chỗ tạm thời trong 5 phút. Khi User A đang chọn một khung giờ, hệ thống sẽ ngay lập tức bôi xám slot đó trên màn hình của User B theo thời gian thực, tối ưu hóa trải nghiệm người dùng (UX).
* **Distributed Lock:** Áp dụng khóa phân tán để xử lý triệt để hiện tượng Deadlock tầng Database khi có hàng ngàn lệnh ghi đồng thời vào một bản ghi dữ liệu đơn lẻ.
<<<<<<< HEAD

## Hướng dẫn setup AI pipeline
**Bước 1: Đảm bảo khi clone đã có thêm các file, thư mục như sau**
```bash
- Frontend: components/AIChatbot.jsx
- Backend:
    + java:
        - HEALTH_CARE_WEBSITE/TTCSN/Back_end/src/main/java/org/example/demo/controller/AIController.java
        - HEALTH_CARE_WEBSITE/TTCSN/Back_end/src/main/java/org/example/demo/controller/BacSiController2.java
        - HEALTH_CARE_WEBSITE/TTCSN/Back_end/src/main/java/org/example/demo/controller/DatLichController.java
        - HEALTH_CARE_WEBSITE/TTCSN/Back_end/src/main/java/org/example/demo/dto/request/ChatRequest.java
        - HEALTH_CARE_WEBSITE/TTCSN/Back_end/src/main/java/org/example/demo/dto/request/DatLichRequest.java
        - HEALTH_CARE_WEBSITE/TTCSN/Back_end/src/main/java/org/example/demo/dto/response/SlotRanhResponse.java
        - HEALTH_CARE_WEBSITE/TTCSN/Back_end/src/main/java/org/example/demo/service/BacSiService2.java
        - HEALTH_CARE_WEBSITE/TTCSN/Back_end/src/main/java/org/example/demo/service/DatLichService.java
        - HEALTH_CARE_WEBSITE/TTCSN/Back_end/src/main/java/org/example/demo/service/DoctorService.java
        - HEALTH_CARE_WEBSITE/TTCSN/Back_end/src/main/java/org/example/demo/service/RAGService.java
    + python:
        - 4 file ai_service, db_services.py, rag_service.py, vector_service.py trong thư mục ai_assistant
```
**Bước 2: tạo key**
```bash
trong thư mục ai_assistant tạo file .env có nội dung sau:

DB_URL = "mysql+pymysql://thang:123456@localhost:3306/DatLichKham" # thay thành đường dẫn db của bạn

GOOGLE_API_KEY="Your_key" # thay thành key AI gemini của bạn (lưu ý cần đảm bảo chắc chắn key có thể hoạt động được)
```
**Bước 3: Tạo thêm bảng mới trong db để lưu embedding sử dụng cho rag**
```bash
truy cập vào file HEALTH_CARE_WEBSITE/TTCSN/Back_end/GuiChoTung.sql để tìm câu lệnh tạo bảng BacSiEmbedding hoặc chạy lệnh dưới

CREATE TABLE IF NOT EXISTS BacSiEmbedding (
    EmbeddingID INT AUTO_INCREMENT PRIMARY KEY,
    BacSiID INT NOT NULL UNIQUE, -- Mỗi bác sĩ có 1 vector đại diện
    
    -- Lưu mảng Vector dưới dạng JSON Array: [0.012, -0.045, ...]
    Embedding JSON NOT NULL, 
    
    -- Đoạn văn bản tổng hợp đã dùng để Embedding (phục vụ kiểm tra/debug)
    DocumentText TEXT, 
    
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (BacSiID) REFERENCES BacSi(BacSiID) ON DELETE CASCADE,
    CONSTRAINT chk_json_embedding CHECK (JSON_VALID(Embedding))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```
**Bước 4: Insert dữ liệu bác sĩ để test**
```bash
tìm trong file HEALTH_CARE_WEBSITE/TTCSN/Back_end/GuiChoTung.sql phần và chạy tất cả các câu lệnh insert phía sau (lưu ý chạy từng lệnh insert một không chạy hết 1 lần)

# -- ---------------------------------------------------
# -- ----------------- THÊM DỮ LIỆU ĐỂ TEST RAG --------
# -- ---------------------------------------------------
```
**Bước 4.1: tạo môi trường ảnh venv và cài thư viện python**
```bash
đảm bảo đường dẫn bắt đầu bằng ai_assistant #  ví dụ: thang@PhatToNhuLai:~/workspace/test/HEALTH_CARE_WEBSITE/TTCSN/ai_assistant$
1. python -m venv .venv
2. source .venv/bin/activate
3. pip install -r requirement.txt
```
**Bước 5: Tạo embedding bằng python**
```bash
Mở file vector_service.py trong thư mục ai_assistant kéo xuống cuối thấy đoạn này
# Đồng bộ dữ liệu trước (nếu chưa thực hiện)
# vector_service.sync_doctors_to_vector_db()
-> thì bỏ dấu thăng đi và chạy lệnh python:
    - cd và thư mực ai_assistant
    - chạy: python vector_service.py
```
**Bước 6: test chức năng AI bằng CLI trước**
```bash
đảm bảo đường dẫn bắt đầu bằng ai_assistant #  ví dụ: thang@PhatToNhuLai:~/workspace/test/HEALTH_CARE_WEBSITE/TTCSN/ai_assistant$

chạy lệnh: python rag_service.py
```
**Bước 7: Test full pileline**
```bash
mở 3 terminal cho FE - BE - AI
lưu ý với AI
    - cd vào ai_assistant
    - chạy python ai_service.py
```
=======
>>>>>>> phung_tuan_anh
