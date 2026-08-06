import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/diabetes/predict";

const YES_NO_FIELDS = [
  { key: "highBP", label: "Cao huyết áp" },
  { key: "highChol", label: "Cholesterol cao" },
  { key: "cholCheck", label: "Đã kiểm tra cholesterol trong 5 năm qua" },
  { key: "smoker", label: "Hút thuốc (ít nhất 100 điếu trong đời)" },
  { key: "stroke", label: "Từng bị đột quỵ" },
  { key: "heartDiseaseorAttack", label: "Bệnh mạch vành / nhồi máu cơ tim" },
  { key: "physActivity", label: "Có vận động thể chất trong 30 ngày qua" },
  { key: "fruits", label: "Ăn trái cây ít nhất 1 lần/ngày" },
  { key: "veggies", label: "Ăn rau ít nhất 1 lần/ngày" },
  { key: "hvyAlcoholConsump", label: "Uống rượu bia nặng" },
  { key: "anyHealthcare", label: "Có bảo hiểm y tế" },
  { key: "noDocbcCost", label: "Từng không đi khám vì chi phí" },
  { key: "diffWalk", label: "Khó khăn khi đi bộ / leo cầu thang" },
];

const AGE_OPTIONS = [
  { value: 1, label: "18–24 tuổi" },
  { value: 2, label: "25–29 tuổi" },
  { value: 3, label: "30–34 tuổi" },
  { value: 4, label: "35–39 tuổi" },
  { value: 5, label: "40–44 tuổi" },
  { value: 6, label: "45–49 tuổi" },
  { value: 7, label: "50–54 tuổi" },
  { value: 8, label: "55–59 tuổi" },
  { value: 9, label: "60–64 tuổi" },
  { value: 10, label: "65–69 tuổi" },
  { value: 11, label: "70–74 tuổi" },
  { value: 12, label: "75–79 tuổi" },
  { value: 13, label: "80 tuổi trở lên" },
];

const EDUCATION_OPTIONS = [
  { value: 1, label: "Chưa đi học" },
  { value: 2, label: "Tiểu học" },
  { value: 3, label: "Trung học cơ sở (chưa tốt nghiệp)" },
  { value: 4, label: "Tốt nghiệp THPT" },
  { value: 5, label: "Học một phần đại học/cao đẳng" },
  { value: 6, label: "Tốt nghiệp đại học/cao đẳng" },
];

const INCOME_OPTIONS = [
  { value: 1, label: "Dưới 10 triệu/năm" },
  { value: 2, label: "10–15 triệu/năm" },
  { value: 3, label: "15–20 triệu/năm" },
  { value: 4, label: "20–25 triệu/năm" },
  { value: 5, label: "25–35 triệu/năm" },
  { value: 6, label: "35–50 triệu/năm" },
  { value: 7, label: "50–75 triệu/năm" },
  { value: 8, label: "Trên 75 triệu/năm" },
];

const GENHLTH_OPTIONS = [
  { value: 1, label: "Rất tốt" },
  { value: 2, label: "Tốt" },
  { value: 3, label: "Khá" },
  { value: 4, label: "Kém" },
  { value: 5, label: "Rất kém" },
];

const initialForm = {
  highBP: 0,
  highChol: 0,
  cholCheck: 1,
  bmi: "",
  smoker: 0,
  stroke: 0,
  heartDiseaseorAttack: 0,
  physActivity: 1,
  fruits: 1,
  veggies: 1,
  hvyAlcoholConsump: 0,
  anyHealthcare: 1,
  noDocbcCost: 0,
  genHlth: 3,
  mentHlth: 0,
  physHlth: 0,
  diffWalk: 0,
  sex: 1,
  age: 9,
  education: 4,
  income: 3,
};

