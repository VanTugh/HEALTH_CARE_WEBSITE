package org.example.demo.service;

import lombok.RequiredArgsConstructor;
import org.example.demo.dto.request.BaiVietRequest;
import org.example.demo.dto.response.BaiVietResponse;
import org.example.demo.entity.BaiViet;
import org.example.demo.repository.BaiVietRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BaiVietService {
    private final BaiVietRepository baiVietRepository;

    public List<BaiVietResponse> getAll(String phanLoai) {
        List<BaiViet> articles;
        if (phanLoai != null && !phanLoai.isEmpty()) {
            articles = baiVietRepository.findByPhanLoaiAndIsDeletedFalseOrderByCreatedAtDesc(phanLoai);
        } else {
            articles = baiVietRepository.findByIsDeletedFalseOrderByCreatedAtDesc();
        }
        return articles.stream().map(BaiVietResponse::of).collect(Collectors.toList());
    }

    public BaiVietResponse getById(Integer id) {
        BaiViet bv = baiVietRepository.findById(id).filter(b -> !b.getIsDeleted()).orElseThrow();
        // Tăng lượt xem lên 1 khi người dùng click vào xem
        bv.setLuotXem(bv.getLuotXem() + 1);
        baiVietRepository.save(bv);
        return BaiVietResponse.of(bv);
    }

    public BaiVietResponse create(BaiVietRequest request) {
        BaiViet bv = new BaiViet();
        bv.setTieuDe(request.getTieuDe());
        bv.setAnhBia(request.getAnhBia());
        bv.setPhanLoai(request.getPhanLoai());
        bv.setNoiDung(request.getNoiDung());
        bv.setLuotXem(0);
        return BaiVietResponse.of(baiVietRepository.save(bv));
    }

    public BaiVietResponse update(Integer id, BaiVietRequest request) {
        BaiViet bv = baiVietRepository.findById(id).filter(b -> !b.getIsDeleted()).orElseThrow();
        bv.setTieuDe(request.getTieuDe());
        if (request.getAnhBia() != null) {
            bv.setAnhBia(request.getAnhBia());
        }
        bv.setPhanLoai(request.getPhanLoai());
        bv.setNoiDung(request.getNoiDung());
        return BaiVietResponse.of(baiVietRepository.save(bv));
    }

    public void delete(Integer id) {
        BaiViet bv = baiVietRepository.findById(id).orElseThrow();
        bv.setIsDeleted(true);
        baiVietRepository.save(bv);
    }
}
