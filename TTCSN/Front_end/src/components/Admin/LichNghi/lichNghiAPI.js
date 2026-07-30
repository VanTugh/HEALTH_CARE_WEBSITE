import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
/**
 * ===============================
 * 1. Lấy danh sách yêu cầu nghỉ CHỜ DUYỆT (Admin)
 * GET http://localhost:8080/api/leave-requests/pending
 * ===============================
 */
export const getPendingLeaveRequests = async (token) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/leave-requests/pending`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*",
        "ngrok-skip-browser-warning": "true",
      },
    });
    return res.data;
  } catch (error) {
    console.error(
      "Lỗi lấy danh sách yêu cầu nghỉ chờ duyệt:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * ===============================
 * 2. Lấy chi tiết 1 yêu cầu nghỉ
 * GET http://localhost:8080/api/leave-requests/{id}
 * ===============================
 */
export const getLeaveRequestDetail = async (id, token) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/leave-requests/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*",
        "ngrok-skip-browser-warning": "true",
      },
    });
    return res.data;
  } catch (error) {
    console.error(
      `Lỗi lấy chi tiết yêu cầu nghỉ ID=${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * ===============================
 * 3. Xóa yêu cầu nghỉ (HARD DELETE)
 * DELETE http://localhost:8080/api/leave-requests/{id}
 * ===============================
 */
export const deleteLeaveRequest = async (id, token) => {
  try {
    const res = await axios.delete(`${API_BASE_URL}/api/leave-requests/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*",
        "ngrok-skip-browser-warning": "true",
      },
    });
    return res.data;
  } catch (error) {
    console.error(
      `Lỗi xóa yêu cầu nghỉ ID=${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * ===============================
 * 4. Hủy yêu cầu nghỉ
 * PATCH http://localhost:8080/api/leave-requests/{id}/cancel
 * ===============================
 */
export const cancelLeaveRequest = async (id, token) => {
  try {
    const res = await axios.patch(
      `${API_BASE_URL}/api/leave-requests/${id}/cancel`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
          "ngrok-skip-browser-warning": "true",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error(
      `Lỗi hủy yêu cầu nghỉ ID=${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * ===============================
 * 5. Admin duyệt / từ chối NHIỀU yêu cầu nghỉ
 * POST http://localhost:8080/api/leave-requests/bulk
 * ===============================
 */
export const approveOrRejectLeaveRequests = async (data, token) => {
  return axios.patch(`${API_BASE_URL}/api/leave-requests/approve`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "*/*",
      "ngrok-skip-browser-warning": "true",
    },
  });
};
