import api from "../../../utils/api";

export const getAllDegrees = async () => {
  try {
    const response = await api.get("/api/degrees");
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi lấy danh sách trình độ:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createDegree = async (data) => {
  try {
    const response = await api.post("/api/degrees", data);
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi tạo trình độ mới:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateDegree = async (id, data) => {
  try {
    const response = await api.put(`/api/degrees/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi cập nhật trình độ:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteDegree = async (id) => {
  try {
    const response = await api.delete(`/api/degrees/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi xóa trình độ:", error.response?.data || error.message);
    throw error;
  }
};
