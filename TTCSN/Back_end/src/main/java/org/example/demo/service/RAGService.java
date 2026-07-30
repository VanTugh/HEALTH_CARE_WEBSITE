package org.example.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@Service
public class RAGService {
    private final RestTemplate restTemplate = new RestTemplate();
    private final String PYTHON_URL = "http://localhost:5000/recommend-doctors";

    public Map<String, Object> callPythonAI(String message) {
        try {
            Map<String, String> request = Map.of("query", message);
            // Python trả về Map có chứa "answer" và "doctor_id"
            return restTemplate.postForObject(PYTHON_URL, request, Map.class);
        } catch (Exception e) {
            System.err.println("❌ Lỗi gọi Python: " + e.getMessage());
            return Map.of("answer", "Hệ thống AI đang bận.", "doctor_id", null);
        }
    }
}