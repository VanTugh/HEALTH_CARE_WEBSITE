"""
AI-Diabetes Prediction Service
------------------------------
Chạy service này bằng lệnh:
    uvicorn api:app --reload --port 8000

Sau đó mở trình duyệt vào: http://localhost:8000/docs
để test trực tiếp (Swagger UI), không cần code React/Java.
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import joblib
import numpy as np
import os
import warnings

warnings.filterwarnings("ignore")  # ẩn cảnh báo version sklearn/xgboost khi load pickle

app = FastAPI(title="AI-Diabetes Prediction API")

# ==== 1. Load model ====
# Đặt file xgboost.pkl cùng thư mục với file api.py này,
# hoặc chỉnh lại đường dẫn MODEL_PATH cho đúng.
MODEL_PATH = os.path.join(os.path.dirname(__file__), "models/xgboost.pkl")

_model_bundle = joblib.load(MODEL_PATH)
# model_bundle là dict gồm {'xgb': ..., 'calibrated': ...}
# Dùng 'calibrated' vì xác suất đáng tin hơn (đã hiệu chỉnh)
model = _model_bundle["calibrated"]

FEATURE_ORDER = [
    "HighBP", "HighChol", "CholCheck", "BMI", "Smoker", "Stroke",
    "HeartDiseaseorAttack", "PhysActivity", "Fruits", "Veggies",
    "HvyAlcoholConsump", "AnyHealthcare", "NoDocbcCost", "GenHlth",
    "MentHlth", "PhysHlth", "DiffWalk", "Sex", "Age", "Education", "Income",
]

LABELS = {
    0: "Không tiểu đường",
    1: "Tiền tiểu đường",
    2: "Tiểu đường",
}


# ==== 2. Định nghĩa dữ liệu đầu vào ====
class PatientData(BaseModel):
    HighBP: int = Field(..., ge=0, le=1, description="Cao huyết áp: 0=không, 1=có")
    HighChol: int = Field(..., ge=0, le=1, description="Cholesterol cao: 0=không, 1=có")
    CholCheck: int = Field(..., ge=0, le=1, description="Có kiểm tra cholesterol 5 năm qua")
    BMI: float = Field(..., gt=0, description="Chỉ số khối cơ thể")
    Smoker: int = Field(..., ge=0, le=1)
    Stroke: int = Field(..., ge=0, le=1, description="Từng bị đột quỵ")
    HeartDiseaseorAttack: int = Field(..., ge=0, le=1)
    PhysActivity: int = Field(..., ge=0, le=1, description="Có vận động thể chất")
    Fruits: int = Field(..., ge=0, le=1)
    Veggies: int = Field(..., ge=0, le=1)
    HvyAlcoholConsump: int = Field(..., ge=0, le=1)
    AnyHealthcare: int = Field(..., ge=0, le=1, description="Có bảo hiểm y tế")
    NoDocbcCost: int = Field(..., ge=0, le=1, description="Không đi khám vì tiền")
    GenHlth: int = Field(..., ge=1, le=5, description="Sức khỏe tổng quát 1(tốt)-5(kém)")
    MentHlth: int = Field(..., ge=0, le=30, description="Số ngày sức khỏe tâm thần kém/30 ngày")
    PhysHlth: int = Field(..., ge=0, le=30, description="Số ngày sức khỏe thể chất kém/30 ngày")
    DiffWalk: int = Field(..., ge=0, le=1, description="Khó khăn khi đi lại")
    Sex: int = Field(..., ge=0, le=1, description="0=nữ, 1=nam")
    Age: int = Field(..., ge=1, le=13, description="Nhóm tuổi mã hóa theo CDC (1-13)")
    Education: int = Field(..., ge=1, le=6, description="Trình độ học vấn (1-6)")
    Income: int = Field(..., ge=1, le=8, description="Mức thu nhập (1-8)")

    class Config:
        json_schema_extra = {
            "example": {
                "HighBP": 1, "HighChol": 1, "CholCheck": 1, "BMI": 30,
                "Smoker": 0, "Stroke": 0, "HeartDiseaseorAttack": 0,
                "PhysActivity": 1, "Fruits": 1, "Veggies": 1,
                "HvyAlcoholConsump": 0, "AnyHealthcare": 1, "NoDocbcCost": 0,
                "GenHlth": 3, "MentHlth": 0, "PhysHlth": 0, "DiffWalk": 0,
                "Sex": 1, "Age": 9, "Education": 4, "Income": 3
            }
        }


class PredictionResponse(BaseModel):
    prediction: int
    label: str
    probabilities: dict


# ==== 3. Endpoint ====
@app.get("/")
def health_check():
    return {"status": "ok", "message": "AI-Diabetes service is running"}


@app.post("/predict", response_model=PredictionResponse)
def predict(data: PatientData):
    try:
        # Sắp đúng thứ tự feature model yêu cầu
        row = [getattr(data, f) for f in FEATURE_ORDER]
        X = np.array([row])

        pred = int(model.predict(X)[0])
        proba = model.predict_proba(X)[0].tolist()

        return PredictionResponse(
            prediction=pred,
            label=LABELS.get(pred, str(pred)),
            probabilities={
                LABELS[0]: round(proba[0], 4),
                LABELS[1]: round(proba[1], 4),
                LABELS[2]: round(proba[2], 4),
            },
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Lỗi khi dự đoán: {str(e)}")
