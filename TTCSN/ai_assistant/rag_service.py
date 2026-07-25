import json
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from google import genai
from google.genai import types
from vector_service import VectorService

load_dotenv()

class RAGAssistant:
    def __init__(self):
        self.vector_service = VectorService()
        self.gemini_key = os.getenv("GOOGLE_API_KEY")
        
        if not self.gemini_key:
            raise ValueError("Lỗi: Không tìm thấy GOOGLE_GEMINI_KEY trong file .env!")
            
        self.client = genai.Client(api_key=self.gemini_key)
        # Sử dụng model gemini-2.5-flash để sinh câu trả lời nhanh & thông minh
        self.model_name = "gemini-3.6-flash"

    def generate_booking_slots(self, doctor_id: int, days_ahead: int = 3) -> list[dict]:
        """
        Giả lập sinh danh sách khung giờ khám (Slots) cho 3 ngày tới dựa trên lịch bác sĩ.
        (Thực tế bước này sẽ query từ bảng LichLamViec hoặc sinh theo ca SANG/CHIEU)
        """
        slots = []
        today = datetime.now()
        
        # Các khung giờ cố định trong ngày
        time_frames = [
            {"ca": "SANG", "gio": "08:30 - 09:30"},
            {"ca": "SANG", "gio": "10:00 - 11:00"},
            {"ca": "CHIEU", "gio": "14:00 - 15:00"},
            {"ca": "CHIEU", "gio": "15:30 - 16:30"}
        ]
        
        for i in range(1, days_ahead + 1):
            next_day = today + timedelta(days=i)
            date_str = next_day.strftime("%Y-%m-%d")
            display_date = next_day.strftime("%d/%m/%Y")
            
            for tf in time_frames:
                slots.append({
                    "slot_id": f"BS{doctor_id}_{date_str}_{tf['ca']}_{tf['gio'].split(' ')[0]}",
                    "bac_si_id": doctor_id,
                    "ngay_kham": date_str,
                    "ngay_hien_thi": display_date,
                    "ca": tf["ca"],
                    "khung_gio": tf["gio"]
                })
                
        return slots

    def answer_and_recommend(self, user_prompt: str, top_k: int = 2) -> dict:
        """
        Luồng RAG chính: Retrieval -> Build Prompt -> LLM Generate -> Trả về text + ID Bác sĩ.
        """
        # 1. Retrieval bác sĩ phù hợp
        top_doctors = self.vector_service.search_top_k_doctors(user_prompt, top_k=top_k)
        
        if not top_doctors:
            return {
                "answer": "Rất tiếc, tôi chưa tìm thấy bác sĩ phù hợp với nhu cầu của bạn. Bạn có thể mô tả chi tiết hơn triệu chứng không?",
                "doctor_id": None
            }

        # 2. Xây dựng Context từ kết quả Retrieval
        context_text = ""
        for idx, doc in enumerate(top_doctors, 1):
            context_text += f"\n--- BÁC SĨ {idx} ---\n"
            context_text += f"ID: {doc['BacSiID']}\n"
            context_text += f"Họ tên: {doc['TenBacSi']}\n"
            context_text += f"Chuyên khoa: {doc['TenChuyenKhoa']}\n"
            context_text += f"Thông tin chi tiết: {doc['DocumentText']}\n"

        # 3. System Prompt
        system_instruction = """
        Bạn là Trợ lý Y tế AI thông minh của hệ thống đặt lịch khám bệnh.
        Nhiệm vụ của bạn:
        1. Phân tích triệu chứng hoặc nhu cầu của người dùng.
        2. Dựa vào danh sách Bác sĩ được cung cấp trong Context, gợi ý 1 bác sĩ phù hợp nhất.
        3. Tóm tắt ngắn gọn lý do tại sao bác sĩ đó lại phù hợp.
        4. Giọng văn lịch sự, ân cần, chuyên nghiệp. Không tự nghĩ ra thông tin bác sĩ ngoài Context.
        """

        prompt = f"""
        Nhu cầu/Triệu chứng của bệnh nhân: "{user_prompt}"

        Danh sách bác sĩ phù hợp từ hệ thống (Context):
        {context_text}

        Hãy đưa ra lời tư vấn và gợi ý bác sĩ tốt nhất.
        """

        # 4. Gọi Gemini API
        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.3
            )
        )

        # 5. Trả về đúng Data cần thiết
        doc = top_doctors[0] # Lấy Bác sĩ tốt nhất (Top 1)
        return {
            "answer": response.text,
            "doctor_id": doc["BacSiID"]
        }


if __name__ == "__main__":
    rag = RAGAssistant()
    user_query = "Tôi dạo này bị đau đầu kinh niên và mất ngủ, muốn tìm bác sĩ giỏi để khám"
    
    print("🤖 AI đang suy nghĩ và lập lộ trình tư vấn...\n")
    result = rag.answer_and_recommend(user_query)
    
    print("--- CÂU TRẢ LỜI CỦA AI ---")
    print(result["answer"])
    print(result["doctor_id"])
    