import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAllSpecialties = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/specialties`, {
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi lấy danh sách chuyên khoa:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createSpecialty = async (data, token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/specialties`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi tạo chuyên khoa mới:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteSpecialty = async (id, token) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/specialties/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi xóa chuyên khoa:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateSpecialty = async (id, data, token) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/specialties/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi cập nhật chuyên khoa:",
      error.response?.data || error.message
    );
    throw error;
  }
};
