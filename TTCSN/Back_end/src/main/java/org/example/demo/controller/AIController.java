package org.example.demo.controller;

import org.example.demo.dto.request.ChatRequest;
import org.example.demo.service.DoctorService;
import org.example.demo.service.RAGService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    private final RAGService ragService;
    private final DoctorService doctorService;

    public AIController(RAGService ragService, DoctorService doctorService) {
        this.ragService = ragService;
        this.doctorService = doctorService;
    }

    @PostMapping("/chat")
    public ResponseEntity<?> chat(@RequestBody ChatRequest request) {
        
        // 1. Gửi tin nhắn sang Python, nhận về answer và doctor_id
        Map<String, Object> aiResponse = ragService.callPythonAI(request.getMessage());
        
        String answer = (String) aiResponse.get("answer");
        Integer doctorId = (Integer) aiResponse.get("doctor_id");

        // 2. Dùng doctor_id query vào DB (MySQL) lấy Full thông tin bác sĩ
        Map<String, Object> doctorDetail = null;
        if (doctorId != null) {
            doctorDetail = doctorService.getDoctorDetailForAI(doctorId);
        }

        // 3. Đóng gói JSON chuẩn 100% theo format ReactJS cần
        Map<String, Object> finalResponse = new HashMap<>();
        finalResponse.put("answer", answer);
        finalResponse.put("recommendedDoctor", doctorDetail); // Nếu null UI sẽ tự ẩn

        return ResponseEntity.ok(finalResponse);
    }
}