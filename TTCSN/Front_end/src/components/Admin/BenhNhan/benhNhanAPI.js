import api from "../../../utils/api";

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
    const res = await api.get("/api/users/patients", {
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
