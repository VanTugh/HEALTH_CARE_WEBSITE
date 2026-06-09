const BASE_URL = "http://localhost:8080/api";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const getToken = () => localStorage.getItem("accessToken");

export const fetchDoctorById = async (id) => {
  try {
    const token = getToken();
    const res = await fetch(`${API_BASE_URL}/api/doctors/${id}`, {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          }
        : {},
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Lấy chi tiết bác sĩ thất bại");
    }
    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchDoctors = async ({
  page = 0,
  size = 10,
  sortBy = "nguoiDung.hoTen",
  direction = "asc",
} = {}) => {
  try {
    const token = getToken();
    const res = await fetch(
      `${API_BASE_URL}/api/doctors?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      }
    );
    if (!res.ok) throw new Error("Không thể tải danh sách bác sĩ");
    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteDoctor = async (id) => {
  try {
    const token = getToken();
    const res = await fetch(`${API_BASE_URL}/api/doctors/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Xóa bác sĩ thất bại");
    }
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const restoreDoctor = async (id) => {
  try {
    const token = getToken();
    const res = await fetch(`${API_BASE_URL}/api/doctors/${id}/restore`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });
    if (!res.ok) throw new Error("Khôi phục bác sĩ thất bại");
    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateDoctor = async (id, doctorData) => {
  try {
    const token = getToken();
    const res = await fetch(`${API_BASE_URL}/api/doctors/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify(doctorData),
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Cập nhật bác sĩ thất bại");
    }
    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createDoctor = async (doctorData) => {
  try {
    const token = getToken();
    const res = await fetch(`${API_BASE_URL}/api/doctors/create-account`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify(doctorData),
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Tạo mới bác sĩ thất bại");
    }
    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchSpecialties = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/specialties`, {
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });
    if (!res.ok) throw new Error("Không thể tải danh sách chuyên khoa");
    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchDegrees = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/degrees`, {
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });
    if (!res.ok) throw new Error("Không thể tải danh sách trình độ");
    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
