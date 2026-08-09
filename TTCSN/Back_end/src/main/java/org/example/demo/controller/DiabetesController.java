package org.example.demo.controller;
 
import jakarta.validation.Valid;
import org.example.demo.dto.request.DiabetesPredictRequest;
import org.example.demo.dto.response.DiabetesPredictResponse;
import org.example.demo.service.DiabetesPredictionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
 
@RestController
@RequestMapping("/api/diabetes")
@CrossOrigin(origins = "*") // Test xong nên giới hạn lại đúng domain của Front_end
public class DiabetesController {
 
    private final DiabetesPredictionService diabetesPredictionService;
 
    public DiabetesController(DiabetesPredictionService diabetesPredictionService) {
        this.diabetesPredictionService = diabetesPredictionService;
    }
 
    /**
     * React gọi: POST http://localhost:<port_java>/api/diabetes/predict
     * Body: JSON khớp với DiabetesPredictRequest (21 trường)
     */
    @PostMapping("/predict")
    public ResponseEntity<DiabetesPredictResponse> predict(@Valid @RequestBody DiabetesPredictRequest request) {
        DiabetesPredictResponse response = diabetesPredictionService.predict(request);
        return ResponseEntity.ok(response);
    }
}
 