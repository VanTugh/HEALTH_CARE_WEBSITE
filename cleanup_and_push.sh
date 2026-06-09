#!/bin/bash

# ==============================================================================
# SCRIPT TỰ ĐỘNG DỌN RÁC VÀ ĐẨY PROJECT HEALTHCARE LÊN GITHUB
# ==============================================================================

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=================================================================="
echo -e "🚀 BẮT ĐẦU QUÁ TRÌNH DỌN RÁC VÀ CHUẨN BỊ ĐẨY CODE LÊN GITHUB"
echo -e "==================================================================${NC}"

PROJECT_ROOT=$(pwd)
echo -e "📂 Thư mục dự án hiện tại: ${GREEN}$PROJECT_ROOT${NC}"

# 1. DỌN RÁC NODE_MODULES TRONG FRONTEND VÀ TEST
echo -e "\n${BLUE}[1/4] Đang quét và xóa các thư mục node_modules nặng nề...${NC}"
find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
echo -e "${GREEN}🗑️ Đã xóa sạch toàn bộ thư mục node_modules thành công!${NC}"

# 2. DỌN RÁC TARGET TRONG BACKEND (SPRING BOOT)
echo -e "\n${BLUE}[2/4] Đang dọn dẹp thư mục build của Backend...${NC}"
BACKEND_DIR=$(find . -name "pom.xml" -exec dirname {} \;)
if [ -n "$BACKEND_DIR" ]; then
    for dir in $BACKEND_DIR; do
        cd "$PROJECT_ROOT/$dir" || exit
        rm -rf target
    done
    cd "$PROJECT_ROOT" || exit
    echo -e "${GREEN}🗑️ Đã làm sạch thư mục build của Spring Boot!${NC}"
fi

# Xóa các file log rác sinh ra trong quá trình test
find . -name "*.log" -type f -delete

# 3. TẠO FILE .GITIGNORE CHUẨN
echo -e "\n${BLUE}[3/4] Đang cấu hình Git và màng lọc .gitignore...${NC}"
if [ ! -d ".git" ]; then
    git init
    echo -e "${GREEN}✨ Đã khởi tạo Git Repository mới!${NC}"
fi

cat << 'EOF' > .gitignore
# Các file của Java (Spring Boot)
**/target/
**/.mvn/
*.jar
*.class

# Các thư viện của Node.js (React / Playwright / K6)
**/node_modules/

# File cấu hình của các IDE (IntelliJ, VS Code, Eclipse)
**/.idea/
**/.vscode/
*.iml
.project
.settings/

# File log và biến môi trường
*.log
**/.env
**/.env.local
.DS_Store

# Các file báo cáo sinh ra khi chạy test
**/playwright-report/
**/test-results/
**/blob-report/
EOF
echo -e "${GREEN}📝 Đã tạo file .gitignore chuẩn!${NC}"

# 4. GOM CODE VÀ ĐÓNG GÓI COMMIT
echo -e "\n${BLUE}[4/4] Đang gom code và chuẩn bị đóng gói...${NC}"
git add .
git commit -m "feat: dọn dẹp rác hệ thống, tối ưu code hoàn chỉnh sau bảo vệ btl"
git branch -M main

echo -e "\n${BLUE}=================================================================="
echo -e "🎉 QUÁ TRÌNH DỌN RÁC HOÀN TẤT!"
echo -e "==================================================================${NC}"

DUNG_LUONG_MOI=$(du -sh . | cut -f1)
echo -e "📊 Dung lượng hiện tại của project chỉ còn: ${GREEN}$DUNG_LUONG_MOI${NC} (Đã giảm từ 3.4 GB!)"
