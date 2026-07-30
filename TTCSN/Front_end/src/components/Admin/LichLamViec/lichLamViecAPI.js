import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE = "http://localhost:8080/api/schedules";

export const createSchedule = async (data) => {
  try {
    const token = localStorage.getItem("accessToken");

    const res = await axios.post(`${API_BASE_URL}/api/schedules`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });

    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createBulkSchedules = async (schedules = []) => {
  try {
    const token = localStorage.getItem("accessToken");

    const payload = {
      schedules,
      totalDays: 0,
      totalSchedules: schedules.length,
      summary: "Tạo lịch mặc định",
    };

    const res = await axios.post(
      `${API_BASE_URL}/api/schedules/bulk`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteSchedule = async (id) => {
  try {
    const token = localStorage.getItem("accessToken");

    const res = await axios.delete(`${API_BASE_URL}/api/schedules/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });

    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAllSchedules = async () => {
  try {
    const token = localStorage.getItem("accessToken");

    const res = await axios.get(`${API_BASE_URL}/api/schedules`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });

    return res.data;
  } catch (error) {
    console.error("Lỗi lấy lịch:", error);
    throw error.response?.data || error;
  }
};
