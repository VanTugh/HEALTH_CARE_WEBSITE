import subprocess
import sys

try:
    print("Running git status...")
    print(subprocess.getoutput("git status"))
    
    print("\nRunning git add .")
    print(subprocess.getoutput("git add ."))
    
    print("\nRunning git commit...")
    print(subprocess.getoutput('git commit -m "feat: Đặt lịch hộ, quản lý Voucher (phần trăm giảm giá) và hệ thống Blog CMS cho người dùng & Admin"'))
    
    print("\nRunning git push...")
    print(subprocess.getoutput("git push origin phung_tuan_anh"))
except Exception as e:
    print(f"Error: {e}")
