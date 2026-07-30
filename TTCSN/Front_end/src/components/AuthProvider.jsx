import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }) => {
    const [isLogin, setIsLogin] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const userData = localStorage.getItem("user");
        const role = localStorage.getItem("vaiTro");

        if (token && userData) {
            const userObj = JSON.parse(userData);
            userObj.vaiTro = role;

            setIsLogin(true);
            setUser(userObj);
        }

        setLoading(false);
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ isLogin, setIsLogin, user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
