# 🏥 Healthcare Booking System

Hệ thống đặt lịch khám bệnh với Spring Boot, MySQL và JWT Authentication.

## 📋 Tính Năng

### ✅ Đã Hoàn Thành

#### 🔐 Authentication & Authorization
- [x] Đăng ký người dùng (với email verification)
- [x] Đăng nhập JWT
- [x] Quên mật khẩu
- [x] Phân quyền: Admin, BacSi, BenhNhan

#### 👨‍⚕️ Quản Lý Bác Sĩ
- [x] CRUD Chuyên Khoa
- [x] CRUD Bác Sĩ
- [x] Tạo tài khoản bác sĩ (Combined API: NguoiDung + BacSi)
- [x] Soft Delete với cascade (BacSi + NguoiDung)
- [x] Restore bác sĩ đã xóa
- [x] Giá khám tự động theo trình độ

#### 📅 Lịch Làm Việc & Nghỉ Phép (Phase 1)
- [x] Lịch mặc định toàn bệnh viện (7 ngày/tuần)
- [x] Quản lý ngày phép bác sĩ (12 ngày/năm)
- [x] Yêu cầu nghỉ với approval workflow
- [x] 3 loại nghỉ: Ngày cụ thể, Ca cụ thể, Ca hàng tuần
- [x] 4 loại phép: Phép năm, Ốm, Công tác, Khác

#### 📚 Documentation
- [x] Swagger/OpenAPI
- [x] Database setup guide
- [x] API test documentation

### ⏳ Đang Phát Triển

#### Phase 1 - Lịch Làm Việc (In Progress)
- [ ] DTOs (Request/Response)
- [ ] Services (Business Logic)
- [ ] Controllers (REST APIs)
- [ ] Available Slots Calculation

#### Phase 2 - Đặt Lịch Khám
- [ ] Đặt lịch khám
- [ ] Xác nhận/Hủy lịch
- [ ] Quản lý slots khám

#### Phase 3 - Thanh Toán & Đánh Giá
- [ ] Tích hợp Payment Gateway
- [ ] Đánh giá bác sĩ
- [ ] Thống kê & báo cáo

---

## 🚀 Quick Start

### 1. Yêu Cầu

- Java 17+
- MySQL 8.0+
- Maven 3.6+

### 2. Clone & Setup

```bash
# Clone project
git clone <repository-url>
cd HealthCareServices/demo

# Copy application.properties
cp src/main/resources/application.properties.example src/main/resources/application.properties

# Sửa DB credentials
# spring.datasource.username=root
# spring.datasource.password=your_password
```

### 3. Setup Database

Xem hướng dẫn chi tiết: **[DATABASE_SETUP_GUIDE.md](DATABASE_SETUP_GUIDE.md)**

#### Option A: Fresh Install (Database mới)

```sql
mysql -u root -p
SOURCE D:/1.Code/TTCSN/HealthCareServices/demo/DatLichKham.sql;
SOURCE D:/1.Code/TTCSN/HealthCareServices/demo/CREATE_ADMIN_USER.sql;
```

#### Option B: Migration (Database đã có)

```sql
mysql -u root -p DatLichKham
SOURCE D:/1.Code/TTCSN/HealthCareServices/demo/MIGRATION_PHASE1_LICH_LAM_VIEC.sql;
```

### 4. Run Application

```bash
# Windows
mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

Application sẽ chạy tại: `http://localhost:8080`

### 5. Test APIs

#### Swagger UI
```
http://localhost:8080/swagger-ui/index.html
```

#### Login Admin

```bash
POST /api/auth/login
{
  "email": "admin@healthcare.com",
  "password": "admin123"
}
```

Copy `accessToken` từ response → Click "Authorize" trong Swagger → Paste token

---

## 📁 Cấu Trúc Project

```
demo/
├── src/main/java/org/example/demo/
│   ├── config/           # Security, Swagger, etc.
│   ├── controller/       # REST Controllers
│   ├── dto/
│   │   ├── request/      # Request DTOs
│   │   └── response/     # Response DTOs
│   ├── entity/           # JPA Entities
│   ├── enums/            # Enumerations
│   ├── exception/        # Custom Exceptions
│   ├── repository/       # JPA Repositories
│   ├── security/         # JWT, UserDetails
│   └── service/          # Business Logic
│
├── src/main/resources/
│   └── application.properties
│
├── DatLichKham.sql                        # Schema đầy đủ
├── CREATE_ADMIN_USER.sql                  # Tạo Admin
├── MIGRATION_PHASE1_LICH_LAM_VIEC.sql    # Migration script
├── SAMPLE_DATA_LICH_LAM_VIEC.sql         # Data mẫu
├── DATABASE_SETUP_GUIDE.md               # Hướng dẫn setup DB chi tiết
└── README.md                              # File này
```

---

## 📚 Documents

| Document | Mô Tả |
|----------|-------|
| [DATABASE_SETUP_GUIDE.md](DATABASE_SETUP_GUIDE.md) | Hướng dẫn setup database chi tiết |
| [TEST_COMBINED_API_AND_SOFT_DELETE.md](TEST_COMBINED_API_AND_SOFT_DELETE.md) | Test Combined API & Soft Delete |
| [PRICE_BASED_ON_DEGREE.md](PRICE_BASED_ON_DEGREE.md) | Logic giá khám theo trình độ |

---

## 🗄️ Database Schema (Phase 1)

### Core Tables

