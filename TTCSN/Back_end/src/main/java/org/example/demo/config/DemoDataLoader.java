package org.example.demo.config;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.example.demo.entity.BacSi;
import org.example.demo.entity.ChuyenKhoa;
import org.example.demo.entity.CoSoYTe;
import org.example.demo.entity.LichLamViecMacDinh;
import org.example.demo.entity.NguoiDung;
import org.example.demo.entity.TrinhDo;
import org.example.demo.enums.CaLamViec;
import org.example.demo.enums.VaiTro;
import org.example.demo.repository.BacSiRepository;
import org.example.demo.repository.ChuyenKhoaRepository;
import org.example.demo.repository.CoSoYTeRepository;
import org.example.demo.repository.LichLamViecMacDinhRepository;
import org.example.demo.repository.NguoiDungRepository;
import org.example.demo.repository.TrinhDoRepository;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Profile("demo")
@RequiredArgsConstructor
@Slf4j
public class DemoDataLoader {

    static final String DEMO_PASSWORD = "admin123";

    private final CoSoYTeRepository coSoYTeRepository;
    private final TrinhDoRepository trinhDoRepository;
    private final ChuyenKhoaRepository chuyenKhoaRepository;
    private final NguoiDungRepository nguoiDungRepository;
    private final BacSiRepository bacSiRepository;
    private final LichLamViecMacDinhRepository lichLamViecMacDinhRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void loadIfEmpty() {
        if (coSoYTeRepository.count() > 0) {
            return;
        }

        log.info("========================================");
        log.info("Dang nap du lieu demo (khong can MySQL)...");
        log.info("========================================");

        CoSoYTe coSo = createFacility();
        List<TrinhDo> trinhDos = createDegrees();
        List<ChuyenKhoa> chuyenKhoas = createSpecialties(coSo);
        createDefaultSchedule(coSo);
        createUser("Admin System", "admin@healthcare.com", VaiTro.Admin, null, null, 0);
        createUser("Nguyen Van Benh Nhan", "patient@healthcare.com", VaiTro.BenhNhan, null, null, 0);
        createDoctor("BS. Nguyen Van An", "doctor@healthcare.com", chuyenKhoas.get(3), trinhDos.get(2), 15);
        createDoctor("BS. Tran Thi Binh", "bs.timmach@example.com", chuyenKhoas.get(3), trinhDos.get(1), 12);
        createDoctor("BS. Le Van Cuong", "bs.cxk@example.com", chuyenKhoas.get(0), trinhDos.get(2), 10);
        createDoctor("BS. Pham Thi Dung", "bs.thankinh@example.com", chuyenKhoas.get(1), trinhDos.get(3), 8);
        createDoctor("BS. Hoang Van Em", "bs.tieuhoa@example.com", chuyenKhoas.get(2), trinhDos.get(1), 6);

        log.info("========================================");
        log.info("Demo data loaded. Tai khoan test:");
        log.info("  Admin:   admin@healthcare.com / {}", DEMO_PASSWORD);
        log.info("  Patient: patient@healthcare.com / {}", DEMO_PASSWORD);
        log.info("  Doctor:  doctor@healthcare.com / {}", DEMO_PASSWORD);
        log.info("========================================");
    }

    private CoSoYTe createFacility() {
        CoSoYTe coSo = new CoSoYTe();
        coSo.setTenCoSo("Benh vien Bach Mai");
        coSo.setDiaChi("So 78, Duong Giai Phong, Ha Noi");
        coSo.setSoDienThoai("024 3869 3731");
        coSo.setEmail("contact@bvbachmai.vn");
        coSo.setWebsite("https://bvbachmai.vn");
        coSo.setMoTa("Benh vien hang dau Viet Nam voi doi ngu y bac si gioi va trang thiet bi hien dai.");
        coSo.setLogo("/images/logo-bachmai.png");
        coSo.setGioLamViec("07:00 - 17:30");
        coSo.setNgayLamViec("Thu 2 - Thu 7");
        return coSoYTeRepository.save(coSo);
    }

    private List<TrinhDo> createDegrees() {
        return trinhDoRepository.saveAll(List.of(
                degree("Bac si Da khoa", "Bac si da khoa", "150000", 1),
                degree("Bac si Chuyen khoa I", "Bac si chuyen khoa cap 1", "250000", 2),
                degree("Bac si Chuyen khoa II", "Bac si chuyen khoa cap 2", "300000", 3),
                degree("Thac si", "Thac si Y khoa", "400000", 4),
                degree("Tien si", "Tien si Y khoa", "500000", 5),
                degree("Pho Giao su", "Pho Giao su", "700000", 6),
                degree("Giao su", "Giao su", "800000", 7)
        ));
    }

    private TrinhDo degree(String ten, String moTa, String gia, int thuTu) {
        TrinhDo trinhDo = new TrinhDo();
        trinhDo.setTenTrinhDo(ten);
        trinhDo.setMoTa(moTa);
        trinhDo.setGiaKham(new BigDecimal(gia));
        trinhDo.setThuTuUuTien(thuTu);
        return trinhDo;
    }

