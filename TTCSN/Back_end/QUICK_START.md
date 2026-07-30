# ⚡ Quick Start Guide

Hướng dẫn nhanh để chạy project trong 5 phút.

---

## 📦 Bước 1: Cài Đặt (1 phút)

### Yêu Cầu
- ✅ Java 17+
- ✅ MySQL 8.0+
- ✅ Maven (hoặc dùng `mvnw` included)

### Kiểm tra

```bash
java -version    # Phải >= 17
mysql --version  # Phải >= 8.0
```

---

## 🗄️ Bước 2: Setup Database (2 phút)

### Option A: Fresh Install (Recommend)

```bash
# 1. Mở MySQL
mysql -u root -p

# 2. Chạy 2 scripts (thay đường dẫn phù hợp)
SOURCE D:/1.Code/TTCSN/HealthCareServices/demo/DatLichKham.sql;
SOURCE D:/1.Code/TTCSN/HealthCareServices/demo/CREATE_ADMIN_USER.sql;

# 3. Verify
USE DatLichKham;
SELECT COUNT(*) FROM LichLamViecMacDinh;  -- Phải = 14
SELECT HoTen, Email FROM NguoiDung WHERE VaiTro = 'Admin';  -- Phải có admin

# 4. Exit
exit;
```

**Admin Credentials:**
- Email: `admin@healthcare.com`
- Password: `admin123`

### Option B: Migration (Nếu DB đã có)

```bash
mysql -u root -p DatLichKham
SOURCE D:/1.Code/TTCSN/HealthCareServices/demo/MIGRATION_PHASE1_LICH_LAM_VIEC.sql;
exit;
```

---

## ⚙️ Bước 3: Config Application (30 giây)

Sửa file `src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/DatLichKham
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD_HERE

# JPA
spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true

# JWT (giữ nguyên hoặc đổi secret)
jwt.secret=healthcare-secret-key-2024-spring-boot-jwt-authentication-minimum-256-bits
jwt.expiration=86400000

# Server (optional)
server.port=8080
```

---

## 🚀 Bước 4: Run Application (30 giây)

### Windows

```bash
cd demo
mvnw.cmd clean spring-boot:run
```

### Linux/Mac

```bash
cd demo
./mvnw clean spring-boot:run
```

### Hoặc dùng IDE
- Open `demo` folder
- Right click `DemoApplication.java`
- Run As → Spring Boot App

---

## ✅ Bước 5: Test (1 phút)

### 1. Mở Swagger UI

```
http://localhost:8080/swagger-ui/index.html
```

### 2. Login Admin

Click `auth-controller` → `POST /api/auth/login` → Try it out

```json
{
  "email": "admin@healthcare.com",
  "matKhau": "admin123"
}
```

Click **Execute**

### 3. Authorize

- Copy `accessToken` từ response
- Click nút **Authorize** (🔓 góc trên phải)
- Paste vào field **Value**: `Bearer <your-token>`
- Click **Authorize**
- Click **Close**

### 4. Test API

Click `chuyen-khoa-controller` → `GET /api/specialties` → Try it out → Execute

**Kết quả mong đợi:** Danh sách 9 chuyên khoa

```json
[
  {
    "chuyenKhoaID": 1,
    "tenChuyenKhoa": "Cơ xương khớp",
    "moTa": "Chuyên khoa điều trị xương khớp",
    ...
  },
  ...
]
```

---

## 🎉 Xong!

Application đã chạy thành công!

### URLs Quan Trọng

| URL | Mô Tả |
|-----|-------|
| `http://localhost:8080/swagger-ui/index.html` | Swagger UI - Test APIs |
| `http://localhost:8080/api/auth/login` | Login endpoint |
| `http://localhost:8080/api/specialties` | Chuyên khoa |
| `http://localhost:8080/api/doctors` | Bác sĩ |

---

## 🔥 Next Steps

### Tạo Bác Sĩ Mẫu

```json
POST /api/doctors/create-account
{
  "hoTen": "BS. Nguyễn Văn A",
  "email": "doctor1@example.com",
  "matKhau": "doctor123",
  "soDienThoai": "0912345678",
  "chuyenKhoaID": 1,
  "trinhDoID": 3,
  "soNamKinhNghiem": 10,
  "gioiThieu": "Bác sĩ chuyên khoa I"
}
```

