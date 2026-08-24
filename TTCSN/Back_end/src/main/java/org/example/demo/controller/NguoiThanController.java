package org.example.demo.controller;

import jakarta.validation.Valid;
import org.example.demo.dto.response.ApiResponseDTO;
import org.example.demo.dto.request.NguoiThanRequest;
import org.example.demo.dto.response.NguoiThanResponse;
import org.example.demo.security.CustomUserDetails;
import org.example.demo.service.NguoiThanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/relatives")
public class NguoiThanController {

    @Autowired
    private NguoiThanService nguoiThanService;

    @GetMapping
    public ResponseEntity<ApiResponseDTO<List<NguoiThanResponse>>> getMyRelatives(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        List<NguoiThanResponse> result = nguoiThanService.getMyRelatives(userDetails.getNguoiDungID());
        return ResponseEntity.ok(ApiResponseDTO.success(result, "Lấy danh sách người thân thành công"));
    }

    @PostMapping
    public ResponseEntity<ApiResponseDTO<NguoiThanResponse>> addRelative(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody NguoiThanRequest request) {
        
        NguoiThanResponse result = nguoiThanService.addRelative(userDetails.getNguoiDungID(), request);
        return ResponseEntity.ok(ApiResponseDTO.success(result, "Thêm người thân thành công"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<Void>> deleteRelative(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Integer id) {
        
        nguoiThanService.deleteRelative(userDetails.getNguoiDungID(), id);
        return ResponseEntity.ok(ApiResponseDTO.success(null, "Xóa người thân thành công"));
    }
}
