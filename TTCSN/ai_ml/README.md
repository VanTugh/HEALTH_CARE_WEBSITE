# guideline
```bash
1. git clone https://github.com/thang170725/04A-Diabets-012-BRFSS.git
2. Tải dataset ở https://www.kaggle.com/datasets/alexteboul/diabetes-health-indicators-dataset
    - Vị trí lưu trữ dataset 04A-Diabets-012-BRFSS/datasets/diabetes1.csv
    - lưu ý: dataset đổi tên là diabetes1.csv
2. cd 04A-Diabets-012-BRFSS
3. python -m venv .venv (recommand python 3.10)
4. .venv\Scripts\activate (Window)
3. pip install -r requirements.txt
4. python main.py
    nếu ra như này là chạy đúng (có thể số liệu sẽ khác tùy hệ điều hành, phiên bản)
#     (.venv) thang@PhatToNhuLai:~/workspace/test/HEALTH_CARE_WEBSITE/TTCSN/ai_ml$ python main.py
# Số lượng mẫu ban đầu: Counter({0.0: 170962, 2.0: 28277, 1.0: 3705})
# Số lượng mẫu sau khi giảm tải nhãn 0: Counter({0.0: 90000, 2.0: 28277, 1.0: 3705})
# /home/thang/workspace/test/HEALTH_CARE_WEBSITE/TTCSN/ai_ml/.venv/lib/python3.10/site-packages/sklearn/calibration.py:330: FutureWarning: The `cv='prefit'` option is deprecated in 1.6 and will be removed in 1.8. You can use CalibratedClassifierCV(FrozenEstimator(estimator)) instead.
#   warnings.warn(
# 🎉 Train thành công bằng phương pháp Hybrid Downsampling + Cost-Sensitive!
# ============================================================
# Accuracy: 0.6156

# Classification Report
#               precision    recall  f1-score   support

#          0.0     0.9560    0.6275    0.7577     42741
#          1.0     0.0303    0.3639    0.0560       926
#          2.0     0.3522    0.5769    0.4374      7069

#     accuracy                         0.6156     50736
#    macro avg     0.4462    0.5228    0.4170     50736
# weighted avg     0.8550    0.6156    0.7002     50736


# Confusion Matrix
# [[26818  8795  7128]
#  [  217   337   372]
#  [ 1016  1975  4078]]

# ============================================================
# Feature Importance

# HighBP                    0.2513
# GenHlth                   0.1508
# HighChol                  0.0894
# Age                       0.0548
# DiffWalk                  0.051
# BMI                       0.0422
# HeartDiseaseorAttack      0.0337
# HvyAlcoholConsump         0.0322
# CholCheck                 0.0312
# Income                    0.0282
# NoDocbcCost               0.0258
# Sex                       0.0231
# Education                 0.0225
# PhysActivity              0.0223
# Stroke                    0.022
# MentHlth                  0.0211
# Smoker                    0.0211
# PhysHlth                  0.0211
# Veggies                   0.0192
# Fruits                    0.0189
# AnyHealthcare             0.0182
# Saved model: models/xgboost.pkl
# Loaded model: models/xgboost.pkl
# 0
# [0.59417468 0.19437014 0.21145517]
```