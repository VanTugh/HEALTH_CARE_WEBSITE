import pandas as pd


class InputPreprocessor:

    # =====================================================

    @staticmethod
    def calculate_bmi(weight, height):

        height = height / 100

        return round(weight / (height * height), 2)

    # =====================================================

    @staticmethod
    def age_to_category(age):

        if age <= 24:
            return 1
        elif age <= 29:
            return 2
        elif age <= 34:
            return 3
        elif age <= 39:
            return 4
        elif age <= 44:
            return 5
        elif age <= 49:
            return 6
        elif age <= 54:
            return 7
        elif age <= 59:
            return 8
        elif age <= 64:
            return 9
        elif age <= 69:
            return 10
        elif age <= 74:
            return 11
        elif age <= 79:
            return 12

        return 13

    # =====================================================

    @staticmethod
    def education_to_code(level):

        mapping = {

            "Never attended school":1,

            "Elementary":2,

            "Middle School":3,

            "High School":4,

            "College":5,

            "College Graduate":6

        }

        return mapping[level]

    # =====================================================

    @staticmethod
    def income_to_code(level):

        mapping = {

            "<10k":1,

            "10k-15k":2,

            "15k-20k":3,

            "20k-25k":4,

            "25k-35k":5,

            "35k-50k":6,

            "50k-75k":7,

            ">75k":8

        }

        return mapping[level]

    # =====================================================

    @staticmethod
    def health_to_code(status):

        mapping = {

            "Excellent":1,

            "Very Good":2,

            "Good":3,

            "Fair":4,

            "Poor":5

        }

        return mapping[status]

    # =====================================================

    @staticmethod
    def preprocess(data):

        bmi = InputPreprocessor.calculate_bmi(

            data["weight"],

            data["height"]

        )

        result = {

            "HighBP": int(data["high_blood_pressure"]),

            "HighChol": int(data["high_cholesterol"]),

            "CholCheck": int(data["cholesterol_checked"]),

            "BMI": bmi,

            "Smoker": int(data["smoker"]),

            "Stroke": int(data["stroke"]),

            "HeartDiseaseorAttack": int(data["heart_disease"]),

            "PhysActivity": int(data["physical_activity"]),

            "Fruits": int(data["eat_fruits"]),

            "Veggies": int(data["eat_vegetables"]),

            "HvyAlcoholConsump": int(data["heavy_alcohol"]),

            "AnyHealthcare": int(data["has_healthcare"]),

            "NoDocbcCost": int(data["cannot_afford_doctor"]),

            "GenHlth": InputPreprocessor.health_to_code(

                data["general_health"]

            ),

            "MentHlth": data["mental_health_days"],

            "PhysHlth": data["physical_health_days"],

            "DiffWalk": int(data["difficulty_walking"]),

            "Sex": 1 if data["gender"] == "Male" else 0,

            "Age": InputPreprocessor.age_to_category(

                data["age"]

            ),

            "Education": InputPreprocessor.education_to_code(

                data["education"]

            ),

            "Income": InputPreprocessor.income_to_code(

                data["income"]

            )

        }

        return pd.DataFrame([result])