import api from "../../../utils/api";

export const createSchedule = async (data) => {
  try {
    const res = await api.post("/api/schedules", data);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createBulkSchedules = async (schedules = []) => {
  try {
    const payload = {
      schedules,
      totalDays: 0,
      totalSchedules: schedules.length,
      summary: "Tạo lịch mặc định",
    };

    const res = await api.post("/api/schedules/bulk", payload);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteSchedule = async (id) => {
  try {
    const res = await api.delete(`/api/schedules/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAllSchedules = async () => {
  try {
    const res = await api.get("/api/schedules");
    return res.data;
  } catch (error) {
    console.error("Lỗi lấy lịch:", error);
    throw error.response?.data || error;
  }
};