    private List<ChuyenKhoa> createSpecialties(CoSoYTe coSo) {
        return chuyenKhoaRepository.saveAll(List.of(
                specialty(coSo, "Co xuong khop", "Chuyen khoa dieu tri xuong khop",
                        "https://cdn.bookingcare.vn/fo/w640/2023/12/26/101627-co-xuong-khop.png", 1),
                specialty(coSo, "Than kinh", "Kham va dieu tri than kinh",
                        "https://cdn.bookingcare.vn/fo/w640/2023/12/26/101739-than-kinh.png", 2),
                specialty(coSo, "Tieu hoa", "Chan doan tieu hoa",
                        "https://cdn.bookingcare.vn/fo/w640/2023/12/26/101713-tieu-hoa.png", 3),
                specialty(coSo, "Tim mach", "Chuyen khoa tim mach",
                        "https://cdn.bookingcare.vn/fo/w640/2023/12/26/101713-tim-mach.png", 4),
                specialty(coSo, "Tai Mui Hong", "Kham tai mui hong",
                        "https://cdn.bookingcare.vn/fo/w640/2023/12/26/101713-tai-mui-hong.png", 5),
                specialty(coSo, "Cot song", "Dieu tri cot song",
                        "https://cdn.bookingcare.vn/fo/w640/2023/12/26/101627-cot-song.png", 6),
                specialty(coSo, "Da lieu", "Dieu tri da lieu",
                        "https://cdn.bookingcare.vn/fo/w640/2023/12/26/101638-da-lieu.png", 7),
                specialty(coSo, "Ho hap", "Dieu tri ho hap",
                        "https://cdn.bookingcare.vn/fo/w640/2023/12/26/101638-ho-hap-phoi.png", 8),
                specialty(coSo, "Mat", "Dieu tri ve mat",
                        "https://cdn.bookingcare.vn/fo/w640/2023/12/26/101638-mat.png", 9)
        ));
    }

    private ChuyenKhoa specialty(CoSoYTe coSo, String ten, String moTa, String anh, int thuTu) {
        ChuyenKhoa chuyenKhoa = new ChuyenKhoa();
        chuyenKhoa.setCoSoYTe(coSo);
        chuyenKhoa.setTenChuyenKhoa(ten);
        chuyenKhoa.setMoTa(moTa);
        chuyenKhoa.setAnhDaiDien(anh);
        chuyenKhoa.setThuTuHienThi(thuTu);
        return chuyenKhoa;
    }

    private void createDefaultSchedule(CoSoYTe coSo) {
        for (int thu = 2; thu <= 8; thu++) {
            lichLamViecMacDinhRepository.save(buildSchedule(coSo, thu, CaLamViec.SANG));
            lichLamViecMacDinhRepository.save(buildSchedule(coSo, thu, CaLamViec.CHIEU));
        }
    }

    private LichLamViecMacDinh buildSchedule(CoSoYTe coSo, int thu, CaLamViec ca) {
        LichLamViecMacDinh schedule = new LichLamViecMacDinh();
        schedule.setCoSoYTe(coSo);
        schedule.setThuTrongTuan(thu);
        schedule.setCa(ca);
        schedule.setThoiGianBatDau(LocalTime.of(8, 0));
        schedule.setThoiGianKetThuc(ca == CaLamViec.SANG ? LocalTime.of(12, 0) : LocalTime.of(17, 0));
        schedule.setIsActive(true);
        schedule.setGhiChu("Lich chuan");
        schedule.setCreatedBy(1);
        return schedule;
    }

    private void createUser(String hoTen, String email, VaiTro vaiTro, ChuyenKhoa chuyenKhoa, TrinhDo trinhDo,
            int soNamKinhNghiem) {
        NguoiDung user = new NguoiDung();
        user.setHoTen(hoTen);
        user.setEmail(email);
        user.setMatKhau(passwordEncoder.encode(DEMO_PASSWORD));
        user.setSoDienThoai("0901234567");
        user.setDiaChi("Ha Noi");
        user.setNgaySinh(LocalDate.of(1990, 1, 1));
        user.setGioiTinh(1);
        user.setVaiTro(vaiTro);
        user.setTrangThai(true);
        user.setIsDeleted(false);
        user.setBadPoint(0);
        NguoiDung saved = nguoiDungRepository.save(user);

        if (vaiTro == VaiTro.BacSi) {
            BacSi bacSi = new BacSi();
            bacSi.setNguoiDung(saved);
            bacSi.setChuyenKhoa(chuyenKhoa);
            bacSi.setTrinhDo(trinhDo);
            bacSi.setSoNamKinhNghiem(soNamKinhNghiem);
            bacSi.setGioiThieu("Bac si co nhieu nam kinh nghiem trong linh vuc chuyen mon.");
            bacSi.setGiaKham(trinhDo.getGiaKham());
            bacSi.setTrangThaiCongViec(true);
            bacSi.setSoNgayPhepNam(12);
            bacSi.setSoNgayPhepDaSuDung(0);
            bacSi.setNamApDung(LocalDate.now().getYear());
            bacSiRepository.save(bacSi);
        }
    }

    private void createDoctor(String hoTen, String email, ChuyenKhoa chuyenKhoa, TrinhDo trinhDo,
            int soNamKinhNghiem) {
        createUser(hoTen, email, VaiTro.BacSi, chuyenKhoa, trinhDo, soNamKinhNghiem);
    }
}
