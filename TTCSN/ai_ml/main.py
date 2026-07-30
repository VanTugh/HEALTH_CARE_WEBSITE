from utils.preprocessor import PreprocessorCSV
from core.train_xgboost import TrainXGBoost
from core.input_processor import InputPreprocessor

import pandas as pd

# 1. KHỞI TẠO
df = pd.read_csv('datasets/diabetes1.csv')
trainer = TrainXGBoost(df)

# 2. TRAIN MODEL
# trainer.split_data()
# trainer.train_hybrid()
# trainer.evaluate()
# trainer.feature_importance()
# trainer.save("models/xgboost.pkl")

model = trainer.load("models/xgboost.pkl")

# 2. predict
person = {

    "gender": "Male",

    "age": 46,

    "height": 170,          # cm

    "weight": 74,           # kg

    "high_blood_pressure": True,

    "high_cholesterol": False,

    "cholesterol_checked": True,

    "smoker": False,

    "stroke": False,

    "heart_disease": False,

    "physical_activity": True,

    "eat_fruits": True,

    "eat_vegetables": True,

    "heavy_alcohol": False,

    "has_healthcare": True,

    "cannot_afford_doctor": False,

    "general_health": "Good",

    "mental_health_days": 2,

    "physical_health_days": 0,

    "difficulty_walking": False,

    "education": "College Graduate",

    "income": "50k-75k"
}

# person = {

#     "gender": "Male",

#     "age": 72,

#     "height": 165,

#     "weight": 98,

#     "high_blood_pressure": True,

#     "high_cholesterol": True,

#     "cholesterol_checked": False,

#     "smoker": True,

#     "stroke": True,

#     "heart_disease": True,

#     "physical_activity": False,

#     "eat_fruits": False,

#     "eat_vegetables": False,

#     "heavy_alcohol": True,

#     "has_healthcare": False,

#     "cannot_afford_doctor": True,

#     "general_health": "Poor",

#     "mental_health_days": 30,

#     "physical_health_days": 30,

#     "difficulty_walking": True,

#     "education": "Elementary",

#     "income": "<10k"
# }

pre, pro = model.predict(person)

print(pre)
print(pro)