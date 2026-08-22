#!/bin/bash
# ============================================================================
# FILE KIỂM THỬ: Quản lý Bài Viết (test_bai_viet.sh)
# Ánh xạ từ 5 Test Case: TC1 → TC5
# Hướng dẫn chạy: Mở Git Bash tại thư mục gốc → bash test_bai_viet.sh
# ============================================================================

BASE_URL="http://localhost:8080"
POSTS_URL="$BASE_URL/api/v1/posts"

# Màu sắc terminal
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

PASS=0
FAIL=0

print_result() {
    local tc=$1
    local desc=$2
    local expected=$3
    local actual=$4

    if [ "$actual" = "$expected" ]; then
        echo -e "  ${GREEN}✅ PASS${NC} | $tc - $desc (HTTP $actual)"
        PASS=$((PASS + 1))
    else
        echo -e "  ${RED}❌ FAIL${NC} | $tc - $desc | Mong đợi: $expected | Thực tế: $actual"
        FAIL=$((FAIL + 1))
    fi
}

echo ""
echo -e "${CYAN}========================================================"
echo    "     🧪 KIỂM THỬ CHỨC NĂNG: QUẢN LÝ BÀI VIẾT"
echo -e "========================================================${NC}"
echo ""

# -------------------------------------------------------
# Bước chuẩn bị: Đăng nhập Admin lấy Token
# (Tương đương: "Đăng nhập bằng tài khoản có quyền Quản trị viên")
# -------------------------------------------------------
echo -e "${YELLOW}  Chuẩn bị: Đăng nhập tài khoản Quản trị viên để lấy Token...${NC}"

LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@healthcare.com","password":"admin123"}')

TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ Không lấy được token. Kiểm tra Backend đang chạy và thông tin đăng nhập Admin.${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Đăng nhập Admin thành công! Token đã sẵn sàng.${NC}"
echo ""

# ============================================================
echo -e "${CYAN}[TC1] Kiểm tra chế độ xem danh sách bài viết${NC}"
echo    "      Bước: Kích vào menu Quản lý bài viết → Hệ thống tải danh sách từ CSDL"
# ============================================================
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$POSTS_URL" \
  -H "Authorization: Bearer $TOKEN")
print_result "TC1" "GET danh sách tất cả bài viết" "200" "$STATUS"
echo ""

# ============================================================
echo -e "${CYAN}[TC2] Kiểm tra thêm mới bài viết thành công (thông tin đầy đủ, hợp lệ)${NC}"
echo    "      Bước: Nhập Tiêu đề, Nội dung, Hình ảnh bìa, Danh mục → Ấn Lưu"
# ============================================================
CREATE_PAYLOAD='{
  "tieuDe": "[TEST-TC2] Bài viết kiểm thử tự động - Thêm mới hợp lệ",
  "anhBia": "https://via.placeholder.com/400x200",
  "phanLoai": "Được quan tâm",
  "noiDung": "<p>Đây là nội dung bài viết được tạo tự động bởi script kiểm thử TC2.</p>"
}'
CREATE_RESPONSE=$(curl -s -X POST "$POSTS_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "$CREATE_PAYLOAD" \
  -w "\n%{http_code}")

STATUS=$(echo "$CREATE_RESPONSE" | tail -n1)
BODY=$(echo "$CREATE_RESPONSE" | head -n-1)
print_result "TC2" "POST thêm bài viết mới đầy đủ thông tin" "200" "$STATUS"

# Lưu ID bài viết vừa tạo để sử dụng ở TC4 và TC5
NEW_ID=$(echo "$BODY" | grep -o '"baiVietID":[0-9]*' | cut -d':' -f2)
if [ -n "$NEW_ID" ]; then
  echo -e "      → ID bài viết vừa tạo: ${GREEN}$NEW_ID${NC} (sẽ dùng cho TC4, TC5)"
fi
echo ""

# ============================================================
echo -e "${CYAN}[TC3] Kiểm tra thêm mới bài viết thất bại (bỏ trống Tiêu đề)${NC}"
echo    "      Bước: Nhập thiếu Tiêu đề → Ấn Lưu → Hệ thống phải báo lỗi Validation"
# ============================================================
BAD_PAYLOAD='{
  "tieuDe": "",
  "phanLoai": "Y tế",
  "noiDung": "<p>Nội dung có nhưng tiêu đề bị để trống - TC3.</p>"
}'
TC3_RESPONSE=$(curl -s -X POST "$POSTS_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "$BAD_PAYLOAD" \
  -w "\n%{http_code}")

TC3_STATUS=$(echo "$TC3_RESPONSE" | tail -n1)
TC3_BODY=$(echo "$TC3_RESPONSE" | head -n-1)

# Kiểm tra kép: 400 = tốt nhất, hoặc 200 nhưng KHÔNG có baiVietID cũng được chấp nhận
TC3_ID=$(echo "$TC3_BODY" | grep -o '"baiVietID":[0-9]*' | cut -d':' -f2)

if [ "$TC3_STATUS" = "400" ]; then
  echo -e "  ${GREEN}✅ PASS${NC} | TC3 - POST thiếu tiêu đề → Backend trả từ chối (HTTP 400)"
  PASS=$((PASS + 1))
elif [ "$TC3_STATUS" = "200" ] && [ -n "$TC3_ID" ]; then
  # Bài viết trống thực sự bị lưu vào DB → Backend thiếu @Valid, cần rebuild
  echo -e "  ${RED}❌ FAIL${NC} | TC3 - Bài viết tiêu đề trống bị lưu vào DB (ID=$TC3_ID) → Backend cần REBUILD để @Valid có hiệu lực!"
  # Dọn dẹp bài viết lỗi vừa tạo
  curl -s -o /dev/null -X DELETE "$POSTS_URL/$TC3_ID" -H "Authorization: Bearer $TOKEN"
  echo -e "         ${YELLOW}→ Đã tự động xóa bài viết lỗi ID=$TC3_ID${NC}"
  FAIL=$((FAIL + 1))
else
  echo -e "  ${YELLOW}⚠️  UNKNOWN${NC} | TC3 - HTTP $TC3_STATUS (không xác định)"
  FAIL=$((FAIL + 1))
fi
echo ""

# ============================================================
echo -e "${CYAN}[TC4] Kiểm tra sửa/cập nhật thông tin bài viết${NC}"
echo    "      Bước: Chọn bài viết → Sửa Tiêu đề & Nội dung → Ấn Cập nhật"
# ============================================================
if [ -n "$NEW_ID" ]; then
  UPDATE_PAYLOAD='{
    "tieuDe": "[TEST-TC4] Bài viết đã được cập nhật thành công",
    "anhBia": "https://via.placeholder.com/400x200",
    "phanLoai": "Y tế",
    "noiDung": "<p>Nội dung đã được chỉnh sửa thành công bởi script kiểm thử TC4.</p>"
  }'
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X PUT "$POSTS_URL/$NEW_ID" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "$UPDATE_PAYLOAD")
  print_result "TC4" "PUT cập nhật bài viết ID=$NEW_ID" "200" "$STATUS"
