import api from "../../../utils/api";

export const getAllSpecialties = async () => {
  try {
    const response = await api.get("/api/specialties");
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi lấy danh sách chuyên khoa:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createSpecialty = async (data) => {
  try {
    const response = await api.post("/api/specialties", data);
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi tạo chuyên khoa mới:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteSpecialty = async (id) => {
  try {
    const response = await api.delete(`/api/specialties/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi xóa chuyên khoa:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateSpecialty = async (id, data) => {
  try {
    const response = await api.put(`/api/specialties/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi cập nhật chuyên khoa:",
      error.response?.data || error.message
    );
    throw error;
  }
};
