import { Navigate } from "react-router-dom";

export default function ProtectedDoctorRoute({ children }) {
    const role = localStorage.getItem("vaiTro");

    if (role !== "BacSi") {
        return <Navigate to="/" replace />;
    }

    return children;
}

