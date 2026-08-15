package org.example.demo.controller;

import lombok.RequiredArgsConstructor;
import org.example.demo.dto.request.BaiVietRequest;
import org.example.demo.dto.response.ApiResponseDTO;
import org.example.demo.dto.response.BaiVietResponse;
import org.example.demo.service.BaiVietService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
public class BaiVietController {

    private final BaiVietService baiVietService;

    // Lấy danh sách bài viết (Có thể filter theo PhanLoai)
    @GetMapping
    public ResponseEntity<ApiResponseDTO<List<BaiVietResponse>>> getAll(@RequestParam(required = false) String category) {
        return ResponseEntity.ok(ApiResponseDTO.success(baiVietService.getAll(category)));
    }

    // Lấy 1 bài viết chi tiết để đọc
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<BaiVietResponse>> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponseDTO.success(baiVietService.getById(id)));
    }

    // Yêu cầu quyền Admin cho các endpoint dưới đây
    @PostMapping
    public ResponseEntity<ApiResponseDTO<BaiVietResponse>> create(@RequestBody BaiVietRequest request) {
        return ResponseEntity.ok(ApiResponseDTO.success(baiVietService.create(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<BaiVietResponse>> update(@PathVariable Integer id, @RequestBody BaiVietRequest request) {
        return ResponseEntity.ok(ApiResponseDTO.success(baiVietService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<String>> delete(@PathVariable Integer id) {
        baiVietService.delete(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Xóa bài viết thành công"));
    }
}
