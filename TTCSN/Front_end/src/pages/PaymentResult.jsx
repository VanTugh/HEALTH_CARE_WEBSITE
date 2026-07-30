import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PaymentResult() {
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const status = params.get("status");
    const datLichID = params.get("datLichID");

    useEffect(() => {
        if (status === "success") {
            toast.success(`Thanh toán thành công! Mã lịch khám: ${datLichID}`, {
                position: "top-right",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            const timer = setTimeout(() => {
                navigate("/userpage");
            }, 3000);
            return () => clearTimeout(timer);
        } else if (status === "failed") {
            toast.error("Thanh toán thất bại. Vui lòng thử lại hoặc liên hệ support.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }, [status, datLichID, navigate]);

    const containerStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        padding: 20,
        backgroundColor: "#f5f5f5",
    };

    const cardStyle = {
        maxWidth: 400,
        width: "100%",
        padding: 30,
        borderRadius: 12,
        boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
        backgroundColor: "#fff",
        textAlign: "center",
    };

    const buttonStyle = {
        marginTop: 20,
        padding: "10px 20px",
        borderRadius: 8,
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: 16,
    };

    return (
        <div style={containerStyle}>
            <ToastContainer />
            <div style={cardStyle}>
                {status === "success" ? (
                    <>
                        <h2 style={{ color: "green", marginBottom: 10 }}>
                            Thanh toán thành công
                        </h2>
                        <p style={{ fontSize: 16 }}>
                            Mã lịch khám: <b>{datLichID}</b>
                        </p>
                        <button
                            style={{
                                ...buttonStyle,
                                backgroundColor: "#4CAF50",
                                color: "#fff",
                            }}
                            onClick={() => navigate("/userpage")}
                        >
                            Xem lịch khám
                        </button>
                        <p style={{ marginTop: 10, fontSize: 14, color: "#555" }}>
                            Tự động chuyển hướng sau 3 giây...
                        </p>
                    </>
                ) : (
                    <>
                        <h2 style={{ color: "red", marginBottom: 10 }}>
                            Thanh toán thất bại
                        </h2>
                        <p style={{ fontSize: 16, marginBottom: 20 }}>
                            Vui lòng thử lại hoặc liên hệ support.
                        </p>
                        <button
                            style={{
                                ...buttonStyle,
                                backgroundColor: "#f44336",
                                color: "#fff",
                            }}
                            onClick={() => navigate("/")}
                        >
                            Quay về trang chủ
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
