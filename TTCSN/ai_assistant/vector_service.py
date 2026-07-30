import json
import os
import numpy as np
from dotenv import load_dotenv
from google import genai
from google.genai import types
from sqlalchemy import text
from db_services import DBService, sql as get_doctors_sql

load_dotenv()

class VectorService:
    def __init__(self):
        self.db_service = DBService()
        self.gemini_key = os.getenv("GOOGLE_API_KEY")

        if not self.gemini_key:
            raise ValueError("Lỗi: Không tìm thấy GOOGLE_GEMINI_KEY trong file .env!")

        # Khởi tạo Gemini Client
        self.client = genai.Client(api_key=self.gemini_key)
        self.embedding_model = "gemini-embedding-001"

    def build_document_text(self, doctor: dict) -> str:
        """Chuyển đổi thông tin Dict của Bác sĩ thành đoạn văn bản ngữ cảnh chuẩn RAG."""
        gender_str = "Nam" if doctor.get("GioiTinh") == 1 else "Nữ"
        price = doctor.get("GiaKhamThucTe")
        price_str = f"{int(price):,} VNĐ" if price else "Chưa cập nhật"
        
        doc = (
            f"Bác sĩ: {doctor.get('TenBacSi', '')} (Giới tính: {gender_str}). "
            f"Chuyên khoa: {doctor.get('TenChuyenKhoa', '')}. "
            f"Trình độ: {doctor.get('TenTrinhDo', '')}. "
            f"Số năm kinh nghiệm: {doctor.get('SoNamKinhNghiem', 0)} năm. "
            f"Giá khám: {price_str}. "
            f"Cơ sở y tế: {doctor.get('TenCoSo', '')}, Địa chỉ: {doctor.get('DiaChiCoSo', '')}. "
            f"Giới thiệu chuyên môn: {doctor.get('GioiThieu', '')} "
            f"Quá trình đào tạo: {doctor.get('QuaTrinhDaoTao', '')} "
            f"Kinh nghiệm làm việc: {doctor.get('KinhNghiemLamViec', '')} "
            f"Lịch làm việc cố định: {doctor.get('LichLamViecCoDinh') or 'Chưa có lịch'}."
        )
        return doc.strip()

    def get_embedding(self, text_content: str, task_type: str = "RETRIEVAL_DOCUMENT") -> list[float]:
        """Gọi API Gemini để chuyển đổi văn bản thành mảng Vector."""
        response = self.client.models.embed_content(
            model=self.embedding_model,
            contents=text_content,
            config=types.EmbedContentConfig(
                task_type=task_type
            )
        )
        return response.embeddings[0].values

    def sync_doctors_to_vector_db(self):
        """Lấy danh sách bác sĩ từ DBService, tạo Embedding và lưu vào MariaDB."""
        doctors = self.db_service.run_sql(get_doctors_sql())
        print(f"📋 Tìm thấy {len(doctors)} bác sĩ cần đồng bộ...")

        upsert_query = text("""
            INSERT INTO BacSiEmbedding (BacSiID, Embedding, DocumentText)
            VALUES (:bac_si_id, :embedding, :doc_text)
            ON DUPLICATE KEY UPDATE
                Embedding = VALUES(Embedding),
                DocumentText = VALUES(DocumentText),
                UpdatedAt = CURRENT_TIMESTAMP;
        """)

        with self.db_service.engine.begin() as conn:
            for doc_data in doctors:
                bac_si_id = doc_data["BacSiID"]
                doc_text = self.build_document_text(doc_data)
                
                print(f"🔄 Đang tạo embedding cho Bác sĩ ID {bac_si_id}: {doc_data.get('TenBacSi')}...")
                vector = self.get_embedding(doc_text, task_type="RETRIEVAL_DOCUMENT")
                vector_json = json.dumps(vector)

                conn.execute(
                    upsert_query,
                    {
                        "bac_si_id": bac_si_id,
                        "embedding": vector_json,
                        "doc_text": doc_text
                    }
                )

        print("✅ Đã đồng bộ thành công toàn bộ Vector Bác sĩ vào MariaDB!")

    @staticmethod
    def _cosine_similarity(vec1: list[float], vec2: list[float]) -> float:
        """Tính điểm tương đồng Cosine giữa 2 vector."""
        a = np.array(vec1)
        b = np.array(vec2)
        norm_a = np.linalg.norm(a)
        norm_b = np.linalg.norm(b)
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return float(np.dot(a, b) / (norm_a * norm_b))

    def search_top_k_doctors(self, query_text: str, top_k: int = 3) -> list[dict]:
        """Tìm kiếm Top-K bác sĩ phù hợp nhất dựa trên câu hỏi của người dùng."""
        # 1. Embedding câu hỏi người dùng
        query_vector = self.get_embedding(query_text, task_type="RETRIEVAL_QUERY")

        # 2. Lấy dữ liệu vector từ DB kết hợp JOIN lấy thông tin bác sĩ chi tiết
        query_sql = text("""
            SELECT 
                e.BacSiID,
                e.Embedding,
                e.DocumentText,
                b.GiaKham,
                n.HoTen AS TenBacSi,
                ck.TenChuyenKhoa,
                td.TenTrinhDo
            FROM BacSiEmbedding e
            INNER JOIN BacSi b ON e.BacSiID = b.BacSiID
            INNER JOIN NguoiDung n ON b.BacSiID = n.NguoiDungID
            INNER JOIN ChuyenKhoa ck ON b.ChuyenKhoaID = ck.ChuyenKhoaID
            INNER JOIN TrinhDo td ON b.TrinhDoID = td.TrinhDoID
        """)

        with self.db_service.engine.connect() as conn:
            results = conn.execute(query_sql).mappings().all()

        if not results:
            return []

        # 3. Tính điểm similarity cho từng bác sĩ
        scored_doctors = []
        for row in results:
            doc_vector = json.loads(row["Embedding"])
            score = self._cosine_similarity(query_vector, doc_vector)
            
            doctor_info = dict(row)
            doctor_info["score"] = score
            del doctor_info["Embedding"]  # Xóa mảng vector thô cho nhẹ RAM
            
            scored_doctors.append(doctor_info)

        # 4. Sắp xếp giảm dần theo điểm số similarity
        scored_doctors.sort(key=lambda x: x["score"], reverse=True)

        # 5. Trả về Top-K kết quả đầu tiên
        return scored_doctors[:top_k]


if __name__ == "__main__":
    vector_service = VectorService()
    
    # Đồng bộ dữ liệu trước (nếu chưa thực hiện)
    # vector_service.sync_doctors_to_vector_db()

    # Test thử chức năng Retrieval
    user_prompt = "Tôi dạo này bị đau đầu kinh niên và mất ngủ, muốn tìm bác sĩ giỏi để khám"
    print(f"\n🔍 Tìm kiếm bác sĩ phù hợp cho câu hỏi: '{user_prompt}'\n")
    
    top_doctors = vector_service.search_top_k_doctors(user_prompt, top_k=2)
    
    for idx, doc in enumerate(top_doctors, 1):
        print(f"Top {idx} [Score: {doc['score']:.4f}]")
        print(f" - Bác sĩ: {doc['TenBacSi']} ({doc['TenTrinhDo']})")
        print(f" - Chuyên khoa: {doc['TenChuyenKhoa']}")
        print(f" - Nội dung document: {doc['DocumentText'][:120]}...\n")