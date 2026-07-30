import joblib
from collections import Counter
from imblearn.under_sampling import RandomUnderSampler
from xgboost import XGBClassifier

from sklearn.model_selection import train_test_split
from sklearn.utils.class_weight import compute_sample_weight

from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)
from imblearn.over_sampling import SMOTENC
from sklearn.calibration import CalibratedClassifierCV

import pandas as pd

from core.input_processor import InputPreprocessor

class TrainXGBoost:
    def __init__(self, df):

        self.df = df

        self.X = df.drop(columns=["Diabetes_012"])
        self.y = df["Diabetes_012"]

        self.xgb_model = None      # Model XGBoost gốc
        self.model = None          # Model đã calibration

    # ==========================================================
    # Split data
    # ==========================================================

    def split_data(
        self,
        test_size=0.2,
        random_state=42
    ):

        (
            self.X_train,
            self.X_test,
            self.y_train,
            self.y_test
        ) = train_test_split(

            self.X,
            self.y,

            test_size=test_size,

            random_state=random_state,

            stratify=self.y
        )

    # ==========================================================
    # Train
    # ==========================================================

    def train(self):

        categorical_columns = [
            "HighBP",
            "HighChol",
            "CholCheck",
            "Smoker",
            "Stroke",
            "HeartDiseaseorAttack",
            "PhysActivity",
            "Fruits",
            "Veggies",
            "HvyAlcoholConsump",
            "AnyHealthcare",
            "NoDocbcCost",
            "DiffWalk",
            "Sex",
            "GenHlth",
            "Age",
            "Education",
            "Income"
        ]

        categorical_features = [
            self.X.columns.get_loc(col)
            for col in categorical_columns
        ]

        smote = SMOTENC(
            categorical_features=categorical_features,
            random_state=42
        )

        X_train_resampled, y_train_resampled = smote.fit_resample(
            self.X_train,
            self.y_train
        )

        # Model XGBoost
        self.xgb_model = XGBClassifier(
            objective="multi:softprob",
            num_class=3,
            n_estimators=300,
            learning_rate=0.05,
            max_depth=6,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42,
            eval_metric="mlogloss"
        )

        # Train để lấy Feature Importance
        self.xgb_model.fit(
            X_train_resampled,
            y_train_resampled
        )

        # Calibration
        self.model = CalibratedClassifierCV(
            estimator=self.xgb_model,
            method="sigmoid",
            cv="prefit"
        )

        self.model.fit(
            X_train_resampled,
            y_train_resampled
        )

    # train model by class weight
    def train_hybrid(self):
        # 1. Tính toán số lượng mẫu hiện tại
        print("Số lượng mẫu ban đầu:", Counter(self.y_train))

        # 2. Cấu hình chiến lược Downsampling chủ động (Chỉ giảm nhãn 0.0 xuống mức vừa phải)
        # Ví dụ: Ép nhãn 0.0 về 90.000 mẫu, giữ nguyên nhãn 1 và 2 
        # (Bạn tự thay số cụ thể dựa trên số lượng tập Train thực tế của bạn)
        sampling_strategy = {
            0.0: 90000, 
            1.0: Counter(self.y_train)[1.0], 
            2.0: Counter(self.y_train)[2.0]
        }

        rus = RandomUnderSampler(sampling_strategy=sampling_strategy, random_state=42)
        X_train_resampled, y_train_resampled = rus.fit_resample(self.X_train, self.y_train)

        print("Số lượng mẫu sau khi giảm tải nhãn 0:", Counter(y_train_resampled))

        # 3. Tính sample_weight trên tập dữ liệu mới (Lúc này tỷ lệ phạt sẽ nhẹ nhàng và mượt hơn)
        sample_weights = compute_sample_weight(
            class_weight='balanced', 
            y=y_train_resampled
        )

        # 4. Khởi tạo và Fit XGBoost
        self.xgb_model = XGBClassifier(
            objective="multi:softprob",
            num_class=3,
            n_estimators=250,
            learning_rate=0.05,
            max_depth=5,              # Để 5 là mức cân bằng tốt
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42,
            eval_metric="mlogloss"
        )

        self.xgb_model.fit(
            X_train_resampled,
            y_train_resampled,
            sample_weight=sample_weights
        )

        # 5. Hiệu chuẩn xác suất trên tập dữ liệu resampled
        self.model = CalibratedClassifierCV(
            estimator=self.xgb_model,
            method="sigmoid",
            cv="prefit"
        )
        self.model.fit(
            X_train_resampled,
            y_train_resampled,
            sample_weight=sample_weights
        )

        print("🎉 Train thành công bằng phương pháp Hybrid Downsampling + Cost-Sensitive!")
    
    # ==========================================================
    # Evaluate
    # ==========================================================
    def evaluate(self):

        pred = self.model.predict(self.X_test)

        print("=" * 60)

        print(

            "Accuracy:",

            round(
                accuracy_score(
                    self.y_test,
                    pred
                ),
                4
            )
        )

        print()

        print("Classification Report")

        print(

            classification_report(

                self.y_test,

                pred,

                digits=4
            )
        )

        print()

        print("Confusion Matrix")

        print(

            confusion_matrix(

                self.y_test,

                pred
            )
        )

    # ==========================================================
    # Feature Importance
    # ==========================================================

    def feature_importance(self):

        importance = sorted(

            zip(

                self.X.columns,

                self.xgb_model.feature_importances_

            ),

            key=lambda x: x[1],

            reverse=True
        )

        print()

        print("=" * 60)

        print("Feature Importance")

        print()

        for feature, score in importance:

            print(

                f"{feature:25}",

                round(float(score), 4)
            )

    # ==========================================================
    # Predict
    # ==========================================================

    def predict(self, person):
        if self.model is None:
            raise Exception("Model chưa train")

        data = InputPreprocessor.preprocess(person)

        data = data[self.X.columns]

        prediction = self.model.predict(data)[0]

        probability = self.model.predict_proba(data)[0]

        return prediction, probability

    # ==========================================================
    # Save
    # ==========================================================

    def save(self, path):
        joblib.dump(
            {
                'xgb': self.xgb_model,
                'calibrated': self.model
            },
            path
        )

        print(

            "Saved model:",

            path
        )

    # ==========================================================
    # Load
    # ==========================================================

    def load(self, path):
        models = joblib.load(path)

        self.xgb_model = models['xgb']
        self.model = models['calibrated']

        print(

            "Loaded model:",

            path
        )

        return self

if __name__ == "__main__":
    df = pd.read_csv('datasets/diabetes1.csv')

    trainer = TrainXGBoost(df)

    trainer.split_data()

    trainer.train()

    trainer.evaluate()

    trainer.feature_importance()

    trainer.save("models/xgboost.pkl")