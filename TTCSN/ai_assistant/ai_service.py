# ai_service.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from rag_service import RAGAssistant # <-- Thêm import

app = Flask(__name__)
CORS(app)

# Khởi tạo RAG một lần duy nhất khi chạy server để tránh tạo lại VectorService nhiều lần
print("⏳ Đang khởi tạo AI RAG Assistant...")
rag_assistant = RAGAssistant()
print("✅ Khởi tạo AI hoàn tất!")

@app.route("/recommend-doctors", methods=["POST"])
def recommend_doctors():
    data = request.get_json() or {}
    query = data.get("query", "")
    
    if not query:
        return jsonify({"error": "Query is required"}), 400

    print(f"📩 [PYTHON] Đã nhận query: {query}")

    try:
        # Gọi RAG THỰC TẾ
        result = rag_assistant.answer_and_recommend(query)
        
        response_data = {
            "answer": result["answer"],
            "doctor_id": result["doctor_id"]
        }
        
        print(f"📤 [PYTHON] Trả về Bác sĩ ID: {response_data['doctor_id']}")
        return jsonify(response_data)
        
    except Exception as e:
        print(f"❌ [PYTHON] Lỗi xử lý RAG: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)