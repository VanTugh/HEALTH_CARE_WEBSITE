#!/bin/bash

BASE_DIR="$HOME/workspace/test/HEALTH_CARE_WEBSITE/TTCSN"

# Hàm dọn dẹp tiến trình
cleanup() {
    echo -e "\n\n🛑 Đang dừng tất cả các dịch vụ..."
    kill 0
    exit 0
}

trap cleanup SIGINT SIGTERM

echo "=========================================="
echo "🧹 ĐANG KIỂM TRA VÀ DỌN DẸP PORT BỊ KẸT..."
echo "=========================================="

# Giải phóng các cổng nếu đang bị chiếm dụng ngầm
fuser -k 8000/tcp 2>/dev/null
fuser -k 5000/tcp 2>/dev/null
fuser -k 8080/tcp 2>/dev/null
fuser -k 5173/tcp 2>/dev/null

sleep 1

echo "=========================================="
echo "🚀 ĐANG KHỞI CHẠY HỆ THỐNG HEALTHCARE..."
echo "=========================================="

# 1. Khởi chạy AI ML (FastAPI - Port 8000)
echo "🤖 [1/4] Khởi chạy AI ML (FastAPI - Port 8000)..."
cd "$BASE_DIR/ai_ml" || exit
if [ -f "$BASE_DIR/ai_ml/.venv/bin/activate" ]; then
    source "$BASE_DIR/ai_ml/.venv/bin/activate"
fi
python -m uvicorn api:app --reload --port 8000 &

# 2. Khởi chạy AI Assistant (Flask - Port 5000)
echo "💬 [2/4] Khởi chạy AI Assistant (Flask - Port 5000)..."
cd "$BASE_DIR/ai_assistant" || exit
if [ -f "$BASE_DIR/ai_assistant/.venv/bin/activate" ]; then
    source "$BASE_DIR/ai_assistant/.venv/bin/activate"
fi
python ai_service.py &

# Chờ AI Assistant và FastAPI khởi tạo hoàn tất
echo "⏳ Đang đợi dịch vụ AI khởi động hoàn tất..."
sleep 5

# 3. Khởi chạy Backend Java (Spring Boot)
echo "☕ [3/4] Khởi chạy Backend Spring Boot..."
cd "$BASE_DIR/Back_end" || exit
mvn spring-boot:run -Dspring-boot.run.profiles=mysql -Dmaven.repo.local=../../maven_repo &

# 4. Khởi chạy Frontend (React/Vite)
echo "🌐 [4/4] Khởi chạy Frontend React..."
cd "$BASE_DIR/Front_end" || exit
npm run dev &

echo "=========================================="
echo "✅ TẤT CẢ CÁC DỊCH VỤ ĐÃ ĐƯỢC MỞ!"
echo "📌 Bấm [Ctrl + C] để dừng toàn bộ hệ thống."
echo "=========================================="

wait