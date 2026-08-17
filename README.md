# 🏥 HEALTH_CARE_WEBSITE - Hệ Thống Đặt Lịch Khám Sức Khỏe & Trợ Lý Y Tế AI

**HealthCareBooking** là một nền tảng web toàn diện cho phép bệnh nhân tìm kiếm, chọn lựa và đặt lịch hẹn với các bác sĩ chuyên khoa theo thời gian thực. Đặc biệt, hệ thống được tích hợp hệ sinh thái Trợ lý Y tế Trí tuệ Nhân tạo (AI RAG Chatbot & Mô hình Machine Learning chẩn đoán bệnh), được xây dựng trên kiến trúc phân tầng vững chắc, hỗ trợ khả năng xử lý đồng thời cao.

Dự án tích hợp sẵn bộ công cụ kiểm thử tự động (E2E Testing) cùng kiểm thử hiệu năng (Performance/Stress Testing) để đảm bảo độ tin cậy tuyệt đối.

---

## 💻 Công Nghệ Sử Dụng (Tech Stack)

| Thành phần | Công nghệ | Chi tiết sử dụng |
| :--- | :--- | :--- |
| **Backend** | Java 17, Spring Boot 3.x | Spring Web, Spring Data JPA, Hibernate, Spring Security (JWT) |
| **Frontend** | React, Vite, Tailwind CSS | Giao diện người dùng SPA năng động, xử lý trạng thái real-time |
| **Database** | MySQL 8.0 | Quản lý thực thể, ràng buộc dữ liệu, lưu trữ Vector Embedding |
| **AI RAG Service**| Python, Flask, Gemini API | Xử lý NLP, Vector Search, tạo sinh câu trả lời tư vấn y tế (Port 5000) |
| **AI ML Service** | Python, FastAPI, XGBoost | Mô hình Machine Learning dự đoán nguy cơ tiểu đường (Port 8000) |
| **Auto Test** | Playwright | Kiểm thử luồng giao diện đầu cuối (E2E) cho các chức năng cốt lõi |
| **Perf Test** | K6 (JavaScript) | Kiểm thử sức chịu tải đột biến (Spike/Stress Test) hệ thống |

---

## ⚙️ Yêu Cầu Hệ Thống (Prerequisites)

Hãy đảm bảo máy tính của bạn đã cài đặt đầy đủ các công cụ sau:
*   **Java Development Kit (JDK):** Phiên bản 17
*   **Node.js:** Phiên bản 22.x hoặc mới hơn (kèm npm)
*   **Python:** Phiên bản 3.9+ (kèm `pip` và `venv`)
*   **Apache Maven:** Phiên bản 3.8+
*   **MySQL Server:** Đang chạy ở Port `3306` hoặc `3307`.

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy (Installation & Setup)

Để chạy Full Pipeline của hệ thống, bạn cần khởi động 4 trạm dịch vụ (mở 4 tab Terminal song song).

### Trạm 1: Cấu Hình & Khởi Chạy Database + Backend (Java)
1. Khởi động MySQL Server, tạo database có tên `DatLichKham`.
2. Chạy file script SQL để khởi tạo bảng và chèn dữ liệu mẫu (đảm bảo bao gồm cả bảng `BacSiEmbedding`).
3. Cấu hình kết nối DB tại `TTCSN/Back_end/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://127.0.0.1:3307/DatLichKham
   spring.datasource.username=YOUR_USERNAME
   spring.datasource.password=YOUR_PASSWORD

```

4. Di chuyển vào thư mục Backend và chạy ứng dụng:
```bash
cd TTCSN/Back_end
mvn clean package -DskipTests
mvn spring-boot:run

```


*👉 Backend chạy tại: `http://localhost:8080*`

### Trạm 2: Khởi Chạy AI RAG Chatbot (Python Flask)

1. Mở Terminal mới, di chuyển vào thư mục `ai_assistant`:
```bash
cd TTCSN/ai_assistant

```


2. Tạo file `.env` và điền cấu hình (lưu ý Port DB phải khớp với cấu hình Backend):
```env
DB_URL="mysql+pymysql://YOUR_USERNAME:YOUR_PASSWORD@localhost:3307/DatLichKham"
GOOGLE_API_KEY="YOUR_GEMINI_API_KEY"

```


3. Tạo môi trường ảo và cài đặt thư viện:
```bash
python -m venv .venv
# Windows:
.\.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

pip install -r requirements.txt

```


