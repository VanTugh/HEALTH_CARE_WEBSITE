package org.example.demo.dto.request;
 
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
 
/**
 * DTO nhận dữ liệu bệnh nhân từ Front_end (React) để gửi sang
 * AI-Diabetes Python service (/predict).
 *
 * Thứ tự và tên trường phải khớp đúng với FEATURE_ORDER trong api.py.
 */
public class DiabetesPredictRequest {
 
    @NotNull @Min(0) @Max(1)
    private Integer highBP;
 
    @NotNull @Min(0) @Max(1)
    private Integer highChol;
 
    @NotNull @Min(0) @Max(1)
    private Integer cholCheck;
 
    @NotNull
    private Double bmi;
 
    @NotNull @Min(0) @Max(1)
    private Integer smoker;
 
    @NotNull @Min(0) @Max(1)
    private Integer stroke;
 
    @NotNull @Min(0) @Max(1)
    private Integer heartDiseaseorAttack;
 
    @NotNull @Min(0) @Max(1)
    private Integer physActivity;
 
    @NotNull @Min(0) @Max(1)
    private Integer fruits;
 
    @NotNull @Min(0) @Max(1)
    private Integer veggies;
 
    @NotNull @Min(0) @Max(1)
    private Integer hvyAlcoholConsump;
 
    @NotNull @Min(0) @Max(1)
    private Integer anyHealthcare;
 
    @NotNull @Min(0) @Max(1)
    private Integer noDocbcCost;
 
    @NotNull @Min(1) @Max(5)
    private Integer genHlth;
 
    @NotNull @Min(0) @Max(30)
    private Integer mentHlth;
 
    @NotNull @Min(0) @Max(30)
    private Integer physHlth;
 
    @NotNull @Min(0) @Max(1)
    private Integer diffWalk;
 
    @NotNull @Min(0) @Max(1)
    private Integer sex;
 
    @NotNull @Min(1) @Max(13)
    private Integer age;
 
    @NotNull @Min(1) @Max(6)
    private Integer education;
 
    @NotNull @Min(1) @Max(8)
    private Integer income;
 
    // ==== Getters & Setters ====
 
    public Integer getHighBP() { return highBP; }
    public void setHighBP(Integer highBP) { this.highBP = highBP; }
 
    public Integer getHighChol() { return highChol; }
    public void setHighChol(Integer highChol) { this.highChol = highChol; }
 
    public Integer getCholCheck() { return cholCheck; }
    public void setCholCheck(Integer cholCheck) { this.cholCheck = cholCheck; }
 
    public Double getBmi() { return bmi; }
    public void setBmi(Double bmi) { this.bmi = bmi; }
 
    public Integer getSmoker() { return smoker; }
    public void setSmoker(Integer smoker) { this.smoker = smoker; }
 
    public Integer getStroke() { return stroke; }
    public void setStroke(Integer stroke) { this.stroke = stroke; }
 
    public Integer getHeartDiseaseorAttack() { return heartDiseaseorAttack; }
    public void setHeartDiseaseorAttack(Integer heartDiseaseorAttack) { this.heartDiseaseorAttack = heartDiseaseorAttack; }
 
    public Integer getPhysActivity() { return physActivity; }
    public void setPhysActivity(Integer physActivity) { this.physActivity = physActivity; }
 
    public Integer getFruits() { return fruits; }
    public void setFruits(Integer fruits) { this.fruits = fruits; }
 
    public Integer getVeggies() { return veggies; }
    public void setVeggies(Integer veggies) { this.veggies = veggies; }
 
    public Integer getHvyAlcoholConsump() { return hvyAlcoholConsump; }
    public void setHvyAlcoholConsump(Integer hvyAlcoholConsump) { this.hvyAlcoholConsump = hvyAlcoholConsump; }
 
    public Integer getAnyHealthcare() { return anyHealthcare; }
    public void setAnyHealthcare(Integer anyHealthcare) { this.anyHealthcare = anyHealthcare; }
 
    public Integer getNoDocbcCost() { return noDocbcCost; }
    public void setNoDocbcCost(Integer noDocbcCost) { this.noDocbcCost = noDocbcCost; }
 
    public Integer getGenHlth() { return genHlth; }
    public void setGenHlth(Integer genHlth) { this.genHlth = genHlth; }
 
    public Integer getMentHlth() { return mentHlth; }
    public void setMentHlth(Integer mentHlth) { this.mentHlth = mentHlth; }
 
    public Integer getPhysHlth() { return physHlth; }
    public void setPhysHlth(Integer physHlth) { this.physHlth = physHlth; }
 
    public Integer getDiffWalk() { return diffWalk; }
    public void setDiffWalk(Integer diffWalk) { this.diffWalk = diffWalk; }
 
    public Integer getSex() { return sex; }
    public void setSex(Integer sex) { this.sex = sex; }
 
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
 
    public Integer getEducation() { return education; }
    public void setEducation(Integer education) { this.education = education; }
 
    public Integer getIncome() { return income; }
    public void setIncome(Integer income) { this.income = income; }
}