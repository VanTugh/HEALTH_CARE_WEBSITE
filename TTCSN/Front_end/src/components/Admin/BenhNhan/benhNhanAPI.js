import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE = "http://localhost:8080/api/users/patients";

export const getAllPatients = async ({
  keyword = "",
  active = true,
  deleted = false,
  page = 0,
  size = 20,
  sortBy = "createdAt",
  direction = "DESC",
} = {}) => {
  try {
    const token = localStorage.getItem("accessToken");

    const res = await axios.get(`${API_BASE_URL}/api/users/patients`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
      params: {
        keyword: keyword || "",
        active,
        deleted,
        page,
        size,
        sortBy,
        direction,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Lỗi lấy danh sách bệnh nhân:", error);
    throw error.response?.data || error;
  }
};
