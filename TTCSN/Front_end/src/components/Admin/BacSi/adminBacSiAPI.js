import api from "../../../utils/api";

export const fetchDoctorById = async (id) => {
  try {
    const { data } = await api.get(`/api/doctors/${id}`);
    return data;
  } catch (error) {
    const errData = error.response?.data;
    console.error(error);
    throw new Error(errData?.message || "Lấy chi tiết bác sĩ thất bại");
  }
};

export const fetchDoctors = async ({
  page = 0,
  size = 10,
  sortBy = "nguoiDung.hoTen",
  direction = "asc",
} = {}) => {
  try {
    const { data } = await api.get("/api/doctors", {
      params: { page, size, sortBy, direction },
    });
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Không thể tải danh sách bác sĩ");
  }
};

export const deleteDoctor = async (id) => {
  try {
    await api.delete(`/api/doctors/${id}`);
    return true;
  } catch (error) {
    const errData = error.response?.data;
    console.error(error);
    throw new Error(errData?.message || "Xóa bác sĩ thất bại");
  }
};

export const restoreDoctor = async (id) => {
  try {
    const { data } = await api.put(`/api/doctors/${id}/restore`);
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Khôi phục bác sĩ thất bại");
  }
};

export const updateDoctor = async (id, doctorData) => {
  try {
    const { data } = await api.put(`/api/doctors/${id}`, doctorData);
    return data;
  } catch (error) {
    const errData = error.response?.data;
    console.error(error);
    throw new Error(errData?.message || "Cập nhật bác sĩ thất bại");
  }
};

export const createDoctor = async (doctorData) => {
  try {
    const { data } = await api.post("/api/doctors/create-account", doctorData);
    return data;
  } catch (error) {
    const errData = error.response?.data;
    console.error(error);
    throw new Error(errData?.message || "Tạo mới bác sĩ thất bại");
  }
};

export const fetchSpecialties = async () => {
  try {
    const { data } = await api.get("/api/specialties");
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Không thể tải danh sách chuyên khoa");
  }
};

export const fetchDegrees = async () => {
  try {
    const { data } = await api.get("/api/degrees");
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Không thể tải danh sách trình độ");
  }
};