const RESULT_STYLES = {
  0: { bar: "bg-emerald-500", chip: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  1: { bar: "bg-amber-500", chip: "bg-amber-50 text-amber-700 border-amber-200" },
  2: { bar: "bg-rose-500", chip: "bg-rose-50 text-rose-700 border-rose-200" },
};

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-0 cursor-pointer">
      <span className="text-xs text-slate-700">{label}</span>
      <button
        type="button"
        onClick={() => onChange(checked ? 0 : 1)}
        className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${
          checked ? "bg-teal-600" : "bg-slate-200"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="block text-xs text-slate-700 mb-1">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function DiabetesPredict({ onClose }) {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (form.bmi === "" || Number(form.bmi) <= 0) {
      setError("Vui lòng nhập chỉ số BMI hợp lệ.");
      return;
    }

    setLoading(true);
    try {
      const payload = { ...form, bmi: Number(form.bmi) };
      const { data } = await axios.post(API_URL, payload);
      setResult(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Không kết nối được tới máy chủ dự đoán. Kiểm tra Java backend và Python AI service."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans">
        {/* Modal Header */}
        <div className="bg-teal-600 text-white px-5 py-3.5 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-base font-semibold">🩺 AI Dự Đoán Nguy Cơ Tiểu Đường</h2>
            <p className="text-xs text-teal-100">Cung cấp thông tin để nhận đánh giá từ mô hình AI</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-teal-700 w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg"
          >
            ✕
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Thông tin cơ bản */}
            <section className="bg-slate-50 rounded-xl border border-slate-200 p-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                1. Thông tin cơ bản
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block">
                  <span className="block text-xs text-slate-700 mb-1">Chỉ số BMI</span>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    placeholder="vd: 24.5"
                    value={form.bmi}
                    onChange={(e) => set("bmi")(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </label>
                <Select
                  label="Giới tính"
                  value={form.sex}
                  onChange={set("sex")}
                  options={[
                    { value: 1, label: "Nam" },
                    { value: 0, label: "Nữ" },
                  ]}
                />
                <Select label="Nhóm tuổi" value={form.age} onChange={set("age")} options={AGE_OPTIONS} />
                <Select
                  label="Trình độ học vấn"
                  value={form.education}
                  onChange={set("education")}
                  options={EDUCATION_OPTIONS}
                />
                <Select
                  label="Mức thu nhập"
                  value={form.income}
                  onChange={set("income")}
                  options={INCOME_OPTIONS}
                />
                <Select
                  label="Sức khỏe tổng quát tự đánh giá"
                  value={form.genHlth}
                  onChange={set("genHlth")}
                  options={GENHLTH_OPTIONS}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <label className="block">
                  <span className="block text-xs text-slate-700 mb-1">
                    Sức khỏe tinh thần kém (0–30 ngày)
                  </span>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={form.mentHlth}
                    onChange={(e) => set("mentHlth")(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </label>
                <label className="block">
                  <span className="block text-xs text-slate-700 mb-1">
                    Sức khỏe thể chất kém (0–30 ngày)
                  </span>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={form.physHlth}
                    onChange={(e) => set("physHlth")(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </label>
              </div>
            </section>

            {/* Tình trạng sức khỏe & lối sống */}
            <section className="bg-slate-50 rounded-xl border border-slate-200 p-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                2. Tình trạng sức khỏe & Lối sống
              </h3>
              <div>
                {YES_NO_FIELDS.map((f) => (
                  <Toggle
                    key={f.key}
                    label={f.label}
                    checked={!!form[f.key]}
                    onChange={set(f.key)}
                  />
                ))}
              </div>
            </section>

            {error && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 text-rose-700 text-xs px-3 py-2.5">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-teal-600 hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold py-2.5 transition-colors"
            >
              {loading ? "Đang xử lý dự đoán..." : "Thực hiện dự đoán ngay"}
            </button>
          </form>

          {/* Kết quả trả về */}
          {result && (
            <section className="bg-teal-50/50 rounded-xl border border-teal-200 p-4">
              <div
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold mb-3 ${RESULT_STYLES[result.prediction]?.chip}`}
              >
                Kết quả: {result.label}
              </div>
              <div className="space-y-2">
                {Object.entries(result.probabilities).map(([label, prob]) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span>{label}</span>
                      <span className="font-semibold">{(prob * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          RESULT_STYLES[Object.keys(result.probabilities).indexOf(label)]?.bar ||
                          "bg-teal-500"
                        }`}
                        style={{ width: `${prob * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 italic mt-3">
                * Lưu ý: Kết quả mang tính chất tham khảo từ mô hình AI, không thay thế chẩn đoán y khoa chính thức.
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}