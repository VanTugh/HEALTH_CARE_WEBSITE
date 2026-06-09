#!/bin/bash
# ============================================================================
# VERIFICATION SCRIPT: Test endpoint /api/bookings/test/create ngay
# ============================================================================

echo "🧪 Testing /api/bookings/test/create endpoint..."
echo ""

# Dữ liệu test (ĐÚNG)
PAYLOAD='{
  "bacSiID": 3,
  "ngayKham": "2026-05-25",
  "ca": "CHIEU",
  "gioKham": "14:00",
  "lyDoKham": "Test booking verification script - quick check",
  "phuongThucThanhToan": "TIEN_MAT"
}'

# Test 1: Đúng định dạng
echo "📋 TEST 1: Request với định dạng ĐÚNG"
echo "Payload:"
echo "$PAYLOAD" | jq '.'
echo ""
echo "Gửi request..."

RESPONSE=$(curl -s -X POST http://localhost:8080/api/bookings/test/create \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" \
  -w "\n%{http_code}")

STATUS_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

echo "Status Code: $STATUS_CODE"
echo "Response Body:"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
echo ""

if [ "$STATUS_CODE" = "201" ]; then
    echo "✅ TEST 1 PASS: Endpoint hoạt động bình thường!"
    echo "   → K6 load test sẽ thành công"
else
    echo "❌ TEST 1 FAIL: Status $STATUS_CODE"
    echo "   → Kiểm tra Backend có chạy không"
    echo "   → Hoặc kiểm tra Database setup"
fi

echo ""
echo "---"
echo ""

# Test 2: Sai định dạng (ca = "14:00" thay vì "CHIEU")
echo "📋 TEST 2: Request với định dạng SAI (để verify error)"
WRONG_PAYLOAD='{
  "bacSiID": 3,
  "ngayKham": "2026-05-25",
  "ca": "14:00",
  "gioKham": "14:00",
  "lyDoKham": "This will fail because ca should be CHIEU enum"
}'

echo "Payload (SAI):"
echo "$WRONG_PAYLOAD" | jq '.'
echo ""
echo "Gửi request..."

RESPONSE=$(curl -s -X POST http://localhost:8080/api/bookings/test/create \
  -H "Content-Type: application/json" \
  -d "$WRONG_PAYLOAD" \
  -w "\n%{http_code}")

STATUS_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

echo "Status Code: $STATUS_CODE"
echo "Response Body (lỗi JSON parse):"
echo "$BODY" | jq '.errorMessage' 2>/dev/null || echo "$BODY" | grep -i "deserialize\|enum"
echo ""

if [ "$STATUS_CODE" = "500" ]; then
    echo "✅ TEST 2 EXPECTED: Lỗi như dự kiến"
    echo "   → Xác nhận vấn đề là JSON deserialization"
    echo "   → K6 script đã sửa → không còn lỗi này"
else
    echo "⚠️  TEST 2: Status $STATUS_CODE (expected 500)"
fi

echo ""
echo "---"
echo ""
echo "📊 SUMMARY:"
echo "✅ TEST 1 (Đúng format): Phải là 201 Created"
echo "⚠️  TEST 2 (Sai format):  Phải là 500 JSON parse error"
echo ""
echo "🚀 Nếu cả 2 test như kỳ vọng → K6 load test sẽ thành công!"