### Tạo Chuyên Khoa Mới

```json
POST /api/specialties
{
  "tenChuyenKhoa": "Nội Khoa",
  "moTa": "Chuyên khoa nội tổng hợp"
}
```

### Xem Lịch Mặc Định

```sql
mysql -u root -p DatLichKham

SELECT 
    CASE ThuTrongTuan
        WHEN 2 THEN 'Thứ 2'
        WHEN 3 THEN 'Thứ 3'
        WHEN 4 THEN 'Thứ 4'
        WHEN 5 THEN 'Thứ 5'
        WHEN 6 THEN 'Thứ 6'
        WHEN 7 THEN 'Thứ 7'
        WHEN 8 THEN 'Chủ nhật'
    END AS Thu,
    Ca,
    CONCAT(ThoiGianBatDau, ' - ', ThoiGianKetThuc) AS ThoiGian
FROM LichLamViecMacDinh
WHERE IsActive = 1
ORDER BY ThuTrongTuan, FIELD(Ca, 'SANG', 'CHIEU', 'TOI');
```

**Output:**
```
+-----------+--------+-------------------+
| Thu       | Ca     | ThoiGian          |
+-----------+--------+-------------------+
| Thứ 2     | SANG   | 08:00:00 - 12:00:00 |
| Thứ 2     | CHIEU  | 14:00:00 - 17:00:00 |
| Thứ 3     | SANG   | 08:00:00 - 12:00:00 |
...
| Chủ nhật  | SANG   | 08:00:00 - 12:00:00 |
| Chủ nhật  | CHIEU  | 14:00:00 - 17:00:00 |
+-----------+--------+-------------------+
14 rows
```

---

## ❌ Troubleshooting

### Port 8080 đã được dùng

```properties
# application.properties
server.port=8081
```

### MySQL connection refused

```bash
# Windows: Khởi động MySQL
net start MySQL80

# Linux: Khởi động MySQL
sudo systemctl start mysql

# Kiểm tra MySQL đang chạy
mysql -u root -p
```

### Admin login failed

```sql
-- Kiểm tra admin có trong DB
SELECT * FROM NguoiDung WHERE Email = 'admin@healthcare.com';

-- Nếu không có, chạy lại:
SOURCE D:/1.Code/TTCSN/HealthCareServices/demo/CREATE_ADMIN_USER.sql;
```

### JWT Token invalid

- Token hết hạn sau 24h → Login lại
- Copy đúng format: `Bearer <token>`
- Không có dấu cách thừa

### "Table doesn't exist"

```bash
# Chạy lại setup DB
mysql -u root -p
SOURCE D:/1.Code/TTCSN/HealthCareServices/demo/DatLichKham.sql;
```

---

## 📚 Tài Liệu Chi Tiết

- **[README.md](README.md)** - Tổng quan project
- **[DATABASE_SETUP_GUIDE.md](DATABASE_SETUP_GUIDE.md)** - Setup DB chi tiết
- **[TEST_COMBINED_API_AND_SOFT_DELETE.md](TEST_COMBINED_API_AND_SOFT_DELETE.md)** - Test APIs

---

## 🎯 APIs Đã Có

### Authentication
- ✅ `POST /api/auth/register` - Đăng ký
- ✅ `POST /api/auth/login` - Đăng nhập
- ✅ `POST /api/auth/forgot-password` - Quên mật khẩu
- ✅ `GET /api/auth/me` - Thông tin user hiện tại

### Admin - Chuyên Khoa
- ✅ `GET /api/specialties` - Danh sách
- ✅ `POST /api/specialties` - Tạo mới
- ✅ `PUT /api/specialties/{id}` - Cập nhật
- ✅ `DELETE /api/specialties/{id}` - Xóa (soft)

### Admin - Bác Sĩ
- ✅ `GET /api/doctors` - Danh sách
- ✅ `GET /api/doctors/{id}` - Chi tiết
- ✅ `POST /api/doctors/create-account` - Tạo tài khoản bác sĩ
- ✅ `PUT /api/doctors/{id}` - Cập nhật
- ✅ `DELETE /api/doctors/{id}` - Xóa (soft)
- ✅ `PUT /api/doctors/{id}/restore` - Khôi phục

---

**Happy Coding! 🚀**

