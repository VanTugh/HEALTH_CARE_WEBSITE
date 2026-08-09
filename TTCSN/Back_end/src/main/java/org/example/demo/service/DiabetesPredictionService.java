package org.example.demo.service;
 
import org.example.demo.dto.request.DiabetesPredictRequest;
import org.example.demo.dto.response.DiabetesPredictResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
 
import java.util.LinkedHashMap;
import java.util.Map;
 
@Service
public class DiabetesPredictionService {
 
    private final RestTemplate restTemplate;
 
    // Đường dẫn tới Python service, cấu hình trong application.properties:
    // ai.diabetes.service.url=http://localhost:8000/predict
    @Value("${ai.diabetes.service.url}")
    private String aiServiceUrl;
 
    public DiabetesPredictionService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }
 
    public DiabetesPredictResponse predict(DiabetesPredictRequest request) {
        // Python (FastAPI) yêu cầu đúng tên trường như trong pydantic model
        // (viết hoa chữ cái đầu, ví dụ "HighBP"), khác với camelCase bên Java,
        // nên phải map lại thủ công ở đây.
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("HighBP", request.getHighBP());
        payload.put("HighChol", request.getHighChol());
        payload.put("CholCheck", request.getCholCheck());
        payload.put("BMI", request.getBmi());
        payload.put("Smoker", request.getSmoker());
        payload.put("Stroke", request.getStroke());
        payload.put("HeartDiseaseorAttack", request.getHeartDiseaseorAttack());
        payload.put("PhysActivity", request.getPhysActivity());
        payload.put("Fruits", request.getFruits());
        payload.put("Veggies", request.getVeggies());
        payload.put("HvyAlcoholConsump", request.getHvyAlcoholConsump());
        payload.put("AnyHealthcare", request.getAnyHealthcare());
        payload.put("NoDocbcCost", request.getNoDocbcCost());
        payload.put("GenHlth", request.getGenHlth());
        payload.put("MentHlth", request.getMentHlth());
        payload.put("PhysHlth", request.getPhysHlth());
        payload.put("DiffWalk", request.getDiffWalk());
        payload.put("Sex", request.getSex());
        payload.put("Age", request.getAge());
        payload.put("Education", request.getEducation());
        payload.put("Income", request.getIncome());
 
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
 
        try {
            return restTemplate.postForObject(aiServiceUrl, entity, DiabetesPredictResponse.class);
        } catch (RestClientException e) {
            throw new IllegalStateException(
                    "Không gọi được AI-Diabetes service tại " + aiServiceUrl
                            + ". Kiểm tra service Python đã chạy chưa. Chi tiết: " + e.getMessage(),
                    e
            );
        }
    }
}