| Table | Mô Tả |
|-------|-------|
| `CoSoYTe` | Thông tin bệnh viện/phòng khám |
| `NguoiDung` | Users (Admin, BacSi, BenhNhan) |
| `TrinhDo` | Trình độ bác sĩ (7 cấp) |
| `ChuyenKhoa` | Chuyên khoa (9 khoa) |
| `BacSi` | Thông tin bác sĩ |
| `LichLamViecMacDinh` | Lịch mặc định toàn BV (14 ca/tuần) |
| `BacSiNgayNghi` | Yêu cầu nghỉ của bác sĩ |
| `LichDatKham` | Lịch hẹn khám |
| `HoSoBenhAn` | Hồ sơ bệnh án |
| `ThongBao` | Thông báo |

### Key Changes Phase 1

#### ❌ Đã Xóa
- `BacSi_LichLamViec` → Thay bằng `LichLamViecMacDinh`
- `BacSi_NgayNghi` → Thay bằng `BacSiNgayNghi`

#### ✅ Mới Thêm
- `LichLamViecMacDinh`: Lịch chung cho TẤT CẢ bác sĩ
- `BacSiNgayNghi`: Yêu cầu nghỉ + Approval workflow

#### ✅ Cập Nhật
`BacSi` thêm:
- `SoNgayPhepNam` (12 ngày)
- `SoNgayPhepDaSuDung` (0)
- `NamApDung` (2025)

---

## 🔐 User Roles & Permissions

### Admin
- ✅ CRUD Chuyên khoa, Bác sĩ, Trình độ
- ✅ Tạo tài khoản bác sĩ
- ✅ Setup lịch mặc định toàn BV
- ✅ Phê duyệt yêu cầu nghỉ
- ✅ Xem thống kê, báo cáo

### Bác Sĩ (Coming Soon)
- [ ] Xem lịch làm việc của mình
- [ ] Đăng ký nghỉ (ngày/ca cụ thể, hàng tuần)
- [ ] Xem lịch hẹn
- [ ] Cập nhật thông tin cá nhân

### Bệnh Nhân (Coming Soon)
- [ ] Đăng ký tài khoản
- [ ] Đặt lịch khám
- [ ] Xem lịch sử khám
- [ ] Đánh giá bác sĩ

---

## 🔧 Configuration

### Database (application.properties)

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/DatLichKham
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

### JWT

```properties
jwt.secret=your-secret-key-here-at-least-256-bits
jwt.expiration=86400000
jwt.refresh-expiration=604800000
```

### Email (Optional)

```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

---

## 🧪 Testing

### Swagger UI
```
http://localhost:8080/swagger-ui/index.html
```

### Login Flow

1. **Register** (nếu chưa có account)
```bash
POST /api/auth/register
{
  "hoTen": "Test User",
  "email": "test@example.com",
  "matKhau": "password123",
  "soDienThoai": "0901234567",
  "vaiTro": "BenhNhan"
}
```

2. **Verify Email** (nếu có email service)
```bash
POST /api/auth/verify
{
  "email": "test@example.com",
  "verificationCode": "123456"
}
```

3. **Login**
```bash
POST /api/auth/login
{
  "email": "test@example.com",
  "password": "password123"
}
```

4. **Authorize trong Swagger**
- Copy `accessToken` từ response
- Click nút "Authorize" (🔓)
- Paste token vào field "Value"
- Click "Authorize"

### Test Admin APIs

Sau khi authorize với Admin account:

```bash
# Lấy danh sách chuyên khoa
GET /api/specialties

# Tạo chuyên khoa mới
POST /api/specialties
{
  "tenChuyenKhoa": "Tai Mũi Họng",
  "moTa": "Chuyên khoa tai mũi họng"
}

# Tạo tài khoản bác sĩ
POST /api/doctors/create-account
{
  "hoTen": "BS. Nguyễn Văn A",
  "email": "doctor@example.com",
  "matKhau": "doctor123",
  "soDienThoai": "0912345678",
  "chuyenKhoaID": 1,
  "trinhDoID": 3,
  "soNamKinhNghiem": 10
}
```

---

## 🐛 Troubleshooting

### Port 8080 đã được sử dụng

```properties
# application.properties
server.port=8081
```

### Database connection failed

1. Kiểm tra MySQL đã chạy:
```bash
# Windows
net start MySQL80

# Linux
sudo systemctl start mysql
```

2. Kiểm tra credentials trong `application.properties`

### JWT Token invalid

- Token hết hạn (24h): Login lại
- Secret key không khớp: Kiểm tra `jwt.secret` trong properties

### Lỗi "Access Denied"

1. Kiểm tra đã authorize trong Swagger
2. Kiểm tra role của user:
```sql
SELECT NguoiDungID, HoTen, Email, VaiTro FROM NguoiDung WHERE Email = 'your-email';
```

---

## 📞 Contact & Support

- **Developer:** Healthcare System Team
- **Email:** support@healthcare.com
- **Documentation:** [DATABASE_SETUP_GUIDE.md](DATABASE_SETUP_GUIDE.md)

---

## 📝 License

Private project - All rights reserved

---

## 🎯 Roadmap

### Phase 1: Lịch Làm Việc ⏳
- [x] Entities & Repositories
- [ ] DTOs & Services
- [ ] Controllers & APIs
- [ ] Available Slots Logic

### Phase 2: Đặt Lịch Khám
- [ ] Booking flow
- [ ] Confirmation & Cancellation
- [ ] Notifications

### Phase 3: Thanh Toán
- [ ] VNPay integration
- [ ] Momo integration
- [ ] Payment history

### Phase 4: Đánh Giá & Thống Kê
- [ ] Rating system
- [ ] Reviews
- [ ] Dashboard & Analytics

---

**Last Updated:** Phase 1 - Lịch Làm Việc & Yêu Cầu Nghỉ  
**Version:** 1.0.0-SNAPSHOT

