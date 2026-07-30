package org.example.demo.controller;

import org.example.demo.dto.response.SlotRanhResponse;
import org.example.demo.service.BacSiService2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bac-si-2") // Đổi endpoint nhẹ sang /api/bac-si-2 để tránh trùng route
@CrossOrigin(origins = "*")
public class BacSiController2 {

    private final BacSiService2 bacSiService2;

    public BacSiController2(BacSiService2 bacSiService2) {
        this.bacSiService2 = bacSiService2;
    }

    @GetMapping("/{bacSiId}/lich-ranh")
    public ResponseEntity<List<SlotRanhResponse>> getLichRanh(
            @PathVariable Integer bacSiId,
            @RequestParam("ngay") String ngay) {
        
        List<SlotRanhResponse> slots = bacSiService2.getLichRanhBacSi(bacSiId, ngay);
        return ResponseEntity.ok(slots);
    }
}