import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAllDegrees = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/degrees`, {
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi lấy danh sách trình độ:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createDegree = async (data, token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/degrees`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi tạo trình độ mới:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateDegree = async (id, data, token) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/degrees/${id}`,
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
      "Lỗi cập nhật trình độ:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteDegree = async (id, token) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/degrees/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi xóa trình độ:", error.response?.data || error.message);
    throw error;
  }
};
