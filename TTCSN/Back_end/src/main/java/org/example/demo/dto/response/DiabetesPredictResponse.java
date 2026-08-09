package org.example.demo.dto.response;
 
import java.util.Map;
 
/**
 * DTO khớp với JSON trả về từ AI-Diabetes Python service:
 * {
 *   "prediction": 2,
 *   "label": "Tiểu đường",
 *   "probabilities": { "Không tiểu đường": 0.12, "Tiền tiểu đường": 0.40, "Tiểu đường": 0.46 }
 * }
 */
public class DiabetesPredictResponse {
 
    private Integer prediction;
    private String label;
    private Map<String, Double> probabilities;
 
    public DiabetesPredictResponse() {
    }
 
    public DiabetesPredictResponse(Integer prediction, String label, Map<String, Double> probabilities) {
        this.prediction = prediction;
        this.label = label;
        this.probabilities = probabilities;
    }
 
    public Integer getPrediction() { return prediction; }
    public void setPrediction(Integer prediction) { this.prediction = prediction; }
 
    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
 
    public Map<String, Double> getProbabilities() { return probabilities; }
    public void setProbabilities(Map<String, Double> probabilities) { this.probabilities = probabilities; }
}
 