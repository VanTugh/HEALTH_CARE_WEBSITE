import api from "../../../utils/api";

export const getPendingLeaveRequests = async () => {
  try {
    const res = await api.get("/api/leave-requests/pending");
    return res.data;
  } catch (error) {
    console.error(
      "Lỗi lấy danh sách yêu cầu nghỉ chờ duyệt:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getLeaveRequestDetail = async (id) => {
  try {
    const res = await api.get(`/api/leave-requests/${id}`);
    return res.data;
  } catch (error) {
    console.error(
      `Lỗi lấy chi tiết yêu cầu nghỉ ID=${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteLeaveRequest = async (id) => {
  try {
    const res = await api.delete(`/api/leave-requests/${id}`);
    return res.data;
  } catch (error) {
    console.error(
      `Lỗi xóa yêu cầu nghỉ ID=${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

export const cancelLeaveRequest = async (id) => {
  try {
    const res = await api.patch(`/api/leave-requests/${id}/cancel`);
    return res.data;
  } catch (error) {
    console.error(
      `Lỗi hủy yêu cầu nghỉ ID=${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

export const approveOrRejectLeaveRequests = async (data) => {
  return api.patch("/api/leave-requests/approve", data);
};
