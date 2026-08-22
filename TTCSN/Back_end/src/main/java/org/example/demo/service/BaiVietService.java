package org.example.demo.service;

import lombok.RequiredArgsConstructor;
import org.example.demo.dto.request.BaiVietRequest;
import org.example.demo.dto.response.BaiVietResponse;
import org.example.demo.entity.BaiViet;
import org.example.demo.repository.BaiVietRepository;
import org.example.demo.repository.NguoiDungRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BaiVietService {
    private final BaiVietRepository baiVietRepository;
    private final NguoiDungRepository nguoiDungRepository;

    private BaiVietResponse mapToResponse(BaiViet bv) {
        BaiVietResponse res = BaiVietResponse.of(bv);
        // Ưu tiên tên tác giả tự điền, fallback về tên bác sĩ nếu không có
        if (bv.getTenTacGia() != null && !bv.getTenTacGia().isBlank()) {
            res.setTenNguoiTao(bv.getTenTacGia());
        } else if (bv.getNguoiTaoID() != null) {
            nguoiDungRepository.findById(bv.getNguoiTaoID())
                .ifPresent(u -> res.setTenNguoiTao(u.getHoTen()));
        } else {
            res.setTenNguoiTao("Quản trị viên HealthCare");
        }
        return res;
    }

    public List<BaiVietResponse> getAll(String phanLoai) {
        List<BaiViet> articles;
        if (phanLoai != null && !phanLoai.isEmpty()) {
            articles = baiVietRepository.findByPhanLoaiAndIsDeletedFalseOrderByCreatedAtDesc(phanLoai);
        } else {
            articles = baiVietRepository.findByIsDeletedFalseOrderByCreatedAtDesc();
        }
        return articles.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public BaiVietResponse getById(Integer id) {
        BaiViet bv = baiVietRepository.findById(id).filter(b -> !b.getIsDeleted()).orElseThrow();
        // Tăng lượt xem lên 1 khi người dùng click vào xem
        bv.setLuotXem(bv.getLuotXem() + 1);
        baiVietRepository.save(bv);
        return mapToResponse(bv);
    }

    public BaiVietResponse create(BaiVietRequest request) {
        BaiViet bv = new BaiViet();
        bv.setTieuDe(request.getTieuDe());
        bv.setAnhBia(request.getAnhBia());
        bv.setPhanLoai(request.getPhanLoai());
        bv.setNoiDung(request.getNoiDung());
        bv.setTenTacGia(request.getTenTacGia());
        bv.setLuotXem(0);
        return mapToResponse(baiVietRepository.save(bv));
    }

    public BaiVietResponse update(Integer id, BaiVietRequest request) {
        BaiViet bv = baiVietRepository.findById(id).filter(b -> !b.getIsDeleted()).orElseThrow();
        bv.setTieuDe(request.getTieuDe());
        if (request.getAnhBia() != null) {
            bv.setAnhBia(request.getAnhBia());
        }
        bv.setPhanLoai(request.getPhanLoai());
        bv.setNoiDung(request.getNoiDung());
        bv.setTenTacGia(request.getTenTacGia());
        return mapToResponse(baiVietRepository.save(bv));
    }

    public void delete(Integer id) {
        BaiViet bv = baiVietRepository.findById(id).orElseThrow();
        bv.setIsDeleted(true);
        baiVietRepository.save(bv);
    }
}
