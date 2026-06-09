export BACKEND_ROOT="/home/tung/TTCSN"
export JAVA_HOME="$BACKEND_ROOT/runtimes/java17"
export NODE_HOME="$BACKEND_ROOT/runtimes/node22"

# Ép hệ thống đọc thư viện libaio cục bộ từ thư mục lib của MySQL
export LD_LIBRARY_PATH="$BACKEND_ROOT/runtimes/mysql/lib:$LD_LIBRARY_PATH"

# Đưa tất cả vào PATH tạm thời
export PATH="$JAVA_HOME/bin:$NODE_HOME/bin:$BACKEND_ROOT/runtimes/mysql/bin:$PATH"

# ✅ FIXED: Thêm cờ --lower-case-table-names=1 để xử lý lỗi sập Data Dictionary ngầm
mysqld --datadir=/home/tung/TTCSN/mysql_data --port=3307 --mysqlx=OFF --lower-case-table-names=1 --log-error=/home/tung/TTCSN/mysql_data/error.log --bind-address=127.0.0.1 &

echo "✅ Môi trường cô lập (Java 17, Node 22, MySQL + Libs) đã sẵn sàng!"