else
  echo -e "  ${YELLOW}⚠️  SKIP TC4: Không có ID bài viết hợp lệ (TC2 có thể đã FAIL)${NC}"
fi
echo ""

# ============================================================
echo -e "${CYAN}[TC5] Kiểm tra chức năng xóa bài viết${NC}"
echo    "      Bước: Chọn bài viết → Ấn Xóa → Xác nhận trên Pop-up → Bài viết bị xóa"
# ============================================================
if [ -n "$NEW_ID" ]; then
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$POSTS_URL/$NEW_ID" \
    -H "Authorization: Bearer $TOKEN")
  print_result "TC5" "DELETE xóa bài viết ID=$NEW_ID" "200" "$STATUS"

  # Xác minh bài viết đã bị xóa thật sự (không còn trong hệ thống)
  VERIFY_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$POSTS_URL/$NEW_ID")
  if [ "$VERIFY_STATUS" = "404" ]; then
    echo -e "      ${GREEN}→ Xác nhận: Bài viết ID=$NEW_ID đã bị xóa hoàn toàn khỏi hệ thống (404).${NC}"
  fi
else
  echo -e "  ${YELLOW}⚠️  SKIP TC5: Không có ID bài viết hợp lệ để xóa${NC}"
fi
echo ""

# ============================================================
echo -e "${CYAN}========================================================"
echo    "                    KẾT QUẢ TỔNG HỢP"
echo -e "========================================================${NC}"
echo ""
echo -e "  ${GREEN}✅ PASS: $PASS${NC} | ${RED}❌ FAIL: $FAIL${NC} | Tổng: $((PASS + FAIL)) test case"
echo ""

if [ "$FAIL" = "0" ]; then
  echo -e "${GREEN}🎉 Tất cả test case PASS! Chức năng Quản lý Bài Viết hoạt động đúng.${NC}"
else
  echo -e "${RED}⚠️  Có $FAIL test case FAIL. Hãy kiểm tra lại Backend/Database.${NC}"
fi
echo ""
