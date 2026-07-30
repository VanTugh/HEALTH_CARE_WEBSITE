from dotenv import load_dotenv
load_dotenv()
from sqlalchemy import create_engine, text
import os


DB_URL = os.getenv('DB_URL')

def sql():
    return '''SELECT 
    b.BacSiID,
    n.HoTen AS TenBacSi,
    n.GioiTinh,
    ck.TenChuyenKhoa,
    td.TenTrinhDo,
    COALESCE(b.GiaKham, td.GiaKham) AS GiaKhamThucTe,
    b.SoNamKinhNghiem,
    b.GioiThieu,
    b.QuaTrinhDaoTao,
    b.KinhNghiemLamViec,
    b.ThanhTich,
    b.ChungChi,
    cs.TenCoSo,
    cs.DiaChi AS DiaChiCoSo,
    -- 1. Gộp danh sách lịch làm việc mặc định trong tuần (Dạng chuỗi)
    (SELECT GROUP_CONCAT(CONCAT('Thứ ', l.ThuTrongTuan, ' ca ', l.Ca, ' (', TIME_FORMAT(l.ThoiGianBatDau, '%H:%i'), '-', TIME_FORMAT(l.ThoiGianKetThuc, '%H:%i'), ')') SEPARATOR '; ')
     FROM LichLamViecMacDinh l 
     WHERE l.CoSoID = b.ChuyenKhoaID -- Hoặc l.CoSoID = 1 theo thiết kế của bạn
       AND l.IsActive = 1 AND l.IsDeleted = 0) AS LichLamViecCoDinh,
    -- 2. Gộp danh sách các ngày nghỉ đã ĐƯỢC DUYỆT sắp tới để AI biết đường né lịch
    (SELECT GROUP_CONCAT(CONCAT(
                CASE 
                    WHEN nn.LoaiNghi = 'NGAY_CU_THE' THEN CONCAT('Ngày ', DATE_FORMAT(nn.NgayNghiCuThe, '%d/%m/%Y'))
                    WHEN nn.LoaiNghi = 'CA_CU_THE' THEN CONCAT('Ca ', nn.Ca, ' ngày ', DATE_FORMAT(nn.NgayNghiCuThe, '%d/%m/%Y'))
                    ELSE CONCAT('Thứ ', nn.ThuTrongTuan, ' hàng tuần ca ', COALESCE(nn.Ca, 'Cả ngày'))
                END, 
                ' (Lý do: ', nn.LyDo, ')')
            SEPARATOR '; ')
     FROM BacSiNgayNghi nn 
     WHERE nn.BacSiID = b.BacSiID 
       AND nn.TrangThai = 'DA_DUYET' 
       AND (nn.NgayNghiCuThe >= CURDATE() OR nn.LoaiNghi = 'CA_HANG_TUAN')
       AND nn.IsDeleted = 0) AS DanhSachNgayNghi
FROM BacSi b
INNER JOIN NguoiDung n ON b.BacSiID = n.NguoiDungID
INNER JOIN ChuyenKhoa ck ON b.ChuyenKhoaID = ck.ChuyenKhoaID
INNER JOIN TrinhDo td ON b.TrinhDoID = td.TrinhDoID
INNER JOIN CoSoYTe cs ON ck.CoSoID = cs.CoSoID
WHERE b.IsDeleted = 0 AND n.IsDeleted = 0 AND n.TrangThai = 1;'''

class DBService:
    def __init__(self):
        self.engine = create_engine(
            url=DB_URL
        )

    def test(self):
        with self.engine.connect() as conn:
            print('DB CONNECT OK')
    
    def run_sql(self, command: str):
        with self.engine.begin() as connection:
            result = connection.execute(
                text(command)
            )
            return result.mappings().all()

if __name__ == "__main__":
    db_service = DBService()
    print(db_service.run_sql(sql()))