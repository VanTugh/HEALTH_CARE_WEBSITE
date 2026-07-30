from types import CodeType
import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
import os

class PreprocessorCSV:
    '''
    class dùng để kiểm tra và tiền xử lý dữ liệu => đảm bảo có một dataset mới đủ sạch
    lưu ý: chưa biến đổi dữ liệu cho train, chỉ làm sách
    '''
    def __init__(self, dataset_path: str = 'datasets/diabetes1.csv'):
        self.df = pd.read_csv(dataset_path)
        self.columns = self.df.columns
    
    def _get_df(self, top: int):
        print(self.df.head(top))
        print(self.df.shape)
    
    def _check_target(self, column_target_name: str):
        count = self.df[column_target_name].value_counts()
        print(count)

    def _check_zero(self):
        print((self.df == 0).sum())
    
    def _check_null(self):
        print(self.df.isnull().sum())
    
    def _check_balance(self, chart = False):
        if chart:
            for column in self.columns:
                if column == "Outcome":
                    continue

                sns.histplot(self.df[column], bins=15)
                plt.title(column)
                plt.show()
        else:
            print(self.df.skew())

    
    def get_info(self, top: int):
        print(" ===== 1. dataset infor ======")
        self._get_df(top)

        print(" ===== 2. Columns info =====")
        print(self.columns)

        print(" ===== 3. Count zero =======")
        self._check_zero()

        print(" ====== 4. Check null ======")
        self._check_null()

        print(" ====== 5. Check balance ======")
        self._check_balance(chart=False)
    
    # ===================
    # ===== Process =====
    # ===================
    # điền giá trị median
    def _fill_median(self, 
        columns: list = ['Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI']
    ):
        # 1. thay thế số 0 ở các cột được chỉ định -> NaN
        self.df[columns] = self.df[columns].replace(0, np.nan)

        # 2. tính toán giá trị trung vị (median) của các cột đó
        medians = self.df[columns].median()

        # 3. điền giá trị trung vị vào những chỗ NaN
        self.df[columns] = self.df[columns].fillna(medians)

        print("Đã xử lý xong dữ liệu khuyết thiếu bằng giá trị trung vị!")

    def _process_balance_by_log(self, column=['Insulin', 'DiabetesPedigreeFunction']):
        self.df[column] = np.log1p(self.df[column])
    
    def save_dataset(self, save_name):
        self.df.to_csv(save_name, index=False)
    
if __name__ == "__main__":
    pre = PreprocessorCSV()

    # 1. xem thông tin cơ bản
    pre.get_info(10)

    # 2. xem thông tin về nhãn phân loại
    pre._check_target('Diabetes_012')
    
    # pre._fill_median()
    # # pre.get_info(10)
    # pre._check_balance()
    # pre._process_balance_by_log()
    # pre._check_balance()