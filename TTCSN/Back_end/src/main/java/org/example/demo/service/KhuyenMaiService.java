package org.example.demo.service;

import lombok.RequiredArgsConstructor;
import org.example.demo.dto.request.KhuyenMaiRequest;
import org.example.demo.dto.response.KhuyenMaiResponse;
import org.example.demo.entity.KhuyenMai;
import org.example.demo.repository.KhuyenMaiRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class KhuyenMaiService {
    private final KhuyenMaiRepository khuyenMaiRepository;

    public List<KhuyenMaiResponse> getAll() {
        return khuyenMaiRepository.findAll().stream()
                .filter(km -> !km.getIsDeleted())
                .map(KhuyenMaiResponse::of)
                .collect(Collectors.toList());
    }

    public List<KhuyenMaiResponse> getActiveVouchers() {
        LocalDateTime now = LocalDateTime.now();
        return khuyenMaiRepository.findAll().stream()
                .filter(km -> !km.getIsDeleted() 
                           && km.getTrangThai() 
                           && km.getSoLuong() > 0 
                           && !now.isBefore(km.getNgayBatDau()) 
                           && !now.isAfter(km.getNgayKetThuc()))
                .map(KhuyenMaiResponse::of)
                .collect(Collectors.toList());
    }

    public KhuyenMaiResponse getByMaVoucher(String code) {
        return khuyenMaiRepository.findByMaVoucherAndIsDeletedFalse(code)
                .map(KhuyenMaiResponse::of)
                .orElse(null);
    }

    public KhuyenMaiResponse create(KhuyenMaiRequest request) {
        KhuyenMai km = new KhuyenMai();
        mapToEntity(request, km);
        return KhuyenMaiResponse.of(khuyenMaiRepository.save(km));
    }

    public KhuyenMaiResponse update(Integer id, KhuyenMaiRequest request) {
        KhuyenMai km = khuyenMaiRepository.findById(id).orElseThrow();
        mapToEntity(request, km);
        return KhuyenMaiResponse.of(khuyenMaiRepository.save(km));
    }

    public void delete(Integer id) {
        KhuyenMai km = khuyenMaiRepository.findById(id).orElseThrow();
        km.setIsDeleted(true);
        khuyenMaiRepository.save(km);
    }

    private void mapToEntity(KhuyenMaiRequest request, KhuyenMai km) {
        km.setMaVoucher(request.getMaVoucher());
        km.setTenKhuyenMai(request.getTenKhuyenMai());
        km.setPhanTramGiam(request.getPhanTramGiam());
        km.setGiamToiDa(request.getGiamToiDa());
        km.setSoLuong(request.getSoLuong());
        km.setNgayBatDau(request.getNgayBatDau());
        km.setNgayKetThuc(request.getNgayKetThuc());
        if (request.getTrangThai() != null) km.setTrangThai(request.getTrangThai());
    }
}
