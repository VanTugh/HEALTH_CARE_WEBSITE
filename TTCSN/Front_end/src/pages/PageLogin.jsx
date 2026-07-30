import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import HeaderSub from "../components/HeaderSub"
import Footer from "../components/Footer"
import RegisterForm from '../components/Register/RegisterForm'
import LoginForm from '../components/Register/LoginForm'
import RegisterPage from '../components/Register/RegisterPage'
const PageLogin = () => {
    const location = useLocation();
    const [showLoginForm, setShowLoginForm] = useState(true);

    useEffect(() => {
        if (location.state && typeof location.state.isLogin === 'boolean') {
            setShowLoginForm(location.state.isLogin);
        }
    }, [location.state]);

    return (
        <div>
            <HeaderSub />
            {showLoginForm ? (
                <LoginForm setShowLoginForm={setShowLoginForm} />
            ) : (
                <RegisterForm setShowLoginForm={setShowLoginForm} />
            )}
            <Footer />
        </div>
    )
}

export default PageLogin;
