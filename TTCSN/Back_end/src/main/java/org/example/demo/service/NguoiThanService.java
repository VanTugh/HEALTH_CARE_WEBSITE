package org.example.demo.service;

import org.example.demo.dto.request.NguoiThanRequest;
import org.example.demo.dto.response.NguoiThanResponse;
import org.example.demo.entity.NguoiDung;
import org.example.demo.entity.NguoiThan;
import org.example.demo.exception.ResourceNotFoundException;
import org.example.demo.exception.UnauthorizedException;
import org.example.demo.repository.NguoiDungRepository;
import org.example.demo.repository.NguoiThanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NguoiThanService {

    @Autowired
    private NguoiThanRepository nguoiThanRepository;

    @Autowired
    private NguoiDungRepository nguoiDungRepository;

    public List<NguoiThanResponse> getMyRelatives(Integer currentUserId) {
        List<NguoiThan> relatives = nguoiThanRepository.findByNguoiDung_NguoiDungIDAndIsDeletedFalse(currentUserId);
        return relatives.stream().map(NguoiThanResponse::of).collect(Collectors.toList());
    }

    public NguoiThanResponse addRelative(Integer currentUserId, NguoiThanRequest request) {
        NguoiDung user = nguoiDungRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        NguoiThan relative = new NguoiThan();
        relative.setNguoiDung(user);
        relative.setHoTen(request.getHoTen());
        relative.setMoiQuanHe(request.getMoiQuanHe());
        relative.setNgaySinh(request.getNgaySinh());
        relative.setGioiTinh(request.getGioiTinh());
        relative.setSoDienThoai(request.getSoDienThoai());
        relative.setDiaChi(request.getDiaChi());
        relative.setCreatedAt(LocalDateTime.now());
        relative.setIsDeleted(false);

        return NguoiThanResponse.of(nguoiThanRepository.save(relative));
    }

    public void deleteRelative(Integer currentUserId, Integer relativeId) {
        NguoiThan relative = nguoiThanRepository.findById(relativeId)
                .orElseThrow(() -> new ResourceNotFoundException("Relative not found"));
        
        if (!relative.getNguoiDung().getNguoiDungID().equals(currentUserId)) {
            throw new UnauthorizedException("You are not authorized to delete this relative");
        }

        relative.setIsDeleted(true);
        relative.setUpdatedAt(LocalDateTime.now());
        nguoiThanRepository.save(relative);
    }
}