4. **Đồng bộ Dữ liệu Bác sĩ thành Vector (Chỉ làm lần đầu):** Mở file `vector_service.py`, bỏ comment dòng `# vector_service.sync_doctors_to_vector_db()` ở cuối file. Chạy lệnh: `python vector_service.py`. Sau khi đồng bộ xong, nhớ comment lại dòng đó.
5. Khởi động Chatbot Server:
```bash
python ai_service.py

```


*👉 RAG AI chạy tại: `http://localhost:5000*`

### Trạm 3: Khởi Chạy AI Dự đoán Tiểu đường (Python FastAPI)

1. Mở Terminal mới, di chuyển vào thư mục `ai_ml`:
```bash
cd TTCSN/ai_ml

```


2. Kích hoạt môi trường ảo (tương tự Trạm 2) và cài đặt thư viện nếu cần.
3. Khởi chạy server FastAPI:
```bash
uvicorn api:app --port 8000

```


*👉 Machine Learning AI chạy tại: `http://localhost:8000*`

### Trạm 4: Khởi Chạy Frontend (React)

1. Mở Terminal mới, di chuyển vào thư mục Frontend:
```bash
cd TTCSN/Front_end

```


2. Cài đặt thư viện và khởi động Vite:
```bash
npm install
npm run dev

```


*👉 Giao diện chạy tại: `http://localhost:5173*`

---

## 🧪 Tài Liệu Kiểm Thử (Testing Guide)

Hệ thống được tích hợp hai tầng kiểm thử độc lập:

### 1. Kiểm Thử Tự Động Giao Diện (E2E Playwright)

Bộ kiểm thử bao gồm các kịch bản kiểm thử luồng chức năng cơ bản (Happy Path) cho 10 chức năng cốt lõi. Nổi bật là xử lý thông minh các trạng thái Dropdown React, tự động phát hiện và bỏ qua các nút bấm đã bị vô hiệu hóa khi slot khám đã đầy.

```bash
# Chạy ở chế độ giao diện UI trực quan
npx playwright test --ui

# Chạy ở chế độ dòng lệnh (Headless mode)
npx playwright test

```

### 2. Kiểm Thử Hiệu Năng Đột Biến (Spike/Stress Testing với K6)

Giả lập 500 người dùng ảo (VUs) liên tục gửi yêu cầu đặt lịch trong vòng 30 giây vào cùng một slot khám. Script sử dụng cơ chế Bypass Cache để ép buộc tầng JPA/Hibernate thực thi trực tiếp xuống Database.

```bash
# Chạy script chẩn đoán lỗi nhanh với 10 VUs
npx k6 run api_perf_env/stress_test_diagnostic.js

# Chạy bài Stress Test toàn tải với 500 VUs
npx k6 run api_perf_env/stress_test.js

```

---

## 💡 Bài Học Kỹ Thuật & Tối Ưu Hóa (Engineering Insights)

Qua các đợt kiểm thử hiệu năng diện rộng, hệ thống đã giải quyết thành công 2 nút thắt cổ chai (Bottlenecks):

1. **Nút thắt tầng ORM (Hibernate EAGER Fetching):** Khi 500 VUs truy cập, thời gian phản hồi nghẽn lên tới 15s do Hibernate thực hiện phép JOIN 5 bảng lãng phí.
* *Giải pháp:* Chuyển sang sử dụng `getReferenceById()` của Spring Data JPA để tạo Proxy Object, giải phóng toàn bộ băng thông CPU.


2. **Nút thắt Cấu hình kết nối (Connection Pool Exhaustion):** Cấu hình HikariCP mặc định chỉ có 10 kết nối, gây lỗi Timeout hàng loạt.
* *Giải pháp:* Điều chỉnh `maximum-pool-size=100` và tăng luồng xử lý `server.tomcat.threads.max=500`.



**Kết quả:** Tốc độ xử lý trung vị giảm ngoạn mục từ 15 giây xuống chỉ còn **4.2 mili-giây (ms)**, và logic nghiệp vụ bắt trùng lịch (409 Conflict) hoạt động chính xác 100% trong môi trường đồng thời.

---

## 🔮 Hướng Phát Triển Tương Lai (Future Enhancements)

* **Real-time Slot Locking:** Tích hợp WebSockets (STOMP) và Redis để bôi xám slot khám theo thời gian thực (giữ chỗ tạm thời 5 phút).
* **Distributed Lock:** Áp dụng khóa phân tán để ngăn chặn hoàn toàn Deadlock tầng Database khi scale hệ thống.
* **Agentic AI Expansion:** Mở rộng quyền tự trị cho AI Chatbot, cho phép bot tự động tra cứu hồ sơ y bạ hoặc đề xuất đơn thuốc tham khảo.

```

```
